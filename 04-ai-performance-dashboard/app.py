"""
app.py
======
Dashboard principal de monitoramento de performance de IA.
Execute com: streamlit run app.py
"""

import streamlit as st
import plotly.graph_objects as go
import pandas as pd

from database import fetch_executions
from utils import (
    calculate_roi,
    get_success_rate,
    get_avg_duration,
    build_daily_summary,
    format_brl,
    format_duration,
    status_color,
)

# ── Constantes de design ──────────────────────────────────────────────────────
_BG_DARK = "#0e1117"
_BG_CARD = "#121828"
_GRID = "#1e2535"
_TEXT = "#ccd6f6"
_TEAL = "#64ffda"
_GREEN = "#6bcb77"
_YELLOW = "#ffd93d"
_RED = "#ff6b6b"
_PURPLE = "#a78bfa"
_MUTED = "#8892b0"

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="AI Performance Dashboard",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ── CSS: dark mode + cards ────────────────────────────────────────────────────
st.markdown(
    f"""
    <style>
        /* ── Base ── */
        .stApp {{ background-color: {_BG_DARK}; color: {_TEXT}; }}
        .block-container {{ padding-top: 2rem; padding-bottom: 2rem; }}

        /* ── Metric card ── */
        .kpi-card {{
            background: linear-gradient(145deg, #161d2f 0%, #0f1623 100%);
            border: 1px solid #2a3352;
            border-radius: 14px;
            padding: 22px 20px 18px;
            text-align: center;
            min-height: 110px;
        }}
        .kpi-label {{
            color: {_MUTED};
            font-size: 0.78rem;
            font-weight: 600;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            margin-bottom: 10px;
        }}
        .kpi-value {{
            font-size: 2rem;
            font-weight: 700;
            line-height: 1;
        }}
        .kpi-sub {{
            color: {_MUTED};
            font-size: 0.75rem;
            margin-top: 7px;
        }}
        .color-teal   {{ color: {_TEAL};   }}
        .color-green  {{ color: {_GREEN};  }}
        .color-yellow {{ color: {_YELLOW}; }}
        .color-red    {{ color: {_RED};    }}
        .color-purple {{ color: {_PURPLE}; }}

        /* ── Section header ── */
        .section-title {{
            color: {_TEXT};
            font-size: 1rem;
            font-weight: 600;
            padding-bottom: 10px;
            border-bottom: 1px solid #2a3352;
            margin-bottom: 14px;
        }}

        /* ── Divider ── */
        hr {{ border-color: #2a3352; margin: 1.5rem 0; }}

        /* ── Streamlit dataframe dark tweaks ── */
        [data-testid="stDataFrame"] {{ border-radius: 10px; overflow: hidden; }}

        /* ── Sidebar ── */
        [data-testid="stSidebar"] {{ background-color: #0d1117; }}

        /* ── Button ── */
        .stButton > button {{
            background: #1a2540;
            border: 1px solid #2a3352;
            color: {_TEXT};
            border-radius: 8px;
        }}
        .stButton > button:hover {{
            background: #243060;
            border-color: {_TEAL};
            color: {_TEAL};
        }}
    </style>
    """,
    unsafe_allow_html=True,
)


# ── Helpers de UI ─────────────────────────────────────────────────────────────

def _kpi_card(label: str, value: str, sub: str, color: str = "teal") -> str:
    return f"""
    <div class="kpi-card">
        <div class="kpi-label">{label}</div>
        <div class="kpi-value color-{color}">{value}</div>
        <div class="kpi-sub">{sub}</div>
    </div>
    """


def _section(title: str) -> None:
    st.markdown(f'<div class="section-title">{title}</div>', unsafe_allow_html=True)


def _plotly_base(fig: go.Figure, height: int = 320) -> go.Figure:
    """Aplica o tema dark padrão em qualquer figura Plotly."""
    fig.update_layout(
        paper_bgcolor=_BG_DARK,
        plot_bgcolor=_BG_CARD,
        font=dict(color=_TEXT, family="Inter, system-ui, sans-serif", size=12),
        margin=dict(l=4, r=4, t=10, b=4),
        height=height,
        xaxis=dict(gridcolor=_GRID, zeroline=False, showline=False),
        yaxis=dict(gridcolor=_GRID, zeroline=False, showline=False),
        legend=dict(
            bgcolor="rgba(0,0,0,0)",
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
        ),
        hovermode="x unified",
    )
    return fig


# ── Carregamento de dados ─────────────────────────────────────────────────────

df: pd.DataFrame = fetch_executions()

roi = calculate_roi(df)
success_rate = get_success_rate(df)
avg_dur = get_avg_duration(df)
daily = build_daily_summary(df)

# ── Cabeçalho ─────────────────────────────────────────────────────────────────
col_h, col_btn = st.columns([9, 1])
with col_h:
    st.markdown(
        f"<h2 style='margin:0;color:{_TEXT}'>🤖 AI Performance Dashboard</h2>"
        f"<p style='color:{_MUTED};margin:4px 0 0;font-size:0.9rem'>"
        "Monitoramento em tempo real das automações com Inteligência Artificial"
        "</p>",
        unsafe_allow_html=True,
    )
with col_btn:
    st.markdown("<div style='padding-top:10px'>", unsafe_allow_html=True)
    if st.button("🔄 Atualizar", use_container_width=True):
        st.cache_data.clear()
        st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)

st.markdown("---")

# ────────────────────────────────────────────────────────────────────────────
# LINHA 1 — 4 Cards de Métricas
# ────────────────────────────────────────────────────────────────────────────
c1, c2, c3, c4 = st.columns(4)

with c1:
    st.markdown(
        _kpi_card(
            "Total Processado",
            f"{roi['total_executions']:,}",
            "execuções nos últimos 30 dias",
            color="teal",
        ),
        unsafe_allow_html=True,
    )

with c2:
    rate_color = status_color(success_rate)
    st.markdown(
        _kpi_card(
            "Taxa de Sucesso",
            f"{success_rate}%",
            f"{roi['error_count']} erros detectados",
            color=rate_color,
        ),
        unsafe_allow_html=True,
    )

with c3:
    st.markdown(
        _kpi_card(
            "Tempo Médio",
            format_duration(avg_dur),
            "por execução (apenas sucessos)",
            color="yellow",
        ),
        unsafe_allow_html=True,
    )

with c4:
    st.markdown(
        _kpi_card(
            "Economia Líquida",
            format_brl(roi["net_savings_brl"]),
            f"ROI {roi['roi_percentage']:,.0f}% · Custo API: {format_brl(roi['total_api_cost_brl'])}",
            color="green",
        ),
        unsafe_allow_html=True,
    )

st.markdown("<br>", unsafe_allow_html=True)

# ────────────────────────────────────────────────────────────────────────────
# LINHA 2 — Gráfico Temporal
# ────────────────────────────────────────────────────────────────────────────
_section("📈 Evolução do Processamento — Últimos 30 Dias")

fig_line = go.Figure()

fig_line.add_trace(
    go.Scatter(
        x=daily["date"],
        y=daily["total"],
        name="Total",
        mode="lines+markers",
        line=dict(color=_TEAL, width=2.5),
        marker=dict(size=5),
        fill="tozeroy",
        fillcolor="rgba(100,255,218,0.05)",
        hovertemplate="%{x|%d/%m}<br>Total: %{y}<extra></extra>",
    )
)
fig_line.add_trace(
    go.Scatter(
        x=daily["date"],
        y=daily["successes"],
        name="Sucessos",
        mode="lines+markers",
        line=dict(color=_GREEN, width=2, dash="dot"),
        marker=dict(size=4),
        hovertemplate="%{x|%d/%m}<br>Sucessos: %{y}<extra></extra>",
    )
)
fig_line.add_trace(
    go.Scatter(
        x=daily["date"],
        y=daily["errors"],
        name="Erros",
        mode="lines+markers",
        line=dict(color=_RED, width=2),
        marker=dict(size=5),
        hovertemplate="%{x|%d/%m}<br>Erros: %{y}<extra></extra>",
    )
)

st.plotly_chart(_plotly_base(fig_line, height=300), use_container_width=True)

# ── Gráficos secundários (custo + distribuição) ────────────────────────────
col_bar, col_pie = st.columns([3, 2])

with col_bar:
    _section("💰 Custo Diário de API (R$)")
    fig_cost = go.Figure(
        go.Bar(
            x=daily["date"],
            y=daily["daily_cost_brl"],
            marker_color=_PURPLE,
            marker_line_color="rgba(0,0,0,0)",
            hovertemplate="%{x|%d/%m}<br>R$ %{y:.4f}<extra></extra>",
        )
    )
    st.plotly_chart(_plotly_base(fig_cost, height=240), use_container_width=True)

with col_pie:
    _section("🧩 Execuções por Workflow")
    wf = df["workflow_name"].value_counts().reset_index()
    wf.columns = ["workflow", "count"]
    fig_pie = go.Figure(
        go.Pie(
            labels=wf["workflow"],
            values=wf["count"],
            hole=0.52,
            marker=dict(colors=[_TEAL, _GREEN, _YELLOW, _RED, _PURPLE]),
            textinfo="percent",
            hovertemplate="%{label}<br>%{value} execuções<extra></extra>",
        )
    )
    fig_pie.update_layout(
        paper_bgcolor=_BG_DARK,
        font=dict(color=_TEXT, size=12),
        margin=dict(l=4, r=4, t=10, b=4),
        height=240,
        legend=dict(bgcolor="rgba(0,0,0,0)", font=dict(size=11)),
        showlegend=True,
    )
    st.plotly_chart(fig_pie, use_container_width=True)

# ────────────────────────────────────────────────────────────────────────────
# LINHA 3 — Tabela das últimas 10 execuções
# ────────────────────────────────────────────────────────────────────────────
st.markdown("---")
_section("🗂️ Últimas 10 Execuções Auditadas")

last_10 = df.head(10).copy()

# Formatação para exibição
last_10["executed_at"] = last_10["executed_at"].dt.strftime("%d/%m/%Y %H:%M:%S")
last_10["duration_seconds"] = last_10["duration_seconds"].apply(format_duration)
last_10["api_cost_brl"] = last_10["api_cost_brl"].apply(
    lambda v: f"R$ {v:.4f}"
)
last_10["status"] = last_10["status"].apply(
    lambda s: "✅ Sucesso" if s == "success" else "❌ Erro"
)

last_10 = last_10.rename(
    columns={
        "executed_at": "Data / Hora",
        "workflow_name": "Workflow",
        "status": "Status",
        "duration_seconds": "Duração",
        "model": "Modelo IA",
        "api_cost_brl": "Custo API",
    }
)

st.dataframe(
    last_10,
    use_container_width=True,
    hide_index=True,
    column_config={
        "Status": st.column_config.TextColumn("Status", width="small"),
        "Duração": st.column_config.TextColumn("Duração", width="small"),
        "Custo API": st.column_config.TextColumn("Custo API", width="small"),
        "Modelo IA": st.column_config.TextColumn("Modelo IA", width="medium"),
    },
)

# ── Footer ─────────────────────────────────────────────────────────────────
st.markdown("---")
st.markdown(
    f"<div style='text-align:center;color:{_MUTED};font-size:0.78rem'>"
    "AI Performance Dashboard · Automa-es Portfolio · "
    "Dados atualizados a cada 5 min · "
    "<code style='color:#4a5568'>USE_MOCK_DATA=true</code>"
    "</div>",
    unsafe_allow_html=True,
)
