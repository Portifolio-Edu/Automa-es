import { useState, useMemo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea, LabelList, Cell,
  LineChart as RLineChart, Line, CartesianGrid, BarChart, Bar, ComposedChart, Legend,
} from 'recharts';
import {
  ChefHat, Carrot, ClipboardList, LineChart, Settings, AlertTriangle,
  Download, ChevronDown, ChevronRight, Store, CookingPot, Scale, Thermometer, Apple, Package, ListChecks, X, Calculator,
} from 'lucide-react';

// Sistema de cor disciplinado: cinza faz 95% do trabalho de hierarquia.
// Só duas cores com significado: uma de marca (usada quase só em estado ativo/ação
// primária) e uma de alerta real (usada só quando algo precisa de atenção agora).
// Nada de cor decorativa por categoria.
const C = {
  bg: '#FAFAFA',
  panel: '#FFFFFF',
  border: '#ECECEE',
  borderStrong: '#DEDEE2',
  text: '#0D0D0F',
  sub: '#6E6E76',
  faint: '#A3A3AA',
  accent: '#2F5233',
  accentSoft: '#EAF0EA',
  danger: '#9A2E1F',
  dangerSoft: '#FBECE8',
};

const shadow = '0 1px 2px rgba(13,13,15,0.03), 0 6px 16px rgba(13,13,15,0.04)';
const font = { fontFamily: "ui-sans-serif, -apple-system, 'Segoe UI', Inter, system-ui, sans-serif" };
const nums = { fontVariantNumeric: 'tabular-nums' };

// ---- insumos: matéria-prima comprada pronta ----
const insumosBase = [
  { id: 'farinha', nome: 'Farinha de trigo', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 4.0, fc: 1, categoria: 'outro' },
  { id: 'mucarela', nome: 'Muçarela', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 35.0, fc: 1, categoria: 'laticinio' },
  { id: 'frango', nome: 'Filé de frango', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 22.0, fc: 1.12, categoria: 'proteina' },
  { id: 'carne-moida', nome: 'Carne moída', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 32.0, fc: 1.05, categoria: 'proteina' },
  { id: 'salmao', nome: 'Salmão', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 68.0, fc: 1.18, categoria: 'proteina' },
  { id: 'alface', nome: 'Alface', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 6.0, fc: 1.21, categoria: 'hortalica' },
  { id: 'oleo', nome: 'Óleo de fritura', unidade: 'l', tamanhoEmbalagem: 1, precoEmbalagem: 8.0, fc: 1, categoria: 'outro' },
  { id: 'massa-lasanha', nome: 'Massa de lasanha', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 12.0, fc: 1, categoria: 'outro' },
  { id: 'parmesao', nome: 'Queijo parmesão', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 55.0, fc: 1, categoria: 'laticinio' },
  { id: 'azeite', nome: 'Azeite', unidade: 'l', tamanhoEmbalagem: 1, precoEmbalagem: 28.0, fc: 1, categoria: 'outro' },
  { id: 'crouton', nome: 'Crouton', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 18.0, fc: 1, categoria: 'outro' },
  { id: 'limao', nome: 'Limão', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 6.0, fc: 1.35, categoria: 'fruta' },
  { id: 'molho-caesar', nome: 'Molho caesar (comprado)', unidade: 'l', tamanhoEmbalagem: 1, precoEmbalagem: 24.0, fc: 1, categoria: 'outro' },
  { id: 'tomate-pelado', nome: 'Tomate pelado', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 6.0, fc: 1, categoria: 'hortalica' },
  { id: 'cebola', nome: 'Cebola', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 5.0, fc: 1.29, categoria: 'hortalica' },
  { id: 'alho', nome: 'Alho', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 25.0, fc: 1.08, categoria: 'hortalica' },
  { id: 'manjericao', nome: 'Manjericão fresco', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 40.0, fc: 1.15, categoria: 'tempero' },
  { id: 'fermento', nome: 'Fermento biológico', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 18.0, fc: 1, categoria: 'outro' },
  { id: 'sal', nome: 'Sal', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 3.0, fc: 1, categoria: 'tempero' },
  { id: 'acucar', nome: 'Açúcar', unidade: 'kg', tamanhoEmbalagem: 1, precoEmbalagem: 5.0, fc: 1, categoria: 'outro' },
  // Embalagem é insumo como qualquer outro, mas só entra no custo quando o prato
  // sai do balcão: delivery e viagem embalam, consumo no salão não.
  { id: 'emb-marmita-750', nome: 'Marmita 750ml c/ tampa', unidade: 'un', tamanhoEmbalagem: 100, precoEmbalagem: 89.0, fc: 1, categoria: 'embalagem' },
  { id: 'emb-caixa-pizza', nome: 'Caixa de pizza 35cm', unidade: 'un', tamanhoEmbalagem: 50, precoEmbalagem: 97.5, fc: 1, categoria: 'embalagem' },
  { id: 'emb-pote-500', nome: 'Pote 500ml c/ tampa', unidade: 'un', tamanhoEmbalagem: 100, precoEmbalagem: 62.0, fc: 1, categoria: 'embalagem' },
  { id: 'emb-sacola', nome: 'Sacola kraft delivery', unidade: 'un', tamanhoEmbalagem: 250, precoEmbalagem: 75.0, fc: 1, categoria: 'embalagem' },
  { id: 'emb-talher', nome: 'Kit talher descartável', unidade: 'un', tamanhoEmbalagem: 500, precoEmbalagem: 105.0, fc: 1, categoria: 'embalagem' },
];
const precoUnitario = (i) => i.precoEmbalagem / i.tamanhoEmbalagem;

// Valores nutricionais de referência por 100g (padrão de rótulo, Anvisa RDC
// 429/2020 + IN 75/2020). Aproximação pra mockup, não substitui laudo. Só os
// insumos usados nos pratos de exemplo têm dado aqui; os demais ficam de fora
// até serem cadastrados. Açúcares totais e adicionados são campos separados,
// a norma exige os dois distintos, não um só.
const NUTRI_CAMPOS = ['calorias', 'carboidratos', 'acucaresTotais', 'acucaresAdicionados', 'proteinas', 'gordurasTotais', 'gordurasSaturadas', 'gordurasTrans', 'fibra', 'sodio'];
const nutricaoInsumoBase = {
  'farinha': { calorias: 364, carboidratos: 76, acucaresTotais: 0.3, acucaresAdicionados: 0, proteinas: 10, gordurasTotais: 1, gordurasSaturadas: 0.2, gordurasTrans: 0, fibra: 2.7, sodio: 2 },
  'mucarela': { calorias: 280, carboidratos: 3, acucaresTotais: 1, acucaresAdicionados: 0, proteinas: 22, gordurasTotais: 17, gordurasSaturadas: 10, gordurasTrans: 0, fibra: 0, sodio: 620 },
  'frango': { calorias: 165, carboidratos: 0, acucaresTotais: 0, acucaresAdicionados: 0, proteinas: 31, gordurasTotais: 3.6, gordurasSaturadas: 1, gordurasTrans: 0, fibra: 0, sodio: 74 },
  'carne-moida': { calorias: 250, carboidratos: 0, acucaresTotais: 0, acucaresAdicionados: 0, proteinas: 26, gordurasTotais: 15, gordurasSaturadas: 6, gordurasTrans: 0.5, fibra: 0, sodio: 66 },
  'salmao': { calorias: 208, carboidratos: 0, acucaresTotais: 0, acucaresAdicionados: 0, proteinas: 20, gordurasTotais: 13, gordurasSaturadas: 3, gordurasTrans: 0, fibra: 0, sodio: 59 },
  'alface': { calorias: 15, carboidratos: 2.9, acucaresTotais: 0.8, acucaresAdicionados: 0, proteinas: 1.4, gordurasTotais: 0.2, gordurasSaturadas: 0, gordurasTrans: 0, fibra: 1.3, sodio: 28 },
  'oleo': { calorias: 884, carboidratos: 0, acucaresTotais: 0, acucaresAdicionados: 0, proteinas: 0, gordurasTotais: 100, gordurasSaturadas: 15, gordurasTrans: 0, fibra: 0, sodio: 0 },
  'massa-lasanha': { calorias: 371, carboidratos: 75, acucaresTotais: 3, acucaresAdicionados: 0, proteinas: 13, gordurasTotais: 1.5, gordurasSaturadas: 0.3, gordurasTrans: 0, fibra: 3, sodio: 6 },
  'parmesao': { calorias: 431, carboidratos: 4, acucaresTotais: 0.9, acucaresAdicionados: 0, proteinas: 38, gordurasTotais: 29, gordurasSaturadas: 19, gordurasTrans: 0, fibra: 0, sodio: 1530 },
  'azeite': { calorias: 884, carboidratos: 0, acucaresTotais: 0, acucaresAdicionados: 0, proteinas: 0, gordurasTotais: 100, gordurasSaturadas: 14, gordurasTrans: 0, fibra: 0, sodio: 2 },
  'crouton': { calorias: 400, carboidratos: 65, acucaresTotais: 4, acucaresAdicionados: 1.5, proteinas: 11, gordurasTotais: 12, gordurasSaturadas: 2, gordurasTrans: 0, fibra: 4, sodio: 700 },
  'limao': { calorias: 29, carboidratos: 9.3, acucaresTotais: 2.5, acucaresAdicionados: 0, proteinas: 1.1, gordurasTotais: 0.3, gordurasSaturadas: 0, gordurasTrans: 0, fibra: 2.8, sodio: 2 },
  'molho-caesar': { calorias: 467, carboidratos: 6, acucaresTotais: 3, acucaresAdicionados: 2, proteinas: 2, gordurasTotais: 48, gordurasSaturadas: 8, gordurasTrans: 0, fibra: 0, sodio: 1100 },
  'tomate-pelado': { calorias: 24, carboidratos: 5, acucaresTotais: 3, acucaresAdicionados: 0, proteinas: 1.1, gordurasTotais: 0.2, gordurasSaturadas: 0, gordurasTrans: 0, fibra: 1.2, sodio: 200 },
  'cebola': { calorias: 40, carboidratos: 9.3, acucaresTotais: 4.2, acucaresAdicionados: 0, proteinas: 1.1, gordurasTotais: 0.1, gordurasSaturadas: 0, gordurasTrans: 0, fibra: 1.7, sodio: 4 },
  'alho': { calorias: 149, carboidratos: 33, acucaresTotais: 1, acucaresAdicionados: 0, proteinas: 6.4, gordurasTotais: 0.5, gordurasSaturadas: 0, gordurasTrans: 0, fibra: 2.1, sodio: 17 },
  'manjericao': { calorias: 23, carboidratos: 2.7, acucaresTotais: 0.3, acucaresAdicionados: 0, proteinas: 3.2, gordurasTotais: 0.6, gordurasSaturadas: 0, gordurasTrans: 0, fibra: 1.6, sodio: 4 },
  'fermento': { calorias: 105, carboidratos: 41, acucaresTotais: 0, acucaresAdicionados: 0, proteinas: 8, gordurasTotais: 1.9, gordurasSaturadas: 0.3, gordurasTrans: 0, fibra: 27, sodio: 51 },
  'sal': { calorias: 0, carboidratos: 0, acucaresTotais: 0, acucaresAdicionados: 0, proteinas: 0, gordurasTotais: 0, gordurasSaturadas: 0, gordurasTrans: 0, fibra: 0, sodio: 38758 },
  'acucar': { calorias: 387, carboidratos: 100, acucaresTotais: 100, acucaresAdicionados: 100, proteinas: 0, gordurasTotais: 0, gordurasSaturadas: 0, gordurasTrans: 0, fibra: 0, sodio: 1 },
};

// VDR (valores diários de referência), Anexo II da IN 75/2020, em vigor. Sem
// entrada pra açúcares totais porque a norma não define VDR pra esse campo.
const VDR = { calorias: 2000, carboidratos: 300, acucaresAdicionados: 50, proteinas: 50, gordurasTotais: 65, gordurasSaturadas: 20, gordurasTrans: 2, fibra: 25, sodio: 2000 };

// Limiar pra selo de alerta frontal ("lupa"), Anexo XV da IN 75/2020, confirmado
// em duas fontes: sólido/semissólido é por 100g, líquido é por 100mL e tem valor
// próprio, não é metade nem proporção do sólido.
const LIMIAR_ALTO_EM = {
  solido: { gordurasSaturadas: 6, sodio: 600, acucaresAdicionados: 15 },
  liquido: { gordurasSaturadas: 3, sodio: 300, acucaresAdicionados: 7.5 },
};


function somaNutrientes(linhas, resolver) {
  // linhas: array de { insumoId?, subReceitaId?, pesoLiquido, pesoBruto } já resolvidas
  const total = Object.fromEntries(NUTRI_CAMPOS.map((c) => [c, 0]));
  let completo = true;
  linhas.forEach((l) => {
    const porItem = resolver(l);
    if (!porItem) { completo = false; return; }
    const mult = (l.pesoBruto || l.pesoLiquido) * 10; // kg (ou l, aproximado) -> múltiplo de 100g
    NUTRI_CAMPOS.forEach((c) => { total[c] += (porItem[c] || 0) * mult; });
  });
  return { total, completo };
}


const preparosBase = [
  { id: 'molho-tomate', nome: 'Molho de Tomate Caseiro', rendimento: 5, unidadeRendimento: 'kg', ficha: [
    { insumoId: 'tomate-pelado', pesoLiquido: 4 },
    { insumoId: 'cebola', pesoLiquido: 0.3 },
    { insumoId: 'alho', pesoLiquido: 0.05 },
    { insumoId: 'azeite', pesoLiquido: 0.1 },
    { insumoId: 'manjericao', pesoLiquido: 0.02 },
  ]},
  { id: 'massa-pizza', nome: 'Massa de Pizza Caseira', rendimento: 10, unidadeRendimento: 'un', ficha: [
    { insumoId: 'farinha', pesoLiquido: 1.2 },
    { insumoId: 'fermento', pesoLiquido: 0.02 },
    { insumoId: 'sal', pesoLiquido: 0.025 },
    { insumoId: 'azeite', pesoLiquido: 0.05 },
    { insumoId: 'acucar', pesoLiquido: 0.03 },
  ]},
];

function fcDoInsumo(insumo, fcEfetivoById) {
  return (fcEfetivoById && fcEfetivoById[insumo.id]) || insumo.fc;
}

function custoPreparo(prep, insumoById, fcEfetivoById) {
  return prep.ficha.reduce((s, f) => {
    const insumo = insumoById[f.insumoId];
    return s + f.pesoLiquido * fcDoInsumo(insumo, fcEfetivoById) * precoUnitario(insumo);
  }, 0);
}

function nutricaoPorUnidadePreparo(prep, insumoById) {
  const linhasComPeso = prep.ficha.map((f) => ({ ...f, pesoBruto: f.pesoLiquido * insumoById[f.insumoId].fc }));
  const { total, completo } = somaNutrientes(linhasComPeso, (l) => nutricaoInsumoBase[l.insumoId] || null);
  if (!completo) return null;
  return Object.fromEntries(NUTRI_CAMPOS.map((c) => [c, total[c] / prep.rendimento]));
}

function resolverLinha(linha, insumoById, preparoById, fcEfetivoById) {
  if (linha.insumoId) {
    const insumo = insumoById[linha.insumoId];
    const fc = fcDoInsumo(insumo, fcEfetivoById);
    const pesoBruto = linha.pesoLiquido * fc;
    return { tipo: 'insumo', nome: insumo.nome, unidade: insumo.unidade, fc, fcObservado: !!(fcEfetivoById && fcEfetivoById[insumo.id]), pesoBruto, precoUnit: precoUnitario(insumo), custo: pesoBruto * precoUnitario(insumo) };
  }
  const prep = preparoById[linha.subReceitaId];
  const precoUnit = custoPreparo(prep, insumoById, fcEfetivoById) / prep.rendimento;
  return { tipo: 'preparo', nome: prep.nome, unidade: linha.unidade, fc: 1, pesoBruto: linha.pesoLiquido, precoUnit, custo: linha.pesoLiquido * precoUnit, preparo: prep };
}

const UNIDADES = ['kg', 'g', 'l', 'ml', 'un'];

const CATEGORIAS_INSUMO = [
  { id: 'proteina', label: 'Proteína (carne/peixe/aves)' },
  { id: 'hortalica', label: 'Hortaliça/legume' },
  { id: 'fruta', label: 'Fruta' },
  { id: 'laticinio', label: 'Laticínio' },
  { id: 'tempero', label: 'Tempero' },
  { id: 'embalagem', label: 'Embalagem' },
  { id: 'outro', label: 'Outro' },
];

function NovoInsumoForm({ onSave, onCancel }) {
  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('kg');
  const [categoria, setCategoria] = useState('outro');
  const [tamanhoEmbalagem, setTamanhoEmbalagem] = useState('');
  const [precoEmbalagem, setPrecoEmbalagem] = useState('');
  const [fc, setFc] = useState('1');
  const inputStyle = { border: `1px solid ${C.borderStrong}`, background: C.panel };

  const salvar = () => {
    if (!nome.trim() || !tamanhoEmbalagem || !precoEmbalagem) return;
    onSave({ id: `insumo-${Date.now()}`, nome: nome.trim(), unidade, categoria, tamanhoEmbalagem: parseFloat(tamanhoEmbalagem), precoEmbalagem: parseFloat(precoEmbalagem), fc: parseFloat(fc) || 1 });
  };

  return (
    <div className="px-5 py-4" style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
      <div className="grid grid-cols-6 gap-2 mb-2">
        <input placeholder="Nome do insumo" value={nome} onChange={(e) => setNome(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md col-span-2" style={inputStyle} />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md col-span-2" style={inputStyle}>
          {CATEGORIAS_INSUMO.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select value={unidade} onChange={(e) => setUnidade(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle}>
          {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <input placeholder="FC" type="number" step="0.01" value={fc} onChange={(e) => setFc(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
      </div>
      <div className="grid grid-cols-6 gap-2 mb-3">
        <input placeholder="Tamanho embalagem" type="number" value={tamanhoEmbalagem} onChange={(e) => setTamanhoEmbalagem(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md col-span-3" style={inputStyle} />
        <input placeholder="Preço pago (R$)" type="number" value={precoEmbalagem} onChange={(e) => setPrecoEmbalagem(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md col-span-3" style={inputStyle} />
      </div>
      <div className="flex gap-2">
        <button onClick={salvar} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ background: C.text, color: '#fff' }}>Salvar insumo</button>
        <button onClick={onCancel} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ border: `1px solid ${C.borderStrong}` }}>Cancelar</button>
      </div>
    </div>
  );
}

function NovoPreparoForm({ insumos, onSave, onCancel }) {
  const [nome, setNome] = useState('');
  const [rendimento, setRendimento] = useState('');
  const [unidadeRendimento, setUnidadeRendimento] = useState('kg');
  const [ficha, setFicha] = useState([]);
  const [linhaInsumoId, setLinhaInsumoId] = useState(insumos[0]?.id || '');
  const [linhaPeso, setLinhaPeso] = useState('');
  const inputStyle = { border: `1px solid ${C.borderStrong}`, background: C.panel };

  const addLinha = () => {
    if (!linhaInsumoId || !linhaPeso) return;
    setFicha([...ficha, { insumoId: linhaInsumoId, pesoLiquido: parseFloat(linhaPeso) }]);
    setLinhaPeso('');
  };
  const removerLinha = (idx) => setFicha(ficha.filter((_, i) => i !== idx));
  const salvar = () => {
    if (!nome.trim() || !rendimento || ficha.length === 0) return;
    onSave({ id: `preparo-${Date.now()}`, nome: nome.trim(), rendimento: parseFloat(rendimento), unidadeRendimento, ficha });
  };

  return (
    <div className="px-5 py-4" style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
      <div className="grid grid-cols-6 gap-2 mb-3">
        <input placeholder="Nome da receita" value={nome} onChange={(e) => setNome(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md col-span-3" style={inputStyle} />
        <input placeholder="Rende" type="number" value={rendimento} onChange={(e) => setRendimento(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
        <select value={unidadeRendimento} onChange={(e) => setUnidadeRendimento(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md col-span-2" style={inputStyle}>
          {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      {ficha.length > 0 && (
        <div className="mb-3 space-y-1">
          {ficha.map((f, idx) => {
            const insumo = insumos.find((i) => i.id === f.insumoId);
            return (
              <div key={idx} className="flex items-center justify-between text-[12px] px-2.5 py-1.5 rounded-md" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
                <span>{insumo?.nome} · {f.pesoLiquido}{insumo?.unidade}</span>
                <button onClick={() => removerLinha(idx)} style={{ color: C.danger }}>remover</button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <select value={linhaInsumoId} onChange={(e) => setLinhaInsumoId(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md flex-1" style={inputStyle}>
          {insumos.map((i) => <option key={i.id} value={i.id}>{i.nome}</option>)}
        </select>
        <input placeholder="Peso líquido" type="number" value={linhaPeso} onChange={(e) => setLinhaPeso(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md w-32" style={inputStyle} />
        <button onClick={addLinha} className="text-[12.5px] font-medium px-3 py-1.5 rounded-md" style={{ border: `1px solid ${C.borderStrong}` }}>+ ingrediente</button>
      </div>

      <div className="flex gap-2">
        <button onClick={salvar} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ background: C.text, color: '#fff' }}>Salvar receita</button>
        <button onClick={onCancel} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ border: `1px solid ${C.borderStrong}` }}>Cancelar</button>
      </div>
    </div>
  );
}

function NovoEstoqueForm({ insumos, jaRastreados, onSave, onCancel }) {
  const disponiveis = insumos.filter((i) => !jaRastreados.includes(i.id));
  const [insumoId, setInsumoId] = useState(disponiveis[0]?.id || '');
  const [atual, setAtual] = useState('');
  const [minimo, setMinimo] = useState('');
  const inputStyle = { border: `1px solid ${C.borderStrong}`, background: C.panel };

  const salvar = () => {
    if (!insumoId || atual === '' || minimo === '') return;
    onSave(insumoId, { atual: parseFloat(atual), minimo: parseFloat(minimo), fatorQuebra: 1 });
  };

  if (disponiveis.length === 0) {
    return (
      <div className="px-5 py-4">
        <p className="text-[12.5px] mb-3" style={{ color: C.sub }}>Todos os insumos cadastrados já têm estoque rastreado. Cadastre um insumo novo na aba Insumos primeiro.</p>
        <button onClick={onCancel} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ border: `1px solid ${C.borderStrong}` }}>Fechar</button>
      </div>
    );
  }

  const unidade = insumos.find((i) => i.id === insumoId)?.unidade || '';

  return (
    <div className="px-5 py-4">
      <div className="grid grid-cols-4 gap-2 mb-3">
        <select value={insumoId} onChange={(e) => setInsumoId(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md col-span-2" style={inputStyle}>
          {disponiveis.map((i) => <option key={i.id} value={i.id}>{i.nome}</option>)}
        </select>
        <input placeholder={`Saldo atual (${unidade})`} type="number" value={atual} onChange={(e) => setAtual(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
        <input placeholder={`Estoque mínimo (${unidade})`} type="number" value={minimo} onChange={(e) => setMinimo(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
      </div>
      <div className="flex gap-2">
        <button onClick={salvar} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ background: C.text, color: '#fff' }}>Adicionar ao estoque</button>
        <button onClick={onCancel} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ border: `1px solid ${C.borderStrong}` }}>Cancelar</button>
      </div>
    </div>
  );
}

function NovoFornecedorForm({ onSave, onCancel }) {
  const [f, setF] = useState({ empresa: '', contato: '', telefone: '', email: '', fornece: '', diasEntrega: '', horarioEntrega: '', prazoUrgencia: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const inputStyle = { border: `1px solid ${C.borderStrong}`, background: C.panel };

  const salvar = () => {
    if (!f.empresa.trim() || !f.telefone.trim()) return;
    onSave({ ...f, id: `forn-${Date.now()}` });
  };

  return (
    <div className="px-5 py-4">
      <div className="grid grid-cols-3 gap-2 mb-2">
        <input placeholder="Empresa" value={f.empresa} onChange={set('empresa')} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
        <input placeholder="Nome do contato" value={f.contato} onChange={set('contato')} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
        <input placeholder="Telefone" value={f.telefone} onChange={set('telefone')} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input placeholder="E-mail" value={f.email} onChange={set('email')} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
        <input placeholder="O que fornece" value={f.fornece} onChange={set('fornece')} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <input placeholder="Dias de entrega (ex: Seg, Qua)" value={f.diasEntrega} onChange={set('diasEntrega')} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
        <input placeholder="Horário de entrega" value={f.horarioEntrega} onChange={set('horarioEntrega')} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
        <input placeholder="Prazo pra pedido de urgência" value={f.prazoUrgencia} onChange={set('prazoUrgencia')} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
      </div>
      <div className="flex gap-2">
        <button onClick={salvar} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ background: C.text, color: '#fff' }}>Salvar fornecedor</button>
        <button onClick={onCancel} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ border: `1px solid ${C.borderStrong}` }}>Cancelar</button>
      </div>
    </div>
  );
}

function NovaProducaoForm({ preparos, pratos, turnoAtivo, chefeTurno, onSave, onCancel }) {
  const [tipo, setTipo] = useState('preparo');
  const [refId, setRefId] = useState(preparos[0]?.id || '');
  const [quantidade, setQuantidade] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [lote, setLote] = useState('');
  const [validade, setValidade] = useState('');
  const inputStyle = { border: `1px solid ${C.borderStrong}`, background: C.panel };

  const opcoes = tipo === 'preparo' ? preparos.map((p) => ({ id: p.id, nome: p.nome })) : pratos.map((p) => ({ id: p.id, nome: p.nome }));
  const unidade = tipo === 'preparo' ? (preparos.find((p) => p.id === refId)?.unidadeRendimento || '') : 'porções';

  const trocarTipo = (novoTipo) => {
    setTipo(novoTipo);
    setRefId(novoTipo === 'preparo' ? (preparos[0]?.id || '') : (pratos[0]?.id || ''));
  };

  const salvar = () => {
    if (!refId || !quantidade || !responsavel.trim() || !lote.trim()) return;
    const agora = new Date();
    const data = `${String(agora.getDate()).padStart(2, '0')}/${String(agora.getMonth() + 1).padStart(2, '0')}`;
    onSave({ id: `prod-${Date.now()}`, lote: lote.trim(), tipo, refId, quantidade: parseFloat(quantidade), responsavel: responsavel.trim(), turno: turnoAtivo, chefeTurno, data, validade: validade.trim(), status: 'em_producao' });
  };

  return (
    <div className="px-5 py-4">
      <div className="flex gap-2 mb-2">
        {[['preparo', 'Preparo próprio'], ['prato', 'Prato final']].map(([id, label]) => (
          <button key={id} onClick={() => trocarTipo(id)} className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg" style={{ background: tipo === id ? C.text : C.panel, color: tipo === id ? '#fff' : C.text, border: `1px solid ${tipo === id ? C.text : C.borderStrong}` }}>
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <select value={refId} onChange={(e) => setRefId(tipo === 'prato' ? Number(e.target.value) : e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md col-span-2" style={inputStyle}>
          {opcoes.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
        </select>
        <input placeholder={`Quantidade${unidade ? ` (${unidade})` : ''}`} type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
        <input placeholder="Responsável" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <input placeholder="Número do lote" value={lote} onChange={(e) => setLote(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md col-span-2" style={inputStyle} />
        <input placeholder="Validade (ex: 17/09)" value={validade} onChange={(e) => setValidade(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md col-span-2" style={inputStyle} />
      </div>
      <div className="flex gap-2">
        <button onClick={salvar} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ background: C.text, color: '#fff' }}>Salvar produção</button>
        <button onClick={onCancel} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ border: `1px solid ${C.borderStrong}` }}>Cancelar</button>
      </div>
    </div>
  );
}

function NovaTemperaturaForm({ locais, onSave, onCancel }) {
  const [localId, setLocalId] = useState(locais[0]?.id || '');
  const [temperatura, setTemperatura] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const inputStyle = { border: `1px solid ${C.borderStrong}`, background: C.panel };

  const local = locais.find((l) => l.id === localId);
  const valor = parseFloat(temperatura);
  const foraDaFaixa = local && temperatura !== '' && (valor < local.min || valor > local.max);

  const salvar = () => {
    if (!localId || temperatura === '' || !responsavel.trim()) return;
    const agora = new Date();
    const data = `${String(agora.getDate()).padStart(2, '0')}/${String(agora.getMonth() + 1).padStart(2, '0')} ${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
    onSave({ id: `temp-${Date.now()}`, localId, temperatura: valor, responsavel: responsavel.trim(), data });
  };

  return (
    <div className="px-5 py-4">
      <div className="grid grid-cols-4 gap-2 mb-2">
        <select value={localId} onChange={(e) => setLocalId(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md col-span-2" style={inputStyle}>
          {locais.map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
        </select>
        <input placeholder="Temperatura (°C)" type="number" value={temperatura} onChange={(e) => setTemperatura(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
        <input placeholder="Responsável" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
      </div>
      {foraDaFaixa && (
        <div className="text-[12px] mb-2" style={{ color: C.danger }}>Fora da faixa ideal desse local ({local.min}°C a {local.max}°C), mas dá pra salvar mesmo assim, o registro é o que importa.</div>
      )}
      <div className="flex gap-2">
        <button onClick={salvar} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ background: C.text, color: '#fff' }}>Salvar leitura</button>
        <button onClick={onCancel} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ border: `1px solid ${C.borderStrong}` }}>Cancelar</button>
      </div>
    </div>
  );
}

function NovoProcessamentoForm({ insumos, insumoInicial, onSave, onCancel }) {
  const [insumoId, setInsumoId] = useState(insumoInicial && insumos.find((i) => i.id === insumoInicial) ? insumoInicial : (insumos[0]?.id || ''));
  const [mes, setMes] = useState('');
  const [data, setData] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [pesoBrutoRecebido, setPesoBrutoRecebido] = useState('');
  const [valorPagoKg, setValorPagoKg] = useState('');
  const [pesoLiquidoResultante, setPesoLiquidoResultante] = useState('');
  const [pesoAparasReaproveitaveis, setPesoAparasReaproveitaveis] = useState('0');
  const [fornecedor, setFornecedor] = useState('');
  const [observacao, setObservacao] = useState('');
  const inputStyle = { border: `1px solid ${C.borderStrong}`, background: C.panel };

  const bruto = parseFloat(pesoBrutoRecebido) || 0;
  const liquido = parseFloat(pesoLiquidoResultante) || 0;
  const aparas = parseFloat(pesoAparasReaproveitaveis) || 0;
  const descartePuro = bruto && liquido ? bruto - liquido - aparas : null;
  const fcPreview = bruto && liquido ? bruto / liquido : null;
  const reconciliacaoInvalida = descartePuro !== null && descartePuro < 0;

  const salvar = () => {
    if (!insumoId || !mes.trim() || !responsavel.trim() || !pesoBrutoRecebido || !valorPagoKg || !pesoLiquidoResultante || reconciliacaoInvalida) return;
    onSave({
      id: `proc-${Date.now()}`, insumoId, mes: mes.trim(), data: data.trim() || mes.trim(), responsavel: responsavel.trim(),
      pesoBrutoRecebido: bruto, valorPagoKg: parseFloat(valorPagoKg),
      pesoLiquidoResultante: liquido, pesoAparasReaproveitaveis: aparas,
      fornecedor: fornecedor.trim() || '—', observacao: observacao.trim(),
    });
  };

  return (
    <div className="px-5 py-4">
      <div className="grid grid-cols-6 gap-2 mb-2">
        <select value={insumoId} onChange={(e) => setInsumoId(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md col-span-2" style={inputStyle}>
          {insumos.map((i) => <option key={i.id} value={i.id}>{i.nome}</option>)}
        </select>
        <input placeholder="Mês (ex: Out)" value={mes} onChange={(e) => setMes(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
        <input placeholder="Data (ex: 12/10)" value={data} onChange={(e) => setData(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
        <input placeholder="Responsável pelo corte" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md col-span-2" style={inputStyle} />
      </div>
      <div className="grid grid-cols-4 gap-2 mb-2">
        <input placeholder="Peso bruto recebido (kg)" type="number" value={pesoBrutoRecebido} onChange={(e) => setPesoBrutoRecebido(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
        <input placeholder="Valor pago/kg (R$)" type="number" value={valorPagoKg} onChange={(e) => setValorPagoKg(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
        <input placeholder="Peso líquido usável (kg)" type="number" value={pesoLiquidoResultante} onChange={(e) => setPesoLiquidoResultante(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
        <input placeholder="Aparas reaproveitáveis (kg)" type="number" value={pesoAparasReaproveitaveis} onChange={(e) => setPesoAparasReaproveitaveis(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={inputStyle} />
      </div>
      <div className="flex items-center gap-3 mb-2">
        <input placeholder="Fornecedor (opcional)" value={fornecedor} onChange={(e) => setFornecedor(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md flex-1" style={inputStyle} />
        {fcPreview && <div className="text-[12.5px]" style={{ color: C.sub }}>FC do lote: <b style={{ ...nums, color: C.text }}>{fcPreview.toFixed(3)}</b></div>}
        {descartePuro !== null && <div className="text-[12.5px]" style={{ color: reconciliacaoInvalida ? C.danger : C.sub }}>Descarte puro: <b style={{ ...nums, color: reconciliacaoInvalida ? C.danger : C.text }}>{descartePuro.toFixed(2)}kg</b></div>}
      </div>
      {reconciliacaoInvalida && (
        <div className="text-[12px] mb-2" style={{ color: C.danger }}>Peso líquido + aparas passa do peso bruto recebido, confere os números antes de salvar.</div>
      )}
      <input placeholder="Observação (ex: peixe chegou machucado, corte impreciso, produto vencendo)" value={observacao} onChange={(e) => setObservacao(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md w-full mb-3" style={inputStyle} />
      <div className="flex gap-2">
        <button onClick={salvar} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ background: C.text, color: '#fff' }}>Salvar lote</button>
        <button onClick={onCancel} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ border: `1px solid ${C.borderStrong}` }}>Cancelar</button>
      </div>
    </div>
  );
}

const pratosBase = [
  { id: 1, nome: 'Pizza Muçarela', categoria: 'Principal', precoVenda: 45, vendasMes: 180, pesoPorcaoG: 420, formaFisica: 'solido', embalagem: ['emb-caixa-pizza', 'emb-sacola'], ficha: [
    { subReceitaId: 'massa-pizza', pesoLiquido: 1, unidade: 'un' },
    { subReceitaId: 'molho-tomate', pesoLiquido: 0.15, unidade: 'kg' },
    { insumoId: 'mucarela', pesoLiquido: 0.2 },
  ]},
  { id: 2, nome: 'Parmegiana de Frango', categoria: 'Principal', precoVenda: 52, vendasMes: 150, pesoPorcaoG: 480, formaFisica: 'solido', embalagem: ['emb-marmita-750', 'emb-sacola', 'emb-talher'], ficha: [
    { insumoId: 'frango', pesoLiquido: 0.22 },
    { subReceitaId: 'molho-tomate', pesoLiquido: 0.12, unidade: 'kg' },
    { insumoId: 'mucarela', pesoLiquido: 0.08 },
    { insumoId: 'farinha', pesoLiquido: 0.05 },
    { insumoId: 'oleo', pesoLiquido: 0.15 },
  ]},
  { id: 3, nome: 'Lasanha Bolonhesa', categoria: 'Principal', precoVenda: 48, vendasMes: 200, pesoPorcaoG: 450, formaFisica: 'solido', embalagem: ['emb-marmita-750', 'emb-sacola', 'emb-talher'], ficha: [
    { insumoId: 'massa-lasanha', pesoLiquido: 0.15 },
    { insumoId: 'carne-moida', pesoLiquido: 0.22 },
    { subReceitaId: 'molho-tomate', pesoLiquido: 0.15, unidade: 'kg' },
    { insumoId: 'mucarela', pesoLiquido: 0.1 },
    { insumoId: 'parmesao', pesoLiquido: 0.08 },
  ]},
  { id: 4, nome: 'Salmão Grelhado', categoria: 'Principal', precoVenda: 68, vendasMes: 40, pesoPorcaoG: 300, formaFisica: 'solido', embalagem: ['emb-marmita-750', 'emb-sacola', 'emb-talher'], ficha: [
    { insumoId: 'salmao', pesoLiquido: 0.22 },
    { insumoId: 'azeite', pesoLiquido: 0.02 },
    { insumoId: 'limao', pesoLiquido: 0.05 },
    { insumoId: 'alface', pesoLiquido: 0.05 },
  ]},
  { id: 5, nome: 'Salada Caesar', categoria: 'Entrada', precoVenda: 19, vendasMes: 35, pesoPorcaoG: 220, formaFisica: 'solido', embalagem: ['emb-pote-500', 'emb-sacola', 'emb-talher'], ficha: [
    { insumoId: 'alface', pesoLiquido: 0.15 },
    { insumoId: 'frango', pesoLiquido: 0.1 },
    { insumoId: 'crouton', pesoLiquido: 0.04 },
    { insumoId: 'parmesao', pesoLiquido: 0.03 },
    { insumoId: 'molho-caesar', pesoLiquido: 0.06 },
  ]},
];

const canais = [
  { id: 'balcao', nome: 'Balcão (salão)', comissao: 0, embala: false },
  { id: 'viagem', nome: 'Viagem / retirada', comissao: 0, embala: true },
  { id: 'ifood-basico', nome: 'iFood · Básico', comissao: 0.152, embala: true },
  { id: 'ifood-entrega', nome: 'iFood · Entrega', comissao: 0.265, embala: true },
  { id: '99food', nome: '99Food', comissao: 0.152, embala: true },
];

// Estoque: só os insumos que já têm movimentação lançada aparecem aqui.
// Os demais mostram "—" na coluna de estoque, isso é intencional — nem todo
// insumo tem rastreio ativo desde o primeiro dia.
const estoqueBase = {
  'mucarela': { atual: 4.2, minimo: 8, fatorQuebra: 1.08 },
  'salmao': { atual: 1.8, minimo: 2, fatorQuebra: 1.12 },
  'frango': { atual: 6.5, minimo: 5, fatorQuebra: 1.0 },
  'farinha': { atual: 9, minimo: 5, fatorQuebra: 1.0 },
  'tomate-pelado': { atual: 12, minimo: 10, fatorQuebra: 1.05 },
};

const movimentacoesRecentes = [
  { insumoId: 'salmao', tipo: 'entrada', quantidade: 3, origem: 'Compra fornecedor', data: '08/09' },
  { insumoId: 'mucarela', tipo: 'ajuste', quantidade: 0.6, origem: 'Perda registrada (queijo vencido)', data: '09/09' },
  { insumoId: 'salmao', tipo: 'saida_venda', quantidade: 1.2, origem: 'Consumo estimado da semana', data: '10/09' },
  { insumoId: 'mucarela', tipo: 'saida_venda', quantidade: 2.3, origem: 'Consumo estimado da semana', data: '10/09' },
];

const locaisArmazenamentoBase = [
  { id: 'freezer-1', nome: 'Freezer 1 (proteínas)', min: -18, max: -12 },
  { id: 'camara-fria', nome: 'Câmara fria', min: 0, max: 4 },
  { id: 'estoque-seco', nome: 'Estoque seco', min: 10, max: 25 },
];

// Lotes produzidos: o que a cozinha efetivamente produziu, de preparo base ou
// de prato final. Quantidade é em porções (prato) ou na unidade de rendimento
// do preparo (kg de molho, un de massa).
const producoesBase = [
  { id: 'prod-1', lote: 'MT-0909-01', tipo: 'preparo', refId: 'molho-tomate', quantidade: 5, responsavel: 'Renata', turno: 'manha', chefeTurno: 'Marcos', data: '09/09', validade: '16/09', status: 'produzido' },
  { id: 'prod-2', lote: 'MP-0909-01', tipo: 'preparo', refId: 'massa-pizza', quantidade: 30, responsavel: 'Marcos', turno: 'manha', chefeTurno: 'Marcos', data: '09/09', validade: '12/09', status: 'produzido' },
  { id: 'prod-3', lote: 'LB-1009-01', tipo: 'prato', refId: 3, quantidade: 12, responsavel: 'Thiago', turno: 'tarde', chefeTurno: 'Renata', data: '10/09', validade: '13/09', status: 'produzido' },
  { id: 'prod-4', lote: 'MT-1009-01', tipo: 'preparo', refId: 'molho-tomate', quantidade: 5, responsavel: 'Renata', turno: 'noite', chefeTurno: 'Renata', data: '10/09', validade: '17/09', status: 'em_producao' },
  { id: 'prod-5', lote: 'PF-1009-01', tipo: 'prato', refId: 2, quantidade: 8, responsavel: 'Renata', turno: 'noite', chefeTurno: 'Renata', data: '10/09', validade: '12/09', status: 'em_producao' },
  { id: 'prod-6', lote: 'MT-0509-02', tipo: 'preparo', refId: 'molho-tomate', quantidade: 5, responsavel: 'Thiago', turno: 'noite', chefeTurno: 'Thiago', data: '05/09', validade: '12/09', status: 'perda', motivoPerda: 'Esqueceu fora da câmara a noite toda' },
];

// Fornecedores: contato preso ao sistema, não à cabeça do gerente. Se quem faz
// compra sai, o próximo assume sem perder telefone, prazo nem janela de pedido.
const fornecedoresBase = [
  { id: 'forn-1', empresa: 'Peixaria Central', contato: 'Sr. Almir', telefone: '(51) 99812-4400', email: 'pedidos@peixariacentral.com.br', fornece: 'Salmão, tilápia, camarão', diasEntrega: 'Ter e Sex', horarioEntrega: '06h às 09h', prazoUrgencia: 'Pedido até 16h do dia anterior' },
  { id: 'forn-2', empresa: 'Avícola Sul', contato: 'Daniela', telefone: '(51) 99745-1180', email: 'comercial@avicolasul.com.br', fornece: 'Filé de frango, coxa, sobrecoxa', diasEntrega: 'Seg, Qua e Sex', horarioEntrega: '07h às 11h', prazoUrgencia: 'Pedido até 14h, entrega no mesmo dia' },
  { id: 'forn-3', empresa: 'Laticínios Serrano', contato: 'Paulo Renato', telefone: '(54) 99630-2277', email: 'vendas@serrano.com.br', fornece: 'Muçarela, parmesão, requeijão', diasEntrega: 'Qui', horarioEntrega: '08h às 12h', prazoUrgencia: 'Não atende urgência, só na rota semanal' },
  { id: 'forn-4', empresa: 'Hortifruti Zona Sul', contato: 'Marlene', telefone: '(51) 99201-8834', email: 'marlene@hortifrutizs.com.br', fornece: 'Alface, tomate, cebola, alho, ervas', diasEntrega: 'Seg a Sáb', horarioEntrega: '05h às 08h', prazoUrgencia: 'Pedido até 20h do dia anterior' },
];

// Checklists: modelo por estabelecimento, editável pelo chef. O sistema entrega
// um padrão de partida, mas cada casa monta o seu — é isso que faz virar
// padronizador de processo em vez de formulário genérico que ninguém usa.
const checklistsBase = [
  {
    id: 'chk-abertura', nome: 'Abertura de turno', momento: 'abertura',
    itens: [
      { id: 'a1', texto: 'Conferir temperatura de câmara fria e freezer' },
      { id: 'a2', texto: 'Checar validade dos preparos em uso' },
      { id: 'a3', texto: 'Ligar equipamentos (forno, fritadeira, banho-maria)' },
      { id: 'a4', texto: 'Conferir estoque de embalagem pra delivery' },
      { id: 'a5', texto: 'Verificar mise en place das praças' },
    ],
  },
  {
    id: 'chk-praca-quente', nome: 'Montagem praça quente', momento: 'praca',
    itens: [
      { id: 'q1', texto: 'Molhos em banho-maria na temperatura' },
      { id: 'q2', texto: 'Proteínas porcionadas e etiquetadas' },
      { id: 'q3', texto: 'Guarnições prontas e cobertas' },
      { id: 'q4', texto: 'Óleo da fritadeira filtrado e no nível' },
    ],
  },
  {
    id: 'chk-praca-fria', nome: 'Montagem praça fria', momento: 'praca',
    itens: [
      { id: 'f1', texto: 'Folhas higienizadas e secas' },
      { id: 'f2', texto: 'Molhos frios em pote fechado e etiquetado' },
      { id: 'f3', texto: 'Queijos e frios porcionados' },
    ],
  },
  {
    id: 'chk-etiquetagem', nome: 'Etiquetagem', momento: 'processo',
    itens: [
      { id: 'e1', texto: 'Todo preparo com data de manipulação' },
      { id: 'e2', texto: 'Todo preparo com data de validade' },
      { id: 'e3', texto: 'Nome do responsável na etiqueta' },
      { id: 'e4', texto: 'Produto aberto do fornecedor reetiquetado' },
    ],
  },
  {
    id: 'chk-fechamento', nome: 'Fechamento de turno', momento: 'fechamento',
    itens: [
      { id: 'z1', texto: 'Registrar perdas do turno no sistema' },
      { id: 'z2', texto: 'Guardar todos os preparos etiquetados' },
      { id: 'z3', texto: 'Limpeza de bancadas, fogão e coifa' },
      { id: 'z4', texto: 'Lixo retirado e lixeiras higienizadas' },
      { id: 'z5', texto: 'Desligar equipamentos e conferir gás' },
      { id: 'z6', texto: 'Registrar temperatura de fechamento' },
    ],
  },
];

const MOMENTOS = { abertura: 'Abertura', praca: 'Praça', processo: 'Processo', fechamento: 'Fechamento' };

// Histórico mensal fechado. Num sistema real isso é agregado do próprio banco no
// fechamento de cada mês; aqui é mock pra mostrar a leitura de tendência.
// Faturamento e custo em reais, cmv e margem em % do faturamento.
const historicoMensal = [
  { mes: 'Jan', faturamento: 24800, custoIngredientes: 6572, perdas: 380, cmvPct: 26.5, margemPct: 73.5 },
  { mes: 'Fev', faturamento: 23100, custoIngredientes: 6260, perdas: 440, cmvPct: 27.1, margemPct: 72.9 },
  { mes: 'Mar', faturamento: 26900, custoIngredientes: 7102, perdas: 310, cmvPct: 26.4, margemPct: 73.6 },
  { mes: 'Abr', faturamento: 26200, custoIngredientes: 7153, perdas: 520, cmvPct: 27.3, margemPct: 72.7 },
  { mes: 'Mai', faturamento: 28400, custoIngredientes: 8009, perdas: 690, cmvPct: 28.2, margemPct: 71.8 },
  { mes: 'Jun', faturamento: 27900, custoIngredientes: 8203, perdas: 810, cmvPct: 29.4, margemPct: 70.6 },
  { mes: 'Jul', faturamento: 30200, custoIngredientes: 8456, perdas: 620, cmvPct: 28.0, margemPct: 72.0 },
  { mes: 'Ago', faturamento: 29100, custoIngredientes: 8759, perdas: 870, cmvPct: 30.1, margemPct: 69.9 },
  { mes: 'Set', faturamento: 28885, custoIngredientes: 8520, perdas: 640, cmvPct: 29.5, margemPct: 70.5 },
];

// Fechamento de CMV do período. No setor, CMV real não é a soma das fichas: é
// (estoque inicial + compras - estoque final) / faturamento. A soma das fichas é
// o CMV teórico. A diferença entre os dois é quebra, desvio ou porção fora do
// padrão — e é esse gap que o sistema existe pra revelar.
const fechamentoCmvBase = {
  estoqueInicial: 6800,
  compras: 9200,
  estoqueFinal: 7480,
};

const TURNOS = [
  { id: 'manha', label: 'Manhã', horario: '06h-14h' },
  { id: 'tarde', label: 'Tarde', horario: '14h-18h' },
  { id: 'noite', label: 'Noite', horario: '18h-00h' },
];

const registrosTemperaturaBase = [
  { id: 'temp-1', localId: 'freezer-1', temperatura: -15, responsavel: 'Marcos', data: '10/09 08:15' },
  { id: 'temp-2', localId: 'camara-fria', temperatura: 3, responsavel: 'Thiago', data: '10/09 08:20' },
  { id: 'temp-3', localId: 'estoque-seco', temperatura: 22, responsavel: 'Thiago', data: '10/09 08:22' },
  { id: 'temp-4', localId: 'camara-fria', temperatura: 7, responsavel: 'Renata', data: '09/09 18:40' },
  { id: 'temp-5', localId: 'freezer-1', temperatura: -14, responsavel: 'Marcos', data: '09/09 08:10' },
];

const MARGEM_ALVO = 0.65;

// Manipulação de proteína: cada lote processado (peixe, gado, frango) vira um
// registro com peso bruto recebido, valor pago naquele lote e peso líquido
// depois de limpar. O FC observado (peso bruto / peso líquido) é medido, não
// estimado, e a média recente substitui o FC cadastrado no insumo quando existe
// histórico — é isso que torna o CMV preciso de verdade, não só uma referência
// de tabela genérica. O registro também serve de auditoria: quem processou,
// quanto virou aparas reaproveitáveis e quanto foi descarte puro, pra separar
// perda normal de técnica de corte de perda evitável.
const processamentosBase = [
  { id: 'proc-1', insumoId: 'salmao', mes: 'Jun', data: '05/06', responsavel: 'Marcos', pesoBrutoRecebido: 4.0, valorPagoKg: 65, pesoLiquidoResultante: 3.35, pesoAparasReaproveitaveis: 0.45, fornecedor: 'Peixaria Central', observacao: '' },
  { id: 'proc-2', insumoId: 'salmao', mes: 'Jul', data: '03/07', responsavel: 'Marcos', pesoBrutoRecebido: 4.2, valorPagoKg: 68, pesoLiquidoResultante: 3.5, pesoAparasReaproveitaveis: 0.48, fornecedor: 'Peixaria Central', observacao: '' },
  { id: 'proc-3', insumoId: 'salmao', mes: 'Ago', data: '12/08', responsavel: 'Renata', pesoBrutoRecebido: 3.8, valorPagoKg: 70, pesoLiquidoResultante: 3.05, pesoAparasReaproveitaveis: 0.40, fornecedor: 'Peixaria Central', observacao: 'Peixe chegou com parte machucada, descartada lateral inteira' },
  { id: 'proc-4', insumoId: 'salmao', mes: 'Set', data: '08/09', responsavel: 'Marcos', pesoBrutoRecebido: 5.0, valorPagoKg: 68, pesoLiquidoResultante: 4.05, pesoAparasReaproveitaveis: 0.55, fornecedor: 'Peixaria Central', observacao: '' },
  { id: 'proc-5', insumoId: 'frango', mes: 'Jul', data: '10/07', responsavel: 'Thiago', pesoBrutoRecebido: 10.0, valorPagoKg: 21, pesoLiquidoResultante: 9.1, pesoAparasReaproveitaveis: 0.70, fornecedor: 'Avícola Sul', observacao: '' },
  { id: 'proc-6', insumoId: 'frango', mes: 'Ago', data: '14/08', responsavel: 'Thiago', pesoBrutoRecebido: 8.5, valorPagoKg: 22.5, pesoLiquidoResultante: 7.6, pesoAparasReaproveitaveis: 0.65, fornecedor: 'Avícola Sul', observacao: '' },
  { id: 'proc-7', insumoId: 'frango', mes: 'Set', data: '09/09', responsavel: 'Renata', pesoBrutoRecebido: 9.0, valorPagoKg: 22, pesoLiquidoResultante: 8.05, pesoAparasReaproveitaveis: 0.68, fornecedor: 'Avícola Sul', observacao: '' },
];

function classificar(margemPct, vendasMes, medianaVendas) {
  const altaMargem = margemPct / 100 >= MARGEM_ALVO;
  const altaVenda = vendasMes >= medianaVendas;
  if (altaMargem && altaVenda) return { label: 'Manter', acao: false };
  if (!altaMargem && altaVenda) return { label: 'Ajustar preço', acao: true };
  if (altaMargem && !altaVenda) return { label: 'Divulgar mais', acao: false };
  return { label: 'Repensar', acao: true };
}

function Card({ children, className = '', style = {} }) {
  return (
    <div className={`ftv-panel rounded-xl ${className}`} style={{ backgroundColor: C.panel, border: `1px solid ${C.border}`, boxShadow: shadow, ...style }}>
      {children}
    </div>
  );
}

function Badge({ children, acao }) {
  return (
    <span
      className="text-[11px] font-medium px-2 py-0.5 rounded-md inline-flex items-center gap-1"
      style={{ color: acao ? C.danger : C.sub, background: acao ? C.dangerSoft : C.bg }}
    >
      {children}
    </span>
  );
}

function Kpi({ label, value, alerta, sub }) {
  return (
    <Card className="p-5">
      <div className="text-[13px]" style={{ color: C.sub }}>{label}</div>
      <div className="text-[30px] font-bold mt-1.5 leading-none" style={{ ...nums, color: alerta ? C.danger : C.text, letterSpacing: '-0.02em' }}>{value}</div>
      {sub && <div className="text-[12px] mt-2" style={{ color: C.faint }}>{sub}</div>}
    </Card>
  );
}

export default function FichaTecnicaMVP() {
  const [tab, setTab] = useState('visao-geral');
  const [expandido, setExpandido] = useState(1);
  const [preparoAberto, setPreparoAberto] = useState(null);
  const [canalCalc, setCanalCalc] = useState({});
  const [pdfMsg, setPdfMsg] = useState('');
  const [insumos, setInsumos] = useState(insumosBase);
  const [preparos, setPreparos] = useState(preparosBase);
  const [showNovoInsumo, setShowNovoInsumo] = useState(false);
  const [showNovoPreparo, setShowNovoPreparo] = useState(false);
  const [perguntaAtiva, setPerguntaAtiva] = useState(null);
  const [processamentos, setProcessamentos] = useState(processamentosBase);
  const [showNovoProcessamento, setShowNovoProcessamento] = useState(false);
  const [proteinaSelecionada, setProteinaSelecionada] = useState('salmao');
  const [registrosTemperatura, setRegistrosTemperatura] = useState(registrosTemperaturaBase);
  const [showNovaTemperatura, setShowNovaTemperatura] = useState(false);
  const [pratoNutricaoSelecionado, setPratoNutricaoSelecionado] = useState(1);
  const [destinoVenda, setDestinoVenda] = useState({});
  const [producoes, setProducoes] = useState(producoesBase);
  const [showNovaProducao, setShowNovaProducao] = useState(false);
  const [loteArrastando, setLoteArrastando] = useState(null); // { colunaOrigem, item }
  const [colunaAlvo, setColunaAlvo] = useState(null);
  const [estoque, setEstoque] = useState(estoqueBase);
  const [buscaInsumo, setBuscaInsumo] = useState('');
  const [showNovoEstoque, setShowNovoEstoque] = useState(false);
  const [fornecedores, setFornecedores] = useState(fornecedoresBase);
  const [showNovoFornecedor, setShowNovoFornecedor] = useState(false);
  const [turnoAtivo, setTurnoAtivo] = useState('noite');
  const [chefeTurno, setChefeTurno] = useState('Renata');
  const [checklists, setChecklists] = useState(checklistsBase);
  const [execucoes, setExecucoes] = useState({}); // { 'chk-id': { 'item-id': true } }
  const [editandoChecklist, setEditandoChecklist] = useState(null);
  const [novoItemTexto, setNovoItemTexto] = useState('');
  const [showNovoChecklist, setShowNovoChecklist] = useState(false);
  const [novoChecklistNome, setNovoChecklistNome] = useState('');
  const [novoChecklistMomento, setNovoChecklistMomento] = useState('abertura');
  // Override de valor nutricional: quando o restaurante tem laudo laboratorial,
  // o número do laudo vale mais que o cálculo por composição de ingrediente.
  const [nutriOverride, setNutriOverride] = useState({});
  const [editandoNutri, setEditandoNutri] = useState(false);
  const [rascunhoNutri, setRascunhoNutri] = useState({});
  // Dados de rotulagem: opcionais, só fazem falta pra quem vende em varejo.
  const [rotulagem, setRotulagem] = useState({});
  const [rotulagemAberta, setRotulagemAberta] = useState(null);
  // Vendas por prato: no produto real vem de importação (CSV do iFood ou do PDV).
  // Enquanto não importa, cai no número informado manualmente na receita.
  const [vendasImportadas, setVendasImportadas] = useState(null);
  const [textoImportacao, setTextoImportacao] = useState('');
  const [erroImportacao, setErroImportacao] = useState('');
  const [fechamentoCmv, setFechamentoCmv] = useState(fechamentoCmvBase);

  const toggleItem = (chkId, itemId) => {
    const atual = execucoes[chkId] || {};
    setExecucoes({ ...execucoes, [chkId]: { ...atual, [itemId]: !atual[itemId] } });
  };
  const addItemChecklist = (chkId) => {
    if (!novoItemTexto.trim()) return;
    setChecklists(checklists.map((ch) => ch.id === chkId
      ? { ...ch, itens: [...ch.itens, { id: `item-${Date.now()}`, texto: novoItemTexto.trim() }] }
      : ch));
    setNovoItemTexto('');
  };
  const removerItemChecklist = (chkId, itemId) => {
    setChecklists(checklists.map((ch) => ch.id === chkId ? { ...ch, itens: ch.itens.filter((i) => i.id !== itemId) } : ch));
  };
  const criarChecklist = () => {
    if (!novoChecklistNome.trim()) return;
    const id = `chk-${Date.now()}`;
    setChecklists([...checklists, { id, nome: novoChecklistNome.trim(), momento: novoChecklistMomento, itens: [] }]);
    setNovoChecklistNome('');
    setShowNovoChecklist(false);
    setEditandoChecklist(id);
  };

  const insumoById = useMemo(() => Object.fromEntries(insumos.map((i) => [i.id, i])), [insumos]);
  const preparoById = useMemo(() => Object.fromEntries(preparos.map((p) => [p.id, p])), [preparos]);
  const fcEfetivoById = useMemo(() => {
    const porInsumo = {};
    processamentos.forEach((p) => {
      const fcLote = p.pesoBrutoRecebido / p.pesoLiquidoResultante;
      (porInsumo[p.insumoId] = porInsumo[p.insumoId] || []).push(fcLote);
    });
    return Object.fromEntries(Object.entries(porInsumo).map(([id, lista]) => [id, lista.reduce((s, v) => s + v, 0) / lista.length]));
  }, [processamentos]);

  const pratos = useMemo(() => {
    const comCmv = pratosBase.map((p) => {
      const linhas = p.ficha.map((f) => ({ ...f, ...resolverLinha(f, insumoById, preparoById, fcEfetivoById) }));
      const cmv = linhas.reduce((s, l) => s + l.custo, 0);
      const margemPct = ((p.precoVenda - cmv) / p.precoVenda) * 100;
      const cmvPct = (cmv / p.precoVenda) * 100;
      const { total: nutriTotal, completo: nutriCompleta } = somaNutrientes(linhas, (l) =>
        l.tipo === 'insumo' ? (nutricaoInsumoBase[l.insumoId] || null) : nutricaoPorUnidadePreparo(l.preparo, insumoById)
      );
      const nutricaoPorcao = Object.fromEntries(NUTRI_CAMPOS.map((c) => [c, nutriTotal[c] / p.rendimento]));
      // Por 100g do alimento: base que a norma usa pro limiar do selo frontal e
      // pra coluna obrigatória da tabela. Não é o mesmo que por porção.
      const linhasEmbalagem = (p.embalagem || []).map((id) => {
        const emb = insumoById[id];
        return emb ? { insumoId: id, nome: emb.nome, custo: precoUnitario(emb) } : null;
      }).filter(Boolean);
      const custoEmbalagem = linhasEmbalagem.reduce((s, l) => s + l.custo, 0);
      const nutricaoPor100 = p.pesoPorcaoG
        ? Object.fromEntries(NUTRI_CAMPOS.map((c) => [c, (nutriTotal[c] / p.rendimento) * (100 / p.pesoPorcaoG)]))
        : null;
      return { ...p, linhas, cmv, margemPct, cmvPct, nutricaoPorcao, nutricaoPor100, nutriCompleta, linhasEmbalagem, custoEmbalagem };
    });
    const medianaVendas = [...comCmv.map((p) => p.vendasMes)].sort((a, b) => a - b)[Math.floor(comCmv.length / 2)];
    return comCmv.map((p) => ({ ...p, classe: classificar(p.margemPct, p.vendasMes, medianaVendas) }));
  }, [insumoById, preparoById, fcEfetivoById]);

  const cmvMedio = pratos.reduce((s, p) => s + p.cmvPct, 0) / pratos.length;
  const margemMedia = pratos.reduce((s, p) => s + p.margemPct, 0) / pratos.length;
  const abaixoAlvo = pratos.filter((p) => p.margemPct / 100 < MARGEM_ALVO).length;
  const perdaIfoodMes = pratos.reduce((s, p) => s + Math.round(p.vendasMes * 0.35) * p.precoVenda * 0.152, 0);
  const medianaVendas = [...pratos.map((p) => p.vendasMes)].sort((a, b) => a - b)[Math.floor(pratos.length / 2)];
  const yMin = Math.floor(Math.min(...pratos.map((p) => p.margemPct)) / 5) * 5 - 5;
  const yMax = Math.ceil(Math.max(...pratos.map((p) => p.margemPct)) / 5) * 5 + 5;
  const xMax = Math.ceil((Math.max(...pratos.map((p) => p.vendasMes)) * 1.15) / 10) * 10;

  const analiseEstoque = useMemo(() => {
    return Object.entries(estoque).map(([insumoId, est]) => {
      const insumo = insumoById[insumoId];
      const consumoTeoricoKg = pratos.reduce((s, p) => {
        const linha = p.linhas.find((l) => l.insumoId === insumoId);
        return s + (linha ? linha.pesoBruto * p.vendasMes : 0);
      }, 0);
      const consumoRealKg = consumoTeoricoKg * est.fatorQuebra;
      const custoTeorico = consumoTeoricoKg * precoUnitario(insumo);
      const custoReal = consumoRealKg * precoUnitario(insumo);
      return { insumoId, nome: insumo.nome, ...est, consumoTeoricoKg, consumoRealKg, custoTeorico, custoReal, quebraReais: custoReal - custoTeorico };
    });
  }, [pratos, insumoById]);
  const quebraTotalMes = analiseEstoque.reduce((s, a) => s + a.quebraReais, 0);

  // Quantas porções ainda dá pra produzir com o estoque atual. O limite é sempre
  // o insumo mais escasso da ficha: adianta ter 9kg de farinha se falta muçarela.
  // Insumo sem rastreio de estoque é ignorado no cálculo, não conta como zero,
  // senão a capacidade apareceria como 0 pra quase todo prato.
  const capacidadeProducao = useMemo(() => pratos.map((p) => {
    const gargalos = p.linhas
      .filter((l) => l.tipo === 'insumo' && estoque[l.insumoId])
      .map((l) => ({
        insumoId: l.insumoId,
        nome: l.nome,
        porcoesPossiveis: Math.floor(estoque[l.insumoId].atual / l.pesoBruto),
      }))
      .sort((a, b) => a.porcoesPossiveis - b.porcoesPossiveis);
    const semRastreio = p.linhas.filter((l) => l.tipo === 'insumo' && !estoque[l.insumoId]).length;
    return {
      ...p,
      maxPorcoes: gargalos.length ? gargalos[0].porcoesPossiveis : null,
      gargalo: gargalos[0] || null,
      semRastreio,
    };
  }), [pratos]);

  // Quantos lotes inteiros de cada preparo base dá pra fazer com o estoque atual.
  // Mesma lógica de gargalo dos pratos, mas contando lote inteiro, não porção.
  const capacidadePreparos = useMemo(() => preparos.map((prep) => {
    const gargalos = prep.ficha
      .filter((f) => estoque[f.insumoId])
      .map((f) => {
        const insumo = insumoById[f.insumoId];
        const pesoBruto = f.pesoLiquido * fcDoInsumo(insumo, fcEfetivoById);
        return { nome: insumo.nome, lotesPossiveis: Math.floor(estoque[f.insumoId].atual / pesoBruto) };
      })
      .sort((a, b) => a.lotesPossiveis - b.lotesPossiveis);
    return {
      id: prep.id,
      nome: prep.nome,
      tipo: 'preparo',
      rendimento: `${prep.rendimento}${prep.unidadeRendimento} por lote`,
      lotes: gargalos.length ? gargalos[0].lotesPossiveis : null,
      gargalo: gargalos[0]?.nome || null,
    };
  }), [preparos, estoque, insumoById, fcEfetivoById]);

  const disponivelProduzir = [
    ...capacidadePreparos,
    ...capacidadeProducao.map((p) => ({
      id: p.id, nome: p.nome, tipo: 'prato',
      rendimento: `${p.rendimento} porç${p.rendimento > 1 ? 'ões' : 'ão'} por receita`,
      lotes: p.maxPorcoes !== null ? Math.floor(p.maxPorcoes / p.rendimento) : null,
      gargalo: p.gargalo?.nome || null,
    })),
  ];

  const producoesEnriquecidas = producoes.map((pr) => {
    if (pr.tipo === 'preparo') {
      const prep = preparoById[pr.refId];
      return { ...pr, nome: prep?.nome, unidade: prep?.unidadeRendimento, rendimentoLote: prep?.rendimento };
    }
    const prato = pratos.find((p) => p.id === pr.refId);
    return { ...pr, nome: prato?.nome, unidade: 'porções', rendimentoLote: prato?.rendimento };
  });

  // Movimentação do kanban: iniciar produção cria o lote já em produção; concluir
  // e marcar perda só trocam o status. Motivo da perda é obrigatório, senão o
  // registro não serve de nada depois na hora de investigar o que aconteceu.
  const iniciarProducao = (item) => {
    const agora = new Date();
    const dd = String(agora.getDate()).padStart(2, '0');
    const mm = String(agora.getMonth() + 1).padStart(2, '0');
    const sigla = item.nome.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    const seq = String(producoes.filter((p) => p.refId === item.id).length + 1).padStart(2, '0');
    const base = item.tipo === 'preparo' ? preparoById[item.id] : pratos.find((p) => p.id === item.id);
    setProducoes([{
      id: `prod-${Date.now()}`,
      lote: `${sigla}-${dd}${mm}-${seq}`,
      tipo: item.tipo,
      refId: item.id,
      quantidade: base?.rendimento || 1,
      responsavel: 'A definir',
      turno: turnoAtivo,
      chefeTurno,
      data: `${dd}/${mm}`,
      validade: '',
      status: 'em_producao',
    }, ...producoes]);
  };

  const moverLote = (id, novoStatus, motivo) => {
    setProducoes(producoes.map((p) => (p.id === id ? { ...p, status: novoStatus, ...(motivo ? { motivoPerda: motivo } : {}) } : p)));
  };

  // Arrastar no quadro segue as mesmas regras dos botões: "estoque" nunca é um
  // status real (é capacidade calculada), então só se sai dele arrastando pra
  // "em_producao". Perda sempre pede motivo, arrastando ou clicando, senão o
  // registro não serve pra investigar nada depois.
  const transicaoValida = (origem, destino) => {
    if (origem === destino) return false;
    if (origem === 'estoque') return destino === 'em_producao';
    if (origem === 'em_producao') return destino === 'produzido' || destino === 'perda';
    if (origem === 'produzido') return destino === 'perda';
    return false;
  };

  const soltarNaColuna = (destino) => {
    if (!loteArrastando) return;
    const { colunaOrigem, item } = loteArrastando;
    if (!transicaoValida(colunaOrigem, destino)) return;

    if (colunaOrigem === 'estoque' && destino === 'em_producao') {
      iniciarProducao(item);
    } else if (destino === 'perda') {
      const motivo = window.prompt('O que aconteceu com esse lote?');
      if (motivo && motivo.trim()) moverLote(item.id, 'perda', motivo.trim());
    } else {
      moverLote(item.id, destino);
    }
  };

  // ---- agregações dos relatórios ----
  // Tudo aqui sai de dado que já existe nas outras abas. O valor não está em
  // nenhum número isolado, está no cruzamento: perda por turno, rendimento por
  // pessoa, alerta que ninguém tratou.
  const custoLoteProducao = (pr) => {
    if (pr.tipo === 'preparo') {
      const prep = preparoById[pr.refId];
      return prep ? (custoPreparo(prep, insumoById, fcEfetivoById) / prep.rendimento) * pr.quantidade : 0;
    }
    const prato = pratos.find((p) => p.id === pr.refId);
    return prato ? prato.cmv * pr.quantidade : 0;
  };

  const perdasProducao = producoesEnriquecidas.filter((p) => p.status === 'perda');
  const custoPerdasProducao = perdasProducao.reduce((s, p) => s + custoLoteProducao(p), 0);

  const perdasPorTurno = TURNOS.map((t) => {
    const daquele = perdasProducao.filter((p) => p.turno === t.id);
    return { turno: t.label, lotes: daquele.length, custo: daquele.reduce((s, p) => s + custoLoteProducao(p), 0) };
  });

  const responsaveis = [...new Set([
    ...processamentos.map((p) => p.responsavel),
    ...producoes.map((p) => p.chefeTurno).filter(Boolean),
    ...registrosTemperatura.map((r) => r.responsavel),
  ])];

  const desempenhoPorPessoa = responsaveis.map((nome) => {
    const lotesProteina = processamentos.filter((p) => p.responsavel === nome);
    const descarteMedio = lotesProteina.length
      ? lotesProteina.reduce((s, l) => s + ((l.pesoBrutoRecebido - l.pesoLiquidoResultante - (l.pesoAparasReaproveitaveis || 0)) / l.pesoBrutoRecebido), 0) / lotesProteina.length * 100
      : null;
    const perdasTurno = perdasProducao.filter((p) => p.chefeTurno === nome).length;
    const tempForaFaixa = registrosTemperatura.filter((r) => {
      const local = locaisArmazenamentoBase.find((l) => l.id === r.localId);
      return r.responsavel === nome && local && (r.temperatura < local.min || r.temperatura > local.max);
    }).length;
    return { nome, lotesProteina: lotesProteina.length, descarteMedio, perdasTurno, tempForaFaixa };
  }).filter((p) => p.lotesProteina > 0 || p.perdasTurno > 0 || p.tempForaFaixa > 0);

  const alertasAbertos = [
    ...Object.entries(estoque).filter(([id, e]) => e.atual < e.minimo).map(([id, e]) => {
      const insumo = insumoById[id];
      const forn = fornecedores.find((f) => f.fornece && insumo && f.fornece.toLowerCase().includes(insumo.nome.split(' ')[0].toLowerCase()));
      return {
        tipo: 'Estoque',
        texto: `${insumo?.nome} abaixo do mínimo (${e.atual}${insumo?.unidade} de ${e.minimo}${insumo?.unidade})`,
        acao: forn ? `${forn.empresa}: ${forn.prazoUrgencia}` : 'Sem fornecedor vinculado',
      };
    }),
    ...registrosTemperatura.filter((r) => {
      const local = locaisArmazenamentoBase.find((l) => l.id === r.localId);
      return local && (r.temperatura < local.min || r.temperatura > local.max);
    }).map((r) => {
      const local = locaisArmazenamentoBase.find((l) => l.id === r.localId);
      return { tipo: 'Temperatura', texto: `${local?.nome} a ${r.temperatura}°C em ${r.data} (faixa ${local?.min}°C a ${local?.max}°C)`, acao: `Registrado por ${r.responsavel}` };
    }),
    ...Object.entries(fcEfetivoById).filter(([id, fcObs]) => insumoById[id] && fcObs > insumoById[id].fc * 1.02).map(([id, fcObs]) => ({
      tipo: 'Rendimento',
      texto: `${insumoById[id].nome} rende menos que o previsto (FC real ${fcObs.toFixed(3)} contra ${insumoById[id].fc.toFixed(2)} cadastrado)`,
      acao: 'CMV dos pratos que usam esse insumo já foi recalculado com o valor real',
    })),
    ...pratos.filter((p) => p.margemPct / 100 < MARGEM_ALVO).map((p) => ({
      tipo: 'Margem',
      texto: `${p.nome} com margem de ${p.margemPct.toFixed(1)}%, abaixo do alvo de ${(MARGEM_ALVO * 100).toFixed(0)}%`,
      acao: `Preço sugerido: R$ ${(p.cmv / (1 - MARGEM_ALVO)).toFixed(2)} (hoje R$ ${p.precoVenda.toFixed(2)})`,
    })),
  ];

  // Comparação mês corrente contra o anterior. Variação em ponto percentual pra
  // indicador que já é %, e em % pra valor absoluto.
  // ---- fechamento de CMV do período ----
  const vendasDoPrato = (p) => (vendasImportadas && vendasImportadas[p.nome] !== undefined ? vendasImportadas[p.nome] : p.vendasMes);

  const linhasCmv = pratos.map((p) => {
    const qtd = vendasDoPrato(p);
    return {
      ...p,
      qtdVendida: qtd,
      faturamentoPrato: qtd * p.precoVenda,
      custoTeoricoPrato: qtd * p.cmv,
      lucroPrato: qtd * (p.precoVenda - p.cmv),
    };
  }).sort((a, b) => b.faturamentoPrato - a.faturamentoPrato);

  const faturamentoPeriodo = linhasCmv.reduce((s, l) => s + l.faturamentoPrato, 0);
  const custoTeoricoPeriodo = linhasCmv.reduce((s, l) => s + l.custoTeoricoPrato, 0);
  const cmvTeoricoPct = faturamentoPeriodo ? (custoTeoricoPeriodo / faturamentoPeriodo) * 100 : 0;

  const consumoReal = fechamentoCmv.estoqueInicial + fechamentoCmv.compras - fechamentoCmv.estoqueFinal;
  const cmvRealPct = faturamentoPeriodo ? (consumoReal / faturamentoPeriodo) * 100 : 0;
  const gapCmv = cmvRealPct - cmvTeoricoPct;
  const gapReais = consumoReal - custoTeoricoPeriodo;

  const importarVendas = () => {
    const linhas = textoImportacao.split('\n').map((l) => l.trim()).filter(Boolean);
    if (linhas.length === 0) { setErroImportacao('Cole os dados antes de importar.'); return; }
    const mapa = {};
    const naoEncontrados = [];
    linhas.forEach((linha) => {
      const partes = linha.split(/[,;\t]/).map((p) => p.trim());
      if (partes.length < 2) return;
      const nome = partes[0];
      const qtd = parseInt(partes[partes.length - 1].replace(/\D/g, ''), 10);
      if (!nome || isNaN(qtd)) return;
      const match = pratos.find((p) => p.nome.toLowerCase() === nome.toLowerCase());
      if (match) mapa[match.nome] = qtd;
      else naoEncontrados.push(nome);
    });
    if (Object.keys(mapa).length === 0) {
      setErroImportacao('Nenhum prato reconhecido. O nome precisa bater com o cadastrado no sistema.');
      return;
    }
    setVendasImportadas(mapa);
    setErroImportacao(naoEncontrados.length ? `Importado, mas ${naoEncontrados.length} item não bateu com prato cadastrado: ${naoEncontrados.join(', ')}` : '');
    setTextoImportacao('');
  };

  const mesAtual = historicoMensal[historicoMensal.length - 1];
  const mesAnterior = historicoMensal[historicoMensal.length - 2];
  const variacao = (atual, anterior) => ((atual - anterior) / anterior) * 100;
  const comparativos = [
    { label: 'Faturamento', atual: `R$ ${(mesAtual.faturamento / 1000).toFixed(1)}k`, delta: variacao(mesAtual.faturamento, mesAnterior.faturamento), unidade: '%', bomSeSobe: true },
    { label: 'CMV', atual: `${mesAtual.cmvPct.toFixed(1)}%`, delta: mesAtual.cmvPct - mesAnterior.cmvPct, unidade: 'p.p.', bomSeSobe: false },
    { label: 'Margem', atual: `${mesAtual.margemPct.toFixed(1)}%`, delta: mesAtual.margemPct - mesAnterior.margemPct, unidade: 'p.p.', bomSeSobe: true },
    { label: 'Perdas', atual: `R$ ${mesAtual.perdas.toLocaleString('pt-BR')}`, delta: variacao(mesAtual.perdas, mesAnterior.perdas), unidade: '%', bomSeSobe: false },
  ];

  const piorPrato = [...pratos].sort((a, b) => a.margemPct - b.margemPct)[0];
  const melhorPrato = [...pratos].sort((a, b) => b.margemPct - a.margemPct)[0];
  const perguntas = [
    {
      q: 'Qual prato tem a pior margem?',
      r: `${piorPrato.nome}, com ${piorPrato.margemPct.toFixed(1)}% de margem (${(MARGEM_ALVO * 100 - piorPrato.margemPct).toFixed(1)} pontos abaixo do seu alvo de ${(MARGEM_ALVO * 100).toFixed(0)}%). CMV de R$ ${piorPrato.cmv.toFixed(2)} num preço de R$ ${piorPrato.precoVenda.toFixed(2)}.`,
    },
    {
      q: 'Quanto eu perco no iFood se não ajustar o preço?',
      r: `Cerca de R$ ${perdaIfoodMes.toFixed(0)} por mês, considerando os pratos que hoje vendem por lá sem embutir a comissão de 15,2% no preço.`,
    },
    {
      q: 'Quais pratos estão abaixo da margem alvo?',
      r: pratos.filter((p) => p.margemPct / 100 < MARGEM_ALVO).map((p) => `${p.nome} (${p.margemPct.toFixed(1)}%)`).join(', ') || 'Nenhum no momento.',
    },
    {
      q: 'Qual prato vale mais a pena divulgar?',
      r: `${melhorPrato.nome}: ${melhorPrato.margemPct.toFixed(1)}% de margem, mas só ${melhorPrato.vendasMes} vendas/mês. Boa margem com pouco volume é oportunidade de divulgação, não de desconto.`,
    },
  ];

  const nav = [
    { id: 'visao-geral', label: 'Visão Geral', icon: LineChart },
    { id: 'insumos', label: 'Insumos', icon: Carrot },
    { id: 'cmv', label: 'Fechamento de CMV', icon: Calculator },
    { id: 'producoes', label: 'Produções', icon: CookingPot },
    { id: 'checklists', label: 'Checklists de Turno', icon: ListChecks },
    { id: 'estoque', label: 'Estoque', icon: Package },
    { id: 'proteinas', label: 'Manipulação de Proteínas', icon: Scale },
    { id: 'nutricional', label: 'Ficha Nutricional', icon: Apple },
    { id: 'seguranca', label: 'Segurança Alimentar', icon: Thermometer },
    { id: 'receitas', label: 'Receitas & Fichas', icon: ClipboardList },
    { id: 'relatorios', label: 'Relatórios', icon: AlertTriangle },
    { id: 'config', label: 'Configurações', icon: Settings },
  ];

  const gerarPdf = (tipo) => { setPdfMsg(tipo); setTimeout(() => setPdfMsg(''), 2200); };

  return (
    <div className="ftv-root w-full min-h-[800px] flex" style={{ ...font, background: C.bg, color: C.text, colorScheme: 'light' }}>
      <style>{`
        .ftv-root, .ftv-root * { color-scheme: light !important; }
        .ftv-root { background-color: ${C.bg} !important; }
        .ftv-panel { background-color: ${C.panel} !important; }
      `}</style>

      <aside className="w-56 shrink-0 flex flex-col ftv-panel" style={{ backgroundColor: C.panel, borderRight: `1px solid ${C.border}` }}>
        <div className="px-5 h-16 flex items-center gap-2" style={{ borderBottom: `1px solid ${C.border}` }}>
          <ChefHat size={16} style={{ color: C.text }} />
          <span className="text-[14px] font-semibold" style={{ letterSpacing: '-0.01em' }}>Ficha Técnica</span>
        </div>
        <nav className="flex-1 py-3 px-2.5 space-y-0.5">
          {nav.map((n) => {
            const active = tab === n.id;
            const Icon = n.icon;
            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] text-left rounded-md"
                style={{ color: active ? C.text : C.sub, background: active ? C.bg : 'transparent', fontWeight: active ? 600 : 400 }}
              >
                <Icon size={14} strokeWidth={active ? 2.25 : 1.75} />
                {n.label}
              </button>
            );
          })}
        </nav>
        <div className="mx-2.5 mb-3 px-3 py-2.5 text-[12px]" style={{ borderTop: `1px solid ${C.border}` }}>
          <div style={{ color: C.text }}>Restaurante do Eduardo</div>
          <div style={{ color: C.faint }} className="mt-0.5">Trial · 9 dias restantes</div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-auto">
        <div className="h-16 shrink-0 flex items-center px-8" style={{ borderBottom: `1px solid ${C.border}` }}>
          <h1 className="text-[15px] font-semibold" style={{ letterSpacing: '-0.01em' }}>{nav.find((n) => n.id === tab)?.label}</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[11.5px]" style={{ color: C.faint }}>Turno</span>
            <select
              value={turnoAtivo}
              onChange={(e) => setTurnoAtivo(e.target.value)}
              className="text-[12px] px-2 py-1 rounded-md"
              style={{ border: `1px solid ${C.borderStrong}`, background: C.panel }}
            >
              {TURNOS.map((t) => <option key={t.id} value={t.id}>{t.label} ({t.horario})</option>)}
            </select>
            <span className="text-[11.5px]" style={{ color: C.faint }}>chefe</span>
            <input
              value={chefeTurno}
              onChange={(e) => setChefeTurno(e.target.value)}
              className="text-[12px] px-2 py-1 rounded-md w-24"
              style={{ border: `1px solid ${C.borderStrong}`, background: C.panel }}
            />
          </div>
        </div>

        <div className="p-8 flex-1">
          {tab === 'visao-geral' && (
            <div className="max-w-5xl">
              <div className="text-[13px] mb-5" style={{ color: C.sub }}>Margem alvo: <span style={{ ...nums, color: C.text, fontWeight: 600 }}>{(MARGEM_ALVO * 100).toFixed(0)}%</span> · últimos 30 dias</div>

              <div className="grid grid-cols-5 gap-3 mb-6">
                <Kpi label="CMV médio dos pratos" value={`${cmvMedio.toFixed(1)}%`} />
                <Kpi label="Margem média atual" value={`${margemMedia.toFixed(1)}%`} />
                <Kpi label="Pratos abaixo da margem alvo" value={abaixoAlvo} alerta={abaixoAlvo > 0} sub={`de ${pratos.length} cadastrados`} />
                <Kpi label="Comissão não recuperada no iFood" value={`R$ ${perdaIfoodMes.toFixed(0)}`} alerta sub="por mês, se o preço não for ajustado" />
                <Kpi label="Quebra de estoque" value={`R$ ${quebraTotalMes.toFixed(0)}`} alerta={quebraTotalMes > 0} sub="consumo real acima do previsto na ficha" />
              </div>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[14px] font-semibold">Engenharia de Cardápio</h2>
                  <div className="text-[12px]" style={{ color: C.faint }}>vermelho = margem abaixo do alvo</div>
                </div>
                <p className="text-[12px] mb-5" style={{ color: C.sub }}>Margem por prato (eixo vertical) contra volume de vendas (eixo horizontal).</p>
                <ResponsiveContainer width="100%" height={340}>
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 10, left: 0 }}>
                    <rect x={-200} y={-200} width={3000} height={2000} fill={C.panel} />
                    <XAxis type="number" dataKey="vendasMes" name="Vendas/mês" domain={[0, xMax]} tick={{ fontSize: 11, fill: C.faint }} tickLine={false} axisLine={{ stroke: C.border }} label={{ value: 'Vendas por mês', position: 'insideBottom', offset: -5, fontSize: 11, fill: C.faint }} />
                    <YAxis type="number" dataKey="margemPct" name="Margem %" unit="%" domain={[yMin, yMax]} ticks={Array.from({ length: Math.floor((yMax - yMin) / 5) + 1 }, (_, i) => yMin + i * 5)} tick={{ fontSize: 11, fill: C.faint }} tickLine={false} axisLine={{ stroke: C.border }} width={40} />
                    <ZAxis type="number" dataKey="vendasMes" range={[240, 560]} />

                    <ReferenceArea x1={0} x2={xMax} y1={yMin} y2={MARGEM_ALVO * 100} fill={C.danger} fillOpacity={0.035} />
                    <ReferenceLine x={medianaVendas} stroke={C.border} strokeWidth={1} />
                    <ReferenceLine y={MARGEM_ALVO * 100} stroke={C.borderStrong} strokeDasharray="4 4" strokeWidth={1.2} label={{ value: `margem alvo ${(MARGEM_ALVO * 100).toFixed(0)}%`, position: 'right', fontSize: 10, fill: C.sub }} />

                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ payload }) => {
                        if (!payload || !payload.length) return null;
                        const p = payload[0].payload;
                        return (
                          <div className="text-xs p-3 rounded-lg" style={{ background: C.text, color: '#fff', boxShadow: shadow }}>
                            <div className="font-semibold mb-1">{p.nome}</div>
                            <div style={nums}>margem {p.margemPct.toFixed(1)}% · {p.vendasMes} vendas/mês</div>
                            <div className="mt-1 opacity-70">{p.classe.label}</div>
                          </div>
                        );
                      }}
                    />
                    <Scatter data={pratos}>
                      {pratos.map((p) => <Cell key={p.id} fill={p.classe.acao ? C.danger : C.text} stroke="#fff" strokeWidth={2} />)}
                      <LabelList dataKey="nome" content={({ x, y, value }) => (
                        <text x={x} y={y - 14} textAnchor="middle" fontSize={11} fontWeight={500} fill={C.text}>{value}</text>
                      )} />
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 mt-4">
                <h2 className="text-[14px] font-semibold mb-1">Estoque: consumo real x teórico</h2>
                <p className="text-[12px] mb-4" style={{ color: C.sub }}>Teórico é o que a ficha técnica diz que devia ter gastado pra essas vendas. Real vem das movimentações de estoque lançadas. A diferença é quebra que a ficha sozinha nunca mostra.</p>
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr style={{ color: C.faint }} className="text-left text-[10.5px] uppercase tracking-wide">
                      <th className="py-2 pr-3 font-medium">Insumo</th>
                      <th className="py-2 pr-3 font-medium text-right">Consumo teórico</th>
                      <th className="py-2 pr-3 font-medium text-right">Consumo real</th>
                      <th className="py-2 pr-3 font-medium text-right">Custo teórico</th>
                      <th className="py-2 pr-3 font-medium text-right">Custo real</th>
                      <th className="py-2 font-medium text-right">Quebra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analiseEstoque.map((a) => (
                      <tr key={a.insumoId} style={{ borderTop: `1px solid ${C.border}` }}>
                        <td className="py-2 pr-3">{a.nome}</td>
                        <td className="py-2 pr-3 text-right" style={nums}>{a.consumoTeoricoKg.toFixed(1)} kg</td>
                        <td className="py-2 pr-3 text-right" style={nums}>{a.consumoRealKg.toFixed(1)} kg</td>
                        <td className="py-2 pr-3 text-right" style={nums}>R$ {a.custoTeorico.toFixed(0)}</td>
                        <td className="py-2 pr-3 text-right" style={nums}>R$ {a.custoReal.toFixed(0)}</td>
                        <td className="py-2 text-right font-medium" style={{ ...nums, color: a.quebraReais > 0 ? C.danger : C.faint }}>
                          {a.quebraReais > 0 ? `+R$ ${a.quebraReais.toFixed(0)}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[11px] mt-3" style={{ color: C.faint }}>Só aparece aqui quem já tem movimentação de estoque lançada. Os demais insumos ainda não têm rastreio ativo.</p>
              </Card>

              <Card className="p-6 mt-4">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[14px] font-semibold">Pergunte sobre seu cardápio</h2>
                  <span className="text-[11px] px-2 py-0.5 rounded-md" style={{ color: C.sub, background: C.bg }}>mesmo agente do WhatsApp</span>
                </div>
                <p className="text-[12px] mb-4" style={{ color: C.sub }}>As respostas usam os dados já cadastrados, não um cálculo genérico. No WhatsApp funciona em texto livre; aqui vão perguntas prontas pra mostrar a ideia.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {perguntas.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPerguntaAtiva(perguntaAtiva === idx ? null : idx)}
                      className="text-[12.5px] px-3 py-1.5 rounded-full"
                      style={{ border: `1px solid ${perguntaAtiva === idx ? C.text : C.borderStrong}`, background: perguntaAtiva === idx ? C.text : C.panel, color: perguntaAtiva === idx ? '#fff' : C.text }}
                    >
                      {p.q}
                    </button>
                  ))}
                </div>
                {perguntaAtiva !== null && (
                  <div className="rounded-lg p-4 text-[13px]" style={{ background: C.bg }}>
                    {perguntas[perguntaAtiva].r}
                  </div>
                )}
              </Card>
            </div>
          )}

          {tab === 'insumos' && (
            <div className="max-w-5xl space-y-6">
              <Card>
                <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <h2 className="text-[13px] font-semibold">Insumos comprados</h2>
                  <button onClick={() => setShowNovoInsumo(!showNovoInsumo)} className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg" style={{ background: showNovoInsumo ? C.bg : C.text, color: showNovoInsumo ? C.text : '#fff', border: `1px solid ${showNovoInsumo ? C.borderStrong : C.text}` }}>
                    {showNovoInsumo ? 'Fechar' : '+ Novo insumo'}
                  </button>
                </div>
                {showNovoInsumo && (
                  <NovoInsumoForm
                    onSave={(novo) => { setInsumos([...insumos, novo]); setShowNovoInsumo(false); }}
                    onCancel={() => setShowNovoInsumo(false)}
                  />
                )}
                <table className="w-full text-[13px]">
                  <thead>
                    <tr style={{ color: C.faint }} className="text-left text-[11px] uppercase tracking-wide">
                      <th className="py-2.5 px-5 font-medium">Insumo</th>
                      <th className="py-2.5 px-3 font-medium">Categoria</th>
                      <th className="py-2.5 px-3 font-medium">Unidade</th>
                      <th className="py-2.5 px-3 font-medium">Embalagem</th>
                      <th className="py-2.5 px-3 font-medium text-right">Preço pago</th>
                      <th className="py-2.5 px-3 font-medium text-right">Preço/unid.</th>
                      <th className="py-2.5 px-3 font-medium text-right">FC</th>
                      <th className="py-2.5 px-5 font-medium text-right">Estoque</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insumos.map((i) => {
                      const est = estoque[i.id];
                      const abaixoMinimo = est && est.atual < est.minimo;
                      return (
                        <tr key={i.id} style={{ borderTop: `1px solid ${C.border}` }}>
                          <td className="py-2.5 px-5">{i.nome}</td>
                          <td className="py-2.5 px-3" style={{ color: C.sub }}>{CATEGORIAS_INSUMO.find((c) => c.id === i.categoria)?.label || i.categoria}</td>
                          <td className="py-2.5 px-3" style={{ color: C.sub }}>{i.unidade}</td>
                          <td className="py-2.5 px-3" style={{ color: C.sub }}>{i.tamanhoEmbalagem} {i.unidade}</td>
                          <td className="py-2.5 px-3 text-right" style={nums}>R$ {i.precoEmbalagem.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right" style={nums}>R$ {precoUnitario(i).toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right" style={{ ...nums, color: i.fc > 1 ? C.danger : C.faint }}>{i.fc.toFixed(2)}</td>
                          <td className="py-2.5 px-5 text-right" style={{ ...nums, color: abaixoMinimo ? C.danger : C.text }}>
                            {est ? `${est.atual}${i.unidade} ${abaixoMinimo ? '· abaixo do mín.' : ''}` : <span style={{ color: C.faint }}>não rastreado</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[13px] font-semibold">Preparos próprios</h2>
                  <button onClick={() => setShowNovoPreparo(!showNovoPreparo)} className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg" style={{ background: showNovoPreparo ? C.bg : C.text, color: showNovoPreparo ? C.text : '#fff', border: `1px solid ${showNovoPreparo ? C.borderStrong : C.text}` }}>
                    {showNovoPreparo ? 'Fechar' : '+ Nova receita'}
                  </button>
                </div>
                <p className="text-[12px] mb-3" style={{ color: C.sub }}>Receitas feitas na casa que viram componente de outros pratos.</p>
                {showNovoPreparo && (
                  <Card className="mb-3">
                    <NovoPreparoForm
                      insumos={insumos}
                      onSave={(novo) => { setPreparos([...preparos, novo]); setShowNovoPreparo(false); }}
                      onCancel={() => setShowNovoPreparo(false)}
                    />
                  </Card>
                )}
                <div className="space-y-3">
                  {preparos.map((prep) => (
                    <Card key={prep.id}>
                      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
                        <div className="flex items-center gap-2">
                          <CookingPot size={14} style={{ color: C.sub }} />
                          <span className="text-[13px] font-semibold">{prep.nome}</span>
                          <Badge>preparo próprio</Badge>
                        </div>
                        <div className="text-[12px]" style={{ ...nums, color: C.sub }}>rende {prep.rendimento}{prep.unidadeRendimento} · R$ {(custoPreparo(prep, insumoById) / prep.rendimento).toFixed(2)}/{prep.unidadeRendimento}</div>
                      </div>
                      <div className="px-5 py-1">
                        {prep.ficha.map((f) => {
                          const insumo = insumoById[f.insumoId];
                          const pesoBruto = f.pesoLiquido * insumo.fc;
                          const custo = pesoBruto * precoUnitario(insumo);
                          return (
                            <div key={f.insumoId} className="flex justify-between text-[12.5px] py-2" style={{ borderTop: `1px solid ${C.border}` }}>
                              <span>{insumo.nome} <span style={{ color: C.faint }}>· {f.pesoLiquido}{insumo.unidade} · FC {insumo.fc.toFixed(2)}</span></span>
                              <span style={nums}>R$ {custo.toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'cmv' && (
            <div className="max-w-5xl space-y-6">
              <div>
                <h2 className="text-[14px] font-semibold mb-1">Importar vendas do período</h2>
                <p className="text-[12px] mb-3" style={{ color: C.sub }}>
                  Cole o relatório de vendas do iFood ou do seu PDV, um prato por linha, no formato <span style={{ ...nums }}>nome do prato, quantidade</span>. Enquanto não importar, o sistema usa o número informado manualmente em cada receita.
                </p>
                <Card className="p-5">
                  <textarea
                    value={textoImportacao}
                    onChange={(e) => { setTextoImportacao(e.target.value); setErroImportacao(''); }}
                    placeholder={'Pizza Muçarela, 192\nParmegiana de Frango, 141\nLasanha Bolonhesa, 218\nSalmão Grelhado, 37\nSalada Caesar, 44'}
                    className="text-[12.5px] px-3 py-2.5 rounded-lg w-full font-mono"
                    style={{ border: `1px solid ${C.borderStrong}`, background: C.panel, minHeight: 110, ...nums }}
                  />
                  {erroImportacao && <div className="text-[11.5px] mt-2" style={{ color: C.danger }}>{erroImportacao}</div>}
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={importarVendas} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ background: C.text, color: '#fff' }}>Importar vendas</button>
                    {vendasImportadas && (
                      <>
                        <Badge>usando vendas importadas</Badge>
                        <button onClick={() => { setVendasImportadas(null); setErroImportacao(''); }} className="text-[11.5px]" style={{ color: C.sub }}>voltar ao manual</button>
                      </>
                    )}
                  </div>
                </Card>
              </div>

              <div>
                <h2 className="text-[14px] font-semibold mb-1">CMV teórico contra CMV real</h2>
                <p className="text-[12px] mb-3" style={{ color: C.sub }}>
                  Teórico é o que as fichas dizem que devia ter sido gasto pra essas vendas. Real é o padrão do setor: estoque inicial + compras − estoque final, dividido pelo faturamento. A diferença é o que saiu da cozinha sem virar prato vendido. Um gap de 1 a 3 pontos é ruído normal de operação; acima disso vale investigar.
                </p>
                <div className="rounded-lg p-3 mb-3 text-[11.5px]" style={{ background: C.bg, color: C.sub }}>
                  A comparação só fecha quando <b>todo o cardápio</b> está cadastrado com ficha técnica. Se metade dos pratos não tem ficha, o CMV teórico sai menor que a realidade e o gap aparece inflado sem que exista problema nenhum na cozinha.
                </div>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <Kpi label="Faturamento do período" value={`R$ ${faturamentoPeriodo.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`} sub={`${linhasCmv.reduce((s, l) => s + l.qtdVendida, 0)} pratos vendidos`} />
                  <Kpi label="CMV teórico (fichas)" value={`${cmvTeoricoPct.toFixed(1)}%`} sub={`R$ ${custoTeoricoPeriodo.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`} />
                  <Kpi label="CMV real (estoque)" value={`${cmvRealPct.toFixed(1)}%`} alerta={gapCmv > 3} sub={`R$ ${consumoReal.toLocaleString('pt-BR')}`} />
                  <Kpi label="Gap não explicado" value={`${gapCmv > 0 ? '+' : ''}${gapCmv.toFixed(1)} p.p.`} alerta={gapCmv > 3} sub={`R$ ${Math.abs(gapReais).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} ${gapReais > 0 ? 'a mais que o previsto' : 'abaixo do previsto'}`} />
                </div>

                <Card className="p-5">
                  <h3 className="text-[13px] font-semibold mb-1">Base do cálculo real</h3>
                  <p className="text-[11.5px] mb-3" style={{ color: C.sub }}>Valores do inventário do período. Ajuste aqui se o número do seu fechamento for diferente.</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ['estoqueInicial', 'Estoque inicial'],
                      ['compras', 'Compras do período'],
                      ['estoqueFinal', 'Estoque final'],
                    ].map(([campo, label]) => (
                      <div key={campo}>
                        <div className="text-[11px] mb-1" style={{ color: C.faint }}>{label}</div>
                        <input
                          type="number"
                          value={fechamentoCmv[campo]}
                          onChange={(e) => setFechamentoCmv({ ...fechamentoCmv, [campo]: parseFloat(e.target.value) || 0 })}
                          className="text-[12.5px] px-2.5 py-1.5 rounded-md w-full text-right"
                          style={{ border: `1px solid ${C.borderStrong}`, background: C.panel, ...nums }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-[11.5px] mt-3 pt-3" style={{ color: C.sub, borderTop: `1px solid ${C.border}` }}>
                    Consumo real = {fechamentoCmv.estoqueInicial.toLocaleString('pt-BR')} + {fechamentoCmv.compras.toLocaleString('pt-BR')} − {fechamentoCmv.estoqueFinal.toLocaleString('pt-BR')} = <b style={{ color: C.text }}>R$ {consumoReal.toLocaleString('pt-BR')}</b>
                  </div>
                </Card>

                {gapCmv > 3 && (
                  <div className="rounded-lg p-4 mt-3 text-[12.5px]" style={{ background: C.dangerSoft, color: C.danger }}>
                    <b>Gap de {gapCmv.toFixed(1)} pontos percentuais.</b> Saiu R$ {gapReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} a mais de insumo do que as fichas previam. As causas prováveis, em ordem: porção maior que a ficha manda, perda não registrada, rendimento de proteína pior que o cadastrado, ou desvio. As abas de Manipulação de Proteínas e Produções ajudam a isolar qual é.
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-[14px] font-semibold mb-1">CMV por prato</h2>
                <p className="text-[12px] mb-3" style={{ color: C.sub }}>Ordenado por faturamento. O que vende muito com margem baixa costuma pesar mais que o que vende pouco com margem ruim.</p>
                <Card>
                  <table className="w-full text-[12.5px]">
                    <thead>
                      <tr style={{ color: C.faint }} className="text-left text-[10.5px] uppercase tracking-wide">
                        <th className="py-2.5 px-5 font-medium">Prato</th>
                        <th className="py-2.5 px-3 font-medium text-right">Vendidos</th>
                        <th className="py-2.5 px-3 font-medium text-right">Preço</th>
                        <th className="py-2.5 px-3 font-medium text-right">CMV unit.</th>
                        <th className="py-2.5 px-3 font-medium text-right">Faturamento</th>
                        <th className="py-2.5 px-3 font-medium text-right">Custo total</th>
                        <th className="py-2.5 px-5 font-medium text-right">Lucro bruto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {linhasCmv.map((l) => (
                        <tr key={l.id} style={{ borderTop: `1px solid ${C.border}` }}>
                          <td className="py-2.5 px-5">
                            <span className="font-medium">{l.nome}</span>
                            {l.margemPct / 100 < MARGEM_ALVO && <span className="ml-2"><Badge acao>margem baixa</Badge></span>}
                          </td>
                          <td className="py-2.5 px-3 text-right" style={nums}>{l.qtdVendida}</td>
                          <td className="py-2.5 px-3 text-right" style={nums}>R$ {l.precoVenda.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right" style={{ ...nums, color: C.sub }}>R$ {l.cmv.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right" style={nums}>R$ {l.faturamentoPrato.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</td>
                          <td className="py-2.5 px-3 text-right" style={{ ...nums, color: C.sub }}>R$ {l.custoTeoricoPrato.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</td>
                          <td className="py-2.5 px-5 text-right font-medium" style={nums}>R$ {l.lucroPrato.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</td>
                        </tr>
                      ))}
                      <tr style={{ borderTop: `1.5px solid ${C.borderStrong}` }}>
                        <td className="py-2.5 px-5 font-semibold" colSpan={4}>Total do período</td>
                        <td className="py-2.5 px-3 text-right font-semibold" style={nums}>R$ {faturamentoPeriodo.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</td>
                        <td className="py-2.5 px-3 text-right font-semibold" style={nums}>R$ {custoTeoricoPeriodo.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</td>
                        <td className="py-2.5 px-5 text-right font-semibold" style={nums}>R$ {(faturamentoPeriodo - custoTeoricoPeriodo).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              </div>
            </div>
          )}

          {tab === 'producoes' && (
            <div className="max-w-5xl space-y-6">
              <div>
                <h2 className="text-[14px] font-semibold mb-1">Quadro de produção</h2>
                <p className="text-[12px] mb-3" style={{ color: C.sub }}>A cozinha move o lote de coluna conforme trabalha. Cada card carrega o número do lote, então dá pra rastrear depois o que saiu de onde.</p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: 'estoque', titulo: 'Em estoque', desc: 'lotes que dá pra produzir' },
                    { id: 'em_producao', titulo: 'Em produção', desc: 'pegos pela cozinha agora' },
                    { id: 'produzido', titulo: 'Produzido', desc: 'pronto pra uso ou venda' },
                    { id: 'perda', titulo: 'Perdas', desc: 'lote descartado' },
                  ].map((col) => {
                    const cards = col.id === 'estoque'
                      ? disponivelProduzir.filter((d) => d.lotes !== null && d.lotes > 0)
                      : producoesEnriquecidas.filter((p) => p.status === col.id);
                    const podeSoltarAqui = !!loteArrastando && transicaoValida(loteArrastando.colunaOrigem, col.id);
                    const emHoverValido = colunaAlvo === col.id && podeSoltarAqui;
                    const emHoverInvalido = colunaAlvo === col.id && !!loteArrastando && !podeSoltarAqui;
                    return (
                      <div
                        key={col.id}
                        className="rounded-xl p-3 transition-colors"
                        style={{
                          background: emHoverValido ? C.accentSoft : C.bg,
                          border: `1.5px dashed ${emHoverValido ? C.accent : emHoverInvalido ? C.danger : 'transparent'}`,
                          outline: `1px solid ${emHoverValido || emHoverInvalido ? 'transparent' : C.border}`,
                          outlineOffset: -1,
                        }}
                        onDragOver={(e) => {
                          if (!loteArrastando) return;
                          e.preventDefault();
                          e.dataTransfer.dropEffect = podeSoltarAqui ? 'move' : 'none';
                          if (colunaAlvo !== col.id) setColunaAlvo(col.id);
                        }}
                        onDragLeave={() => setColunaAlvo((atual) => (atual === col.id ? null : atual))}
                        onDrop={(e) => {
                          e.preventDefault();
                          soltarNaColuna(col.id);
                          setColunaAlvo(null);
                        }}
                      >
                        <div className="flex items-baseline justify-between mb-0.5">
                          <span className="text-[12.5px] font-semibold" style={{ color: col.id === 'perda' && cards.length > 0 ? C.danger : C.text }}>{col.titulo}</span>
                          <span className="text-[12px] font-semibold" style={{ ...nums, color: col.id === 'perda' && cards.length > 0 ? C.danger : C.sub }}>{cards.length}</span>
                        </div>
                        <div className="text-[10.5px] mb-2.5" style={{ color: C.faint }}>{col.desc}</div>
                        <div className="space-y-2">
                          {cards.length === 0 && (
                            <div className="text-[11px] py-2" style={{ color: podeSoltarAqui ? C.accent : C.faint }}>
                              {podeSoltarAqui ? 'Solte aqui' : 'Nada aqui.'}
                            </div>
                          )}

                          {col.id === 'estoque' && cards.map((d) => (
                            <div
                              key={`${d.tipo}-${d.id}`}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.effectAllowed = 'move';
                                setLoteArrastando({ colunaOrigem: 'estoque', item: d });
                              }}
                              onDragEnd={() => { setLoteArrastando(null); setColunaAlvo(null); }}
                              className="rounded-lg p-2.5 ftv-panel cursor-grab active:cursor-grabbing"
                              style={{ border: `1px solid ${C.border}`, opacity: loteArrastando?.item === d ? 0.4 : 1 }}
                            >
                              <div className="text-[12px] font-medium leading-tight">{d.nome}</div>
                              <div className="text-[10.5px] mt-1" style={{ color: C.sub }}>{d.rendimento}</div>
                              <div className="text-[10.5px] mt-1.5 flex items-baseline gap-1">
                                <span className="font-semibold" style={{ ...nums, color: d.lotes <= 2 ? C.danger : C.text, fontSize: 13 }}>{d.lotes}</span>
                                <span style={{ color: C.sub }}>lote{d.lotes > 1 ? 's' : ''} possível{d.lotes > 1 ? 'eis' : ''}</span>
                              </div>
                              {d.gargalo && <div className="text-[10px] mt-1" style={{ color: C.faint }}>limite: {d.gargalo}</div>}
                              <button onClick={() => iniciarProducao(d)} className="mt-2 w-full text-[11px] font-medium py-1.5 rounded-md" style={{ background: C.text, color: '#fff' }}>
                                Iniciar produção
                              </button>
                            </div>
                          ))}

                          {col.id !== 'estoque' && cards.map((pr) => (
                            <div
                              key={pr.id}
                              draggable={col.id !== 'perda'}
                              onDragStart={(e) => {
                                e.dataTransfer.effectAllowed = 'move';
                                setLoteArrastando({ colunaOrigem: col.id, item: pr });
                              }}
                              onDragEnd={() => { setLoteArrastando(null); setColunaAlvo(null); }}
                              className={col.id !== 'perda' ? 'rounded-lg p-2.5 ftv-panel cursor-grab active:cursor-grabbing' : 'rounded-lg p-2.5 ftv-panel'}
                              style={{ border: `1px solid ${col.id === 'perda' ? C.dangerSoft : C.border}`, opacity: loteArrastando?.item === pr ? 0.4 : 1 }}
                            >
                              <div className="text-[10.5px] font-semibold" style={{ ...nums, color: C.sub }}>{pr.lote}</div>
                              <div className="text-[12px] font-medium leading-tight mt-0.5">{pr.nome}</div>
                              <div className="text-[10.5px] mt-1" style={{ ...nums, color: C.sub }}>{pr.quantidade} {pr.unidade} · {pr.responsavel}</div>
                              <div className="text-[10px] mt-1 inline-block px-1.5 py-0.5 rounded" style={{ background: C.bg, color: C.sub }}>
                                {TURNOS.find((t) => t.id === pr.turno)?.label || '—'} · chefe {pr.chefeTurno || '—'}
                              </div>
                              {pr.validade && <div className="text-[10px] mt-0.5" style={{ color: C.faint }}>validade {pr.validade}</div>}
                              {pr.motivoPerda && <div className="text-[10.5px] mt-1.5" style={{ color: C.danger }}>{pr.motivoPerda}</div>}

                              {col.id === 'em_producao' && (
                                <div className="flex gap-1.5 mt-2">
                                  <button onClick={() => moverLote(pr.id, 'produzido')} className="flex-1 text-[11px] font-medium py-1.5 rounded-md" style={{ background: C.text, color: '#fff' }}>Concluir</button>
                                  <button
                                    onClick={() => {
                                      const motivo = window.prompt('O que aconteceu com esse lote?');
                                      if (motivo && motivo.trim()) moverLote(pr.id, 'perda', motivo.trim());
                                    }}
                                    className="text-[11px] font-medium py-1.5 px-2 rounded-md"
                                    style={{ border: `1px solid ${C.borderStrong}`, color: C.danger }}
                                  >
                                    Perda
                                  </button>
                                </div>
                              )}

                              {col.id === 'produzido' && (
                                <button
                                  onClick={() => {
                                    const motivo = window.prompt('O que aconteceu com esse lote?');
                                    if (motivo && motivo.trim()) moverLote(pr.id, 'perda', motivo.trim());
                                  }}
                                  className="mt-2 w-full text-[11px] font-medium py-1.5 rounded-md"
                                  style={{ border: `1px solid ${C.borderStrong}`, color: C.danger }}
                                >
                                  Registrar perda
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[14px] font-semibold">Detalhe de capacidade por prato</h2>
                  <button onClick={() => setShowNovaProducao(!showNovaProducao)} className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg" style={{ background: showNovaProducao ? C.bg : C.text, color: showNovaProducao ? C.text : '#fff', border: `1px solid ${showNovaProducao ? C.borderStrong : C.text}` }}>
                    {showNovaProducao ? 'Fechar' : '+ Registrar produção'}
                  </button>
                </div>
                <p className="text-[12px] mb-3" style={{ color: C.sub }}>Detalhamento em porções por prato, com o insumo que vai faltar primeiro. O quadro acima mostra a mesma coisa em lotes.</p>

                {showNovaProducao && (
                  <Card className="mb-3">
                    <NovaProducaoForm
                      preparos={preparos}
                      pratos={pratos}
                      turnoAtivo={turnoAtivo}
                      chefeTurno={chefeTurno}
                      onSave={(novo) => { setProducoes([novo, ...producoes]); setShowNovaProducao(false); }}
                      onCancel={() => setShowNovaProducao(false)}
                    />
                  </Card>
                )}

                <Card>
                  <table className="w-full text-[12.5px]">
                    <thead>
                      <tr style={{ color: C.faint }} className="text-left text-[10.5px] uppercase tracking-wide">
                        <th className="py-2.5 px-5 font-medium">Prato</th>
                        <th className="py-2.5 px-3 font-medium text-right">Rende por receita</th>
                        <th className="py-2.5 px-3 font-medium text-right">Ainda dá pra fazer</th>
                        <th className="py-2.5 px-5 font-medium">Primeiro insumo a faltar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {capacidadeProducao.map((p) => (
                        <tr key={p.id} style={{ borderTop: `1px solid ${C.border}` }}>
                          <td className="py-2.5 px-5 font-medium">{p.nome}</td>
                          <td className="py-2.5 px-3 text-right" style={nums}>{p.rendimento} porç{p.rendimento > 1 ? 'ões' : 'ão'}</td>
                          <td className="py-2.5 px-3 text-right font-semibold" style={{ ...nums, color: p.maxPorcoes !== null && p.maxPorcoes < 10 ? C.danger : C.text }}>
                            {p.maxPorcoes === null ? <span style={{ color: C.faint, fontWeight: 400 }}>sem estoque rastreado</span> : `${p.maxPorcoes} porções`}
                          </td>
                          <td className="py-2.5 px-5" style={{ color: C.sub }}>
                            {p.gargalo ? p.gargalo.nome : '—'}
                            {p.semRastreio > 0 && <span style={{ color: C.faint }}> · {p.semRastreio} insumo{p.semRastreio > 1 ? 's' : ''} fora do cálculo</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>

            </div>
          )}

          {tab === 'checklists' && (
            <div className="max-w-5xl">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-[14px] font-semibold">Checklists de turno</h2>
                <button onClick={() => setShowNovoChecklist(!showNovoChecklist)} className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg" style={{ background: showNovoChecklist ? C.bg : C.text, color: showNovoChecklist ? C.text : '#fff', border: `1px solid ${showNovoChecklist ? C.borderStrong : C.text}` }}>
                  {showNovoChecklist ? 'Fechar' : '+ Novo checklist'}
                </button>
              </div>
              <p className="text-[12px] mb-4" style={{ color: C.sub }}>
                Cada casa monta o seu. Os modelos abaixo são ponto de partida: o chef edita, remove e cria o que fizer sentido pra operação dele. O que for marcado fica registrado no turno de {TURNOS.find((t) => t.id === turnoAtivo)?.label.toLowerCase()}, sob responsabilidade de {chefeTurno}.
              </p>

              {showNovoChecklist && (
                <Card className="mb-4">
                  <div className="px-5 py-4">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <input placeholder="Nome do checklist" value={novoChecklistNome} onChange={(e) => setNovoChecklistNome(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md col-span-2" style={{ border: `1px solid ${C.borderStrong}`, background: C.panel }} />
                      <select value={novoChecklistMomento} onChange={(e) => setNovoChecklistMomento(e.target.value)} className="text-[12.5px] px-2.5 py-1.5 rounded-md" style={{ border: `1px solid ${C.borderStrong}`, background: C.panel }}>
                        {Object.entries(MOMENTOS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                      </select>
                    </div>
                    <button onClick={criarChecklist} className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg" style={{ background: C.text, color: '#fff' }}>Criar checklist</button>
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-3">
                {checklists.map((ch) => {
                  const marcados = Object.values(execucoes[ch.id] || {}).filter(Boolean).length;
                  const total = ch.itens.length;
                  const completo = total > 0 && marcados === total;
                  const editando = editandoChecklist === ch.id;
                  return (
                    <Card key={ch.id} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-[13px] font-semibold">{ch.nome}</div>
                          <div className="text-[10.5px] mt-0.5" style={{ color: C.faint }}>{MOMENTOS[ch.momento]}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11.5px] font-semibold" style={{ ...nums, color: completo ? C.accent : C.sub }}>{marcados}/{total}</span>
                          <button onClick={() => setEditandoChecklist(editando ? null : ch.id)} className="text-[11px] px-2 py-1 rounded-md" style={{ border: `1px solid ${C.borderStrong}`, color: C.sub }}>
                            {editando ? 'Pronto' : 'Editar'}
                          </button>
                        </div>
                      </div>

                      <div className="h-1 rounded-full mb-3" style={{ background: C.border }}>
                        <div className="h-1 rounded-full" style={{ width: total ? `${(marcados / total) * 100}%` : '0%', background: completo ? C.accent : C.sub }} />
                      </div>

                      <div className="space-y-1">
                        {ch.itens.map((item) => {
                          const feito = !!(execucoes[ch.id] || {})[item.id];
                          return (
                            <div key={item.id} className="flex items-center gap-2 py-1">
                              {editando ? (
                                <>
                                  <span className="text-[12px] flex-1" style={{ color: C.sub }}>{item.texto}</span>
                                  <button onClick={() => removerItemChecklist(ch.id, item.id)} style={{ color: C.danger }}><X size={13} /></button>
                                </>
                              ) : (
                                <button onClick={() => toggleItem(ch.id, item.id)} className="flex items-center gap-2 text-left w-full">
                                  <span className="w-3.5 h-3.5 rounded shrink-0 flex items-center justify-center" style={{ border: `1.5px solid ${feito ? C.accent : C.borderStrong}`, background: feito ? C.accent : 'transparent' }}>
                                    {feito && <span style={{ color: '#fff', fontSize: 9, lineHeight: 1 }}>✓</span>}
                                  </span>
                                  <span className="text-[12px]" style={{ color: feito ? C.faint : C.text, textDecoration: feito ? 'line-through' : 'none' }}>{item.texto}</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                        {ch.itens.length === 0 && <div className="text-[11.5px] py-1" style={{ color: C.faint }}>Sem itens ainda.</div>}
                      </div>

                      {editando && (
                        <div className="flex gap-2 mt-3">
                          <input
                            placeholder="Novo item do checklist"
                            value={novoItemTexto}
                            onChange={(e) => setNovoItemTexto(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') addItemChecklist(ch.id); }}
                            className="text-[12px] px-2.5 py-1.5 rounded-md flex-1"
                            style={{ border: `1px solid ${C.borderStrong}`, background: C.panel }}
                          />
                          <button onClick={() => addItemChecklist(ch.id)} className="text-[12px] font-medium px-3 py-1.5 rounded-md" style={{ background: C.text, color: '#fff' }}>+</button>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'estoque' && (
            <div className="max-w-5xl space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[14px] font-semibold">Saldo em armazenamento</h2>
                  <button onClick={() => setShowNovoEstoque(!showNovoEstoque)} className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg" style={{ background: showNovoEstoque ? C.bg : C.text, color: showNovoEstoque ? C.text : '#fff', border: `1px solid ${showNovoEstoque ? C.borderStrong : C.text}` }}>
                    {showNovoEstoque ? 'Fechar' : '+ Rastrear insumo'}
                  </button>
                </div>
                <p className="text-[12px] mb-3" style={{ color: C.sub }}>Só aparece quem tem movimentação lançada. Insumo sem rastreio não vira zero, fica de fora do cálculo.</p>

                {showNovoEstoque && (
                  <Card className="mb-3">
                    <NovoEstoqueForm
                      insumos={insumos}
                      jaRastreados={Object.keys(estoque)}
                      onSave={(insumoId, dados) => { setEstoque({ ...estoque, [insumoId]: dados }); setShowNovoEstoque(false); }}
                      onCancel={() => setShowNovoEstoque(false)}
                    />
                  </Card>
                )}

                <input
                  placeholder="Buscar insumo pelo nome..."
                  value={buscaInsumo}
                  onChange={(e) => setBuscaInsumo(e.target.value)}
                  className="text-[12.5px] px-3 py-2 rounded-lg mb-3 w-full max-w-xs"
                  style={{ border: `1px solid ${C.borderStrong}`, background: C.panel }}
                />

                <Card>
                  <table className="w-full text-[12.5px]">
                    <thead>
                      <tr style={{ color: C.faint }} className="text-left text-[10.5px] uppercase tracking-wide">
                        <th className="py-2.5 px-5 font-medium">Insumo</th>
                        <th className="py-2.5 px-3 font-medium">Categoria</th>
                        <th className="py-2.5 px-3 font-medium text-right">Saldo atual</th>
                        <th className="py-2.5 px-3 font-medium text-right">Estoque mínimo</th>
                        <th className="py-2.5 px-5 font-medium text-right">Valor parado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(estoque).filter(([insumoId]) => {
                        const ins = insumoById[insumoId];
                        if (!ins) return false;
                        if (!buscaInsumo.trim()) return true;
                        return ins.nome.toLowerCase().includes(buscaInsumo.trim().toLowerCase());
                      }).map(([insumoId, est]) => {
                        const insumo = insumoById[insumoId];
                        if (!insumo) return null;
                        const abaixo = est.atual < est.minimo;
                        return (
                          <tr key={insumoId} style={{ borderTop: `1px solid ${C.border}` }}>
                            <td className="py-2.5 px-5 font-medium">{insumo.nome}</td>
                            <td className="py-2.5 px-3" style={{ color: C.sub }}>{CATEGORIAS_INSUMO.find((c) => c.id === insumo.categoria)?.label}</td>
                            <td className="py-2.5 px-3 text-right font-semibold" style={{ ...nums, color: abaixo ? C.danger : C.text }}>{est.atual}{insumo.unidade}{abaixo && ' · repor'}</td>
                            <td className="py-2.5 px-3 text-right" style={{ ...nums, color: C.sub }}>{est.minimo}{insumo.unidade}</td>
                            <td className="py-2.5 px-5 text-right" style={nums}>R$ {(est.atual * precoUnitario(insumo)).toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
              </div>

              <div>
                <h2 className="text-[14px] font-semibold mb-1">Entradas e saídas</h2>
                <p className="text-[12px] mb-3" style={{ color: C.sub }}>Compra entra, venda e perda saem. Ajuste manual serve pra corrigir contagem ou registrar desperdício.</p>
                <Card>
                  <div className="px-5 py-1">
                    {movimentacoesRecentes.map((m, idx) => {
                      const insumo = insumoById[m.insumoId];
                      const label = { entrada: 'Entrada', saida_venda: 'Saída (venda)', ajuste: 'Ajuste' }[m.tipo];
                      const cor = m.tipo === 'entrada' ? C.text : m.tipo === 'ajuste' ? C.danger : C.sub;
                      return (
                        <div key={idx} className="flex items-center justify-between text-[12.5px] py-2.5" style={{ borderTop: idx ? `1px solid ${C.border}` : 'none' }}>
                          <div>
                            <span className="font-medium">{insumo?.nome}</span>
                            <span style={{ color: C.faint }}> · {m.origem}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span style={{ color: C.faint }}>{m.data}</span>
                            <span style={{ ...nums, color: cor }}>{m.tipo === 'entrada' ? '+' : '-'}{m.quantidade}{insumo?.unidade}</span>
                            <Badge acao={m.tipo === 'ajuste'}>{label}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[14px] font-semibold">Fornecedores</h2>
                  <button onClick={() => setShowNovoFornecedor(!showNovoFornecedor)} className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg" style={{ background: showNovoFornecedor ? C.bg : C.text, color: showNovoFornecedor ? C.text : '#fff', border: `1px solid ${showNovoFornecedor ? C.borderStrong : C.text}` }}>
                    {showNovoFornecedor ? 'Fechar' : '+ Novo fornecedor'}
                  </button>
                </div>
                <p className="text-[12px] mb-3" style={{ color: C.sub }}>Contato fica no sistema, não na cabeça de quem faz compra. Se o responsável sai, quem entra assume sem perder telefone, janela de entrega nem prazo de urgência.</p>

                {showNovoFornecedor && (
                  <Card className="mb-3">
                    <NovoFornecedorForm
                      onSave={(novo) => { setFornecedores([...fornecedores, novo]); setShowNovoFornecedor(false); }}
                      onCancel={() => setShowNovoFornecedor(false)}
                    />
                  </Card>
                )}

                <div className="space-y-3">
                  {fornecedores.map((f) => (
                    <Card key={f.id} className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-[13.5px] font-semibold">{f.empresa}</div>
                          <div className="text-[12px]" style={{ color: C.sub }}>{f.fornece}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[13px] font-medium" style={nums}>{f.telefone}</div>
                          <div className="text-[11.5px]" style={{ color: C.sub }}>{f.contato}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-[11.5px]" style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                        <div>
                          <div style={{ color: C.faint }}>E-mail</div>
                          <div className="mt-0.5">{f.email || '—'}</div>
                        </div>
                        <div>
                          <div style={{ color: C.faint }}>Dias de entrega</div>
                          <div className="mt-0.5">{f.diasEntrega || '—'}</div>
                        </div>
                        <div>
                          <div style={{ color: C.faint }}>Horário</div>
                          <div className="mt-0.5">{f.horarioEntrega || '—'}</div>
                        </div>
                        <div>
                          <div style={{ color: C.faint }}>Pedido de urgência</div>
                          <div className="mt-0.5">{f.prazoUrgencia || '—'}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'proteinas' && (
            <div className="max-w-5xl">
              <p className="text-[13px] mb-5" style={{ color: C.sub }}>
                Cada lote de proteína processada (peixe, gado, frango) entra aqui com peso bruto recebido, valor pago, peso limpo, quanto virou apara reaproveitável e quanto foi descarte puro. O FC observado é medido, não estimado, e a média recente substitui o FC cadastrado no cálculo de CMV sempre que existir histórico. Isso também é registro de auditoria: dá pra ver quem processou cada lote e comparar rendimento entre pessoas.
              </p>

              <div className="flex items-center gap-2 mb-5 flex-wrap">
                {insumos.filter((i) => i.categoria === 'proteina').map((i) => (
                  <button
                    key={i.id}
                    onClick={() => setProteinaSelecionada(i.id)}
                    className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg"
                    style={{ background: proteinaSelecionada === i.id ? C.text : C.panel, color: proteinaSelecionada === i.id ? '#fff' : C.text, border: `1px solid ${proteinaSelecionada === i.id ? C.text : C.borderStrong}` }}
                  >
                    {i.nome}
                  </button>
                ))}
                <button onClick={() => setShowNovoProcessamento(!showNovoProcessamento)} className="ml-auto text-[12.5px] font-medium px-3 py-1.5 rounded-lg" style={{ background: showNovoProcessamento ? C.bg : C.text, color: showNovoProcessamento ? C.text : '#fff', border: `1px solid ${showNovoProcessamento ? C.borderStrong : C.text}` }}>
                  {showNovoProcessamento ? 'Fechar' : '+ Registrar lote'}
                </button>
              </div>

              {showNovoProcessamento && (
                <Card className="mb-5">
                  <NovoProcessamentoForm
                    insumos={insumos.filter((i) => i.categoria === 'proteina')}
                    insumoInicial={proteinaSelecionada}
                    onSave={(novo) => { setProcessamentos([...processamentos, novo]); setShowNovoProcessamento(false); setProteinaSelecionada(novo.insumoId); }}
                    onCancel={() => setShowNovoProcessamento(false)}
                  />
                </Card>
              )}

              {(() => {
                const insumo = insumoById[proteinaSelecionada];
                const lotes = processamentos.filter((p) => p.insumoId === proteinaSelecionada);
                const fcObservadoMedio = fcEfetivoById[proteinaSelecionada];
                const diferenca = insumo && fcObservadoMedio ? ((fcObservadoMedio - insumo.fc) / insumo.fc) * 100 : 0;

                if (!insumo) return null;

                if (lotes.length === 0) {
                  return (
                    <Card className="p-6 text-center">
                      <p className="text-[13px]" style={{ color: C.sub }}>Nenhum lote de {insumo.nome} registrado ainda. O FC usado no cálculo de CMV continua sendo o cadastrado ({insumo.fc.toFixed(2)}) até o primeiro lote entrar.</p>
                    </Card>
                  );
                }

                return (
                  <>
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <Kpi label="FC cadastrado (referência)" value={insumo.fc.toFixed(2)} />
                      <Kpi label="FC observado (média dos lotes)" value={fcObservadoMedio?.toFixed(3)} alerta={Math.abs(diferenca) > 2} sub={`${diferenca >= 0 ? '+' : ''}${diferenca.toFixed(1)}% vs. cadastrado`} />
                      <Kpi label="Lotes registrados" value={lotes.length} sub="insumo usado no cálculo de CMV agora" />
                    </div>

                    <Card className="p-6 mb-5">
                      <h2 className="text-[14px] font-semibold mb-1">FC observado por mês</h2>
                      <p className="text-[12px] mb-4" style={{ color: C.sub }}>Linha tracejada é o FC cadastrado. Quanto mais alto acima dela, pior o rendimento real do lote.</p>
                      <ResponsiveContainer width="100%" height={220}>
                        <RLineChart data={lotes.map((l) => ({ ...l, fcLote: l.pesoBrutoRecebido / l.pesoLiquidoResultante }))} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                          <rect x={-200} y={-200} width={3000} height={2000} fill={C.panel} />
                          <CartesianGrid stroke={C.border} vertical={false} />
                          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: C.faint }} tickLine={false} axisLine={{ stroke: C.border }} />
                          <YAxis domain={['dataMin - 0.03', 'dataMax + 0.03']} tick={{ fontSize: 11, fill: C.faint }} tickLine={false} axisLine={{ stroke: C.border }} width={40} />
                          <ReferenceLine y={insumo.fc} stroke={C.borderStrong} strokeDasharray="4 4" label={{ value: 'FC cadastrado', position: 'right', fontSize: 10, fill: C.sub }} />
                          <Tooltip content={({ payload }) => {
                            if (!payload || !payload.length) return null;
                            const p = payload[0].payload;
                            return (
                              <div className="text-xs p-2.5 rounded-lg" style={{ background: C.text, color: '#fff' }}>
                                <div className="font-semibold">{p.mes} · {p.responsavel}</div>
                                <div style={nums}>FC do lote: {p.fcLote.toFixed(3)}</div>
                                <div style={nums}>{p.pesoBrutoRecebido}kg bruto → {p.pesoLiquidoResultante}kg líquido</div>
                              </div>
                            );
                          }} />
                          <Line type="monotone" dataKey="fcLote" stroke={C.text} strokeWidth={2} dot={{ r: 4, fill: C.text }} />
                        </RLineChart>
                      </ResponsiveContainer>
                    </Card>

                    <Card>
                      <div className="px-5 py-3.5" style={{ borderBottom: `1px solid ${C.border}` }}>
                        <h2 className="text-[13px] font-semibold">Histórico de lotes (auditoria)</h2>
                      </div>
                      <table className="w-full text-[12px]">
                        <thead>
                          <tr style={{ color: C.faint }} className="text-left text-[10px] uppercase tracking-wide">
                            <th className="py-2.5 px-5 font-medium">Data</th>
                            <th className="py-2.5 px-2 font-medium">Responsável</th>
                            <th className="py-2.5 px-2 font-medium">Fornecedor</th>
                            <th className="py-2.5 px-2 font-medium text-right">Bruto</th>
                            <th className="py-2.5 px-2 font-medium text-right">Valor/kg</th>
                            <th className="py-2.5 px-2 font-medium text-right">Líquido</th>
                            <th className="py-2.5 px-2 font-medium text-right">Aparas reaproveitadas</th>
                            <th className="py-2.5 px-2 font-medium text-right">Descarte puro</th>
                            <th className="py-2.5 px-5 font-medium text-right">FC</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lotes.map((l) => {
                            const fcLote = l.pesoBrutoRecebido / l.pesoLiquidoResultante;
                            const descartePuro = l.pesoBrutoRecebido - l.pesoLiquidoResultante - (l.pesoAparasReaproveitaveis || 0);
                            const descarteAlto = descartePuro / l.pesoBrutoRecebido > 0.08;
                            return (
                              <>
                                <tr key={l.id} style={{ borderTop: `1px solid ${C.border}` }}>
                                  <td className="py-2 px-5">{l.data || l.mes}</td>
                                  <td className="py-2 px-2 font-medium">{l.responsavel}</td>
                                  <td className="py-2 px-2" style={{ color: C.sub }}>{l.fornecedor}</td>
                                  <td className="py-2 px-2 text-right" style={nums}>{l.pesoBrutoRecebido.toFixed(2)}kg</td>
                                  <td className="py-2 px-2 text-right" style={nums}>R$ {l.valorPagoKg.toFixed(2)}</td>
                                  <td className="py-2 px-2 text-right" style={nums}>{l.pesoLiquidoResultante.toFixed(2)}kg</td>
                                  <td className="py-2 px-2 text-right" style={{ ...nums, color: C.sub }}>{(l.pesoAparasReaproveitaveis || 0).toFixed(2)}kg</td>
                                  <td className="py-2 px-2 text-right" style={{ ...nums, color: descarteAlto ? C.danger : C.text }}>{descartePuro.toFixed(2)}kg</td>
                                  <td className="py-2 px-5 text-right font-medium" style={nums}>{fcLote.toFixed(3)}</td>
                                </tr>
                                {l.observacao && (
                                  <tr>
                                    <td colSpan={9} className="pb-2 px-5 text-[11.5px]" style={{ color: C.sub }}>Obs: {l.observacao}</td>
                                  </tr>
                                )}
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </Card>
                  </>
                );
              })()}
            </div>
          )}


          {tab === 'nutricional' && (
            <div className="max-w-5xl">
              <h2 className="text-[14px] font-semibold mb-1">Ficha nutricional por porção</h2>
              <p className="text-[12px] mb-3" style={{ color: C.sub }}>Calculado a partir do peso bruto de cada insumo na receita, mesma lógica do CMV. Aproximação de cálculo, não laudo laboratorial.</p>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {pratos.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPratoNutricaoSelecionado(p.id)}
                    className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg"
                    style={{ background: pratoNutricaoSelecionado === p.id ? C.text : C.panel, color: pratoNutricaoSelecionado === p.id ? '#fff' : C.text, border: `1px solid ${pratoNutricaoSelecionado === p.id ? C.text : C.borderStrong}` }}
                  >
                    {p.nome}
                  </button>
                ))}
              </div>
              {(() => {
                const p = pratos.find((pr) => pr.id === pratoNutricaoSelecionado);
                if (!p) return null;
                // Se existe override (laudo), ele manda; senão vale o cálculo.
                const ov = nutriOverride[p.id];
                const n = ov ? { ...p.nutricaoPorcao, ...ov } : p.nutricaoPorcao;
                const temOverride = !!ov;
                const destino = destinoVenda[p.id] || 'proprio';
                const paraVarejo = destino === 'varejo_terceiro';
                const vd = (campo) => VDR[campo] ? (n[campo] / VDR[campo]) * 100 : null;
                // campo: nome real no objeto de nutrientes; vdCampo: null quando a
                // norma não define VDR (caso dos açúcares totais).
                const linhas = [
                  { label: 'Valor energético', campo: 'calorias', un: 'kcal', vdCampo: 'calorias', extra: (v) => ` (${(v * 4.184).toFixed(0)}kJ)` },
                  { label: 'Carboidratos', campo: 'carboidratos', un: 'g', vdCampo: 'carboidratos' },
                  { label: '   açúcares totais', campo: 'acucaresTotais', un: 'g', vdCampo: null },
                  { label: '   açúcares adicionados', campo: 'acucaresAdicionados', un: 'g', vdCampo: 'acucaresAdicionados' },
                  { label: 'Proteínas', campo: 'proteinas', un: 'g', vdCampo: 'proteinas' },
                  { label: 'Gorduras totais', campo: 'gordurasTotais', un: 'g', vdCampo: 'gordurasTotais' },
                  { label: '   das quais saturadas', campo: 'gordurasSaturadas', un: 'g', vdCampo: 'gordurasSaturadas' },
                  { label: '   das quais trans', campo: 'gordurasTrans', un: 'g', vdCampo: 'gordurasTrans' },
                  { label: 'Fibra alimentar', campo: 'fibra', un: 'g', vdCampo: 'fibra' },
                  { label: 'Sódio', campo: 'sodio', un: 'mg', vdCampo: 'sodio' },
                ];
                const n100 = p.pesoPorcaoG
                  ? Object.fromEntries(NUTRI_CAMPOS.map((cp) => [cp, n[cp] * (100 / p.pesoPorcaoG)]))
                  : null;
                const limiares = LIMIAR_ALTO_EM[p.formaFisica === 'liquido' ? 'liquido' : 'solido'];
                const altoEm = n100 ? Object.entries(limiares).filter(([campo, limiar]) => n100[campo] >= limiar) : [];

                return (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[12.5px]" style={{ color: C.sub }}>Destino de venda:</span>
                      {[['proprio', 'Próprio estabelecimento'], ['varejo_terceiro', 'Varejo/mercado de terceiro']].map(([id, label]) => (
                        <button
                          key={id}
                          onClick={() => setDestinoVenda({ ...destinoVenda, [p.id]: id })}
                          className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg"
                          style={{ background: destino === id ? C.text : C.panel, color: destino === id ? '#fff' : C.text, border: `1px solid ${destino === id ? C.text : C.borderStrong}` }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {paraVarejo ? (
                      <div className="text-[12px] mb-3" style={{ color: C.sub }}>Vendido fora do próprio estabelecimento: rotulagem nutricional completa é obrigatória (RDC 429/2020), incluindo alerta frontal se aplicável. Tabela abaixo já força fundo branco e letra preta, formato exigido pela norma.</div>
                    ) : (
                      <div className="text-[12px] mb-3" style={{ color: C.sub }}>Vendido no próprio estabelecimento (balcão/delivery): rotulagem é voluntária, não obrigatória (IN 75/2020, Anexo I).</div>
                    )}

                    {paraVarejo && altoEm.length > 0 && (
                      <div className="rounded-lg p-3 mb-4 text-[12.5px]" style={{ background: C.dangerSoft, color: C.danger }}>
                        <b>Alto em {altoEm.map(([campo]) => ({ gordurasSaturadas: 'gordura saturada', sodio: 'sódio', acucaresAdicionados: 'açúcar adicionado' }[campo])).join(', ')}</b> — esse produto precisa do selo de alerta frontal (lupa). Avaliado por 100{p.formaFisica === 'liquido' ? 'mL' : 'g'} do alimento, base que a norma usa, não por porção. O desenho oficial do selo é o arquivo vetorial do Anexo XVII da IN 75/2020, precisa ser aplicado na arte da embalagem.
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => {
                          if (editandoNutri) { setEditandoNutri(false); return; }
                          setRascunhoNutri(Object.fromEntries(NUTRI_CAMPOS.map((cp) => [cp, String(n[cp].toFixed(1))])));
                          setEditandoNutri(true);
                        }}
                        className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg"
                        style={{ background: editandoNutri ? C.bg : C.text, color: editandoNutri ? C.text : '#fff', border: `1px solid ${editandoNutri ? C.borderStrong : C.text}` }}
                      >
                        {editandoNutri ? 'Cancelar edição' : 'Editar valores'}
                      </button>
                      {temOverride && (
                        <>
                          <Badge acao>valor de laudo, não calculado</Badge>
                          <button onClick={() => setNutriOverride({ ...nutriOverride, [p.id]: undefined })} className="text-[11.5px]" style={{ color: C.sub }}>voltar ao calculado</button>
                        </>
                      )}
                    </div>

                    {editandoNutri && (
                      <Card className="p-5 mb-3 max-w-lg">
                        <p className="text-[11.5px] mb-3" style={{ color: C.sub }}>Use isto quando tiver laudo laboratorial: o valor informado aqui substitui o cálculo por composição de ingrediente na tabela e no selo frontal. Valores por porção.</p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {NUTRI_CAMPOS.map((cp) => (
                            <div key={cp} className="flex items-center gap-2">
                              <span className="text-[11.5px] flex-1" style={{ color: C.sub }}>{({ calorias: 'Energia (kcal)', carboidratos: 'Carboidratos (g)', acucaresTotais: 'Açúcares totais (g)', acucaresAdicionados: 'Açúcares adic. (g)', proteinas: 'Proteínas (g)', gordurasTotais: 'Gorduras totais (g)', gordurasSaturadas: 'Saturadas (g)', gordurasTrans: 'Trans (g)', fibra: 'Fibra (g)', sodio: 'Sódio (mg)' })[cp]}</span>
                              <input
                                type="number"
                                value={rascunhoNutri[cp] ?? ''}
                                onChange={(e) => setRascunhoNutri({ ...rascunhoNutri, [cp]: e.target.value })}
                                className="text-[12px] px-2 py-1 rounded-md w-20 text-right"
                                style={{ border: `1px solid ${C.borderStrong}`, background: C.panel, ...nums }}
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            setNutriOverride({ ...nutriOverride, [p.id]: Object.fromEntries(NUTRI_CAMPOS.map((cp) => [cp, parseFloat(rascunhoNutri[cp]) || 0])) });
                            setEditandoNutri(false);
                          }}
                          className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-lg"
                          style={{ background: C.text, color: '#fff' }}
                        >
                          Salvar valores do laudo
                        </button>
                      </Card>
                    )}

                    <Card className="p-6 max-w-lg" style={paraVarejo ? { backgroundColor: '#FFFFFF', color: '#000000' } : {}}>
                      <div className="mb-2" style={{ borderBottom: `3px solid ${paraVarejo ? '#000' : C.text}`, paddingBottom: 6 }}>
                        <div className="text-[14px] font-bold" style={paraVarejo ? { color: '#000' } : {}}>INFORMAÇÃO NUTRICIONAL</div>
                        <div className="text-[11px] mt-0.5" style={{ color: paraVarejo ? '#000' : C.sub }}>
                          {p.rendimento} porç{p.rendimento > 1 ? 'ões' : 'ão'} por embalagem · porção de {p.pesoPorcaoG}g
                        </div>
                      </div>
                      {!p.nutriCompleta && (
                        <div className="text-[11.5px] mb-2" style={{ color: paraVarejo ? '#900' : C.sub }}>Atenção: alguns insumos ainda não têm dado nutricional cadastrado, os valores abaixo estão incompletos e não podem ser impressos como rótulo.</div>
                      )}
                      <table className="w-full text-[12px]">
                        <thead>
                          <tr style={{ color: paraVarejo ? '#000' : C.faint, borderBottom: `1.5px solid ${paraVarejo ? '#000' : C.border}` }} className="text-left text-[10.5px]">
                            <th className="py-1 font-semibold"></th>
                            <th className="py-1 font-semibold text-right">Por porção<br/>({p.pesoPorcaoG}g)</th>
                            <th className="py-1 font-semibold text-right">Por 100{p.formaFisica === 'liquido' ? 'mL' : 'g'}</th>
                            <th className="py-1 font-semibold text-right">%VD*</th>
                          </tr>
                        </thead>
                        <tbody>
                          {linhas.map((l) => (
                            <tr key={l.label} style={{ borderTop: `1px solid ${paraVarejo ? '#999' : C.border}` }}>
                              <td className="py-1.5" style={{ color: paraVarejo ? '#000' : (l.label.startsWith('   ') ? C.sub : C.text) }}>{l.label}</td>
                              <td className="py-1.5 text-right" style={{ ...nums, color: paraVarejo ? '#000' : C.text }}>
                                {n[l.campo]?.toFixed(1)}{l.un}{l.extra ? l.extra(n[l.campo]) : ''}
                              </td>
                              <td className="py-1.5 text-right" style={{ ...nums, color: paraVarejo ? '#000' : C.sub }}>
                                {n100 ? `${n100[l.campo].toFixed(1)}${l.un}` : '—'}
                              </td>
                              <td className="py-1.5 text-right" style={{ ...nums, color: paraVarejo ? '#000' : C.sub }}>
                                {l.vdCampo && vd(l.vdCampo) !== null ? `${vd(l.vdCampo).toFixed(0)}%` : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="text-[9.5px] mt-2 leading-snug" style={{ color: paraVarejo ? '#000' : C.faint }}>
                        *Percentual de valores diários fornecidos pela porção, com base numa dieta de 2.000kcal ou 8.400kJ. Seus valores diários podem ser maiores ou menores dependendo das suas necessidades energéticas. Açúcares totais não têm %VD definido pela norma.
                      </div>
                    </Card>

                    {paraVarejo && (
                      <Card className="p-5 mt-4 max-w-lg">
                        <h3 className="text-[13px] font-semibold mb-1">Falta pro rótulo ficar pronto</h3>
                        <p className="text-[11.5px] mb-3" style={{ color: C.sub }}>A tabela acima está no formato da norma, mas rótulo comercial exige mais do que ela. Nenhum destes é gerado pelo sistema.</p>
                        {(() => {
                          const rot = rotulagem[p.id] || {};
                          const ok = (campo) => !!(rot[campo] && String(rot[campo]).trim());
                          return [
                            ['Valor nutricional validado', temOverride ? 'Valor de laudo informado na ficha nutricional.' : 'Os números vêm de cálculo por composição de ingrediente, não de laudo. Use o botão "Editar valores" pra informar o laudo (tolerância de fiscalização é 20%).', temOverride],
                            ['Lista de ingredientes', 'Em ordem decrescente de peso, obrigatória. Preenchida na ficha técnica do prato.', ok('ingredientes')],
                            ['Alérgenos', 'Alerta dos alérgenos obrigatórios (RDC 26/2015) e de lactose quando aplicável (RDC 135/2017).', ok('alergenos')],
                            ['Glúten', '"Contém glúten" ou "não contém glúten", obrigatório em todo alimento (Lei 10.674/2003).', ok('gluten')],
                            ['Identificação legal', 'Fabricante, CNPJ, endereço e peso líquido. Lote e validade saem do quadro de produção.', ok('fabricante') && ok('endereco') && ok('pesoLiquido')],
                            ...(altoEm.length > 0 ? [['Selo de alerta frontal', 'Arte vetorial oficial do Anexo XVII, aplicada na face frontal conforme as regras de posição e tamanho do Anexo XVIII.', false]] : []),
                            ['Registro sanitário', 'Regularização do produto e do estabelecimento na vigilância sanitária (e SIF/SIE/SIM se for produto de origem animal). Fora do sistema.', false],
                          ].map(([titulo, desc, feito]) => (
                            <div key={titulo} className="flex gap-2.5 py-2" style={{ borderTop: `1px solid ${C.border}` }}>
                              <div className="w-3.5 h-3.5 rounded shrink-0 mt-0.5 flex items-center justify-center" style={{ border: `1.5px solid ${feito ? C.accent : C.borderStrong}`, background: feito ? C.accent : 'transparent' }}>
                                {feito && <span style={{ color: '#fff', fontSize: 9, lineHeight: 1 }}>✓</span>}
                              </div>
                              <div>
                                <div className="text-[12.5px] font-medium" style={{ color: feito ? C.sub : C.text }}>{titulo}</div>
                                <div className="text-[11.5px]" style={{ color: C.sub }}>{desc}</div>
                              </div>
                            </div>
                          ));
                        })()}
                      </Card>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {tab === 'seguranca' && (
            <div className="max-w-5xl">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-[14px] font-semibold">Temperatura de armazenamento</h2>
                <button onClick={() => setShowNovaTemperatura(!showNovaTemperatura)} className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg" style={{ background: showNovaTemperatura ? C.bg : C.text, color: showNovaTemperatura ? C.text : '#fff', border: `1px solid ${showNovaTemperatura ? C.borderStrong : C.text}` }}>
                  {showNovaTemperatura ? 'Fechar' : '+ Registrar leitura'}
                </button>
              </div>
              <p className="text-[12px] mb-3" style={{ color: C.sub }}>Leitura manual por local de armazenamento, com responsável. Fica fora da faixa quando passa do limite cadastrado pro local.</p>

              {showNovaTemperatura && (
                <Card className="mb-4">
                  <NovaTemperaturaForm
                    locais={locaisArmazenamentoBase}
                    onSave={(novo) => { setRegistrosTemperatura([novo, ...registrosTemperatura]); setShowNovaTemperatura(false); }}
                    onCancel={() => setShowNovaTemperatura(false)}
                  />
                </Card>
              )}

              <div className="grid grid-cols-3 gap-3 mb-4">
                {locaisArmazenamentoBase.map((local) => {
                  const ultima = registrosTemperatura.filter((r) => r.localId === local.id).sort((a, b) => (a.data < b.data ? 1 : -1))[0];
                  const foraDaFaixa = ultima && (ultima.temperatura < local.min || ultima.temperatura > local.max);
                  return (
                    <Kpi key={local.id} label={local.nome} value={ultima ? `${ultima.temperatura}°C` : '—'} alerta={foraDaFaixa} sub={`faixa ideal: ${local.min}°C a ${local.max}°C`} />
                  );
                })}
              </div>

              <Card>
                <div className="px-5 py-3.5" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <h2 className="text-[13px] font-semibold">Histórico de leituras</h2>
                </div>
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr style={{ color: C.faint }} className="text-left text-[10.5px] uppercase tracking-wide">
                      <th className="py-2.5 px-5 font-medium">Data</th>
                      <th className="py-2.5 px-3 font-medium">Local</th>
                      <th className="py-2.5 px-3 font-medium">Responsável</th>
                      <th className="py-2.5 px-5 font-medium text-right">Temperatura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrosTemperatura.map((r) => {
                      const local = locaisArmazenamentoBase.find((l) => l.id === r.localId);
                      const foraDaFaixa = local && (r.temperatura < local.min || r.temperatura > local.max);
                      return (
                        <tr key={r.id} style={{ borderTop: `1px solid ${C.border}` }}>
                          <td className="py-2.5 px-5">{r.data}</td>
                          <td className="py-2.5 px-3">{local?.nome}</td>
                          <td className="py-2.5 px-3" style={{ color: C.sub }}>{r.responsavel}</td>
                          <td className="py-2.5 px-5 text-right font-medium" style={{ ...nums, color: foraDaFaixa ? C.danger : C.text }}>{r.temperatura}°C{foraDaFaixa && ' · fora da faixa'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {tab === 'receitas' && (
            <div className="max-w-5xl space-y-3">
              {pratos.map((p) => {
                const aberto = expandido === p.id;
                const canalSel = canalCalc[p.id] || 'ifood-basico';
                const canalObj = canais.find((c) => c.id === canalSel);
                // No canal que embala, o custo do prato sobe: o CMV vira ingrediente +
                // embalagem, e o preço precisa cobrir comissão E embalagem pra manter
                // o mesmo ganho por porção.
                const ganhoAtual = p.precoVenda - p.cmv;
                const custoEmbCanal = canalObj.embala ? p.custoEmbalagem : 0;
                const precoCanal = (p.precoVenda + custoEmbCanal) / (1 - canalObj.comissao);
                const abaixoDoAlvo = p.margemPct / 100 < MARGEM_ALVO;
                return (
                  <Card key={p.id}>
                    <button className="w-full flex items-center justify-between px-5 py-4 text-left" onClick={() => setExpandido(aberto ? null : p.id)}>
                      <div className="flex items-center gap-3">
                        {aberto ? <ChevronDown size={15} style={{ color: C.faint }} /> : <ChevronRight size={15} style={{ color: C.faint }} />}
                        <span className="text-[14px] font-semibold">{p.nome}</span>
                        <Badge acao={p.classe.acao}>{p.classe.label}</Badge>
                      </div>
                      <div className="flex items-center gap-5 text-[12.5px]" style={{ ...nums, color: C.sub }}>
                        <span>CMV {p.cmvPct.toFixed(1)}%</span>
                        <span style={{ color: abaixoDoAlvo ? C.danger : C.text, fontWeight: 600 }}>margem {p.margemPct.toFixed(1)}%</span>
                        <span className="font-semibold" style={{ color: C.text }}>R$ {p.precoVenda.toFixed(2)}</span>
                      </div>
                    </button>

                    {aberto && (
                      <div className="px-5 pb-5" style={{ borderTop: `1px solid ${C.border}` }}>
                        <table className="w-full text-[12.5px] mt-4 mb-4">
                          <thead>
                            <tr style={{ color: C.faint }} className="text-left text-[10.5px] uppercase tracking-wide">
                              <th className="py-2 pr-3 font-medium">Insumo</th>
                              <th className="py-2 pr-3 font-medium text-right">Peso líq.</th>
                              <th className="py-2 pr-3 font-medium text-right">FC</th>
                              <th className="py-2 pr-3 font-medium text-right">Peso bruto</th>
                              <th className="py-2 pr-3 font-medium text-right">Preço/unid.</th>
                              <th className="py-2 font-medium text-right">Custo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {p.linhas.map((l) => {
                              const key = l.insumoId || l.subReceitaId;
                              const idPrep = `${p.id}-${key}`;
                              const prepAberto = preparoAberto === idPrep;
                              return (
                                <>
                                  <tr key={key} style={{ borderTop: `1px solid ${C.border}` }}>
                                    <td className="py-2 pr-3">
                                      <div className="flex items-center gap-1.5">
                                        {l.tipo === 'preparo' && (
                                          <button onClick={() => setPreparoAberto(prepAberto ? null : idPrep)}>
                                            {prepAberto ? <ChevronDown size={11} style={{ color: C.faint }} /> : <ChevronRight size={11} style={{ color: C.faint }} />}
                                          </button>
                                        )}
                                        {l.nome}
                                        {l.tipo === 'preparo' && <Badge>preparo próprio</Badge>}
                                      </div>
                                    </td>
                                    <td className="py-2 pr-3 text-right" style={nums}>{l.pesoLiquido} {l.unidade}</td>
                                    <td className="py-2 pr-3 text-right" style={nums}>
                                      {l.tipo === 'preparo' ? '—' : (
                                        <span title={l.fcObservado ? 'FC medido a partir dos lotes processados' : 'FC cadastrado (referência)'}>
                                          {l.fc.toFixed(3)}{l.fcObservado && <span style={{ color: C.sub }}> ●</span>}
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-2 pr-3 text-right" style={nums}>{l.pesoBruto.toFixed(3)} {l.unidade}</td>
                                    <td className="py-2 pr-3 text-right" style={nums}>R$ {l.precoUnit.toFixed(2)}</td>
                                    <td className="py-2 text-right font-medium" style={nums}>R$ {l.custo.toFixed(2)}</td>
                                  </tr>
                                  {l.tipo === 'preparo' && prepAberto && (
                                    <tr>
                                      <td colSpan={6} className="pb-2">
                                        <div className="ml-5 mt-1 rounded-lg p-3" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                                          <div className="text-[11px] mb-1.5" style={{ color: C.sub }}>Ficha de {l.preparo.nome} (rende {l.preparo.rendimento}{l.preparo.unidadeRendimento})</div>
                                          {l.preparo.ficha.map((f) => {
                                            const insumo = insumoById[f.insumoId];
                                            const pesoBruto = f.pesoLiquido * insumo.fc;
                                            const custo = pesoBruto * precoUnitario(insumo);
                                            return (
                                              <div key={f.insumoId} className="flex justify-between text-[11.5px] py-0.5">
                                                <span>{insumo.nome} · {f.pesoLiquido}{insumo.unidade} · FC {insumo.fc.toFixed(2)}</span>
                                                <span style={nums}>R$ {custo.toFixed(2)}</span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </>
                              );
                            })}
                            <tr style={{ borderTop: `1.5px solid ${C.borderStrong}` }}>
                              <td className="py-2.5 pr-3 font-semibold" colSpan={5}>CMV de ingredientes</td>
                              <td className="py-2.5 text-right font-semibold" style={nums}>R$ {p.cmv.toFixed(2)}</td>
                            </tr>
                            {p.linhasEmbalagem.length > 0 && (
                              <>
                                <tr>
                                  <td colSpan={6} className="pt-3 pb-1 text-[10.5px] uppercase tracking-wide" style={{ color: C.faint }}>Embalagem (só em venda de viagem/delivery)</td>
                                </tr>
                                {p.linhasEmbalagem.map((e) => (
                                  <tr key={e.insumoId} style={{ borderTop: `1px solid ${C.border}` }}>
                                    <td className="py-2 pr-3" colSpan={5} style={{ color: C.sub }}>{e.nome}</td>
                                    <td className="py-2 text-right" style={nums}>R$ {e.custo.toFixed(2)}</td>
                                  </tr>
                                ))}
                                <tr style={{ borderTop: `1px solid ${C.border}` }}>
                                  <td className="py-2 pr-3 font-medium" colSpan={5}>Custo total embalado (ingrediente + embalagem)</td>
                                  <td className="py-2 text-right font-semibold" style={nums}>R$ {(p.cmv + p.custoEmbalagem).toFixed(2)}</td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>

                        <div className="grid grid-cols-4 gap-3 mb-4">
                          {[
                            ['CMV do prato', `R$ ${p.cmv.toFixed(2)}`, `${p.cmvPct.toFixed(1)}%`, false],
                            ['Preço atual', `R$ ${p.precoVenda.toFixed(2)}`, null, false],
                            [`Preço sugerido (margem ${(MARGEM_ALVO * 100).toFixed(0)}%)`, `R$ ${(p.cmv / (1 - MARGEM_ALVO)).toFixed(2)}`, null, false],
                            ['Margem no preço atual', `${p.margemPct.toFixed(1)}%`, null, abaixoDoAlvo],
                          ].map(([label, value, extra, alerta], idx) => (
                            <div key={idx} className="rounded-lg p-3" style={{ background: C.bg }}>
                              <div className="text-[11px]" style={{ color: C.sub }}>{label}</div>
                              <div className="text-[14px] font-semibold mt-0.5" style={{ ...nums, color: alerta ? C.danger : C.text }}>{value} {extra && <span className="text-[11px] font-normal" style={{ color: C.faint }}>({extra})</span>}</div>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-lg p-4 mb-4" style={{ background: C.bg }}>
                          <div className="flex items-center gap-2 text-[12px] mb-3" style={{ color: C.sub }}>
                            <Store size={13} /> Vendendo no {canalObj.nome}: {canalObj.embala ? `além da comissão, o prato leva embalagem (R$ ${p.custoEmbalagem.toFixed(2)} por porção)` : 'sem comissão e sem embalagem'}. Esse é o preço pra manter o mesmo ganho de hoje (R$ {ganhoAtual.toFixed(2)} por porção).
                          </div>
                          <div className="flex items-center gap-4 flex-wrap">
                            <select
                              value={canalSel}
                              onChange={(e) => setCanalCalc({ ...canalCalc, [p.id]: e.target.value })}
                              className="text-[12.5px] px-2.5 py-1.5 rounded-md"
                              style={{ border: `1px solid ${C.borderStrong}`, background: C.panel }}
                            >
                              {canais.map((c) => <option key={c.id} value={c.id}>{c.nome} ({(c.comissao * 100).toFixed(1)}%)</option>)}
                            </select>
                            <div className="text-[12.5px]">Preço hoje: <b style={nums}>R$ {p.precoVenda.toFixed(2)}</b></div>
                            {canalObj.comissao > 0 ? (
                              <div className="text-[12.5px]">
                                Preço nesse canal: <b style={nums}>R$ {precoCanal.toFixed(2)}</b>{' '}
                                <span style={{ color: C.faint }}>(+R$ {(precoCanal - p.precoVenda).toFixed(2)}: R$ {custoEmbCanal.toFixed(2)} de embalagem e R$ {(precoCanal - p.precoVenda - custoEmbCanal).toFixed(2)} de comissão)</span>
                              </div>
                            ) : (
                              <div className="text-[12.5px]" style={{ color: C.sub }}>{canalObj.embala ? `Sem comissão, mas embala: +R$ ${custoEmbCanal.toFixed(2)} de embalagem, preço pra manter o ganho fica R$ ${precoCanal.toFixed(2)}.` : 'Sem comissão e sem embalagem, preço já é o de hoje.'}</div>
                            )}
                          </div>
                        </div>

                        <div className="rounded-lg mb-4" style={{ border: `1px solid ${C.border}` }}>
                          <button
                            onClick={() => setRotulagemAberta(rotulagemAberta === p.id ? null : p.id)}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 text-left"
                          >
                            <div className="flex items-center gap-2">
                              {rotulagemAberta === p.id ? <ChevronDown size={13} style={{ color: C.faint }} /> : <ChevronRight size={13} style={{ color: C.faint }} />}
                              <span className="text-[12.5px] font-medium">Dados de rotulagem</span>
                              <Badge>opcional</Badge>
                            </div>
                            <span className="text-[11px]" style={{ color: C.faint }}>
                              {Object.values(rotulagem[p.id] || {}).filter((v) => v && String(v).trim()).length} de 8 campos preenchidos
                            </span>
                          </button>

                          {rotulagemAberta === p.id && (
                            <div className="px-3.5 pb-3.5" style={{ borderTop: `1px solid ${C.border}` }}>
                              <p className="text-[11.5px] my-3" style={{ color: C.sub }}>
                                Só faz falta pra quem vende em mercado ou varejo de terceiro. Quem serve no próprio estabelecimento pode deixar tudo em branco, o resto do sistema funciona igual.
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  ['ingredientes', 'Lista de ingredientes (ordem decrescente de peso)', true],
                                  ['alergenos', 'Alérgenos (RDC 26/2015)', true],
                                  ['gluten', 'Glúten: contém / não contém', false],
                                  ['lactose', 'Lactose, quando aplicável', false],
                                  ['fabricante', 'Fabricante e CNPJ', false],
                                  ['endereco', 'Endereço do fabricante', false],
                                  ['pesoLiquido', 'Peso líquido da embalagem', false],
                                  ['conservacao', 'Modo de conservação e validade', false],
                                ].map(([campo, label, largo]) => (
                                  <div key={campo} className={largo ? 'col-span-2' : ''}>
                                    <div className="text-[10.5px] mb-1" style={{ color: C.faint }}>{label}</div>
                                    <input
                                      value={(rotulagem[p.id] || {})[campo] || ''}
                                      onChange={(e) => setRotulagem({ ...rotulagem, [p.id]: { ...(rotulagem[p.id] || {}), [campo]: e.target.value } })}
                                      className="text-[12px] px-2.5 py-1.5 rounded-md w-full"
                                      style={{ border: `1px solid ${C.borderStrong}`, background: C.panel }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => gerarPdf('Ficha de Custos (dono)')} className="flex items-center gap-1.5 text-[12.5px] font-medium px-3.5 py-2 rounded-lg" style={{ background: C.text, color: '#fff' }}>
                            <Download size={13} /> PDF · Ficha de Custos
                          </button>
                          <button onClick={() => gerarPdf('Ficha Operacional (cozinha)')} className="flex items-center gap-1.5 text-[12.5px] font-medium px-3.5 py-2 rounded-lg" style={{ border: `1px solid ${C.borderStrong}` }}>
                            <Download size={13} /> PDF · Ficha Operacional
                          </button>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
              {pdfMsg && (
                <div className="fixed bottom-6 right-6 text-[12.5px] px-4 py-2.5 rounded-lg" style={{ background: C.text, color: '#fff', boxShadow: shadow }}>
                  Gerando {pdfMsg}… (mock, sem geração real ainda)
                </div>
              )}
            </div>
          )}

          {tab === 'relatorios' && (
            <div className="max-w-5xl space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[12.5px]" style={{ color: C.sub }}>Consolidado dos últimos 30 dias. Tudo aqui vem das outras abas, ninguém digita nada duas vezes.</p>
                <button onClick={() => gerarPdf('Relatório gerencial')} className="flex items-center gap-1.5 text-[12.5px] font-medium px-3.5 py-2 rounded-lg" style={{ background: C.text, color: '#fff' }}>
                  <Download size={13} /> Exportar PDF
                </button>
              </div>

              <div>
                <h2 className="text-[14px] font-semibold mb-1">Setembro contra agosto</h2>
                <p className="text-[12px] mb-3" style={{ color: C.sub }}>Variação em pontos percentuais pro que já é percentual, e em percentual pro que é valor.</p>
                <div className="grid grid-cols-4 gap-3">
                  {comparativos.map((c2) => {
                    const subiu = c2.delta > 0;
                    const bom = subiu === c2.bomSeSobe;
                    return (
                      <Card key={c2.label} className="p-4">
                        <div className="text-[12.5px]" style={{ color: C.sub }}>{c2.label}</div>
                        <div className="text-[24px] font-bold mt-1 leading-none" style={{ ...nums, letterSpacing: '-0.02em' }}>{c2.atual}</div>
                        <div className="text-[12px] mt-2 font-medium" style={{ ...nums, color: bom ? C.accent : C.danger }}>
                          {subiu ? '↑' : '↓'} {Math.abs(c2.delta).toFixed(1)}{c2.unidade} vs. agosto
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Card className="p-5">
                <h3 className="text-[13px] font-semibold mb-1">Faturamento, custo e margem no ano</h3>
                <p className="text-[11.5px] mb-4" style={{ color: C.sub }}>Barras são valor em reais (eixo da esquerda), a linha é a margem em % (eixo da direita). Quando a barra de custo cresce mais rápido que a de faturamento, a linha cai.</p>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={historicoMensal} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                    <rect x={-200} y={-200} width={3000} height={2000} fill={C.panel} />
                    <CartesianGrid stroke={C.border} vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: C.faint }} tickLine={false} axisLine={{ stroke: C.border }} />
                    <YAxis yAxisId="esq" tick={{ fontSize: 10, fill: C.faint }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} width={40} />
                    <YAxis yAxisId="dir" orientation="right" domain={[65, 80]} tick={{ fontSize: 10, fill: C.faint }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} width={38} />
                    <Tooltip content={({ payload, label }) => {
                      if (!payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="text-xs p-3 rounded-lg" style={{ background: C.text, color: '#fff' }}>
                          <div className="font-semibold mb-1">{label}</div>
                          <div style={nums}>Faturamento: R$ {d.faturamento.toLocaleString('pt-BR')}</div>
                          <div style={nums}>Custo de ingrediente: R$ {d.custoIngredientes.toLocaleString('pt-BR')}</div>
                          <div style={nums}>Perdas: R$ {d.perdas.toLocaleString('pt-BR')}</div>
                          <div style={{ ...nums, marginTop: 4 }}>CMV {d.cmvPct.toFixed(1)}% · margem {d.margemPct.toFixed(1)}%</div>
                        </div>
                      );
                    }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Bar yAxisId="esq" dataKey="faturamento" name="Faturamento" fill={C.borderStrong} radius={[3, 3, 0, 0]} />
                    <Bar yAxisId="esq" dataKey="custoIngredientes" name="Custo de ingrediente" fill={C.sub} radius={[3, 3, 0, 0]} />
                    <Line yAxisId="dir" type="monotone" dataKey="margemPct" name="Margem %" stroke={C.accent} strokeWidth={2.5} dot={{ r: 3, fill: C.accent }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-5">
                <h3 className="text-[13px] font-semibold mb-1">Perdas mês a mês</h3>
                <p className="text-[11.5px] mb-4" style={{ color: C.sub }}>Quebra de estoque e lote descartado somados, em reais. Vermelho passa de R$ 700 no mês.</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={historicoMensal} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                    <rect x={-200} y={-200} width={3000} height={2000} fill={C.panel} />
                    <CartesianGrid stroke={C.border} vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: C.faint }} tickLine={false} axisLine={{ stroke: C.border }} />
                    <YAxis tick={{ fontSize: 10, fill: C.faint }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip content={({ payload, label }) => {
                      if (!payload || !payload.length) return null;
                      return (
                        <div className="text-xs p-2.5 rounded-lg" style={{ background: C.text, color: '#fff' }}>
                          <div className="font-semibold">{label}</div>
                          <div style={nums}>R$ {payload[0].payload.perdas.toLocaleString('pt-BR')} em perdas</div>
                        </div>
                      );
                    }} />
                    <Bar dataKey="perdas" radius={[3, 3, 0, 0]}>
                      {historicoMensal.map((m, i) => (
                        <Cell key={i} fill={m.perdas > 700 ? C.danger : C.sub} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <div className="px-5 py-3.5" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <h3 className="text-[13px] font-semibold">Fechamento mês a mês</h3>
                </div>
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr style={{ color: C.faint }} className="text-left text-[10.5px] uppercase tracking-wide">
                      <th className="py-2.5 px-5 font-medium">Mês</th>
                      <th className="py-2.5 px-3 font-medium text-right">Faturamento</th>
                      <th className="py-2.5 px-3 font-medium text-right">Custo</th>
                      <th className="py-2.5 px-3 font-medium text-right">Perdas</th>
                      <th className="py-2.5 px-3 font-medium text-right">CMV</th>
                      <th className="py-2.5 px-5 font-medium text-right">Margem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...historicoMensal].reverse().map((m, i, arr) => {
                      const ant = arr[i + 1];
                      const deltaMargem = ant ? m.margemPct - ant.margemPct : null;
                      return (
                        <tr key={m.mes} style={{ borderTop: `1px solid ${C.border}` }}>
                          <td className="py-2.5 px-5 font-medium">{m.mes}</td>
                          <td className="py-2.5 px-3 text-right" style={nums}>R$ {m.faturamento.toLocaleString('pt-BR')}</td>
                          <td className="py-2.5 px-3 text-right" style={nums}>R$ {m.custoIngredientes.toLocaleString('pt-BR')}</td>
                          <td className="py-2.5 px-3 text-right" style={{ ...nums, color: m.perdas > 700 ? C.danger : C.text }}>R$ {m.perdas.toLocaleString('pt-BR')}</td>
                          <td className="py-2.5 px-3 text-right" style={nums}>{m.cmvPct.toFixed(1)}%</td>
                          <td className="py-2.5 px-5 text-right font-medium" style={{ ...nums, color: m.margemPct / 100 < MARGEM_ALVO ? C.danger : C.text }}>
                            {m.margemPct.toFixed(1)}%
                            {deltaMargem !== null && (
                              <span className="text-[10.5px] font-normal ml-1.5" style={{ color: deltaMargem >= 0 ? C.accent : C.danger }}>
                                {deltaMargem >= 0 ? '↑' : '↓'}{Math.abs(deltaMargem).toFixed(1)}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>

              <div>
                <h2 className="text-[14px] font-semibold mb-3">Onde o dinheiro está vazando neste mês</h2>
                <div className="grid grid-cols-4 gap-3">
                  <Kpi label="Quebra de estoque" value={`R$ ${quebraTotalMes.toFixed(0)}`} alerta={quebraTotalMes > 0} sub="consumo real acima da ficha" />
                  <Kpi label="Lotes perdidos na produção" value={`R$ ${custoPerdasProducao.toFixed(0)}`} alerta={custoPerdasProducao > 0} sub={`${perdasProducao.length} lote${perdasProducao.length !== 1 ? 's' : ''} descartado${perdasProducao.length !== 1 ? 's' : ''}`} />
                  <Kpi label="Comissão não recuperada" value={`R$ ${perdaIfoodMes.toFixed(0)}`} alerta sub="delivery sem preço ajustado" />
                  <Kpi label="Total identificado" value={`R$ ${(quebraTotalMes + custoPerdasProducao + perdaIfoodMes).toFixed(0)}`} alerta sub="por mês, em perdas evitáveis" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Card className="p-5">
                  <h3 className="text-[13px] font-semibold mb-1">Perdas de produção por turno</h3>
                  <p className="text-[11.5px] mb-3" style={{ color: C.sub }}>Custo dos lotes descartados, separado pelo turno em que foram produzidos.</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={perdasPorTurno} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                      <rect x={-200} y={-200} width={3000} height={2000} fill={C.panel} />
                      <CartesianGrid stroke={C.border} vertical={false} />
                      <XAxis dataKey="turno" tick={{ fontSize: 11, fill: C.faint }} tickLine={false} axisLine={{ stroke: C.border }} />
                      <YAxis tick={{ fontSize: 11, fill: C.faint }} tickLine={false} axisLine={false} />
                      <Tooltip content={({ payload }) => {
                        if (!payload || !payload.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="text-xs p-2.5 rounded-lg" style={{ background: C.text, color: '#fff' }}>
                            <div className="font-semibold">{d.turno}</div>
                            <div style={nums}>R$ {d.custo.toFixed(2)} · {d.lotes} lote{d.lotes !== 1 ? 's' : ''}</div>
                          </div>
                        );
                      }} />
                      <Bar dataKey="custo" radius={[4, 4, 0, 0]}>
                        {perdasPorTurno.map((d, i) => <Cell key={i} fill={d.custo > 0 ? C.danger : C.border} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-5">
                  <h3 className="text-[13px] font-semibold mb-1">Margem por prato</h3>
                  <p className="text-[11.5px] mb-3" style={{ color: C.sub }}>Vermelho está abaixo do alvo de {(MARGEM_ALVO * 100).toFixed(0)}%.</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={[...pratos].sort((a, b) => a.margemPct - b.margemPct)} layout="vertical" margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                      <rect x={-200} y={-200} width={3000} height={2000} fill={C.panel} />
                      <CartesianGrid stroke={C.border} horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: C.faint }} tickLine={false} axisLine={{ stroke: C.border }} />
                      <YAxis type="category" dataKey="nome" width={110} tick={{ fontSize: 10, fill: C.sub }} tickLine={false} axisLine={false} />
                      <ReferenceLine x={MARGEM_ALVO * 100} stroke={C.borderStrong} strokeDasharray="4 4" />
                      <Tooltip content={({ payload }) => {
                        if (!payload || !payload.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="text-xs p-2.5 rounded-lg" style={{ background: C.text, color: '#fff' }}>
                            <div className="font-semibold">{d.nome}</div>
                            <div style={nums}>margem {d.margemPct.toFixed(1)}% · CMV R$ {d.cmv.toFixed(2)}</div>
                          </div>
                        );
                      }} />
                      <Bar dataKey="margemPct" radius={[0, 4, 4, 0]}>
                        {[...pratos].sort((a, b) => a.margemPct - b.margemPct).map((p) => (
                          <Cell key={p.id} fill={p.margemPct / 100 < MARGEM_ALVO ? C.danger : C.text} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              <div>
                <h2 className="text-[14px] font-semibold mb-1">Desempenho por responsável</h2>
                <p className="text-[12px] mb-3" style={{ color: C.sub }}>Cruzamento do que cada pessoa registrou nas outras abas. Serve pra treinar quem precisa, não pra punir: descarte alto pode ser técnica de corte, mas também pode ser matéria-prima ruim do fornecedor.</p>
                <Card>
                  <table className="w-full text-[12.5px]">
                    <thead>
                      <tr style={{ color: C.faint }} className="text-left text-[10.5px] uppercase tracking-wide">
                        <th className="py-2.5 px-5 font-medium">Responsável</th>
                        <th className="py-2.5 px-3 font-medium text-right">Lotes de proteína</th>
                        <th className="py-2.5 px-3 font-medium text-right">Descarte médio</th>
                        <th className="py-2.5 px-3 font-medium text-right">Perdas no turno</th>
                        <th className="py-2.5 px-5 font-medium text-right">Temp. fora da faixa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {desempenhoPorPessoa.map((d) => (
                        <tr key={d.nome} style={{ borderTop: `1px solid ${C.border}` }}>
                          <td className="py-2.5 px-5 font-medium">{d.nome}</td>
                          <td className="py-2.5 px-3 text-right" style={nums}>{d.lotesProteina || '—'}</td>
                          <td className="py-2.5 px-3 text-right" style={{ ...nums, color: d.descarteMedio > 10 ? C.danger : C.text }}>
                            {d.descarteMedio !== null ? `${d.descarteMedio.toFixed(1)}%` : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right" style={{ ...nums, color: d.perdasTurno > 0 ? C.danger : C.faint }}>{d.perdasTurno || '—'}</td>
                          <td className="py-2.5 px-5 text-right" style={{ ...nums, color: d.tempForaFaixa > 0 ? C.danger : C.faint }}>{d.tempForaFaixa || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>

              <div>
                <h2 className="text-[14px] font-semibold mb-1">Pendências que precisam de decisão</h2>
                <p className="text-[12px] mb-3" style={{ color: C.sub }}>{alertasAbertos.length} item{alertasAbertos.length !== 1 ? 's' : ''} aberto{alertasAbertos.length !== 1 ? 's' : ''} hoje.</p>
                <Card>
                  <div className="px-5 py-1">
                    {alertasAbertos.map((a, i) => (
                      <div key={i} className="flex items-start justify-between gap-4 py-2.5" style={{ borderTop: i ? `1px solid ${C.border}` : 'none' }}>
                        <div className="flex gap-2.5">
                          <Badge acao>{a.tipo}</Badge>
                          <div className="text-[12.5px]">{a.texto}</div>
                        </div>
                        <div className="text-[11.5px] text-right shrink-0" style={{ color: C.sub }}>{a.acao}</div>
                      </div>
                    ))}
                    {alertasAbertos.length === 0 && <div className="text-[12.5px] py-4" style={{ color: C.sub }}>Nada pendente no momento.</div>}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {tab === 'config' && (
            <Card className="p-6 max-w-5xl space-y-3">
              {[['Restaurante', 'Restaurante do Eduardo'], ['WhatsApp vinculado', '+55 51 9•••• ••••'], ['Margem alvo padrão', `${(MARGEM_ALVO * 100).toFixed(0)}%`], ['Plano', 'Trial · 9 dias restantes']].map(([l, v]) => (
                <div key={l} className="text-[13px] flex gap-2"><span style={{ color: C.sub }}>{l}:</span> <span className="font-medium">{v}</span></div>
              ))}
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
