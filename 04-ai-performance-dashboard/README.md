# 📊 Dashboard de Performance de IA

## Overview
Aplicação Streamlit para monitoramento em tempo real de automações n8n com IA. Exibe KPIs financeiros, taxa de sucesso, tempo médio de execução e histórico auditável — tudo em dark mode com gráficos Plotly interativos.

## 🎯 Problema Resolvido
- Sem visibilidade sobre o desempenho das automações em produção
- Custo de API não rastreado em tempo real
- ROI financeiro calculado manualmente (ou não calculado)

## 🗂️ Estrutura de Arquivos

```
04-ai-performance-dashboard/
├── app.py               # Interface principal Streamlit
├── database.py          # Camada de dados: PostgreSQL + modo mock
├── utils.py             # KPIs e funções auxiliares puras
├── requirements.txt     # Dependências com versões fixadas
├── .env.example         # Template de variáveis de ambiente
└── .streamlit/
    └── config.toml      # Tema dark mode
```

## ✅ Layout da Interface

1. **Cards de Métricas (4 colunas):** Total Processado · Taxa de Sucesso · Tempo Médio · Economia Líquida em R$
2. **Gráfico de Linha:** Evolução diária de execuções (total / sucessos / erros)
3. **Gráfico de Barras:** Custo diário de API em R$
4. **Gráfico de Pizza:** Distribuição por workflow
5. **Tabela Auditada:** Últimas 10 execuções com status, duração, modelo e custo

## 🚀 Como Rodar Localmente

### 1. Clone e acesse o diretório
```bash
git clone <repo-url>
cd 04-ai-performance-dashboard
```

### 2. Crie e ative o ambiente virtual
```bash
python -m venv .venv
source .venv/bin/activate        # Linux/macOS
.venv\Scripts\activate           # Windows
```

### 3. Instale as dependências
```bash
pip install -r requirements.txt
```

### 4. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite .env com suas credenciais (ou mantenha USE_MOCK_DATA=true para testar)
```

### 5. Execute o dashboard
```bash
streamlit run app.py
```

Acesse em: **http://localhost:8501**

## 🔌 Conectando ao Banco Real

1. No `.env`, altere `USE_MOCK_DATA=false`
2. Preencha `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
3. Crie a tabela no PostgreSQL:

```sql
CREATE TABLE ai_execution_logs (
    id               SERIAL PRIMARY KEY,
    executed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    workflow_name    TEXT        NOT NULL,
    status           TEXT        NOT NULL CHECK (status IN ('success', 'error')),
    duration_seconds NUMERIC(8,2),
    model            TEXT,
    api_cost_brl     NUMERIC(10,4)
);

-- Índice para a query dos últimos 30 dias
CREATE INDEX idx_logs_executed_at ON ai_execution_logs (executed_at DESC);
```

## 🛠️ Stack
Python · Streamlit · Pandas · Plotly · psycopg2-binary · python-dotenv

## 📈 Resultados
| Métrica | Antes | Depois |
|---|---|---|
| Visibilidade de erros | manual / zero | tempo real |
| Cálculo de ROI | planilha mensal | automático |
| Custo de API rastreado | não | por execução |
