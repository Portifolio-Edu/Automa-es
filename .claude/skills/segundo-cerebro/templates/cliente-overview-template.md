---
type: cliente
empresa: {{marca-dona-da-relacao (se houver mais de uma)}}
status: {{lead | proposta enviada | ativo | pausado | encerrado}}
updated: {{DATA}}
tags: [cliente]
---
#cliente

# {{Nome do Cliente}}

| Campo | Valor |
|---|---|
| O que é | {{1 frase}} |
| Status | {{status + data do último movimento}} |
| Escopo/contrato | {{o que foi vendido/combinado, valores}} |
| Decisor | {{quem decide}} |

## Próxima ação
- [ ] {{próxima ação com dono e prazo}}

## Histórico
- {{DATA}}: ficha criada.
