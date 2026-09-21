# 🍽️ Ficha Técnica SaaS — CMV, Precificação e Controle Operacional

## Overview
SaaS de ficha técnica, CMV e controle operacional para restaurantes, agnóstico de PDV. Diferente de Saipos, GrandChef e MarginEdge — que sempre embutem a ficha técnica dentro de um sistema de gestão maior — o produto vende só a camada de análise, na língua de food service (CMV, ficha técnica, precificação, perda), não como "automação" ou "IA". Eduardo (15 anos de cozinha profissional) é o cliente piloto, com um segundo cliente e um parceiro de validação já engajados.

## 🎯 Problema Resolvido
- Ficha técnica e CMV calculados em planilha, sem fator de correção medido (rendimento real de proteína ignorado)
- Precificação por canal de delivery feita "no olho", inflando ou corroendo margem quando comissão de iFood/99Food muda
- Sem visibilidade de gap entre CMV teórico e real, perda de estoque não rastreada por causa
- Rotulagem nutricional (Anvisa RDC 429/2020) tratada manualmente, sem organização de pendências

## 📊 Mercado
iFood registrou 335 mil novos parceiros em 2025 (~918 restaurantes/dia). Base de 1,38 milhão de estabelecimentos no Brasil, 94% microempresa, margem operacional de 7% a 22% — espaço para uma ferramenta de precisão de custo que nenhum concorrente vende isolada.

## 🏗️ Arquitetura
- **Banco:** Supabase (Postgres), RLS por `cliente_id` em toda tabela desde a primeira migration
- **App:** Next.js + React + TypeScript + Tailwind + shadcn/ui + Recharts
- **Motor de cálculo:** funções puras, separadas da UI, com teste unitário por fórmula
- **Alertas:** `event_log` + cron (fila reprocessável), não trigger de banco chamando webhook direto
- **n8n:** reservado para automação e agente futuros — não é dependência do MVP

## 🧮 Núcleo do cálculo
- **Fator de correção efetivo:** média do FC observado em lotes de `processamentos_proteina` prevalece sobre o FC de tabela — é o que torna o CMV medido em vez de estimado
- **CMV da receita:** peso convertido → peso bruto (× FC efetivo) → custo por insumo, com suporte a sub-receita (preparo próprio) aninhada um nível
- **Preço por canal:** mantém o mesmo ganho em reais do balcão ao embutir comissão + embalagem, em vez de recalcular margem alvo em cima da comissão (erro que inflava um prato de R$48 para R$90)
- **Capacidade de produção:** gargalo (mínimo) entre os insumos rastreados em estoque, não a média — insumo sem rastreio fica fora do cálculo, não conta como zero
- **CMV teórico vs. real:** gap de 1 a 3 pontos percentuais é ruído normal; a comparação só é válida com o cardápio inteiro cadastrado

## ✅ Conformidade Anvisa (RDC 429/2020 + IN 75/2020)
Tabela nutricional com os 10 itens obrigatórios, VDR do Anexo II e selo frontal (lupa) calculado por 100g/100mL — nunca por porção — para açúcar adicionado, gordura saturada e sódio. `nutricional_override` permite que um laudo laboratorial substitua o cálculo por composição. Sistema deixa explícito o que não resolve sozinho: validação por nutricionista, lista de ingredientes, alérgenos e regularização sanitária ficam como pendência, não como caixa marcada.

## 🛠️ Stack
Next.js · React · TypeScript · Tailwind · shadcn/ui · Recharts · @react-pdf/renderer · Supabase (Postgres + RLS) · n8n (futuro)

## 📦 Escopo do MVP
**Dentro:** insumo, receita e preparo próprio, fator de correção medido, CMV, precificação por canal, estoque, produção com kanban, manipulação de proteína, checklists de turno, ficha nutricional, temperatura, fechamento de CMV, relatórios.

**Fora (decidido):** cobrança/Asaas, WhatsApp/Meta Cloud API, integração com PDV e OCR de nota fiscal — entram depois, com receita e segundo cliente validando a demanda.

## 📁 Neste diretório
- [`mockup/ficha-tecnica-mvp.jsx`](./mockup/ficha-tecnica-mvp.jsx) — especificação viva das telas (React + Recharts), com as 12 abas do produto e as regras de negócio já validadas tela a tela.
- [`app/`](./app) — projeto Next.js 15 (App Router, TypeScript, Tailwind v4, shadcn/ui) integrado ao Supabase. Dono da migration canônica (`supabase/migrations/`, 27 tabelas, RLS por `auth.uid()`) e do motor de cálculo (`src/lib/calculo/`, funções puras com 39 testes unitários cobrindo a seção 5 do handoff). Todo item do menu lateral do mockup tem tela funcionando de verdade, exceto Configurações: auth, CRUD de insumo/receita/preparo base, estoque com fornecedores, produção com kanban, manipulação de proteína, fechamento de CMV com importação de vendas, relatórios, ficha nutricional (com rotulagem e laudo laboratorial), segurança alimentar (temperatura) e checklists de turno — mesmo visual do mockup em todas. Gera os 3 PDFs da seção 6 do handoff (ficha de custos, ficha operacional e rótulo nutricional com fundo branco/letra preta obrigatórios) direto no navegador, sem servidor.

## 📈 Status
MVP completo nas 12 telas do mockup. Próximo passo é validar com cardápio real do piloto (Eduardo) e ajustar o que a operação de verdade pedir — schema e regras de negócio já estão testados, o que falta é o atrito real de uso diário. Ordem de construção, schema completo e todas as fórmulas com regra de teste unitário estão documentados no handoff técnico interno do projeto.
