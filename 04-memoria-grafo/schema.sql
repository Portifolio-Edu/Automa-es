-- ============================================================
-- Memória com Grafo — schema Postgres/Supabase
-- Base de conhecimento indexada (full-text + semântica) com
-- grafo de relações entre nós, no estilo Obsidian.
--
-- Aplicado no projeto Supabase "memoria-grafo-dev" (região sa-east-1).
-- Para reaplicar do zero em outro projeto Supabase, rode este
-- arquivo inteiro via SQL Editor ou `supabase db push`.
-- ============================================================

create extension if not exists vector;
create extension if not exists pg_trgm;
create extension if not exists unaccent;

-- unaccent não é IMMUTABLE por padrão; wrapper IMMUTABLE necessário
-- para usar em coluna gerada (content_tsv) e em índice.
create or replace function public.f_unaccent(text)
returns text
language sql
immutable
parallel safe
set search_path = public, pg_catalog
as $$
  select unaccent('unaccent', $1)
$$;

-- ============================================================
-- Nós: notas, entidades, decisões, projetos, agentes, sessões...
-- ============================================================
create table public.memory_nodes (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'note'
    check (type in ('note','entity','project','decision','person','concept','automation','session')),
  title text not null,
  content text not null default '',
  tags text[] not null default '{}',
  source text not null default 'manual'
    check (source in ('manual','claude','n8n','api')),
  metadata jsonb not null default '{}',
  embedding vector(1536),
  content_tsv tsvector generated always as (
    setweight(to_tsvector('portuguese', f_unaccent(coalesce(title, ''))), 'A') ||
    setweight(to_tsvector('portuguese', f_unaccent(coalesce(content, ''))), 'B')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index memory_nodes_tsv_idx on public.memory_nodes using gin (content_tsv);
create index memory_nodes_tags_idx on public.memory_nodes using gin (tags);
create index memory_nodes_type_idx on public.memory_nodes (type);
create index memory_nodes_title_trgm_idx on public.memory_nodes using gin (title gin_trgm_ops);
create index memory_nodes_embedding_idx on public.memory_nodes
  using hnsw (embedding vector_cosine_ops);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger memory_nodes_set_updated_at
  before update on public.memory_nodes
  for each row execute function public.set_updated_at();

-- ============================================================
-- Arestas: grafo dirigido, com tipo de relação e peso
-- ============================================================
create table public.memory_edges (
  id uuid primary key default gen_random_uuid(),
  from_node uuid not null references public.memory_nodes(id) on delete cascade,
  to_node uuid not null references public.memory_nodes(id) on delete cascade,
  relation text not null default 'related_to',
  weight real not null default 1,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique (from_node, to_node, relation)
);

create index memory_edges_from_idx on public.memory_edges (from_node);
create index memory_edges_to_idx on public.memory_edges (to_node);
create index memory_edges_relation_idx on public.memory_edges (relation);

-- ============================================================
-- Auto-linking estilo Obsidian: [[Título]] no conteúdo cria uma
-- aresta para o nó existente com esse título (case-insensitive).
-- Não cria nós fantasma — só resolve links para o que já existe;
-- links para títulos inexistentes ficam sem aresta até o nó existir
-- (aí um novo update do nó de origem os resolve).
-- ============================================================
create or replace function public.sync_wikilinks()
returns trigger language plpgsql as $$
declare
  link_title text;
  target_id uuid;
begin
  delete from public.memory_edges
   where from_node = new.id
     and relation = 'links_to'
     and metadata->>'auto' = 'true';

  for link_title in
    select distinct m[1]
    from regexp_matches(new.content, '\[\[([^\]|]+)(\|[^\]]*)?\]\]', 'g') as m
  loop
    select id into target_id
      from public.memory_nodes
     where lower(title) = lower(trim(link_title))
       and id <> new.id
     limit 1;

    if target_id is not null then
      insert into public.memory_edges (from_node, to_node, relation, metadata)
      values (new.id, target_id, 'links_to', '{"auto": true}'::jsonb)
      on conflict (from_node, to_node, relation) do nothing;
    end if;
  end loop;

  return new;
end;
$$;

create trigger memory_nodes_sync_wikilinks
  after insert or update of content on public.memory_nodes
  for each row execute function public.sync_wikilinks();

-- ============================================================
-- Busca full-text (rápida, exata, com ranking)
-- ============================================================
create or replace function public.search_memory_nodes(
  query text,
  match_count int default 20,
  filter_types text[] default null
)
returns table (
  id uuid, type text, title text, content text, tags text[],
  rank real, created_at timestamptz
)
language sql stable as $$
  select n.id, n.type, n.title, n.content, n.tags,
         ts_rank(n.content_tsv, websearch_to_tsquery('portuguese', f_unaccent(query))) as rank,
         n.created_at
    from public.memory_nodes n
   where n.content_tsv @@ websearch_to_tsquery('portuguese', f_unaccent(query))
     and (filter_types is null or n.type = any(filter_types))
   order by rank desc
   limit match_count
$$;

-- ============================================================
-- Busca semântica (similaridade de embeddings, cosine)
-- ============================================================
create or replace function public.match_memory_nodes(
  query_embedding vector(1536),
  match_count int default 10,
  filter_types text[] default null
)
returns table (
  id uuid, type text, title text, content text, tags text[],
  similarity float, created_at timestamptz
)
language sql stable as $$
  select n.id, n.type, n.title, n.content, n.tags,
         1 - (n.embedding <=> query_embedding) as similarity,
         n.created_at
    from public.memory_nodes n
   where n.embedding is not null
     and (filter_types is null or n.type = any(filter_types))
   order by n.embedding <=> query_embedding
   limit match_count
$$;

-- ============================================================
-- Busca híbrida: funde full-text + semântica via Reciprocal Rank Fusion
-- ============================================================
create or replace function public.hybrid_search_memory(
  query text,
  query_embedding vector(1536),
  match_count int default 10,
  filter_types text[] default null,
  rrf_k int default 50
)
returns table (
  id uuid, type text, title text, content text, tags text[], score float
)
language sql stable as $$
  with fts as (
    select id, row_number() over (order by rank desc) as rnk
      from public.search_memory_nodes(query, 50, filter_types)
  ),
  vec as (
    select id, row_number() over (order by similarity desc) as rnk
      from public.match_memory_nodes(query_embedding, 50, filter_types)
  ),
  fused as (
    select coalesce(fts.id, vec.id) as id,
           coalesce(1.0 / (rrf_k + fts.rnk), 0) + coalesce(1.0 / (rrf_k + vec.rnk), 0) as score
      from fts
      full outer join vec on fts.id = vec.id
  )
  select n.id, n.type, n.title, n.content, n.tags, f.score
    from fused f
    join public.memory_nodes n on n.id = f.id
   order by f.score desc
   limit match_count
$$;

-- ============================================================
-- Backlinks de um nó (quem aponta para ele) — painel do Obsidian
-- ============================================================
create or replace function public.get_backlinks(target_id uuid)
returns table (
  edge_id uuid, relation text, weight real,
  node_id uuid, node_type text, node_title text
)
language sql stable as $$
  select e.id, e.relation, e.weight, n.id, n.type, n.title
    from public.memory_edges e
    join public.memory_nodes n on n.id = e.from_node
   where e.to_node = target_id
   order by e.created_at desc
$$;

-- ============================================================
-- Vizinhança do grafo (N saltos a partir de um nó) — grafo local
-- ============================================================
create or replace function public.get_graph_neighborhood(start_id uuid, depth int default 2)
returns table (
  node_id uuid, node_type text, node_title text, hop int
)
language sql stable as $$
  with recursive walk(id, hop) as (
    select start_id, 0
    union
    select case when e.from_node = w.id then e.to_node else e.from_node end, w.hop + 1
      from public.memory_edges e
      join walk w on e.from_node = w.id or e.to_node = w.id
     where w.hop < depth
  )
  select distinct on (n.id) n.id, n.type, n.title, min(w.hop) over (partition by n.id)
    from walk w
    join public.memory_nodes n on n.id = w.id
   order by n.id
$$;

-- ============================================================
-- RLS: fecha o schema para anon/authenticated. O único código que
-- acessa estas tabelas é a Edge Function memory-api, que usa a
-- service_role key injetada automaticamente pelo Supabase — o
-- servidor MCP e o n8n falam com ela via HTTP usando só a chave
-- pública (anon), nunca a service_role.
-- ============================================================
alter table public.memory_nodes enable row level security;
alter table public.memory_edges enable row level security;
