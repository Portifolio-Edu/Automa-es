#!/bin/bash
# Protocolo de captura contínua: lembrete injetado a cada mensagem (hook UserPromptSubmit).
echo "<protocolo-captura>Se esta mensagem contém fato novo sobre entidade (pessoa, cliente, negócio, decisão, número, relação), grave AGORA no objeto certo do vault (CLAUDE.md §4) e anuncie em 1 linha. Se faltar dado-chave, faça no máximo 1 pergunta de completude. Tarefa mencionada vira item em tasks/todo.md.</protocolo-captura>"
