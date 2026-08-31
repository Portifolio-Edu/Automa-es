# memory-api (Edge Function)

Já está implantada no projeto Supabase `memoria-grafo-dev` (região `sa-east-1`) em:

```
https://bebewljjouhqwpzmgeks.supabase.co/functions/v1/memory-api
```

## Por que uma Edge Function e não PostgREST direto

O schema (`../schema.sql`) mantém RLS ativo sem policies — nenhuma chave pública toca `memory_nodes`/`memory_edges` direto. Esta função é o único código que acessa as tabelas, usando a `service_role` key que o **Supabase injeta automaticamente** no ambiente de toda Edge Function (`Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")`). Resultado: ninguém — nem o servidor MCP, nem n8n, nem você — precisa copiar essa chave de lugar nenhum. Quem chama esta função só usa a chave pública (anon), que só serve para passar no `verify_jwt` do próprio Supabase.

## Rotas

| Rota | Método | Uso |
|---|---|---|
| `/nodes` | POST | Cria nó |
| `/nodes/:id` | PATCH | Atualiza nó |
| `/nodes/:id` | GET | Busca por id |
| `/nodes?title=...` | GET | Busca por título exato |
| `/search` | POST | `{ query, mode: text\|semantic\|hybrid, limit, types }` |
| `/links` | POST | Cria aresta manual `{ from_id, to_id, relation, weight }` |
| `/backlinks/:id` | GET | Quem aponta para o nó |
| `/graph/:id?depth=2` | GET | Vizinhança do grafo |

## Redeploy

Se editar `index.ts`, reimplante com a MCP tool `deploy_edge_function` do Supabase (ou `supabase functions deploy memory-api` via CLI, se preferir rodar local).

## Secrets opcionais

- `OPENAI_API_KEY` — habilita embeddings e busca `semantic`/`hybrid`. Configure em Project → Edge Functions → memory-api → Secrets.
- `OPENAI_EMBEDDING_MODEL` — default `text-embedding-3-small`.
