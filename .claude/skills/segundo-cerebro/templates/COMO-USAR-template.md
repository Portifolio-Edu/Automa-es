# 🧠 Como usar o seu Segundo Cérebro

> Criado em {{DATA}} pela skill Segundo Cérebro do Felipe Tâmbara. Guarde esta página: é tudo que você precisa saber.

## A regra de ouro
Você não organiza nada. Você só **fala**. O Claude guarda cada coisa no lugar certo e te avisa onde guardou.

## Os 3 movimentos do dia a dia

**1. Falar (captura automática)**
Abra o terminal na pasta do vault, rode `claude` e conte o que aconteceu, do jeito que você fala:
- "{{EXEMPLO_CAPTURA_1 (ex: 'reuni com o fornecedor X e fechamos prazo pra sexta')}}"
- "{{EXEMPLO_CAPTURA_2 (ex: 'conheci a fulana num evento, ela tem uma agência')}}"
- "gastei R$X com Y" / "preciso lembrar de Z"
O Claude grava e responde: "Gravei em `pessoas/Fulana.md`".

**2. Perguntar (recuperação)**
- "O que ficou da última reunião com {{PESSOA}}?"
- "Qual o status do cliente {{CLIENTE}}?"
- "O que eu tenho pendente essa semana?"

**3. Fechar (`/save`)**
No fim de um bloco de trabalho, digite `/save`. Ele varre a conversa, salva o que faltou, atualiza suas tarefas e o foco da semana.

## Rotina mínima que sustenta tudo
- **1 sessão por dia útil** (nem que seja 5 minutos despejando o dia).
- **`/save` no fim** de cada sessão de trabalho.
- **Segunda-feira:** o painel vai te cobrar o foco da semana. Responda com 1 a 3 prioridades.

## O mapa do vault
| Pasta | O que mora lá |
|---|---|
{{TABELA_DAS_PASTAS_CRIADAS}}

## Por que cada pasta tem um CLAUDE.md
É o índice daquela pasta: o mapa que o Claude lê antes de procurar qualquer coisa ali. Você não precisa escrever nem manter: o `/save` atualiza. Se quiser saber o que tem numa pasta, abra o `CLAUDE.md` dela.

## As próximas camadas
Este vault é a camada 1 (Memória). Quando ele estiver vivo, as próximas são: **Habilidades** (fez algo 3 vezes, peça pro Claude transformar em skill), **Orquestração** (vários agentes trabalhando juntos) e **Braços** (o Claude ligado nas suas ferramentas).

## O que NUNCA fazer
- Não crie pastas novas por conta própria: fale com o Claude e deixe ele rotear.
- Não guarde código de programação aqui dentro: projeto de código mora fora do vault, e aqui fica só a nota dele em `projetos/`.
- Não delete nada: peça pro Claude "arquivar", que vai pra `arquivo/` com data.
- Não acumule "pra organizar depois": se está na sua cabeça, fala AGORA numa sessão.
