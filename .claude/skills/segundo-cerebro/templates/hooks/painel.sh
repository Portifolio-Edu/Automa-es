#!/bin/bash
# Painel do vault: injetado em toda sessão via hook SessionStart.
V="${CLAUDE_PROJECT_DIR:-$(pwd)}"

echo "📍 PAINEL DO VAULT · $(date +%Y-%m-%d)"
echo ""
echo "## Foco da Semana"
if [ -f "$V/memoria/foco-da-semana.md" ]; then
  sed -n '/^\*\*Semana de/,/^\*\*Bloqueio/p' "$V/memoria/foco-da-semana.md"
  FOCO_DATE=$(grep -m1 '^\*\*Semana de' "$V/memoria/foco-da-semana.md" | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' | head -1)
  if [ -n "$FOCO_DATE" ]; then
    if date -j -f "%Y-%m-%d" "$FOCO_DATE" "+%s" >/dev/null 2>&1; then
      FOCO_TS=$(date -j -f "%Y-%m-%d" "$FOCO_DATE" "+%s")
    else
      FOCO_TS=$(date -d "$FOCO_DATE" "+%s" 2>/dev/null || echo 0)
    fi
    DIAS=$(( ( $(date +%s) - FOCO_TS ) / 86400 ))
    if [ "$DIAS" -gt 7 ]; then
      echo "⚠️ FOCO VENCIDO (${DIAS} dias): pergunte o foco da semana nova e atualize memoria/foco-da-semana.md antes de trabalho estratégico."
    fi
  fi
fi
echo ""
echo "## Tarefas abertas (topo de tasks/todo.md)"
grep -m 10 '^- \[ \]' "$V/tasks/todo.md" 2>/dev/null
echo ""
echo "## Lembrete de captura"
echo "Todo fato novo dito pelo usuário (pessoa, cliente, negócio, decisão, número) deve ser gravado no objeto certo NA HORA, com anúncio de 1 linha. Roteamento: CLAUDE.md §4."
