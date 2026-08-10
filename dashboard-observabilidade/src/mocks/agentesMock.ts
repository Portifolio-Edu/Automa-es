import type { AgenteResponse, Periodo } from '../types';

const generateLeadsPorDia = (days: number, dataCorte: string): { data: string; leads: number }[] => {
  const result: { data: string; leads: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const isBeforeCorte = date < new Date(dataCorte);
    result.push({
      data: date.toISOString().split('T')[0],
      leads: isBeforeCorte ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 50) + 20,
    });
  }
  return result;
};

export const agentesMock: Record<Periodo, AgenteResponse> = {
  '7d': {
    dataCorte: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ultimaAtualizacao: new Date().toISOString(),
    totalLeads: 234,
    leadsComTelefone: 156,
    leadsComCallAgendada: 48,
    taxaAgendamento: 20.5,
    volumePorCanal: [
      { canal: 'WhatsApp', volume: 120 },
      { canal: 'Instagram', volume: 78 },
      { canal: 'Site', volume: 36 },
    ],
    distribuicaoTemperatura: [
      { temperatura: 'Quente', quantidade: 52 },
      { temperatura: 'Morno', quantidade: 98 },
      { temperatura: 'Frio', quantidade: 84 },
    ],
    frenteInteresse: [
      { frente: 'Consultoria', quantidade: 89 },
      { frente: 'Produto', quantidade: 67 },
      { frente: 'Parceria', quantidade: 45 },
      { frente: 'Outros', quantidade: 33 },
    ],
    leadsPorDia: generateLeadsPorDia(7, new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    leadsRecentes: Array.from({ length: 15 }, (_, i) => ({
      id: `lead-${i}`,
      canal: ['WhatsApp', 'Instagram', 'Site'][Math.floor(Math.random() * 3)] as 'site' | 'instagram' | 'whatsapp',
      nome: `Lead ${i + 1}`,
      temperatura: ['quente', 'morno', 'frio'][Math.floor(Math.random() * 3)] as 'frio' | 'morno' | 'quente',
      frenteInteresse: ['Consultoria', 'Produto', 'Parceria'][Math.floor(Math.random() * 3)],
      temTelefone: Math.random() > 0.3,
      temCallMarcada: Math.random() > 0.7,
      ultimaInteracao: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
    })),
  },
  '30d': {
    dataCorte: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ultimaAtualizacao: new Date().toISOString(),
    totalLeads: 892,
    leadsComTelefone: 612,
    leadsComCallAgendada: 178,
    taxaAgendamento: 19.9,
    volumePorCanal: [
      { canal: 'WhatsApp', volume: 456 },
      { canal: 'Instagram', volume: 298 },
      { canal: 'Site', volume: 138 },
    ],
    distribuicaoTemperatura: [
      { temperatura: 'Quente', quantidade: 198 },
      { temperatura: 'Morno', quantidade: 378 },
      { temperatura: 'Frio', quantidade: 316 },
    ],
    frenteInteresse: [
      { frente: 'Consultoria', quantidade: 334 },
      { frente: 'Produto', quantidade: 267 },
      { frente: 'Parceria', quantidade: 178 },
      { frente: 'Outros', quantidade: 113 },
    ],
    leadsPorDia: generateLeadsPorDia(30, new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    leadsRecentes: Array.from({ length: 15 }, (_, i) => ({
      id: `lead-${i}`,
      canal: ['WhatsApp', 'Instagram', 'Site'][Math.floor(Math.random() * 3)] as 'site' | 'instagram' | 'whatsapp',
      nome: `Lead ${i + 1}`,
      temperatura: ['quente', 'morno', 'frio'][Math.floor(Math.random() * 3)] as 'frio' | 'morno' | 'quente',
      frenteInteresse: ['Consultoria', 'Produto', 'Parceria'][Math.floor(Math.random() * 3)],
      temTelefone: Math.random() > 0.3,
      temCallMarcada: Math.random() > 0.7,
      ultimaInteracao: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    })),
  },
  '90d': {
    dataCorte: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ultimaAtualizacao: new Date().toISOString(),
    totalLeads: 2456,
    leadsComTelefone: 1678,
    leadsComCallAgendada: 512,
    taxaAgendamento: 20.8,
    volumePorCanal: [
      { canal: 'WhatsApp', volume: 1234 },
      { canal: 'Instagram', volume: 812 },
      { canal: 'Site', volume: 410 },
    ],
    distribuicaoTemperatura: [
      { temperatura: 'Quente', quantidade: 534 },
      { temperatura: 'Morno', quantidade: 1023 },
      { temperatura: 'Frio', quantidade: 899 },
    ],
    frenteInteresse: [
      { frente: 'Consultoria', quantidade: 912 },
      { frente: 'Produto', quantidade: 734 },
      { frente: 'Parceria', quantidade: 512 },
      { frente: 'Outros', quantidade: 298 },
    ],
    leadsPorDia: generateLeadsPorDia(90, new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    leadsRecentes: Array.from({ length: 15 }, (_, i) => ({
      id: `lead-${i}`,
      canal: ['WhatsApp', 'Instagram', 'Site'][Math.floor(Math.random() * 3)] as 'site' | 'instagram' | 'whatsapp',
      nome: `Lead ${i + 1}`,
      temperatura: ['quente', 'morno', 'frio'][Math.floor(Math.random() * 3)] as 'frio' | 'morno' | 'quente',
      frenteInteresse: ['Consultoria', 'Produto', 'Parceria'][Math.floor(Math.random() * 3)],
      temTelefone: Math.random() > 0.3,
      temCallMarcada: Math.random() > 0.7,
      ultimaInteracao: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
    })),
  },
};
