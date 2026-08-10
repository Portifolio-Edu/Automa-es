export interface AgenteResponse {
  dataCorte: string;
  ultimaAtualizacao: string;
  totalLeads: number;
  leadsComTelefone: number;
  leadsComCallAgendada: number;
  taxaAgendamento: number;
  volumePorCanal: { canal: string; volume: number }[];
  distribuicaoTemperatura: { temperatura: string; quantidade: number }[];
  frenteInteresse: { frente: string; quantidade: number }[];
  leadsPorDia: { data: string; leads: number }[];
  leadsRecentes: Lead[];
}

export interface Lead {
  id: string;
  canal: 'site' | 'instagram' | 'whatsapp';
  nome: string;
  temperatura: 'frio' | 'morno' | 'quente';
  frenteInteresse: string;
  temTelefone: boolean;
  temCallMarcada: boolean;
  ultimaInteracao: string;
}

export interface TrafegoResponse {
  dataCorte: string;
  ultimaAtualizacao: string;
  investimentoTotal: number;
  impressoes: number;
  cliques: number;
  ctr: number;
  cpc: number;
  leadsGerados: number;
  custoPorLead: number;
  investimentoELedsPorDia: { data: string; investimento: number; leads: number }[];
  campanhas: Campanha[];
}

export interface Campanha {
  id: string;
  nome: string;
  plataforma: string;
  investimento: number;
  cliques: number;
  leads: number;
  custoPorLead: number;
}

export type Periodo = '7d' | '30d' | '90d';
