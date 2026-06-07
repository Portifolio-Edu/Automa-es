# Automação de Cortes de Vídeo com n8n + Python + FFmpeg

Este projeto implementa uma solução de **decupagem automatizada** usando a técnica "Holy Grail". Ele extrai o áudio do vídeo, detecta silêncios usando `ffmpeg`, calcula intervalos de fala ignorando cortes curtos, e extrai cada intervalo mantendo o codec original de vídeo com a opção `-c copy` para máxima velocidade.
O fluxo de automação usa o n8n para orquestrar o processo, processar os arquivos cortados e enviá-los ao Google Drive.

## Arquitetura do Fluxo

1. **n8n (Trigger):** Detecta um novo vídeo numa pasta (ou via Webhook).
2. **n8n (Execute Command):** Chama o script Python local (`auto_cutter.py`) enviando o caminho do vídeo.
3. **Python (auto_cutter.py):**
   - Roda o filtro `silencedetect` nativo do FFmpeg no áudio do vídeo.
   - Calcula os intervalos de "fala", ignorando silêncios.
   - Ignora trechos muito curtos (ex: menos de 10 segundos).
   - Executa o FFmpeg com `-c copy` cortando cada trecho, resultando em clips rápidos.
   - Retorna um JSON para o n8n com a lista dos arquivos criados.
4. **n8n (Code Node):** Recebe a lista do script Python e os prepara para o envio ao Google Drive.
5. **n8n (Upload ao Google Drive):** Envia os novos clipes para a nuvem.

## Como Configurar

### 1. Script Python

Copie o script `auto_cutter.py` para dentro da pasta mapeada pelo seu docker n8n (ex: `/data/videos/auto_cutter.py`).

Ajustes de sensibilidade (no próprio script Python):
- `SILENCE_THRESHOLD = "-30dB"` (Corte normal)
- Para mais cortes: `-40dB` ou `-45dB`
- Para ignorar respiros: `-25dB`

### 2. Imagem Docker customizada

Para que o n8n consiga rodar o Python e o FFmpeg, precisamos customizar a imagem do n8n.
No mesmo diretório que o `Dockerfile`, construa a imagem do docker:
```bash
docker build -t n8n-custom-ffmpeg .
```
E certifique-se de configurar a imagem `n8n-custom-ffmpeg` no seu `docker-compose.yml` e mapear o volume de vídeos.

### 3. Workflow n8n

O fluxo principal do n8n (a ser construído):

- **Trigger:** Configurado para novos arquivos `.mp4` na pasta observada.
- **Node "Execute Command":**
  - **Command:** `python3 /data/videos/auto_cutter.py {{$json.filePath}}`
  - **Timeout:** 1800 (30 minutos para arquivos longos).
- **Node "Code" (JavaScript):**
  - Copie o conteúdo de `n8n_code_node.js` aqui.
  - Ele converte o `stdout` em lista de arquivos.
- **Upload Google Drive:** Lê cada arquivo retornado via node "Read/Write Files from Disk" e envia via a operação "Upload" ao Google Drive.
