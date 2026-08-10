import type { TrafegoResponse, Periodo } from '../types';

const generateInvestimentoELedsPorDia = (days: number, dataCorte: string): { data: string; investimento: number; leads: number }[] => {
  const result: { data: string; investimento: number; leads: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const isBeforeCorte = date < new Date(dataCorte);
    result.push({
      data: date.toISOString().split('T')[0],
      investimento: isBeforeCorte ? Math.floor(Math.random() * 50) + 20 : Math.floor(Math.random() * 150) + 80,
      leads: isBeforeCorte ? Math.floor(Math.random() * 5) + 2 : Math.floor(Math.random() * 15) + 8,
    });
  }
  return result;
};

export const trafegoMock: Record<Periodo, TrafegoResponse> = {
  '7d': {
    dataCorte: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ultimaAtualizacao: new Date().toISOString(),
    investimentoTotal: 850.50,
    impressoes: 45230,
    cliques: 1823,
    ctr: 4.03,
    cpc: 0.47,
    leadsGerados: 156,
    custoPorLead: 5.45,
    investimentoELedsPorDia: generateInvestimentoELedsPorDia(7, new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    campanhas: [
      { id: 'c1', nome: 'Campanha Instagram Q4', plataforma: 'Instagram', investimento: 320.00, cliques: 678, leads: 58, custoPorLead: 5.53 },
      { id: 'c2', nome: 'Google Search Brand', plataforma: 'Google', investimento: 280.50, cliques: 512, leads: 48, custoPorLead: 5.84 },
      { id: 'c3', nome: 'Facebook Retargeting', plataforma: 'Facebook', investimento: 150.00, cliques: 423, leads: 32, custoPorLead: 4.69 },
      { id: 'c4', nome: 'YouTube Awareness', plataforma: 'YouTube', investimento: 100.00, cliques: 210, leads: 18, custoPorLead: 5.56 },
    ],
  },
  '30d': {
    dataCorte: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ultimaAtualizacao: new Date().toISOString(),
    investimentoTotal: 3420.75,
    impressoes: 182450,
    cliques: 7234,
    ctr: 3.96,
    cpc: 0.47,
    leadsGerados: 612,
    custoPorLead: 5.59,
    investimentoELedsPorDia: generateInvestimentoELedsPorDia(30, new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    campanhas: [
      { id: 'c1', nome: 'Campanha Instagram Q4', plataforma: 'Instagram', investimento: 1280.00, cliques: 2678, leads: 228, custoPorLead: 5.61 },
      { id: 'c2', nome: 'Google Search Brand', plataforma: 'Google', investimento: 1120.50, cliques: 2012, leads: 188, custoPorLead: 5.96 },
      { id: 'c3', nome: 'Facebook Retargeting', plataforma: 'Facebook', investimento: 620.25, cliques: 1623, leads: 132, custoPorLead: 4.70 },
      { id: 'c4', nome: 'YouTube Awareness', plataforma: 'YouTube', investimento: 400.00, cliques: 921, leads: 64, custoPorLead: 6.25 },
    ],
  },
  '90d': {
    dataCorte: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ultimaAtualizacao: new Date().toISOString(),
    investimentoTotal: 9850.25,
    impressoes: 524380,
    cliques: 21234,
    ctr: 4.05,
    cpc: 0.46,
    leadsGerados: 1789,
    custoPorLead: 5.51,
    investimentoELedsPorDia: generateInvestimentoELedsPorDia(90, new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    campanhas: [
      { id: 'c1', nome: 'Campanha Instagram Q4', plataforma: 'Instagram', investimento: 3680.00, cliques: 7878, leads: 658, custoPorLead: 5.59 },
      { id: 'c2', nome: 'Google Search Brand', plataforma: 'Google', investimento: 3420.50, cliques: 6212, leads: 568, custoPorLead: 6.02 },
      { id: 'c3', nome: 'Facebook Retargeting', plataforma: 'Facebook', investimento: 1820.75, cliques: 4823, leads: 392, custoPorLead: 4.64 },
      { id: 'c4', nome: 'YouTube Awareness', plataforma: 'YouTube', investimento: 929.00, cliques: 2321, leads: 171, custoPorLead: 5.43 },
    ],
  },
};
