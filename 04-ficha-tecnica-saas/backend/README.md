# Backend — Ficha Técnica SaaS

Schema, RLS e motor de cálculo do produto, implementados a partir do handoff técnico do projeto. Cobre os passos 1 e 4 da ordem de construção: banco com RLS desde a primeira migration, e funções puras testadas para as fórmulas de CMV, precificação, estoque e nutricional.

## Estrutura

```
supabase/migrations/0001_init_schema.sql   schema completo (27 tabelas) + RLS por cliente_id
src/calc/                                  motor de cálculo (funções puras, sem I/O)
src/calc/__tests__/                        testes unitários (vitest)
```

## Schema e RLS

Todo tenant é isolado por `cliente_id`. Tabelas com `cliente_id` direto usam
`cliente_id = auth_cliente_id()`; tabelas alcançáveis só por uma tabela-mãe
(`receita_insumos`, `estoque`, `checklist_itens`, ...) usam um `EXISTS` até o
ancestral que carrega `cliente_id`, em vez de duplicar a coluna em cada folha.

`auth_cliente_id()` lê o claim customizado `cliente_id` do JWT da sessão
(`request.jwt.claims`). Isso pressupõe um hook de Auth do Supabase que injeta
esse claim ao autenticar — ainda não implementado, é o próximo passo antes de
apontar o backend para um projeto Supabase real.

Constraints de negócio ficam no banco, não só na aplicação: perda de produção
exige `motivo_perda`, e um lote de processamento de proteína cujo líquido +
aparas ultrapassa o bruto recebido é rejeitado no `insert`/`update` (a conta
não fecha). Ambos foram exercitados manualmente contra um Postgres 16 local.

Aplicar num projeto Supabase:

```
supabase db push
# ou, direto via psql:
psql "$DATABASE_URL" -f supabase/migrations/0001_init_schema.sql
```

## Motor de cálculo

Cada arquivo em `src/calc/` implementa uma fórmula da seção 5 do handoff,
sem depender de banco ou de UI — recebe dados já resolvidos e devolve número:

| Arquivo | Fórmula |
|---|---|
| `fatorCorrecao.ts` | FC efetivo (medido prevalece sobre o cadastrado) |
| `conversaoUnidade.ts` | kg/g, l/ml, un via `peso_por_unidade` |
| `cmv.ts` | CMV da receita, com sub-receita aninhada (1 nível) |
| `precificacao.ts` | Preço sugerido e preço por canal (mantém o ganho em reais) |
| `capacidadeProducao.ts` | Gargalo de estoque, insumo sem rastreio fica fora |
| `fechamentoCmv.ts` | CMV teórico × real, gap; quebra de estoque |
| `nutricional.ts` | Por porção, por 100g, %VD, selo frontal, override de laudo |

Rodar:

```
npm install
npm test        # 39 testes, cobrindo os exemplos numéricos do handoff (salmão, lasanha, iFood)
npm run typecheck
```

## Em aberto

- Hook de Auth para injetar `cliente_id` no JWT (pré-requisito para a RLS valer em produção).
- Camada de API/RPC (Edge Functions ou rotas Next.js) que chama o motor de cálculo a partir dos dados lidos via Supabase client.
- Cron de `event_log` (alertas) e geração de PDF, ainda fora de escopo desta etapa.
