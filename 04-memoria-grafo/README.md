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
        │  MCP (stdio)                  │  HTTP
        ▼                               ▼
        Edge Function "memory-api" (roda no Supabase,
        service_role key injetada automaticamente —
        quem chama só precisa da chave pública/anon)
                        │
                        ▼
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
- **[`edge-function/`](./edge-function)** — a API HTTP real (Deno, roda no Supabase). É o único ponto que fala com o banco usando privilégios de escrita; ninguém mais precisa da service_role key.
- **[`mcp-server/`](./mcp-server)** — servidor MCP em Node.js: dá ao Claude as tools `memory_create_node`, `memory_search`, `memory_backlinks`, `memory_graph` etc. em qualquer sessão/projeto. Já vem configurado, sem `.env` para preencher.
- **[`n8n/`](./n8n)** — como workflows n8n leem e escrevem na mesma memória via HTTP Request node.

## ✅ Como funciona o grafo (estilo Obsidian)
1. Você escreve um nó com `[[Nome de Outro Nó]]` no conteúdo.
2. Um trigger no Postgres resolve o link para o nó existente com esse título e cria a aresta (`relation: links_to`) automaticamente — sem passo manual.
3. `memory_backlinks` mostra quem aponta pra um nó (o painel de backlinks do Obsidian). `memory_graph` mostra a vizinhança em N saltos (o grafo local).
4. Relações que não são "menção no texto" (`depends_on`, `caused_by`, `part_of`...) são criadas explicitamente via `memory_link`.

## 🛠️ Stack
Supabase (Postgres 17) · pgvector (HNSW) · pg_trgm/unaccent · Edge Functions (Deno) · Model Context Protocol SDK · Node.js · OpenAI embeddings (opcional, `text-embedding-3-small`) · n8n via HTTP

## 🔒 Decisões técnicas
- **RLS fechado + Edge Function como único ponto de escrita**: `memory_nodes`/`memory_edges` têm Row Level Security ativo sem policies — nem `anon` nem `authenticated` tocam as tabelas direto. Só a Edge Function `memory-api` acessa o banco, usando a `service_role` key que o Supabase injeta automaticamente no ambiente dela. Isso significa que **nenhum humano ou serviço externo precisa conhecer a service_role key** — nem para configurar o servidor MCP, nem o n8n, nem qualquer cliente futuro. Quem chama a API só precisa da chave pública (anon), que é segura por design.
- **Grafo sem extensão dedicada**: sem Apache AGE disponível no plano, o grafo é uma tabela de arestas + CTE recursiva. Suficiente para a escala de um portfólio pessoal; migra para AGE/Neo4j só se o volume justificar.
- **Auto-link conservador**: `[[Título]]` só vira aresta se o nó de destino já existir (sem criar nós fantasma). Se o destino ainda não existe, o link fica sem aresta até o nó ser criado e a origem ser reeditada.
- **Busca híbrida via RRF**: Reciprocal Rank Fusion combina o ranking full-text com o de similaridade vetorial sem precisar normalizar as duas escalas de score.
- **Projeto Supabase dedicado** (`memoria-grafo-dev`, plano free): isolado do projeto `Marketplace de Freelas por Turno` já existente, pra não misturar schemas de domínios diferentes.

## ⚠️ Limitação conhecida
A rede deste ambiente de desenvolvimento (sandbox onde o Claude rodou ao construir isso) bloqueia acesso direto a `*.supabase.co` por política da organização — por isso o endpoint HTTP da Edge Function não foi testado com uma chamada real feita *daqui de dentro*. A lógica de banco (nós, backlinks automáticos, busca, grafo) foi validada via SQL direto, e o deploy da função foi aceito sem erro. Se você rodar `mcp-server` na sua própria máquina (com acesso normal à internet), deve funcionar de primeira — mas vale testar `memory_create_node` uma vez antes de confiar de olhos fechados.
