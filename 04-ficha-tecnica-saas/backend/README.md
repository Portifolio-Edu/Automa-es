# Backend — Ficha Técnica SaaS

Motor de cálculo do produto: funções puras testadas para as fórmulas de CMV, precificação, estoque e nutricional (seção 5 do handoff). Cobre o passo 4 da ordem de construção.

O schema Postgres + RLS (passo 1) mora em [`../app/supabase/migrations`](../app/supabase/migrations) — o projeto Next.js é o dono do `supabase/` daqui pra frente, pra não ter duas migrations divergindo em paralelo. Veja o README de `app/` pros detalhes de RLS e como aplicar.

## Estrutura

```
src/calc/                                  motor de cálculo (funções puras, sem I/O)
src/calc/__tests__/                        testes unitários (vitest)
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

- Camada de API/RPC (Server Actions ou route handlers em `app/`) que chama o motor de cálculo a partir dos dados lidos via Supabase client.
- Cron de `event_log` (alertas) e geração de PDF, ainda fora de escopo desta etapa.
