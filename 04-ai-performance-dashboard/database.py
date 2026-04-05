"""
database.py
===========
Responsável exclusivamente pela camada de dados:
  - Conexão segura ao PostgreSQL via variáveis de ambiente (.env)
  - Cache de conexão com st.cache_resource (uma conexão por sessão)
  - Modo mock para testes visuais sem banco real
  - Tratamento de erros em todas as operações de I/O
"""

import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

import streamlit as st
from dotenv import load_dotenv

load_dotenv()

# ── Configuração via ambiente ─────────────────────────────────────────────────
USE_MOCK: bool = os.getenv("USE_MOCK_DATA", "true").lower() == "true"

# ── Query de produção ─────────────────────────────────────────────────────────
# Tabela esperada: ai_execution_logs
# Colunas mínimas obrigatórias:
#   executed_at       TIMESTAMPTZ   — horário da execução
#   workflow_name     TEXT          — identificador do workflow
#   status            TEXT          — 'success' | 'error'
#   duration_seconds  NUMERIC       — tempo total de execução
#   model             TEXT          — modelo de IA utilizado
#   api_cost_brl      NUMERIC       — custo da chamada em R$
_SQL_FETCH_LOGS = """
SELECT
    executed_at,
    workflow_name,
    status,
    duration_seconds,
    model,
    api_cost_brl
FROM ai_execution_logs
WHERE executed_at >= NOW() - INTERVAL '30 days'
ORDER BY executed_at DESC;
"""


# ── Conexão cacheada (uma por processo Streamlit) ─────────────────────────────
@st.cache_resource(show_spinner="Conectando ao banco de dados…")
def _get_connection():
    """
    Cria e retorna uma conexão psycopg2 cacheada.
    Em caso de falha, retorna None e exibe erro na UI.
    """
    try:
        import psycopg2

        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            port=int(os.getenv("DB_PORT", "5432")),
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            connect_timeout=10,
            options="-c statement_timeout=30000",  # 30s query timeout
        )
        conn.autocommit = True
        return conn
    except Exception as exc:
        st.error(f"❌ Falha na conexão com PostgreSQL: {exc}")
        return None


# ── Gerador de dados mock ─────────────────────────────────────────────────────
def _build_mock_data() -> pd.DataFrame:
    """
    Gera um DataFrame com 90 execuções simuladas distribuídas nos últimos
    30 dias. Os dados imitam padrões reais de automações n8n em produção.
    """
    rng = np.random.default_rng(seed=42)

    workflows = [
        "meta_ads_report",
        "ecommerce_order",
        "sophia_sdr",
        "invoice_extract",
    ]
    models = ["gpt-4o", "gpt-4.1", "gemini-2.5-pro"]

    n = 90
    base = datetime.now() - timedelta(days=30)

    # Distribuição realista: ~92 % sucesso
    statuses = rng.choice(
        ["success", "error"],
        size=n,
        p=[0.92, 0.08],
    )

    executed_at = [
        base + timedelta(hours=int(i * 8.0 + rng.integers(0, 6)))
        for i in range(n)
    ]

    rows = []
    for i in range(n):
        is_success = statuses[i] == "success"
        duration = (
            round(float(rng.uniform(1.5, 9.0)), 2)
            if is_success
            else round(float(rng.uniform(0.4, 2.5)), 2)
        )
        api_cost = round(duration * float(rng.uniform(0.015, 0.09)), 4)

        rows.append(
            {
                "executed_at": executed_at[i],
                "workflow_name": rng.choice(workflows),
                "status": statuses[i],
                "duration_seconds": duration,
                "model": rng.choice(models),
                "api_cost_brl": api_cost,
            }
        )

    df = pd.DataFrame(rows)
    df["executed_at"] = pd.to_datetime(df["executed_at"])
    return df.sort_values("executed_at", ascending=False).reset_index(drop=True)


# ── Interface pública ─────────────────────────────────────────────────────────
@st.cache_data(ttl=300, show_spinner="Carregando execuções…")
def fetch_executions() -> pd.DataFrame:
    """
    Ponto de entrada único para obtenção dos dados.

    - USE_MOCK_DATA=true  → retorna DataFrame mock (sem banco)
    - USE_MOCK_DATA=false → executa query no PostgreSQL; se falhar, usa mock
    """
    if USE_MOCK:
        return _build_mock_data()

    conn = _get_connection()
    if conn is None:
        st.warning("⚠️ Banco indisponível. Exibindo dados mock.")
        return _build_mock_data()

    try:
        df = pd.read_sql(_SQL_FETCH_LOGS, conn)
        df["executed_at"] = pd.to_datetime(df["executed_at"])
        return df
    except Exception as exc:
        st.error(f"❌ Erro ao executar query: {exc}")
        return pd.DataFrame(
            columns=[
                "executed_at",
                "workflow_name",
                "status",
                "duration_seconds",
                "model",
                "api_cost_brl",
            ]
        )
