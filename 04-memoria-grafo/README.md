# 🧠 Memória com Grafo — banco indexado estilo Obsidian

## Overview
Banco de conhecimento persistente e indexado, compartilhado entre todos os projetos deste portfólio. Guarda notas, decisões, entidades e eventos como **nós**, liga eles em um **grafo** (backlinks automáticos via `[[wikilinks]]`, como no Obsidian) e permite busca full-text, semântica ou híbrida. Qualquer agente — Claude, um workflow n8n, ou uma API futura — lê e escreve na mesma memória, em vez de cada automação guardar contexto isolado.

## 🎯 Problema Resolvido
- Contexto perdido entre sessões de desenvolvimento com o Claude e entre execuções de workflows n8n.
- Decisões de arquitetura e histórico de "por que fizemos assim" espalhados em conversas que somem.
- Nenhuma forma de relacionar projetos, clientes e automações entre si — cada um documentado isoladamente (como os READMEs dos outros projetos deste repo).

## 🏗️ Arquitetura

```
Claude (qualquer sessão)         n8n (qualquer workflow)
        │  MCP (stdio)                  │  HTTP (PostgREST)
        ▼                               ▼
              Supabase — projeto "memoria-grafo-dev"
              Postgres 17 + pgvector + pg_trgm
        ┌─────────────────────────────────────────┐
        │ memory_nodes  (notas, decisões, entidades)│
        │   - content_tsv  → full-text (português) │
        │   - embedding    → busca semântica        │
        │   - trigger sync_wikilinks → auto-backlink│
        │ memory_edges  (grafo dirigido, tipado)    │
        └─────────────────────────────────────────┘
        RPC: search_memory_nodes · match_memory_nodes
             hybrid_search_memory · get_backlinks
             get_graph_neighborhood
```

- **[`schema.sql`](./schema.sql)** — schema completo (tabelas, índices, triggers, funções RPC), já aplicado no projeto Supabase.
- **[`mcp-server/`](./mcp-server)** — servidor MCP em Node.js: dá ao Claude as tools `memory_create_node`, `memory_search`, `memory_backlinks`, `memory_graph` etc. em qualquer sessão/projeto.
- **[`n8n/`](./n8n)** — como workflows n8n leem e escrevem na mesma memória via REST (PostgREST do Supabase, sem servidor extra).

## ✅ Como funciona o grafo (estilo Obsidian)
1. Você escreve um nó com `[[Nome de Outro Nó]]` no conteúdo.
2. Um trigger no Postgres resolve o link para o nó existente com esse título e cria a aresta (`relation: links_to`) automaticamente — sem passo manual.
3. `memory_backlinks` mostra quem aponta pra um nó (o painel de backlinks do Obsidian). `memory_graph` mostra a vizinhança em N saltos (o grafo local).
4. Relações que não são "menção no texto" (`depends_on`, `caused_by`, `part_of`...) são criadas explicitamente via `memory_link`.

## 🛠️ Stack
Supabase (Postgres 17) · pgvector (HNSW) · pg_trgm/unaccent · Model Context Protocol SDK · Node.js · OpenAI embeddings (opcional, `text-embedding-3-small`) · n8n via PostgREST

## 🔒 Decisões técnicas
- **RLS fechado por padrão**: `memory_nodes`/`memory_edges` têm Row Level Security ativo sem policies — só a `service_role` key atravessa. A chave `anon` nunca deve ser usada aqui.
- **Grafo sem extensão dedicada**: sem Apache AGE disponível no plano, o grafo é uma tabela de arestas + CTE recursiva. Suficiente para a escala de um portfólio pessoal; migra para AGE/Neo4j só se o volume justificar.
- **Auto-link conservador**: `[[Título]]` só vira aresta se o nó de destino já existir (sem criar nós fantasma). Se o destino ainda não existe, o link fica sem aresta até o nó ser criado e a origem ser reeditada.
- **Busca híbrida via RRF**: Reciprocal Rank Fusion combina o ranking full-text com o de similaridade vetorial sem precisar normalizar as duas escalas de score.
- **Projeto Supabase dedicado** (`memoria-grafo-dev`, plano free): isolado do projeto `Marketplace de Freelas por Turno` já existente, pra não misturar schemas de domínios diferentes.
