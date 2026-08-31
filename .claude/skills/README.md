# Skills instaladas

Este diretório reúne skills de terceiros para uso com Claude Code neste
repositório. Cada subpasta contém um `SKILL.md` (e, quando aplicável,
scripts/referências/templates) copiados diretamente dos repositórios de
origem, sem modificações no conteúdo.

## Fontes

| Skill(s) instaladas | Repositório de origem | Licença |
|---|---|---|
| `design-dna` | [zanwei/design-dna](https://github.com/zanwei/design-dna) | ver `.licenses/design-dna.LICENSE` |
| `academy-guide`, `algorithmic-art`, `brand-guidelines`, `canvas-design`, `claude-api`, `discernment-nudge`, `doc-coauthoring`, `docx`, `frontend-design`, `internal-comms`, `mcp-builder`, `pdf`, `pptx`, `skill-creator`, `slack-gif-creator`, `theme-factory`, `web-artifacts-builder`, `webapp-testing`, `xlsx` | [anthropics/skills](https://github.com/anthropics/skills) | ver `THIRD_PARTY_NOTICES.md` do repositório de origem |
| `brandkit`, `redesign-skill`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `soft-skill`, `brutalist-skill`, `taste-skill`, `taste-skill-v1`, `stitch-skill`, `output-skill`, `image-to-code-skill`, `gpt-tasteskill`, `minimalist-skill` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | ver `.licenses/taste-skill.LICENSE` |
| `scrollcraft` | [nateherkai/scroll-craft](https://github.com/nateherkai/scroll-craft) (plugin `nateherk-design`) | ver `.licenses/scroll-craft.LICENSE` |

## Como o Claude Code usa isso

Skills colocadas em `.claude/skills/<nome>/SKILL.md` ficam disponíveis
automaticamente para o Claude Code neste repositório, e podem ser
invocadas via `/<nome>` ou acionadas conforme a descrição de cada uma.

Todo o crédito do conteúdo de cada skill pertence aos respectivos autores
listados acima.
