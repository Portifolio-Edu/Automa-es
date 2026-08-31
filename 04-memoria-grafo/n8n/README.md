# Integração n8n

Os workflows n8n falam com a memória chamando a mesma [Edge Function `memory-api`](../edge-function) que o servidor MCP usa. Não precisa de credencial de banco nem de service_role key — só um HTTP Request node com dois headers fixos.

## Credencial

Crie uma credencial **Header Auth** no n8n (ou use headers manuais no node):

- Header 1: `Authorization` = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlYmV3bGpqb3VocXdwem1nZWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxOTgyMTAsImV4cCI6MjEwMzc3NDIxMH0.qkGQffkslopGgvNP3aZbm-ceYhv2AlEmbJef8yOnDDA`
- Header 2: `apikey` = mesmo valor acima

URL base: `https://bebewljjouhqwpzmgeks.supabase.co/functions/v1/memory-api`

Essa é a chave pública (anon) do projeto — não dá acesso a nada além do que a própria Edge Function decide expor, então não tem problema ela estar aqui no repo.

## Criar um nó de memória

`POST {base}/nodes`

```json
{
  "type": "automation",
  "title": "Workflow: Relatório Meta Ads",
  "content": "Roda todo domingo 08h. Depende de [[Credencial Facebook Graph API]].",
  "tags": ["n8n", "meta-ads"],
  "source": "n8n"
}
```

## Atualizar um nó

`PATCH {base}/nodes/{id}` com o mesmo formato de body (só os campos que quer mudar).

## Buscar

`POST {base}/search`

```json
{ "query": "relatório meta ads", "mode": "text", "limit": 10 }
```

## Backlinks / grafo local

`GET {base}/backlinks/{id}`

`GET {base}/graph/{id}?depth=2`

## Criar aresta manual

Para relações que não são "menção no texto" (ex: `depends_on`, `blocks`):

`POST {base}/links`
```json
{ "from_id": "<uuid>", "to_id": "<uuid>", "relation": "depends_on" }
```

## Padrão sugerido de workflow

1. No fim de cada automação relevante (ex: Sophia SDR fechou um lead, Meta Ads gerou um relatório), um node HTTP Request grava um nó em `/nodes` com `source: "n8n"` e `[[wikilinks]]` para entidades relacionadas (cliente, projeto).
2. Um Code node monta o `content` já com os `[[Título]]` corretos — a Edge Function resolve os backlinks sozinha, não precisa criar a aresta manualmente.
3. Para relações que não são "menção no texto", chame `POST {base}/links` direto, como no exemplo acima.
