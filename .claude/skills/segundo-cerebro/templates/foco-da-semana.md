---
name: foco-da-semana
description: Foco semanal vigente; injetado em toda sessão via hook SessionStart e atualizado pelo /save (ou toda segunda-feira)
---

# Foco da Semana

**Semana de:** {{DATA_SEGUNDA}}
**Prioridade 1:** {{PRIORIDADE_1}}
**Prioridade 2:** {{PRIORIDADE_2}}
**Prioridade 3:** {{PRIORIDADE_3}}
**Bloqueio principal:** {{BLOQUEIO}}

> Regra: se a data acima tiver mais de 7 dias, o hook de sessão avisa e o Claude pergunta o foco novo antes de seguir com trabalho estratégico.

## Histórico
- {{DATA}}: primeira versão, criada na mentoria de Segundo Cérebro.
