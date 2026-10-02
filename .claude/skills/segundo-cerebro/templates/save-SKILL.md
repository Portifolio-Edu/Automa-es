---
name: save
description: Fecha a sessão de trabalho do vault: faz a checagem final de captura (algo dito e não gravado?), salva o resumo da sessão no objeto certo, atualiza o foco da semana, tasks/todo.md e lessons.md, e deixa em dia o índice CLAUDE.md das pastas que mudaram. Use quando o usuário disser "/save", "salva", "salva a sessão", "fecha a sessão", "registra isso antes de fechar", "resume essa sessão" ou similar, ao final de um bloco de trabalho.
---

# Skill: /save · Fechamento de Sessão

> Fecha o expediente garantindo que NADA da conversa se perdeu. É a segunda metade do Protocolo de Captura Contínua (CLAUDE.md §2): a captura roda durante a conversa; o /save é a varredura final + estado do sistema em dia.

## Setup (leia antes de executar)
1. `CLAUDE.md` do vault: §2 (captura), §3 (estrutura), §4 (roteamento).
2. `memoria/foco-da-semana.md` e `tasks/todo.md`.

## Fluxo (na ordem)

### 1. Checagem de captura (a etapa mais importante)
Varra a conversa inteira e liste todo fato que deveria estar gravado e ainda não foi:
- Pessoa nova ou fato novo sobre pessoa → `pessoas/Nome Próprio.md`
- Fato sobre cliente/negócio (status, valor, decisão) → nota da entidade (atualizar `status` e `updated` no frontmatter)
- Tarefa ou pendência mencionada → `tasks/todo.md`
- Correção que o usuário fez no trabalho → `tasks/lessons.md`
Grave cada um AGORA e anuncie em 1 linha por gravação.

### 2. Resumo da sessão no objeto certo
Se a sessão teve trabalho substancial, salvar `YYYY-MM-DD-<contexto-breve>.md` DENTRO do objeto principal da sessão (cliente, projeto, negócio, área pessoal). Formato:

```markdown
---
data: YYYY-MM-DD
tipo: sessao
tema: <contexto-breve>
---

# <Contexto> · YYYY-MM-DD

## Decisões
- ...

## Informações novas
- ...

## Próximas ações
- [ ] <ação> · <dono> · <prazo ou "sem prazo">
```

### 3. Foco da semana (`memoria/foco-da-semana.md`)
- Se a data "Semana de:" tem 7+ dias (ou é segunda-feira): perguntar as prioridades da semana e reescrever o bloco, movendo o anterior pro Histórico.
- Se a sessão mudou o quadro (decisão grande, prioridade nova, bloqueio resolvido): atualizar só o que mudou.

### 4. Tasks
- `tasks/todo.md`: marcar concluídas (mover pra seção "Concluídas" com data), adicionar novas.
- `tasks/lessons.md`: registrar padrão de qualquer correção recebida na sessão.

### 5. Memória de contexto (`memoria/MEMORY.md`)
Se a sessão trouxe algo que muda o contexto permanente (projeto novo, mudança de rumo, preferência forte), atualizar/criar a nota em `memoria/` e manter o índice `MEMORY.md` em dia (1 linha por nota). Anunciar o que gravou.

### 6. Índices de pasta em dia
Para cada pasta em que a sessão criou, renomeou, moveu ou arquivou arquivo: abrir o `<pasta>/CLAUDE.md` e atualizar a tabela do que existe ali, o status e a data. Se a sessão criou uma pasta nova, criar o índice dela e incluir a pasta na tabela de estrutura do `.claude/CLAUDE.md`. Se o índice dizia uma coisa e o arquivo outra, o arquivo vence: corrigir o índice. Anunciar em 1 linha quais índices mudaram.

### 7. Fechar
Confirmar: "Tem mais alguma coisa pra registrar antes de fechar?" e listar em 3-5 linhas o que foi salvo e onde.

## Regras
- Kebab-case + data YYYY-MM-DD em tudo que gerar.
- Nunca usar o travessão "—".
- Nunca deletar: arquivar com timestamp em `arquivo/`.
- Resumo enxuto: registro operacional, não redação.
- Se a sessão foi trivial (só conversa, nada produzido), dizer isso e pular o passo 2 sem burocracia.
