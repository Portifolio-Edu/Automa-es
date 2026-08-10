# Dashboard de Observabilidade - Agentes de IA

Dashboard web para monitoramento de operações de atendimento com agentes de IA.

## Stack

- **React + Vite + TypeScript**
- **Tailwind CSS** (modo escuro)
- **Recharts** (gráficos)
- **lucide-react** (ícones)
- **date-fns** (formatação de datas)

## Estrutura

```
src/
├── mocks/           # Dados mockados (substituir por endpoints reais)
│   ├── agentesMock.ts
│   └── trafegoMock.ts
├── types/           # Tipos TypeScript
│   └── index.ts
├── components/ui/   # Componentes UI reutilizáveis
│   └── Card.tsx
├── lib/             # Utilitários
│   └── utils.ts
└── pages/           # Páginas do dashboard
```

## Páginas

### 1. Desempenho dos Agentes (`/api/agentes`)

**Cards:**
- Total de leads no período
- Leads com telefone coletado
- Leads com call agendada
- Taxa de agendamento

**Gráficos:**
- Volume por canal (site, Instagram, WhatsApp)
- Distribuição de temperatura (frio, morno, quente)
- Frente de interesse (barra horizontal)
- Leads por dia (linha com marcação de período não confiável)

**Tabela:**
- Leads recentes com filtros por canal e temperatura
- Ordenável por todas as colunas

### 2. Tráfego Pago (`/api/trafego`)

**Cards:**
- Investimento total, impressões, cliques, CTR, CPC
- Leads gerados, custo por lead

**Gráficos:**
- Investimento e leads por dia (dois eixos, ComposedChart)

**Tabela:**
- Campanhas por nome, plataforma, investimento, cliques, leads, CPL

## Regras de Produto Implementadas

✅ **Nenhum cálculo no frontend** - Todos os números vêm prontos do endpoint  
✅ **Data de última atualização** exibida em cada card  
✅ **Data de corte de confiabilidade** (`dataCorte`) com faixa sombreada nos gráficos temporais  
✅ **Estados obrigatórios:** loading (skeleton), erro (com retry), vazio (mensagem explicativa)  
✅ **Sem placeholders inventados** - Mock explícito na interface  
✅ **Tema escuro** por padrão  
✅ **Responsivo** (sidebar vira menu mobile)  

## Para Produção

Substitua o módulo `src/mocks/` por uma camada de fetch real:

```typescript
// Exemplo: src/api/agentes.ts
export async function fetchAgentes(periodo: string): Promise<AgenteResponse> {
  const res = await fetch(`/api/agentes?periodo=${periodo}`);
  return res.json();
}
```

E troque a importação em `App.tsx`.

## Desenvolvimento

```bash
cd dashboard-observabilidade
npm install
npm run dev
```

## Build

```bash
npm run build
```

Os arquivos estáticos estarão em `dist/`.
