# memoria-grafo-mcp

Servidor MCP (Model Context Protocol) que expõe a memória com grafo para o Claude — em qualquer sessão, de qualquer projeto, com contexto persistente entre conversas.

## Setup

```bash
cd mcp-server
npm install
cp .env.example .env
```

Preencha o `.env`:
- `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`: em Project Settings → API do projeto Supabase `memoria-grafo-dev`. **Use a service_role key, nunca a anon** — o RLS do schema bloqueia anon/authenticated de propósito, só a service_role tem acesso.
- `OPENAI_API_KEY` (opcional): sem ela, `memory_search` sempre roda em modo `text` (full-text). Com ela, habilita busca `semantic`/`hybrid`.

## Registrar no Claude Code

```bash
claude mcp add memoria-grafo -- node /caminho/absoluto/para/04-memoria-grafo/mcp-server/src/index.js
```

(ou configure as env vars via `-e SUPABASE_URL=... -e SUPABASE_SERVICE_ROLE_KEY=...` na hora de adicionar, em vez do `.env`).

## Tools expostas

| Tool | Uso |
|---|---|
| `memory_create_node` | Cria nota/decisão/entidade/projeto. `[[Título]]` no conteúdo vira backlink automático. |
| `memory_update_node` | Atualiza um nó existente (reprocessa embedding e wikilinks). |
| `memory_get_node` | Busca por id ou título exato. |
| `memory_search` | Busca `text` (full-text), `semantic` (embeddings) ou `hybrid` (RRF, recomendado). |
| `memory_link` | Cria uma aresta manual (`depends_on`, `caused_by`, `part_of`, ...). |
| `memory_backlinks` | Lista quem aponta para um nó. |
| `memory_graph` | Vizinhança do grafo (N saltos) a partir de um nó — grafo local, como no Obsidian. |

## Por que isso "supera" o Obsidian num ponto específico

O Obsidian indexa localmente e só busca por texto/tags no vault. Aqui a mesma ideia de grafo + backlinks roda sobre Postgres compartilhado, então:
- qualquer agente (Claude, n8n, uma API futura) lê e escreve na mesma memória, não fica preso a um vault local;
- a busca é híbrida (texto exato + significado via embeddings), não só full-text;
- é consultável via SQL/RPC direto, sem precisar abrir um app.

O trade-off: não tem editor visual nem grafo renderizado ainda — isso fica para uma camada de UI futura, se for necessária.
