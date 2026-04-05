# CLAUDE.md — AI Assistant Guide for Automa-es

This file provides context for AI assistants (Claude, Copilot, etc.) working in this repository.

---

## Repository Overview

This is a **portfolio documentation repository**, not a traditional software codebase. It documents n8n automation workflows with AI integration, each solving a real business problem. There is no source code, package manager, or build system — the actual workflows live in self-hosted or cloud n8n instances.

**Owner:** Portifolio-Edu  
**License:** MIT  
**Primary language:** Portuguese (pt-BR) for all documentation content  

---

## Repository Structure

```
Automa-es/
├── CLAUDE.md                        ← this file
├── README.md                        ← portfolio landing page
├── LICENSE                          ← MIT
├── 01-meta-ads-reporting/
│   └── README.md                    ← full workflow documentation
├── 02-ecommerce-automation/         ← planned, not yet created
│   └── README.md
├── 03-agente-sdr-sophia/            ← planned, not yet created
│   └── README.md
├── assets/                          ← workflow screenshots/diagrams
│   ├── workflow-agencia-ads.png
│   ├── workflow-ecommerce.png
│   └── workflow-sophia.png
└── docs/
    ├── STACK.md                     ← detailed tech stack reference
    ├── ROI-CALCULATOR.md            ← ROI methodology
    └── FAQ.md                       ← troubleshooting guide
```

> Note: `assets/` and `docs/` are referenced in READMEs but not yet fully populated as of the last commit.

---

## Project Naming Convention

Projects follow a zero-padded numeric prefix + kebab-case name:

```
NN-project-name-kebab-case/
```

Examples:
- `01-meta-ads-reporting`
- `02-ecommerce-automation`
- `03-agente-sdr-sophia`

---

## Current Projects

### 01 — Relatório Semanal Meta Ads (`01-meta-ads-reporting`)
**Segment:** Marketing agency  
**Status:** Documented  
**Stack:** n8n · Facebook Graph API v20 · GPT-4o · Evolution API · Google Sheets · JavaScript  
**Problem solved:** 6h/week building manual reports → fully automated Sunday 08:00 delivery  
**ROI:** 529% (R$240/month → R$12/month; annual savings R$40.300)

**Workflow (9 nodes):**
1. Schedule Trigger → Sundays 08:00 (America/Sao_Paulo)
2. HTTP Request → Facebook Graph API (7-day metrics per ad_account_id)
3. Loop Over Items → iterate each client
4. Code Node (JS) → normalize, calculate WoW%, format BRL
5. GPT-4o → textual analysis + recommendations
6. Merge → consolidate data + analysis
7. Evolution API → WhatsApp delivery to client/group
8. Google Sheets → audit history
9. Error Handler → fallback + operator alert

### 02 — Automação de E-commerce (`02-ecommerce-automation`)
**Segment:** Online retail  
**Status:** Planned / not yet documented  
**Stack:** n8n · RabbitMQ · Redis · GPT-4.1

### 03 — Agente SDR com IA — Sophia (`03-agente-sdr-sophia`)
**Segment:** Aesthetic clinic  
**Status:** Planned / not yet documented  
**Stack:** n8n · GPT-4.1 · Supabase (PostgreSQL + pgvector) · Google Calendar  
**Architecture:** Multi-agent AI system for automated SDR  
**ROI:** 212% (annual savings R$15.300; payback 5 months)

---

## Technology Stack Reference

| Category | Tools |
|---|---|
| Orchestration | n8n (270+ nodes in production) |
| LLMs | OpenAI GPT-4.1, GPT-4o; Google Gemini 2.5 Pro |
| Audio/Voice | OpenAI Whisper, ElevenLabs |
| Messaging | Evolution API (WhatsApp), RabbitMQ |
| Caching / Rate-limit | Redis |
| Databases | Baserow, Supabase (PostgreSQL + pgvector) |
| Google Suite | Sheets, Calendar, Drive, Docs, Gmail |
| APIs | Facebook Graph API v20, ViaCEP |

---

## Documentation Conventions

All documentation is written in **Portuguese (pt-BR)**. Follow these patterns when adding or updating docs:

### README.md per project

Each project README must include:
1. **Title** — emoji + descriptive name
2. **Overview** — one-paragraph summary (what, how, when)
3. **Problema Resolvido** — bulleted list of pain points solved
4. **Fluxo Node-a-Node** — numbered list of every n8n node in order
5. **Stack** — inline list of technologies
6. **Resultados** — before/after metrics table with columns: Métrica | Antes | Depois

### Root README.md

The root README acts as the portfolio landing page. It must stay in sync with:
- The project table (rows match existing project directories)
- The workflow screenshots in `assets/`
- The results table (ROI/payback figures)

### Markdown style
- Use emoji in section headers (`## 📊 ...`) — consistent with existing docs
- Use GitHub-flavored markdown tables for metrics and stack info
- Reference local assets with relative paths (`./assets/...`)
- Keep each project section self-contained

---

## Architecture Patterns

The workflows in this portfolio use three distinct patterns:

1. **Schedule-Driven** — cron/time-based triggers (e.g., every Sunday 08:00)
2. **Event-Driven** — reactive to external signals (webhooks, queue messages)
3. **Webhook-Based** — n8n HTTP endpoint triggers from third-party services

All workflows follow the same high-level data pipeline:
```
[Trigger] → [Data Collection] → [Transform/Enrich] → [AI Analysis] → [Delivery + Storage + Error Handler]
```

---

## Git Workflow

**Branching:**
- `main` — stable, reviewed documentation
- Feature branches: `claude/...` or `feature/...` for in-progress additions

**Commit style:** imperative, descriptive (existing commits are in English)  
**Push:** always `git push -u origin <branch-name>`

When adding a new project:
1. Create the directory `NN-project-name/`
2. Add `README.md` following the per-project template above
3. Add workflow screenshot to `assets/`
4. Update root `README.md` project table and results table
5. Update `docs/STACK.md` if new tools are introduced

---

## What This Repo Is NOT

- Not a deployable application — no `npm install`, `pip install`, or build step
- Not a monorepo — no shared libraries or inter-project dependencies
- Not a workflow export repo — n8n JSON exports are not committed here (docs only)
- The `assets/` images and `docs/` files referenced in READMEs may not all exist yet

---

## Key Instructions for AI Assistants

1. **Write all content in Portuguese (pt-BR)** unless the file is technical config (like this one).
2. **Do not create source code files** — this repo holds documentation, not implementation.
3. **Follow the node-by-node format** when documenting n8n workflows.
4. **Keep ROI figures consistent** between individual project READMEs and the root README results table.
5. **Do not add files that are not referenced** — avoid file bloat; only create assets and docs that are linked from a README.
6. **Respect the emoji + section header style** used throughout the existing markdown.
7. **Never push to `main` directly** — use a feature branch and open a PR.
