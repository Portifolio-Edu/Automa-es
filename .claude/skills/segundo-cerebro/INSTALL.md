# Como instalar a skill Segundo Cérebro
> Leva uns 10 minutos. No fim você tem o seu segundo cérebro montado, com as suas pastas, as suas fichas e o Claude guardando tudo sozinho.

## 1. Instale o Obsidian
Baixe em https://obsidian.md e instale. Não precisa configurar nada.

## 2. Instale o Claude Code
Abra o Terminal (Mac: Cmd+Espaço e digite "Terminal") e rode:

```
curl -fsSL https://claude.ai/install.sh | bash
```

Depois rode `claude` e faça o login (precisa de uma conta Claude com plano pago: https://claude.ai).

## 3. Crie a pasta do seu vault e abra o Claude nela
```
mkdir -p ~/Documents/"Segundo Cerebro"
cd ~/Documents/"Segundo Cerebro"
claude
```

## 4. Entregue a skill pro Claude
Arraste o arquivo `segundo-cerebro.zip` pra dentro do terminal e escreva:

**"instala essa skill e monta o meu segundo cérebro"**

O Claude descompacta, instala a skill e começa a te fazer as perguntas, uma por vez.

### Se preferir instalar na mão
Descompacte o zip e copie o `SKILL.md` e a pasta `templates/` pra `~/.claude/skills/segundo-cerebro/` (crie a pasta com `mkdir -p ~/.claude/skills/segundo-cerebro`). Depois, com o Claude aberto na pasta do vault, digite **"monta meu segundo cérebro"**.

## Depois de montado
Abra a pasta no Obsidian ("Open folder as vault") e leia o `COMO-USAR.md` que o Claude deixou na raiz.
