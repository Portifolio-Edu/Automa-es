import { useCallback, useEffect, useRef, useState } from 'react'
import './voy.css'

// TODO: trocar pelo link real de WhatsApp da Voy antes de publicar
const WHATSAPP_URL = 'https://wa.me/55'
const DIAGNOSTICO_URL = WHATSAPP_URL

/* ============================================================
   Diagramas gravados — linguagem da capa do Golden Record:
   só traço, sem preenchimento, como instruções gravadas no disco.
   ============================================================ */

const DiagramaPulsar = () => (
  // mapa de pulsares: direção — a peça diante do público certo
  <svg className="diagrama" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <circle cx="100" cy="100" r="96" strokeOpacity="0.35" />
    <circle cx="100" cy="100" r="4" />
    {[14, 47, 86, 128, 155, 199, 236, 262, 291, 324].map((ang, i) => {
      const a = (ang * Math.PI) / 180
      const len = 52 + (i % 4) * 11
      const x2 = 100 + len * Math.cos(a)
      const y2 = 100 + len * Math.sin(a)
      const tx = 100 + (len * 0.55) * Math.cos(a)
      const ty = 100 + (len * 0.55) * Math.sin(a)
      return (
        <g key={ang}>
          <line x1={100 + 8 * Math.cos(a)} y1={100 + 8 * Math.sin(a)} x2={x2} y2={y2} />
          <line
            x1={tx + 4 * Math.sin(a)} y1={ty - 4 * Math.cos(a)}
            x2={tx - 4 * Math.sin(a)} y2={ty + 4 * Math.cos(a)}
          />
        </g>
      )
    })}
  </svg>
)

const DiagramaAgulha = () => (
  // como tocar o disco: a agulha sobre os sulcos — o destino onde a narrativa converte
  <svg className="diagrama" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <circle cx="100" cy="100" r="96" strokeOpacity="0.35" />
    {[26, 40, 54, 68, 82].map((r) => (
      <path key={r} d={`M ${64 - r} 128 A ${r} ${r} 0 0 1 ${64 + r} 128`} />
    ))}
    <circle cx="64" cy="128" r="5" />
    <line x1="64" y1="128" x2="64" y2="123" />
    <line x1="168" y1="34" x2="92" y2="96" />
    <circle cx="168" cy="34" r="7" />
    <line x1="92" y1="96" x2="88" y2="104" />
    <circle cx="88" cy="106" r="2.5" fill="currentColor" stroke="none" />
  </svg>
)

const DiagramaTrajetoria = () => (
  // o diagrama de trajetória com assistes gravitacionais — direção, não slide
  <svg className="diagrama" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <circle cx="100" cy="100" r="96" strokeOpacity="0.35" />
    <path d="M 20 168 C 60 160, 58 128, 78 118 A 12 12 0 1 0 92 100 C 104 84, 128 88, 138 72 A 9 9 0 1 0 148 58 C 156 44, 166 36, 178 30" strokeDasharray="4 4" />
    <circle cx="84" cy="112" r="7" />
    <circle cx="145" cy="66" r="5" />
    <circle cx="30" cy="164" r="9" />
    <path d="M 170 38 l 8 -8 M 178 38 v -8 h -8" strokeWidth="1" />
  </svg>
)

const DiagramaOnda = () => (
  // a forma de onda gravada no disco: sinal contínuo — o fluxo que sustenta
  <svg className="diagrama" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <circle cx="100" cy="100" r="96" strokeOpacity="0.35" />
    <path d="M 24 100 h 14 v -22 h 12 v 44 h 12 v -30 h 12 v 16 h 12 v -38 h 12 v 52 h 12 v -34 h 12 v 20 h 12 v -12 h 12 v 4 h 14" />
    {Array.from({ length: 13 }).map((_, i) => (
      <line key={i} x1={30 + i * 12} y1="150" x2={30 + i * 12} y2={i % 3 === 0 ? 138 : 144} />
    ))}
    <line x1="24" y1="58" x2="176" y2="58" strokeOpacity="0.4" strokeDasharray="2 5" />
  </svg>
)

const DiagramaHidrogenio = () => (
  // a transição hiperfina do hidrogênio, da capa do disco: a unidade fundamental de comunicação
  <svg className="diagrama" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <circle cx="100" cy="100" r="96" strokeOpacity="0.35" />
    <circle cx="62" cy="100" r="26" />
    <circle cx="138" cy="100" r="26" />
    <circle cx="62" cy="100" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="138" cy="100" r="2.5" fill="currentColor" stroke="none" />
    <line x1="62" y1="66" x2="62" y2="54" />
    <path d="M 58 58 l 4 -6 l 4 6" />
    <line x1="138" y1="134" x2="138" y2="146" />
    <path d="M 134 142 l 4 6 l 4 -6" />
    <line x1="94" y1="100" x2="106" y2="100" />
    <line x1="100" y1="94" x2="100" y2="106" />
  </svg>
)

const MiraLancamento = () => (
  // marca de lançamento: a cruz de mira de onde a Rota parte
  <svg className="hero-mira" viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <circle cx="80" cy="80" r="60" strokeOpacity="0.4" />
    <circle cx="80" cy="80" r="34" strokeDasharray="3 5" />
    <line x1="80" y1="4" x2="80" y2="40" />
    <line x1="80" y1="120" x2="80" y2="156" />
    <line x1="4" y1="80" x2="40" y2="80" />
    <line x1="120" y1="80" x2="156" y2="80" />
    <circle cx="80" cy="80" r="3" fill="currentColor" stroke="none" />
  </svg>
)

/* ============================================================
   Conteúdo — cópia usada exatamente como fornecida
   ============================================================ */

const SERVICOS = [
  {
    curto: 'Tráfego Pago',
    titulo: 'Tráfego Pago de Alta Performance',
    tagline:
      'O vídeo que a Voy produz é a sua melhor peça criativa; o tráfego é o que coloca essa peça diante do público certo.',
    descricao:
      'Não apenas "subimos campanhas": transformamos cada view em um ativo comercial, conectando sua produção audiovisual aos dados de performance para garantir que o lead seja qualificado desde o primeiro clique.',
    entregaveis: [
      'Gestão focada em CAC e payback real, independente do nicho',
      'Testes de fadiga de criativos integrados com a produtora',
      'Estratégia desenhada pra escalar o que traz retorno, eliminando métricas de vaidade.',
    ],
    ideal:
      'negócios que já investem em audiovisual de qualidade e querem garantir que cada centavo em anúncio converta em venda.',
    Diagrama: DiagramaPulsar,
  },
  {
    curto: 'Landing Pages',
    titulo: 'Landing Pages de Conversão',
    tagline:
      'A Produtora Voy cria a narrativa visual; nós criamos o destino onde essa narrativa se converte em dinheiro.',
    descricao:
      'Projetamos páginas que mantêm a identidade visual da marca e dão o contexto necessário pra que o lead que chegou pelo vídeo tome a decisão de compra de forma fluida e sem fricção.',
    entregaveis: [
      'Design de interface que preserva o impacto visual dos vídeos da Voy',
      'Arquitetura validada por testes A/B',
      'Integração total: o lead assiste, clica e já entra no CRM.',
    ],
    ideal:
      'quem tem conteúdo de altíssimo nível mas perde conversão no site por falta de uma página à altura.',
    Diagrama: DiagramaAgulha,
  },
  {
    curto: 'Consultoria Estratégica',
    titulo: 'Consultoria Estratégica & Crescimento',
    tagline:
      'Unimos a expertise em branding da Produtora Voy com a visão técnica de um arquiteto de automação.',
    descricao:
      'Analisamos a operação de ponta a ponta, diagnosticando onde o conteúdo de vídeo poderia gerar mais impacto. Não entregamos slide. Entregamos direção.',
    entregaveis: [
      'Mapeamento de funil integrando conteúdo, tráfego e vendas',
      'Diagnóstico prático em 90-180 dias',
      'Validação de estratégia antes de grandes alocações de capital.',
    ],
    ideal:
      'fundadores que buscam visão estratégica integrada, usando o poder do vídeo aliado a uma operação robusta.',
    Diagrama: DiagramaTrajetoria,
  },
  {
    curto: 'Automações',
    titulo: 'Automação Inteligente',
    tagline: 'O vídeo atrai, mas a automação sustenta.',
    descricao:
      'Não apenas conectamos ferramentas: reescrevemos o fluxo do negócio, eliminando tarefas repetitivas e centralizando dados pra que a mão de obra humana assuma a direção estratégica.',
    entregaveis: [
      'Sincronização bidirecional entre CRM, marketing e finanças',
      'Relatórios automatizados com clareza pra decisão',
      'Redesign de processos pra velocidade e previsibilidade.',
    ],
    ideal:
      'empresas que operam em silos e precisam de operação fluida pra focar no que traz lucro.',
    Diagrama: DiagramaOnda,
  },
  {
    curto: 'Agentes de IA',
    titulo: 'Agentes de IA & Inteligência Multimodal',
    tagline:
      'Agentes de IA que operam como uma extensão real do time, com memória contextual profunda e autonomia pra agir.',
    descricao:
      'Não apenas "respondem": processam áudio, vídeo, documentos e imagens, entendendo o contexto de cada interação, com o tom de voz exclusivo da empresa em todos os canais.',
    entregaveis: [
      'Multimodalidade real em arquivos, áudios e imagens',
      'Execução autônoma (CRM, reuniões, relatórios) sem intervenção humana',
      'Memória de longo prazo que refina o atendimento a cada interação.',
    ],
    ideal: 'operações que buscam atendimento multicanal altamente personalizado e escalável.',
    Diagrama: DiagramaHidrogenio,
  },
]

const PASSOS = [
  { nome: 'Diagnóstico', texto: 'entendemos o negócio, o funil atual e onde o crescimento trava.' },
  { nome: 'Arquitetura', texto: 'desenhamos a operação, quais frentes entram, em que ordem, com que investimento.' },
  { nome: 'Implementação', texto: 'criativo, páginas, campanhas e automações construídos pela mesma equipe.' },
  { nome: 'Operação', texto: 'tudo no ar, com acompanhamento ativo e correção rápida.' },
  { nome: 'Evolução', texto: 'relatório executivo, aprendizado incorporado, próxima alavanca definida.' },
]

const LEITURAS = [
  { valor: '+15 mil', rotulo: 'produções entregues' },
  { valor: 'a produtora que mais cresce', rotulo: 'no estado' },
  { valor: 'uma só operação', rotulo: 'do criativo à conversão' },
]

const DUVIDAS = [
  {
    p: 'Preciso contratar as cinco frentes de uma vez?',
    r: 'Não. O diagnóstico define por onde começar. Quando expandir, as frentes já nascem integradas.',
  },
  {
    p: 'Já tenho agência de tráfego, faz sentido falar com vocês?',
    r: 'Faz. Muitas operações travam no que vem antes e depois da mídia: página, processo e follow-up.',
  },
  {
    p: 'O que exatamente são os agentes de IA?',
    r: 'Sistemas treinados no seu negócio que conversam, qualificam e encaminham pro seu time no momento certo, com supervisão, não robô genérico.',
  },
  {
    p: 'Funciona pra empresa pequena ou só marca grande?',
    r: 'Funciona pros dois. O escopo se ajusta ao tamanho, o padrão de execução não muda.',
  },
  {
    p: 'A verba de mídia está inclusa no valor?',
    r: 'Não. Vai direto pra plataforma, com transparência total na proposta.',
  },
]

/* ============================================================
   A Rota — elemento de assinatura.
   Uma única linha que nasce no lançamento, faz um slingshot em
   volta de cada frente, atravessa o plano de voo e termina
   enrolada no sulco do Golden Record.
   ============================================================ */

function usePrefersReducedMotion() {
  const [reduzido, setReduzido] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduzido(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduzido
}

const bezierAte = (de, ate) => {
  const dy = Math.max((ate.y - de.y) * 0.45, 40)
  return ` C ${de.x} ${de.y + dy}, ${ate.x} ${ate.y - dy}, ${ate.x} ${ate.y}`
}

function espiralPath(cx, cy, rExt, rInt, voltas) {
  const passos = Math.ceil(voltas * 64)
  const total = voltas * Math.PI * 2
  let d = ''
  for (let i = 0; i <= passos; i++) {
    const t = (i / passos) * total
    const r = rExt - ((rExt - rInt) * t) / total
    const x = cx + r * Math.cos(t - Math.PI / 2)
    const y = cy + r * Math.sin(t - Math.PI / 2)
    d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

function RotaSvg({ rootRef }) {
  const [geo, setGeo] = useState(null)
  const linhaRef = useRef(null)
  const sondaRef = useRef(null)
  const distanciaRef = useRef(null)
  const nodesRef = useRef([])
  const wpsRef = useRef([])
  const reduzido = usePrefersReducedMotion()

  const medir = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const rr = root.getBoundingClientRect()
    const centro = (el) => {
      const r = el.getBoundingClientRect()
      return { x: r.left - rr.left + r.width / 2, y: r.top - rr.top + r.height / 2 }
    }
    const largura = root.clientWidth
    const altura = root.scrollHeight
    const mobile = largura < 1025

    const inicio = root.querySelector('[data-rota="inicio"]')
    const nodes = [...root.querySelectorAll('[data-rota="node"]')]
    const wps = [...root.querySelectorAll('[data-rota="wp"]')]
    const vias = [...root.querySelectorAll('[data-rota="via"]')]
    const disco = root.querySelector('[data-rota="disco"]')
    const escuro = root.querySelector('[data-rota="escuro"]')
    if (!inicio || !disco || nodes.length === 0) return

    let pInicio = centro(inicio)
    if (inicio.getBoundingClientRect().width === 0 && inicio.getBoundingClientRect().height === 0) {
      // âncora do hero fica display:none nas larguras menores: parte do fim do hero
      const hero = root.querySelector('.hero')
      const hr = hero.getBoundingClientRect()
      pInicio = { x: 18, y: hr.bottom - rr.top - 24 }
    }
    const pDisco = centro(disco)
    const discoR = disco.getBoundingClientRect().width / 2
    const rExt = discoR * 0.94
    const rInt = discoR * 0.42
    const espiralInicio = { x: pDisco.x, y: pDisco.y - rExt }
    const yEscuro = escuro ? escuro.getBoundingClientRect().top - rr.top : altura * 0.72

    let d
    let pontosNode = []
    let pontosWp = []

    if (mobile) {
      // composição própria do celular/tablet: linha de guia na borda esquerda
      const x = 18
      d = `M ${x} ${pInicio.y}`
      let prev = { x, y: pInicio.y }
      pontosNode = nodes.map((el) => ({ x, y: centro(el).y }))
      pontosWp = wps.map((el) => ({ x, y: centro(el).y }))
      const yFimReta = pDisco.y - discoR * 1.4
      d += ` L ${x} ${yFimReta}`
      prev = { x, y: yFimReta }
      d += bezierAte(prev, espiralInicio)
    } else {
      d = `M ${pInicio.x} ${pInicio.y}`
      let prev = pInicio
      const R = 44
      nodes.forEach((el, i) => {
        const c = centro(el)
        const s = i % 2 === 0 ? 1 : -1
        const aE = ((-90 - s * 38) * Math.PI) / 180
        const aX = ((90 + s * 38) * Math.PI) / 180
        const E = { x: c.x + R * Math.cos(aE), y: c.y + R * Math.sin(aE) }
        const X = { x: c.x + R * Math.cos(aX), y: c.y + R * Math.sin(aX) }
        d += bezierAte(prev, E)
        d += ` A ${R} ${R} 0 1 ${s > 0 ? 1 : 0} ${X.x} ${X.y}`
        prev = X
        pontosNode.push(c)
      })
      wps.forEach((el) => {
        const c = centro(el)
        d += bezierAte(prev, c)
        prev = c
        pontosWp.push(c)
      })
      vias.forEach((el) => {
        const c = centro(el)
        d += bezierAte(prev, c)
        prev = c
      })
      d += bezierAte(prev, espiralInicio)
    }

    setGeo({
      largura,
      altura,
      d,
      espiral: espiralPath(pDisco.x, pDisco.y, rExt, rInt, 5),
      centroDisco: { x: pDisco.x, y: pDisco.y, rInt },
      pontosNode,
      pontosWp,
      mobile,
      yEscuro,
      yInicio: pInicio.y,
      yFim: espiralInicio.y,
    })
  }, [rootRef])

  // useEffect (não useLayoutEffect): o ref do pai só é anexado depois
  // dos layout effects dos filhos, então aqui o root já existe
  useEffect(() => {
    medir()
    const root = rootRef.current
    if (!root) return
    const ro = new ResizeObserver(() => medir())
    ro.observe(root)
    if (document.fonts?.ready) document.fonts.ready.then(() => medir())
    window.addEventListener('load', medir)
    return () => {
      ro.disconnect()
      window.removeEventListener('load', medir)
    }
  }, [medir, rootRef])

  // desenho progressivo + sonda seguindo o scroll
  useEffect(() => {
    if (!geo) return
    const linha = linhaRef.current
    if (!linha) return
    const L = linha.getTotalLength()

    if (reduzido) {
      linha.style.strokeDasharray = 'none'
      linha.style.strokeDashoffset = '0'
      if (sondaRef.current) sondaRef.current.style.display = 'none'
      nodesRef.current.forEach((n) => n && n.classList.add('passou'))
      wpsRef.current.forEach((n) => n && n.classList.add('passou'))
      return
    }

    linha.style.strokeDasharray = `${L}`
    let raf = 0
    const atualizar = () => {
      raf = 0
      const linhaAgora = window.scrollY + window.innerHeight * 0.78
      const prog = Math.min(1, Math.max(0.02, (linhaAgora - geo.yInicio) / (geo.yFim - geo.yInicio)))
      linha.style.strokeDashoffset = `${L * (1 - prog)}`
      const p = linha.getPointAtLength(L * prog)
      if (sondaRef.current) {
        sondaRef.current.setAttribute('cx', p.x)
        sondaRef.current.setAttribute('cy', p.y)
      }
      if (distanciaRef.current) {
        distanciaRef.current.textContent = `${String(Math.round(prog * 100)).padStart(3, '0')}%`
      }
      nodesRef.current.forEach((n, i) => {
        if (!n) return
        n.classList.toggle('passou', linhaAgora > geo.pontosNode[i].y)
      })
      wpsRef.current.forEach((n, i) => {
        if (!n) return
        n.classList.toggle('passou', linhaAgora > geo.pontosWp[i].y)
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(atualizar)
    }
    atualizar()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [geo, reduzido])

  if (!geo) return null

  const stopEscuro = Math.min(0.999, Math.max(0.001, geo.yEscuro / geo.altura))

  return (
    <>
      <svg
        className="rota-svg"
        width={geo.largura}
        height={geo.altura}
        viewBox={`0 0 ${geo.largura} ${geo.altura}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="rota-tinta" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={geo.altura}>
            <stop offset="0" stopColor="#1d1eb4" />
            <stop offset={stopEscuro} stopColor="#1d1eb4" />
            <stop offset={Math.min(1, stopEscuro + 0.02)} stopColor="#9b9cf8" />
            <stop offset="1" stopColor="#9b9cf8" />
          </linearGradient>
        </defs>
        <path ref={linhaRef} className="rota-linha" d={geo.d} stroke="url(#rota-tinta)" />
        <path className="rota-espiral" d={geo.espiral} />
        <circle
          className="rota-espiral"
          cx={geo.centroDisco.x}
          cy={geo.centroDisco.y}
          r={Math.max(geo.centroDisco.rInt * 0.16, 5)}
        />
        {geo.pontosNode.map((p, i) => (
          <circle
            key={`n${i}`}
            ref={(el) => (nodesRef.current[i] = el)}
            className="rota-node"
            cx={p.x}
            cy={p.y}
            r={geo.mobile ? 5 : 7}
          />
        ))}
        {geo.pontosWp.map((p, i) => (
          <circle
            key={`w${i}`}
            ref={(el) => (wpsRef.current[i] = el)}
            className="rota-wp"
            cx={p.x}
            cy={p.y}
            r={4.5}
          />
        ))}
        {!reduzido && <circle ref={sondaRef} className="rota-sonda" r="5.5" cx="-20" cy="-20" />}
      </svg>
      {!reduzido && !geo.mobile && (
        <div className="telemetria" aria-hidden="true">
          <i />
          <span>SONDA VOY · DISTÂNCIA</span>
          <span ref={distanciaRef}>002%</span>
        </div>
      )}
    </>
  )
}

/* ============================================================
   Página
   ============================================================ */

const Marca = () => (
  <a className="voy-marca" href="#topo" aria-label="Voy Company — início">
    <i aria-hidden="true" />
    VOY <span>Company</span>
  </a>
)

export default function VoyTrafegoPago() {
  const rootRef = useRef(null)

  return (
    <div className="voy-root" id="topo" ref={rootRef}>
      <RotaSvg rootRef={rootRef} />

      <header className="voy-nav">
        <div className="voy-nav-inner">
          <Marca />
          <nav className="voy-nav-links" aria-label="Seções do documento">
            <a href="#sistema">O sistema</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#resultados">Resultados</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
          <a className="botao botao-primario botao-nav" href={DIAGNOSTICO_URL}>
            Solicitar diagnóstico
          </a>
        </div>
      </header>

      <main>
        {/* VOY/01 — LANÇAMENTO */}
        <section className="hero">
          <div className="voy-secao-inner">
            <div>
              <span className="carimbo">VOY/01 · Lançamento</span>
              <br />
              <span className="hero-selo">Voy Company · A nova camada da Voy</span>
              <h1>
                A Voy sempre soube criar. Agora ela também <span className="grifo">constrói o crescimento.</span>
              </h1>
              <p className="hero-sub">
                A Voy Company é a estrutura de performance da Voy: tráfego, conversão, automação e inteligência
                operacional integrados em uma só operação, com o mesmo padrão que já atende Globo, Dell e Cyrela.
              </p>
              <div className="hero-acoes">
                <a className="botao botao-primario" href={DIAGNOSTICO_URL}>
                  Solicitar diagnóstico
                </a>
                <a className="botao" href="#sistema">
                  Conhecer o sistema
                </a>
              </div>
            </div>
            <div className="hero-plataforma" aria-hidden="true">
              <MiraLancamento />
              <span data-rota="inicio" style={{ position: 'absolute', top: '4rem', left: '50%' }} />
            </div>
          </div>
        </section>

        {/* VOY/02 — POR QUE A MISSÃO EXISTE */}
        <section className="secao posicionamento">
          <div className="voy-secao-inner">
            <div className="secao-cabeca">
              <span className="carimbo">VOY/02 · Por que a Voy Company existe</span>
              <span className="folha">DOSSIÊ DE MISSÃO — FL. 02</span>
            </div>
            <div className="posicionamento-grid">
              <h2>Crescimento não vem de peças isoladas. Vem de operação.</h2>
              <p className="posicionamento-texto">
                Um bom anúncio sem página que converte desperdiça clique. Uma página boa sem tráfego não recebe
                ninguém. Leads sem processo esfriam no caminho. A maioria das empresas não tem um problema de
                talento, tem um problema de integração.
              </p>
            </div>
          </div>
        </section>

        {/* VOY/03 — O SISTEMA (manifesto de carga) */}
        <section className="secao" id="sistema">
          <div className="voy-secao-inner">
            <div className="secao-cabeca">
              <span className="carimbo">VOY/03 · O sistema</span>
              <span className="folha">CARGA ÚTIL — 5 INSTRUMENTOS A BORDO</span>
            </div>

            {SERVICOS.map((s, i) => (
              <article className={`encontro${i % 2 === 1 ? ' invertido' : ''}`} key={s.curto}>
                <div className="encontro-figura">
                  <s.Diagrama />
                  <span className="diagrama-legenda">INSTRUMENTO 0{i + 1}</span>
                  <span className="encontro-ancora" data-rota="node" aria-hidden="true" />
                </div>
                <div>
                  <p className="encontro-rotulo">
                    Encontro 0{i + 1} — {s.curto}
                  </p>
                  <h3>{s.titulo}</h3>
                  <p className="encontro-tagline">{s.tagline}</p>
                  <p className="encontro-descricao">{s.descricao}</p>
                  <ul className="encontro-entregaveis">
                    {s.entregaveis.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                  <p className="encontro-ideal">
                    <b>Ideal pra</b>
                    {s.ideal}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* resumo do sistema */}
        <section className="secao resumo">
          <div className="voy-secao-inner">
            <h2>Cinco frentes. Uma operação de crescimento.</h2>
            <p>
              Você pode começar pela frente que o seu momento pede. A diferença é que aqui elas foram desenhadas
              pra funcionar juntas.
            </p>
          </div>
        </section>

        {/* VOY/04 — COMO FUNCIONA (plano de voo) */}
        <section className="secao" id="como-funciona">
          <div className="voy-secao-inner">
            <div className="secao-cabeca">
              <span className="carimbo">VOY/04 · Como funciona</span>
              <span className="folha">PLANO DE VOO — 5 WAYPOINTS</span>
            </div>
            <ol className="voo-lista">
              {PASSOS.map((p, i) => (
                <li className="voo-passo" key={p.nome}>
                  <span className="voo-num" data-rota="wp">
                    0{i + 1}
                  </span>
                  <div>
                    <h3>{p.nome}</h3>
                    <p>{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* a página deixa a Terra: seções finais em espaço profundo */}
        <div className="escuro" data-rota="escuro">
          {/* VOY/05 — RESULTADOS (sinal recebido) */}
          <section className="secao sinal" id="resultados">
            <div className="voy-secao-inner">
              <div className="secao-cabeca">
                <span className="carimbo">VOY/05 · Resultados</span>
                <span className="folha">SINAL RECEBIDO NA TERRA</span>
              </div>
              <h2>O padrão que marcas grandes já aprovaram, aplicado ao seu crescimento.</h2>
              <div className="sinal-leituras">
                {LEITURAS.map((l, i) => (
                  <div className="sinal-leitura" key={l.rotulo}>
                    <span className="sinal-reg">REG 0{i + 1}</span>
                    <span className="sinal-valor">{l.valor}</span>
                    <span className="sinal-rotulo">{l.rotulo}</span>
                  </div>
                ))}
              </div>
              <span data-rota="via" style={{ position: 'absolute', right: '-7%', top: '55%' }} aria-hidden="true" />
            </div>
          </section>

          {/* ANEXO A — DÚVIDAS */}
          <section className="secao" id="duvidas">
            <div className="voy-secao-inner">
              <div className="secao-cabeca">
                <span className="carimbo">Anexo A · Dúvidas</span>
                <span className="folha">PERGUNTAS DE VERIFICAÇÃO</span>
              </div>
              <div className="anexo-lista">
                {DUVIDAS.map((d, i) => (
                  <div className="anexo-item" key={d.p}>
                    <span className="anexo-ref">A.{i + 1}</span>
                    <h3>{d.p}</h3>
                    <p>{d.r}</p>
                  </div>
                ))}
              </div>
              <span data-rota="via" style={{ position: 'absolute', left: '48.5%', top: '62%' }} aria-hidden="true" />
            </div>
          </section>

          {/* GOLDEN RECORD — CTA final */}
          <section className="cta" id="diagnostico">
            <div className="cta-disco" data-rota="disco" aria-hidden="true" />
            <div className="voy-secao-inner">
              <span className="carimbo">Golden Record · Mensagem a bordo</span>
              <h2>Sua marca já merece o padrão Voy. Sua operação também.</h2>
              <p className="cta-texto">
                Solicite um diagnóstico e veja onde uma operação integrada de crescimento pode levar o seu negócio.
              </p>
              <div className="cta-acoes">
                <a className="botao botao-primario" href={DIAGNOSTICO_URL}>
                  Solicitar diagnóstico
                </a>
                <a className="botao" href={WHATSAPP_URL}>
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </section>

          <footer className="rodape">
            <div className="voy-secao-inner">
              <Marca />
              <span className="rodape-direita">Voy Company · A nova camada da Voy · {new Date().getFullYear()}</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}
