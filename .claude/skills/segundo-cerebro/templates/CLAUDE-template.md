# CLAUDE.md ({{NOME}})
> Constituição do vault. Leia antes de qualquer ação. Fonte única de contexto e roteamento.
> Gerada em {{DATA}} pela skill Segundo Cérebro do Felipe Tâmbara (arquitetura v3).

<!-- INSTRUÇÕES PRA SKILL (apagar depois de preencher):
     · Substituir todos os {{PLACEHOLDERS}} com o briefing.
     · Manter só os blocos do perfil escolhido (marcados com "BLOCO:").
     · As tabelas de estrutura (§3) e roteamento (§4) devem listar SÓ as pastas que existem no vault.
-->

---

## 1. Quem sou eu

**{{NOME}}**, {{CIDADE}}.
**O que faço:** {{PERFIL_RESUMO}}

<!-- BLOCO: UMA EMPRESA -->
### {{EMPRESA_NOME}}
**O que vende:** {{EMPRESA_OFERTA}}
**Pra quem:** {{EMPRESA_ICP}}
Detalhes, oferta e financeiro em `negocio/`.
<!-- FIM BLOCO -->

<!-- BLOCO: VÁRIAS EMPRESAS (repetir por empresa) -->
### {{EMPRESA_NOME}}
**O que vende:** {{EMPRESA_OFERTA}}
**Pra quem:** {{EMPRESA_ICP}}
Detalhes em `negocios/{{EMPRESA_SLUG}}/`.
<!-- FIM BLOCO -->

<!-- BLOCO: VIDA PESSOAL -->
### Vida pessoal
**Prioridades:** {{PRIORIDADES_PESSOAIS}}
Detalhes em `pessoal/`.
<!-- FIM BLOCO -->

### Como falar comigo
{{TOM}}

---

## 2. Protocolo de Captura Contínua (regra número 1)

> **Tudo que eu falo vira registro no lugar certo, na hora.** Não existe "depois eu salvo". Não existe inbox.

1. **Toda mensagem minha é fonte de captura.** Se ela contém fato novo sobre uma entidade (pessoa, cliente, negócio, decisão, número, relação), gravar imediatamente no objeto certo (§4), mesmo que o fato seja secundário ao pedido.
2. **Anunciar em 1 linha** cada gravação: "Gravei em `pessoas/Fulano.md`". Sem pedir permissão pra capturar.
3. **No máximo 1 pergunta de completude** quando faltar dado-chave. Não interrogar.
4. **Tarefa mencionada vira item em `tasks/todo.md`** na hora.
5. **Correção minha vira lição em `tasks/lessons.md`** na hora, com o padrão que evita repetir o erro.
6. Este protocolo é sustentado por hooks (§8). O fechamento de sessão é o `/save`.

---

## 3. Estrutura do vault

| Pasta | O que tem |
|---|---|
| `tasks/` | `todo.md` (fonte única de tarefas) e `lessons.md` (padrões aprendidos) |
| `memoria/` | `MEMORY.md` (contexto vivo indexado) + `foco-da-semana.md` |
| `pessoas/` | Uma nota por pessoa (Nome Próprio.md): sócio, equipe, cliente, família, contato |
| `conhecimento/` | `raw/` (bruto: transcrições, artigos) e `wiki/` (notas interligadas) |
| `assets/` | Arquivos ATIVOS: PDFs, imagens, documentos |
| `arquivo/` | Histórico MORTO, sempre com timestamp. Nunca tratar como ativo |
| `.claude/` | Constituição, skill `/save`, hooks |
<!-- BLOCO: UMA EMPRESA -->
| `negocio/` | Estratégia, oferta, preços e financeiro da {{EMPRESA_NOME}} |
| `clientes/` | Uma pasta kebab-case por cliente/lead, com `overview.md` obrigatório |
| `reunioes/` | Reuniões sem dono de cliente, `YYYY-MM-DD-contexto.md` |
<!-- FIM BLOCO -->
<!-- BLOCO: VÁRIAS EMPRESAS -->
| `negocios/<empresa>/` | Estratégia, oferta e financeiro de cada empresa |
| `clientes/` | Uma pasta por cliente, com `overview.md` (campo `empresa:` no frontmatter) |
| `reunioes/` | Reuniões sem dono de cliente, `YYYY-MM-DD-contexto.md` |
<!-- FIM BLOCO -->
<!-- BLOCO: VIDA PESSOAL -->
| `pessoal/` | {{SUBPASTAS_PESSOAL}} |
<!-- FIM BLOCO -->
<!-- BLOCO: OPCIONAIS (manter só as criadas) -->
| `projetos/` | Só o ÍNDICE: uma nota `<slug>.md` por projeto (o que é, onde está, como rodar, status). O código mora FORA do vault, em `~/Documents/Projetos/<slug>/` |
| `conteudo/` | Conteúdo pra redes: rascunhos em `_drafts/`, publicados em `publicados/` |
<!-- FIM BLOCO -->

**Não existe (e não criar):** inbox, diário, pastas de fila ou "processar depois". Material sem destino claro = fazer 1 pergunta e gravar no objeto apontado.

---

## 4. Roteamento (onde buscar e onde gravar)

> Regra de ouro: todo output nasce dentro do objeto a que serve. Antes de agir sobre uma entidade, ler a nota dela.

**Índice de pasta:** cada pasta tem um `<pasta>/CLAUDE.md` com o mapa do que existe ali, quando abrir o quê e as pegadinhas. Ele carrega sozinho ao tocar qualquer arquivo da pasta. **Antes de varrer uma pasta com busca, ler o `CLAUDE.md` dela: 1 leitura resolve o que antes custava dez.** O índice é mapa, não fonte da verdade: o fato vive no arquivo. Divergiu, o arquivo vence e o índice se conserta na hora. Quem mantém em dia é o `/save`. Pasta nova nasce com o índice dela.

| Gatilho | Destino |
|---|---|
| Pessoa nova ou fato sobre pessoa | `pessoas/Nome Próprio.md` |
| Tarefa, pendência, cobrança | `tasks/todo.md` |
| Correção/lição de trabalho | `tasks/lessons.md` |
| Material de estudo, transcrição, artigo | `conhecimento/raw/` (depois compilar pra `wiki/`) |
| Documento/PDF/imagem ativo | `assets/` |
| Foco da semana | `memoria/foco-da-semana.md` |
<!-- BLOCO: EMPRESA(S) -->
| Cliente ou lead (proposta, reunião, entrega, contrato) | `clientes/<slug>/` (lead ganha pasta no primeiro contato sério; status no overview) |
| Estratégia/oferta/preço/financeiro da empresa | `negocio(s)/{{...}}/` |
| Reunião com cliente | `clientes/<slug>/reunioes/YYYY-MM-DD-tema.md` |
| Reunião interna/parceria | `reunioes/YYYY-MM-DD-contexto.md` |
<!-- FIM BLOCO -->
<!-- BLOCO: VIDA PESSOAL -->
| Finanças pessoais | `pessoal/financeiro/` |
| Saúde, metas, rotina | `pessoal/<área>/` |
<!-- FIM BLOCO -->
| Código de projeto (site, app, script) | Fora do vault: `~/Documents/Projetos/<slug>/` + nota-índice em `projetos/<slug>.md` |
| Sem destino claro | NÃO criar pasta nova: 1 pergunta e gravar onde for apontado |

---

## 5. Padrões de nota e naming

- **Nota de entidade** (`pessoas/`, `clientes/*/overview.md`) tem frontmatter mínimo: `type`, `status`, `updated`, `tags`. Atualizou a nota, atualiza o `updated`.
- **Naming:** kebab-case, datado `YYYY-MM-DD` quando for registro. Exceção: notas de `pessoas/` usam `Nome Próprio.md`.
- **Wikilinks:** interligar entidades sempre que citadas ([[Fulano]] na nota do cliente, etc.).

---

## 6. Skills

| Skill | O que faz |
|---|---|
| `save` | Fecha a sessão: varredura final de captura, resumo no objeto certo, foco da semana, todo, lessons, índices de pasta em dia |

> Skill = um processo seu que se repete, escrito como passo a passo pro Claude. Regra pra criar a próxima: fez a mesma coisa 3 vezes, vira skill. Elas moram em `.claude/skills/<nome>/SKILL.md` e entram nesta tabela.

---

## 7. Regras de operação

- Nunca deletar: arquivar com timestamp em `arquivo/`.
- Nunca enviar comunicação a terceiros sem revisão de {{NOME}}.
- Ao fechar um bloco de trabalho, rodar o `/save` (ou sugerir).
- Nunca usar o travessão "—". Usar vírgula, dois-pontos, parênteses ou ponto final.

---

## 8. Enforcement (hooks ativos)

| Hook | Quando roda | O que faz |
|---|---|---|
| `hooks/painel.sh` | SessionStart | Injeta o painel do vault: foco da semana (alerta se vencido 7+ dias) + topo do todo + lembrete de captura |
| `hooks/captura.sh` | UserPromptSubmit | Injeta o protocolo de captura (§2) a cada mensagem |

Config em `.claude/settings.json`. Se um hook quebrar, consertar é prioridade: regra sem enforcement vira letra morta.

---

## 9. Foco da Semana

O foco vive em `memoria/foco-da-semana.md` e entra em toda sessão via hook. Atualizar toda segunda-feira (o `/save` pergunta quando estiver vencido).
