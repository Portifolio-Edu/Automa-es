# memoria-grafo-mcp

Servidor MCP (Model Context Protocol) que expõe a memória com grafo para o Claude — em qualquer sessão, de qualquer projeto, com contexto persistente entre conversas.

Fala com a [Edge Function `memory-api`](../edge-function) via HTTPS. Não precisa de banco, chave secreta nem `.env` — já vem configurado com os valores reais do projeto `memoria-grafo-dev`.

## Setup

```bash
cd mcp-server
npm install
```

Pronto — sem `.env`, sem chave para copiar de lugar nenhum. (Se um dia quiser apontar para outro projeto Supabase, copie `.env.example` para `.env` e preencha `MEMORY_API_URL`/`MEMORY_API_KEY` com os valores do outro projeto.)

## Registrar no Claude Code

```bash
claude mcp add memoria-grafo -- node /caminho/absoluto/para/04-memoria-grafo/mcp-server/src/index.js
```

Depois de rodar isso uma vez na sua máquina, toda sessão do Claude Code ganha as tools de memória abaixo.

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

## Habilitar busca semântica (opcional)

Por padrão só `text` funciona (full-text, já é bom o suficiente pra maioria dos casos). Pra habilitar `semantic`/`hybrid`, configure a secret `OPENAI_API_KEY` na Edge Function pelo painel do Supabase: **Project → Edge Functions → memory-api → Secrets**. Isso é feito uma vez só, direto no Supabase — o servidor MCP não muda em nada.

## Por que isso "supera" o Obsidian num ponto específico

O Obsidian indexa localmente e só busca por texto/tags no vault. Aqui a mesma ideia de grafo + backlinks roda sobre Postgres compartilhado, então:
- qualquer agente (Claude, n8n, uma API futura) lê e escreve na mesma memória, não fica preso a um vault local;
- a busca é híbrida (texto exato + significado via embeddings), não só full-text;
- é consultável via HTTP direto, sem precisar abrir um app.

O trade-off: não tem editor visual nem grafo renderizado ainda — isso fica para uma camada de UI futura, se for necessária.
