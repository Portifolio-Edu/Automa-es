# 📊 Relatório Semanal Meta Ads — 5 Clientes

## Overview
Workflow n8n que coleta métricas de 5 contas Meta Ads via Facebook Graph API v20, gera análise com GPT-4o e envia relatório via WhatsApp (Evolution API) todo domingo às 8h.

## 🎯 Problema Resolvido
- 6h/semana montando relatórios manualmente
- Dados dispersos sem padronização
- Erros humanos em CPL, CTR e ROAS

## ✅ Fluxo Node-a-Node
1. Schedule Trigger → domingo 08:00 (America/Sao_Paulo)
2. HTTP Request Facebook Graph API → métricas por ad_account_id (7 dias)
3. Loop Over Items → itera cada cliente
4. Code Node JS → normaliza, calcula WoW%, formata BRL
5. GPT-4o → análise textual + recomendações
6. Merge → consolida dados + análise
7. Evolution API → WhatsApp para cliente/grupo
8. Google Sheets → histórico/auditoria
9. Error Handler → fallback + alerta operador

## 🛠️ Stack
n8n · Facebook Graph API v20 · GPT-4o · Evolution API · Google Sheets · JavaScript

## 📈 Resultados
| Métrica | Antes | Depois |
|---|---|---|
| Tempo de relatório | 6h/semana | 0 (automático) |
| Erros de cálculo | recorrentes | zero |
| Custo | R$240/mês | R$12/mês |
| ROI | — | 529% |