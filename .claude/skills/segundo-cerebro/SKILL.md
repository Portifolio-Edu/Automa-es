---
name: segundo-cerebro
description: Monta um Segundo Cérebro completo (Obsidian + Claude Code) do zero, na arquitetura v3 do Felipe (captura contínua + hooks + /save + um índice CLAUDE.md em cada pasta). Conduz um briefing interativo guiado (uma pergunta por vez, com exemplos pra ajudar a responder), adapta a estrutura ao uso da pessoa (uma empresa, várias empresas, vida pessoal ou misto), instala pastas + constituição CLAUDE.md + índice de cada pasta + hooks de enforcement + a skill /save, cria as primeiras fichas a partir do próprio briefing e termina com teste ao vivo. Funciona sozinho (quem baixou a skill) ou com o Felipe conduzindo numa mentoria. Use quando alguém disser "monta meu segundo cérebro", "quero estruturar meu Obsidian", "cria meu vault do zero", "setup do segundo cérebro", "quero um segundo cérebro igual ao do Felipe".
---

# Segundo Cérebro v3 (setup completo)

Esta skill monta, do zero, um Segundo Cérebro pilotado pelo Claude Code na **arquitetura v3** (a mesma do vault do Felipe em outubro de 2026): captura contínua com enforcement por hooks, roteamento por objeto, **um índice `CLAUDE.md` em cada pasta** e a skill `/save` como fechamento. É a camada 1 (Memória) do sistema de 4 camadas: memória, habilidades, orquestração e braços. O resultado final: a pessoa só precisa FALAR com o Claude no dia a dia; o sistema guarda tudo no lugar certo sozinho e acha de volta sem varrer o vault inteiro.

> "Mentorado" neste documento = a pessoa dona do vault que está sendo montado, com ou sem o Felipe na call.

**Princípios da arquitetura v3 (não negociar):**
1. **Sem inbox, sem fila.** Tudo nasce dentro do objeto a que serve. Material sem destino claro = 1 pergunta, nunca "processar depois".
2. **Regra sem enforcement vira letra morta.** Hooks obrigatórios (painel no início da sessão + lembrete de captura em toda mensagem).
3. **Só criar pasta que vai ser usada.** Pasta vazia "pra quando precisar" morre vazia (lição da auditoria: 4 pastas de CRM ficaram com 0 arquivos por 2 meses).
4. **O briefing É a primeira captura.** Tudo que o mentorado contar nas perguntas já vira ficha no vault dele, na frente dele. Essa é a melhor demonstração do sistema.
5. **Toda pasta tem um `CLAUDE.md` próprio (índice de contexto).** É o mapa daquela pasta: o que existe ali, quando abrir o quê e as pegadinhas. Ele carrega sozinho quando o Claude toca qualquer arquivo da pasta, então 1 leitura resolve o que antes custava dez buscas. É o que faz o vault continuar rápido e barato quando passa de centenas de arquivos. O índice é mapa, não fonte da verdade: o fato vive no arquivo; divergiu, o arquivo vence e o índice se conserta na hora.
6. **Código não mora no vault.** Projeto de programação (site, app, script) vive numa pasta fora, tipo `~/Documents/Projetos/<slug>/`. No vault fica só uma nota-índice por projeto (o que é, onde está, como rodar, status). Milhares de arquivos de código dentro do vault travam o Obsidian.
7. **A constituição é o mapa dos mapas.** O `.claude/CLAUDE.md` diz quem a pessoa é e pra onde cada coisa vai; os `CLAUDE.md` das pastas dizem o que tem em cada lugar. O Claude nunca lê o vault inteiro: lê a constituição, o índice da pasta certa e só então o arquivo.

## O que NÃO fazer
- NÃO copiar o arsenal de skills do Felipe. O mentorado recebe SÓ a `/save` (está em `templates/save-SKILL.md`).
- NÃO despejar todas as perguntas de uma vez. UMA pergunta por mensagem, sempre.
- NÃO criar a estrutura antes do mentorado aprovar a proposta (Fase 2).
- NÃO usar o travessão "—" em nada que gerar.
- NÃO copiar dados do vault do Felipe (clientes, preços, pessoas) pro vault do mentorado.

## FASE 0 · Pré-voo (2 minutos)
1. Confirme onde o vault vai viver. Pergunte o caminho (sugestão padrão: `~/Documents/Segundo Cerebro`). Se a sessão do Claude Code não estiver rodando nessa pasta, oriente: criar a pasta, abrir o terminal nela e rodar `claude` de lá.
2. Confirme que o Obsidian está instalado e que a pessoa vai abrir essa pasta como vault ("Open folder as vault").

## FASE 1 · Briefing guiado (o coração da mentoria)

Uma pergunta por vez. Depois de cada resposta, **reaja e devolva entendimento** ("entendi, então o grosso do teu dia é X...") antes da próxima. Se a pessoa travar, ofereça opções e exemplos concretos. Anote tudo: vira ficha na Fase 3.

**P1. Quem é você?** "Me conta em 2-3 frases: seu nome, sua cidade e o que você faz hoje."

**P2. Uso principal.** "Qual vai ser o uso número 1 do seu segundo cérebro?" Ofereça as opções:
   - (a) Gerir **uma empresa/negócio**
   - (b) Gerir **várias empresas ou marcas**
   - (c) Organizar a **vida pessoal** (finanças, saúde, metas, estudos)
   - (d) **Misto** (negócio + pessoal)
   Ajude a decidir: "pensa no que hoje mais se perde ou mais te dá dor de cabeça por estar desorganizado".

**P3. (se tem negócio) As empresas.** Para CADA empresa/marca: nome, o que vende, pra quem vende (1 frase), e se tem clientes/contratos ativos. Se (b), pergunte também: "as empresas compartilham clientes e equipe, ou são mundos separados?"

**P4. Pessoas-chave.** "Me fala de 3 a 5 pessoas centrais na sua operação ou vida: sócio, mentor, funcionário, cliente importante, família." Nome + papel de cada uma. (Cada uma vira ficha em `pessoas/` na Fase 3.)

**P5. O que chega no seu dia.** "O que hoje chega até você e se perde? Exemplos: reuniões e calls, ideias soltas, notas de estudo, finanças, documentos, conteúdo pra redes sociais, tarefas." A resposta define as pastas OPCIONAIS (só criar as citadas).

**P6. Rotina de foco.** "Você tem algum ritual de planejamento? Semanal, mensal, nenhum?" (Configura o texto do foco-da-semana e a cobrança do hook.)

**P7. Tom.** "Como você prefere que o Claude fale com você: direto e telegráfico, ou mais explicadinho?"

## FASE 2 · Proposta da arquitetura (aprovar antes de criar)

Monte a árvore adaptada e mostre com 1 linha de explicação por pasta. Regra de montagem:

**Base (todo perfil recebe):**
```
tasks/          todo.md (tarefas) + lessons.md (correções viram regra)
memoria/        MEMORY.md (contexto vivo) + foco-da-semana.md
pessoas/        uma ficha por pessoa (Nome Próprio.md)
conhecimento/   raw/ (bruto) e wiki/ (notas interligadas)
assets/         arquivos ativos (PDFs, imagens, docs)
arquivo/        histórico morto com timestamp (nunca deletar nada)
.claude/        CLAUDE.md (constituição) + skills/save + hooks
```

**Perfil (a) uma empresa, adicionar:** `negocio/` (estratégia, oferta, financeiro da empresa), `clientes/` (uma pasta kebab-case por cliente com overview.md), `reunioes/` (reuniões sem dono de cliente), `projetos/` (se cita entregas/builds).
**Perfil (b) várias empresas, adicionar:** `negocios/<slug-de-cada-empresa>/` (estratégia + financeiro de cada uma), `clientes/` compartilhada com campo `empresa:` no frontmatter (se forem mundos separados: `clientes/<empresa>/<cliente>/`), `reunioes/`, `projetos/`.
**Perfil (c) vida pessoal, adicionar:** `pessoal/financeiro/`, `pessoal/saude/`, `pessoal/metas/`, `pessoal/rotina/` (só as que a P5 justificar).
**Perfil (d) misto:** combinação de (a ou b) + (c).
**Opcionais por P5:** `conteudo/` (se produz conteúdo pra redes). Estudos NÃO ganham pasta nova: vão em `conhecimento/`.
**`projetos/` guarda só o índice:** uma nota `<slug>.md` por projeto. Se a pessoa programa, explique que o código fica fora do vault (princípio 6).

Na proposta, avise em 1 linha que cada pasta vai nascer com o seu `CLAUDE.md` (o índice dela) e explique pra que serve.

Pergunte: "Faz sentido? Quer ajustar algum nome ou tirar algo?" Ajuste até o "sim".

## FASE 3 · Build (criar tudo)

1. **Pastas** da árvore aprovada. Pasta só nasce se tiver arquivo inicial ou uso imediato claro.
2. **Constituição**: gerar `.claude/CLAUDE.md` do vault novo a partir de `templates/CLAUDE-template.md`, preenchendo os `{{PLACEHOLDERS}}` com o briefing e removendo os blocos de perfil que não se aplicam. As tabelas de estrutura e roteamento devem listar SÓ as pastas que existem.
3. **Enforcement**: copiar `templates/hooks/painel.sh` e `templates/hooks/captura.sh` para `.claude/hooks/` do vault novo (dar `chmod +x`) e `templates/hooks/settings.json` para `.claude/settings.json`. Testar: rodar `bash .claude/hooks/painel.sh` e mostrar a saída pro mentorado.
4. **Skill /save**: copiar `templates/save-SKILL.md` para `.claude/skills/save/SKILL.md` do vault novo.
4b. **Índice de cada pasta**: para CADA pasta de primeiro nível criada (menos `.claude/` e `arquivo/`), gerar `<pasta>/CLAUDE.md` a partir de `templates/pasta-CLAUDE-template.md`, já preenchido com o que aquela pasta guarda no mundo DESTA pessoa, as regras de nome dela e a tabela dos arquivos que existem. Refazer a tabela de cada índice no fim do passo 6, quando as fichas já existirem.
5. **Estado inicial**: criar `memoria/MEMORY.md`, `memoria/foco-da-semana.md` (preenchido com o foco REAL da semana da pessoa, pergunte qual é), `tasks/todo.md` (com as tarefas reais que ela citou no briefing) e `tasks/lessons.md`, a partir dos templates.
6. **Primeiras fichas (a mágica):** criar, na frente do mentorado, as fichas de TUDO que ele contou no briefing: `pessoas/<Nome>.md` pra cada pessoa da P4, `negocio(s)/<slug>/visao-geral.md` pra cada empresa da P3, `clientes/<slug>/overview.md` se citou cliente ativo. Usar `templates/pessoa-template.md` e `templates/cliente-overview-template.md`. Anunciar cada gravação em 1 linha.
7. **Guia**: criar `COMO-USAR.md` na raiz do vault a partir de `templates/COMO-USAR-template.md`, adaptando os exemplos ao mundo da pessoa.

## FASE 4 · Teste ao vivo (prova de que funciona)

1. Peça: "Me conta uma coisa real que aconteceu essa semana: uma reunião, uma conversa, uma decisão, qualquer coisa." Capture na hora no objeto certo e anuncie ("Gravei em `clientes/fulano/overview.md`").
2. Peça pra pessoa abrir o Obsidian e VER a nota criada. Esse momento é o clique da mentoria.
3. Rode um `/save` de demonstração explicando cada passo.
4. Explique o ciclo em uma frase: "você fala, o sistema guarda; na próxima sessão o painel te devolve o contexto; segunda-feira ele te cobra o foco".

## FASE 5 · Handoff

Checklist final com o mentorado (mostrar e confirmar item a item):
- [ ] Vault abre no Obsidian e as pastas fazem sentido pra ele
- [ ] Painel apareceu ao abrir a sessão do Claude (hook funcionando)
- [ ] Fichas do briefing criadas (pessoas, empresa, clientes)
- [ ] Cada pasta tem o seu `CLAUDE.md` e ele lista o que existe nela (abrir um no Obsidian e mostrar)
- [ ] Foco da semana preenchido com prioridade real
- [ ] Ele rodou 1 captura sozinho (contou algo e viu a nota nascer, sem ajuda)
- [ ] Ele sabe os 3 movimentos do dia a dia: falar normalmente (captura), perguntar ("o que ficou da reunião com X?"), e `/save` no fim do bloco

Feche orientando a rotina mínima: **1 sessão por dia útil, /save no fim, foco novo toda segunda.**

## FASE 6 · Sobrou tempo? Abastecimento ao vivo (o que separa quem usa de quem abandona)

Vault vazio é o maior motivo de abandono. Se o build terminar antes do fim da mentoria, use o tempo restante nesta ordem:

1. **Despejo das últimas 2 semanas.** Peça: "me conta tudo que aconteceu nas últimas 2 semanas: reuniões, conversas, decisões, pendências, gastos". Capture cada fato na frente do mentorado. Ele sai com o cérebro carregado com a vida real dele.
2. **Importação do acervo legado.** Pergunte onde estão as anotações dele hoje (Notion, Apple Notes, "WhatsApp comigo mesmo", caderno, pastas soltas). Pegue 3 a 5 itens importantes e roteie junto: transcrição vira `conhecimento/raw/`, contato vira ficha em `pessoas/`, documento vira `assets/`. Não migrar tudo na call: ensinar o movimento.
3. **Bateria de recuperação.** Agora que tem dado dentro, o mentorado pergunta: "o que ficou da reunião com X?", "o que eu tenho pendente?". Fecha o ciclo captura → recuperação e prova o valor.
4. **Desafio dos 7 dias.** Contrato de uso explícito, gravado em `tasks/todo.md` dele: 1 sessão por dia (nem que sejam 5 minutos despejando o dia), `/save` no fim, segunda-feira responder o foco que o painel cobrar. Marcar um check-in com o Felipe no dia 7.

## Regras
- Uma pergunta por mensagem, sempre. Reagir antes de perguntar de novo.
- Datar tudo que for registro: YYYY-MM-DD, kebab-case (exceto fichas de pessoa: Nome Próprio.md).
- Nada de pasta vazia decorativa.
- Pasta nova criada depois (pelo Claude, a pedido da pessoa) nasce já com o `CLAUDE.md` dela e entra na tabela de estrutura da constituição.
- Antes de procurar algo numa pasta com busca, ler o `CLAUDE.md` dela.
- Se a mentoria for ao vivo com o Felipe conduzindo, você é o copiloto: execute rápido e deixe o palco pro Felipe explicar os conceitos.
- Se a pessoa está sozinha (baixou a skill pelo vídeo), você conduz tudo: explique cada conceito em 1 ou 2 frases antes de aplicar e não pule o teste ao vivo da Fase 4.
