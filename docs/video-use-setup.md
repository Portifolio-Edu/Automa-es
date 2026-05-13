# video-use — Edição de Vídeo com IA

Skill instalada de [browser-use/video-use](https://github.com/browser-use/video-use).

Edita vídeos por conversa: transcrição, cortes, color grade, legendas, overlays animados.

## Instalação (já executada)

```bash
git clone https://github.com/browser-use/video-use ~/Developer/video-use
ln -sfn ~/Developer/video-use ~/.claude/skills/video-use
cd ~/Developer/video-use && uv sync
apt install ffmpeg
```

## Configuração

Adicione a chave em `~/Developer/video-use/.env`:

```
ELEVENLABS_API_KEY=sua_chave_aqui
```

Obtenha em: https://elevenlabs.io/app/settings/api-keys

## Uso

```bash
cd /pasta/com/videos
claude
# Prompt: "edite esses vídeos em um vídeo de lançamento"
# Output: edit/final.mp4
```

## Capacidades

- Remoção de vícios de linguagem e pausas longas
- Color grading automático
- Fades de áudio nos cortes
- Geração e queima de legendas
- Overlays animados
