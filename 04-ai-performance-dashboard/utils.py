"""
utils.py
========
Funções auxiliares puras para cálculo de KPIs de negócio.
Sem dependências de Streamlit — facilita testes unitários isolados.
"""

import os
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

# ── Parâmetros de ROI (override via .env) ─────────────────────────────────────
_HOURLY_RATE_BRL: float = float(os.getenv("HOURLY_RATE_BRL", "80.0"))
_HOURS_PER_EXEC: float = float(os.getenv("HOURS_SAVED_PER_EXECUTION", "0.5"))


# ── KPIs ──────────────────────────────────────────────────────────────────────

def calculate_roi(
    df: pd.DataFrame,
    hourly_rate: float = _HOURLY_RATE_BRL,
    hours_per_exec: float = _HOURS_PER_EXEC,
) -> dict:
    """
    Calcula o ROI financeiro das automações.

    Fórmula:
        horas_salvas   = execuções_bem_sucedidas × hours_per_exec
        valor_mão_obra = horas_salvas × hourly_rate
        economia_líq   = valor_mão_obra − custo_total_api
        roi_%          = (economia_líq / custo_total_api) × 100

    Parâmetros
    ----------
    df           : DataFrame retornado por fetch_executions()
    hourly_rate  : valor R$/hora do analista substituído (padrão: $HOURLY_RATE_BRL)
    hours_per_exec: horas economizadas por execução (padrão: $HOURS_SAVED_PER_EXECUTION)

    Retorna
    -------
    dict com as chaves:
        total_executions    int
        success_count       int
        error_count         int
        hours_saved         float
        labor_value_brl     float
        total_api_cost_brl  float
        net_savings_brl     float
        roi_percentage      float
    """
    if df.empty:
        return {
            "total_executions": 0,
            "success_count": 0,
            "error_count": 0,
            "hours_saved": 0.0,
            "labor_value_brl": 0.0,
            "total_api_cost_brl": 0.0,
            "net_savings_brl": 0.0,
            "roi_percentage": 0.0,
        }

    success_df = df[df["status"] == "success"]
    success_count = len(success_df)
    error_count = len(df) - success_count

    hours_saved = success_count * hours_per_exec
    labor_value = hours_saved * hourly_rate
    total_api_cost = float(df["api_cost_brl"].sum())
    net_savings = labor_value - total_api_cost
    roi_pct = (net_savings / total_api_cost * 100) if total_api_cost > 0 else 0.0

    return {
        "total_executions": len(df),
        "success_count": success_count,
        "error_count": error_count,
        "hours_saved": round(hours_saved, 1),
        "labor_value_brl": round(labor_value, 2),
        "total_api_cost_brl": round(total_api_cost, 2),
        "net_savings_brl": round(net_savings, 2),
        "roi_percentage": round(roi_pct, 1),
    }


def get_success_rate(df: pd.DataFrame) -> float:
    """Retorna a taxa de sucesso em % (0–100). Retorna 0.0 para DataFrame vazio."""
    if df.empty:
        return 0.0
    return round(len(df[df["status"] == "success"]) / len(df) * 100, 1)


def get_avg_duration(df: pd.DataFrame) -> float:
    """Duração média em segundos apenas das execuções bem-sucedidas."""
    success_df = df[df["status"] == "success"]
    if success_df.empty:
        return 0.0
    return round(float(success_df["duration_seconds"].mean()), 2)


def build_daily_summary(df: pd.DataFrame) -> pd.DataFrame:
    """
    Agrega execuções por dia para uso nos gráficos temporais.

    Colunas resultantes:
        date, total, successes, errors, avg_duration, daily_cost_brl
    """
    if df.empty:
        return pd.DataFrame()

    tmp = df.copy()
    tmp["date"] = tmp["executed_at"].dt.normalize()

    summary = (
        tmp.groupby("date", as_index=False)
        .agg(
            total=("status", "count"),
            successes=("status", lambda x: (x == "success").sum()),
            errors=("status", lambda x: (x == "error").sum()),
            avg_duration=("duration_seconds", "mean"),
            daily_cost_brl=("api_cost_brl", "sum"),
        )
    )
    summary["avg_duration"] = summary["avg_duration"].round(2)
    summary["daily_cost_brl"] = summary["daily_cost_brl"].round(4)
    return summary.sort_values("date").reset_index(drop=True)


# ── Formatadores de apresentação ──────────────────────────────────────────────

def format_brl(value: float) -> str:
    """Formata float como R$ 1.234,56 (padrão brasileiro)."""
    formatted = f"{value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {formatted}"


def format_duration(seconds: float) -> str:
    """Converte segundos em string legível: '3.2s' ou '1.5min'."""
    if seconds < 60:
        return f"{seconds:.1f}s"
    return f"{seconds / 60:.1f}min"


def status_color(rate: float) -> str:
    """Retorna classe CSS de cor conforme taxa de sucesso."""
    if rate >= 90:
        return "green"
    if rate >= 70:
        return "yellow"
    return "red"
