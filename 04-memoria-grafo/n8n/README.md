# Integração n8n

Os workflows n8n falam com a memória do mesmo jeito que o servidor MCP: via [PostgREST](https://postgrest.org), a API REST que o Supabase já gera automaticamente para as tabelas e funções do schema. Não é preciso subir nenhum serviço extra.

## Credencial

Crie uma credencial **Header Auth** (ou use direto o node HTTP Request com header manual) apontando para:

- URL base: `https://<project-ref>.supabase.co/rest/v1`
- Headers em toda chamada:
  - `apikey: <SUPABASE_SERVICE_ROLE_KEY>`
  - `Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>`

Use sempre a **service_role key** (Project Settings → API), guardada como credencial no n8n — nunca hardcoded no node. O schema tem RLS ativo e nega anon/authenticated de propósito; só a service_role atravessa.

## Criar um nó de memória

`POST /memory_nodes`

```json
{
  "type": "automation",
  "title": "Workflow: Relatório Meta Ads",
  "content": "Roda todo domingo 08h. Depende de [[Credencial Facebook Graph API]].",
  "tags": ["n8n", "meta-ads"],
  "source": "n8n"
}
```

Body do HTTP Request node: JSON acima. Header extra: `Prefer: return=representation` (senão o Supabase responde 201 sem corpo).

> Embedding não é gerado aqui — inserts via REST direto não chamam o servidor MCP, então ficam sem vetor semântico (a coluna `embedding` fica null). Isso é ok para full-text (`search_memory_nodes`), mas para entrar na busca semântica/híbrida o nó precisa ser criado/atualizado via `memory_create_node`/`memory_update_node` do MCP (ou você gera o embedding você mesmo e manda no body).

## Buscar (full-text)

`POST /rpc/search_memory_nodes`

```json
{ "query": "relatório meta ads", "match_count": 10 }
```

## Backlinks / grafo local

`POST /rpc/get_backlinks`
```json
{ "target_id": "<uuid do nó>" }
```

`POST /rpc/get_graph_neighborhood`
```json
{ "start_id": "<uuid do nó>", "depth": 2 }
```

## Padrão sugerido de workflow

1. No fim de cada automação relevante (ex: Sophia SDR fechou um lead, Meta Ads gerou um relatório), um node HTTP Request grava um nó em `memory_nodes` com `source: "n8n"` e `[[wikilinks]]` para entidades relacionadas (cliente, projeto).
2. Um Code node monta o `content` já com os `[[Título]]` corretos — o trigger do banco resolve os backlinks sozinho, não precisa criar a aresta manualmente.
3. Para relações que não são "menção no texto" (ex: `depends_on`, `blocks`), chame `POST /memory_edges` direto:
   ```json
   { "from_node": "<uuid>", "to_node": "<uuid>", "relation": "depends_on" }
   ```
