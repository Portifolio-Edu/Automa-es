import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import './voy.css'

// TODO: trocar pelo link real de WhatsApp da Voy antes de publicar
const WHATSAPP_URL = 'https://wa.me/55'
const DIAGNOSTICO_URL = WHATSAPP_URL

/* ============================================================
   Marca — recriações vetoriais dos assets da Voy
   ============================================================ */

// o glifo "voy" (traço grosso arredondado do logo)
const VoyGlyph = ({ className }) => (
  <svg className={className} viewBox="0 0 424 248" fill="none" aria-hidden="true">
    <circle cx="34" cy="36" r="24" fill="currentColor" />
    <circle cx="126" cy="36" r="24" fill="currentColor" />
    <path
      d="M 34 104 L 80 198 L 126 104"
      stroke="currentColor"
      strokeWidth="48"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="216" cy="150" r="48" stroke="currentColor" strokeWidth="46" />
    <path d="M 306 104 L 350 196" stroke="currentColor" strokeWidth="48" strokeLinecap="round" />
    <path
      d="M 398 104 L 350 202 Q 336 228 310 220"
      stroke="currentColor"
      strokeWidth="48"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// o logo completo com o eco "produtora" repetido
const LogoEco = ({ className }) => (
  <span className={`logo-eco ${className || ''}`}>
    <span className="ecos" aria-hidden="true">
      <i>produtora</i>
      <i>produtora</i>
      <i>produtora</i>
    </span>
    <VoyGlyph className="glifo" />
  </span>
)

// o "V" de dois pontos usado como marca d'água
const VMarcaDagua = ({ className }) => (
  <svg className={className} viewBox="0 0 240 260" fill="none" aria-hidden="true">
    <circle cx="46" cy="36" r="26" fill="currentColor" />
    <circle cx="194" cy="36" r="26" fill="currentColor" />
    <path
      d="M 46 110 L 120 224 L 194 110"
      stroke="currentColor"
      strokeWidth="54"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// o asterisco de brilho verde-lima da marca
const AsteriscoGlow = ({ className, uid }) => (
  <svg className={className} viewBox="0 0 400 400" aria-hidden="true">
    <defs>
      <linearGradient id={`ag-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#35c80a" />
        <stop offset="1" stopColor="#eaf702" />
      </linearGradient>
      <filter id={`ab-${uid}`} x="-45%" y="-45%" width="190%" height="190%">
        <feGaussianBlur stdDeviation="24" />
      </filter>
    </defs>
    <g filter={`url(#ab-${uid})`} opacity="0.9">
      {[0, 45, 90, 135].map((a) => (
        <rect
          key={a}
          x="178"
          y="34"
          width="44"
          height="332"
          rx="8"
          fill={`url(#ag-${uid})`}
          transform={`rotate(${a} 200 200)`}
        />
      ))}
    </g>
  </svg>
)

/* ============================================================
   Cena do hero — astronauta gravado + asteroides low-poly
   ============================================================ */

const Astronauta = ({ className }) => (
  <svg className={className} viewBox="0 0 300 380" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <defs>
      <pattern id="meiotom" width="7" height="7" patternUnits="userSpaceOnUse">
        <circle cx="3.5" cy="3.5" r="1.05" fill="currentColor" opacity="0.28" stroke="none" />
      </pattern>
    </defs>
    {/* mochila PLSS */}
    <rect x="92" y="86" width="116" height="100" rx="14" fill="url(#meiotom)" />
    <line x1="104" y1="102" x2="104" y2="170" />
    <line x1="196" y1="102" x2="196" y2="170" />
    {/* capacete */}
    <circle cx="150" cy="62" r="42" fill="url(#meiotom)" />
    <ellipse cx="150" cy="64" rx="29" ry="23" fill="#0b0b28" stroke="none" className="pt" />
    <ellipse cx="150" cy="64" rx="29" ry="23" />
    <path d="M 130 56 A 25 19 0 0 1 152 46" stroke="#c6fc00" strokeWidth="2.2" />
    <path d="M 122 94 h 56" />
    {/* torso */}
    <rect x="112" y="106" width="76" height="90" rx="16" fill="url(#meiotom)" />
    <rect x="127" y="122" width="46" height="28" rx="4" />
    <circle cx="136" cy="162" r="3.2" fill="currentColor" stroke="none" className="pt" />
    <circle cx="150" cy="162" r="3.2" fill="currentColor" stroke="none" className="pt" />
    <circle cx="164" cy="162" r="3.2" fill="currentColor" stroke="none" className="pt" />
    <path d="M 118 178 h 64" strokeDasharray="4 5" />
    {/* braço esquerdo erguido */}
    <path d="M 114 116 C 90 112, 70 126, 58 154" />
    <path d="M 120 136 C 100 134, 86 144, 74 166" />
    <path d="M 74 138 l 12 14" />
    <circle cx="58" cy="172" r="13" fill="url(#meiotom)" />
    {/* braço direito estendido */}
    <path d="M 186 116 C 212 120, 232 138, 244 158" />
    <path d="M 182 136 C 204 142, 218 154, 228 170" />
    <path d="M 226 146 l -12 14" />
    <circle cx="242" cy="174" r="13" fill="url(#meiotom)" />
    {/* perna esquerda */}
    <path d="M 120 196 C 114 232, 106 258, 94 284" />
    <path d="M 142 196 C 138 230, 132 256, 122 286" />
    <path d="M 100 246 l 20 8" />
    <path d="M 90 282 L 82 306 Q 78 318 92 319 L 118 321 Q 130 321 126 308 L 120 288" fill="url(#meiotom)" />
    {/* perna direita estendida */}
    <path d="M 160 196 C 176 224, 190 246, 206 266" />
    <path d="M 140 198 C 152 228, 164 248, 178 270" />
    <path d="M 168 234 l -16 12" />
    <path d="M 208 262 L 226 280 Q 235 290 224 297 L 202 308 Q 190 313 188 300 L 182 276" fill="url(#meiotom)" />
    {/* cordão umbilical */}
    <path d="M 150 168 C 118 224, 76 244, 24 252" strokeDasharray="3 7" />
  </svg>
)

const Asteroide = ({ variante = 0 }) => {
  const formas = [
    {
      vb: '0 0 120 100',
      base: '8,52 28,14 64,6 98,18 114,44 108,74 76,94 38,92 12,78',
      facetas: [
        ['8,52 28,14 46,40 24,62', '#22224a'],
        ['28,14 64,6 46,40', '#2d2d5e'],
        ['64,6 98,18 78,44 46,40', '#232350'],
        ['98,18 114,44 78,44', '#3a3a74'],
        ['114,44 108,74 76,60 78,44', '#2a2a58'],
        ['24,62 46,40 78,44 76,60 76,94 38,92', '#1b1b40'],
        ['108,74 76,94 76,60', '#31316a'],
      ],
    },
    {
      vb: '0 0 110 96',
      base: '6,40 30,10 68,4 102,22 104,58 82,88 42,92 12,72',
      facetas: [
        ['6,40 30,10 42,42 20,58', '#262654'],
        ['30,10 68,4 60,36 42,42', '#303064'],
        ['68,4 102,22 78,44 60,36', '#20204a'],
        ['102,22 104,58 78,44', '#3d3d7a'],
        ['42,42 60,36 78,44 82,88 42,92', '#191938'],
        ['104,58 82,88 78,44', '#2c2c5e'],
      ],
    },
    {
      vb: '0 0 90 80',
      base: '6,36 26,8 58,4 84,20 86,50 64,74 28,76 8,60',
      facetas: [
        ['6,36 26,8 38,34', '#2a2a5a'],
        ['26,8 58,4 50,30 38,34', '#343470'],
        ['58,4 84,20 62,38 50,30', '#22224e'],
        ['84,20 86,50 62,38', '#3f3f80'],
        ['38,34 50,30 62,38 64,74 28,76', '#1a1a3c'],
      ],
    },
  ]
  const f = formas[variante % formas.length]
  return (
    <svg viewBox={f.vb} aria-hidden="true">
      <polygon points={f.base} fill="#131330" />
      {f.facetas.map(([pts, cor]) => (
        <polygon key={pts} points={pts} fill={cor} />
      ))}
      <polygon points={f.base} fill="none" stroke="rgba(150,152,232,0.35)" strokeWidth="1" />
    </svg>
  )
}

/* ============================================================
   Atmosfera
   ============================================================ */

function CampoEstrelas() {
  const estrelas = useMemo(() => {
    let s = 20260710
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    return Array.from({ length: 130 }, () => ({
      x: rnd() * 100,
      y: rnd() * 100,
      r: rnd() < 0.85 ? 0.8 : 1.5,
      o: 0.15 + rnd() * 0.45,
      lima: rnd() > 0.94,
    }))
  }, [])
  return (
    <svg className="voy-estrelas" width="100%" height="100%" aria-hidden="true">
      {estrelas.map((e, i) => (
        <circle key={i} cx={`${e.x}%`} cy={`${e.y}%`} r={e.r} fill={e.lima ? '#c6fc00' : '#f4f1e8'} opacity={e.o} />
      ))}
    </svg>
  )
}

function GlowCursor() {
  const ref = useRef(null)
  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(pointer: fine)').matches
    )
      return
    const el = ref.current
    let x = innerWidth / 2
    let y = innerHeight / 3
    let tx = x
    let ty = y
    let raf = 0
    const loop = () => {
      x += (tx - x) * 0.1
      y += (ty - y) * 0.1
      el.style.transform = `translate(${x - 310}px, ${y - 310}px)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0
    }
    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      if (!raf) raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return <div className="glow-cursor" ref={ref} aria-hidden="true" />
}

/* ============================================================
   Interações
   ============================================================ */

// scroll inercial suave; a navegação por âncora passa pelo Lenis
function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.12, anchors: true })
    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-rev]')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((e) => e.classList.add('rev-on'))
      return
    }
    const io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('rev-on')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
}

function useParallaxHero() {
  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(pointer: fine)').matches
    )
      return
    const camadas = [...document.querySelectorAll('[data-prof]')]
    if (!camadas.length) return
    let mx = 0
    let my = 0
    let cx = 0
    let cy = 0
    let raf = 0
    const loop = () => {
      cx += (mx - cx) * 0.07
      cy += (my - cy) * 0.07
      camadas.forEach((el) => {
        const p = parseFloat(el.dataset.prof)
        el.style.transform = `translate3d(${(-cx * p * 260).toFixed(1)}px, ${(-cy * p * 260).toFixed(1)}px, 0)`
      })
      raf = Math.abs(mx - cx) + Math.abs(my - cy) > 0.0015 ? requestAnimationFrame(loop) : 0
    }
    const onMove = (e) => {
      mx = e.clientX / innerWidth - 0.5
      my = e.clientY / innerHeight - 0.5
      if (!raf) raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}

function useScrollSpy() {
  useEffect(() => {
    const secoes = ['sistema', 'como-funciona', 'resultados', 'duvidas']
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    const links = [...document.querySelectorAll('.voy-nav-links a')]
    const io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting)
            links.forEach((l) => l.classList.toggle('ativo', l.getAttribute('href') === `#${e.target.id}`))
        }),
      { rootMargin: '-25% 0px -65% 0px' },
    )
    secoes.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])
}

// conta de +0 mil até +15 mil quando entra em cena
function ContadorMil() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const dur = 1500
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur)
          const ease = 1 - Math.pow(1 - p, 3)
          el.textContent = `+${Math.round(ease * 15)} mil`
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <span ref={ref}>+15 mil</span>
}

/* ============================================================
   Diagramas gravados — linguagem da capa do Golden Record
   ============================================================ */

const DiagramaPulsar = () => (
  <svg className="diagrama" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <circle cx="100" cy="100" r="96" strokeOpacity="0.35" pathLength="1" />
    <circle cx="100" cy="100" r="4" pathLength="1" />
    {[14, 47, 86, 128, 155, 199, 236, 262, 291, 324].map((ang, i) => {
      const a = (ang * Math.PI) / 180
      const len = 52 + (i % 4) * 11
      const x2 = 100 + len * Math.cos(a)
      const y2 = 100 + len * Math.sin(a)
      const tx = 100 + len * 0.55 * Math.cos(a)
      const ty = 100 + len * 0.55 * Math.sin(a)
      return (
        <g key={ang}>
          <line x1={100 + 8 * Math.cos(a)} y1={100 + 8 * Math.sin(a)} x2={x2} y2={y2} pathLength="1" />
          <line
            x1={tx + 4 * Math.sin(a)} y1={ty - 4 * Math.cos(a)}
            x2={tx - 4 * Math.sin(a)} y2={ty + 4 * Math.cos(a)}
            pathLength="1"
          />
        </g>
      )
    })}
  </svg>
)

const DiagramaAgulha = () => (
  <svg className="diagrama" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <circle cx="100" cy="100" r="96" strokeOpacity="0.35" pathLength="1" />
    {[26, 40, 54, 68, 82].map((r) => (
      <path key={r} d={`M ${64 - r} 128 A ${r} ${r} 0 0 1 ${64 + r} 128`} pathLength="1" />
    ))}
    <circle cx="64" cy="128" r="5" pathLength="1" />
    <line x1="64" y1="128" x2="64" y2="123" pathLength="1" />
    <line x1="168" y1="34" x2="92" y2="96" pathLength="1" />
    <circle cx="168" cy="34" r="7" pathLength="1" />
    <line x1="92" y1="96" x2="88" y2="104" pathLength="1" />
    <circle cx="88" cy="106" r="2.5" fill="currentColor" stroke="none" className="pt" />
  </svg>
)

const DiagramaTrajetoria = () => (
  <svg className="diagrama" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <circle cx="100" cy="100" r="96" strokeOpacity="0.35" pathLength="1" />
    <path d="M 20 168 C 60 160, 58 128, 78 118 A 12 12 0 1 0 92 100 C 104 84, 128 88, 138 72 A 9 9 0 1 0 148 58 C 156 44, 166 36, 178 30" strokeDasharray="4 4" pathLength="1" />
    <circle cx="84" cy="112" r="7" pathLength="1" />
    <circle cx="145" cy="66" r="5" pathLength="1" />
    <circle cx="30" cy="164" r="9" pathLength="1" />
    <path d="M 170 38 l 8 -8 M 178 38 v -8 h -8" strokeWidth="1" pathLength="1" />
  </svg>
)

const DiagramaOnda = () => (
  <svg className="diagrama" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <circle cx="100" cy="100" r="96" strokeOpacity="0.35" pathLength="1" />
    <path d="M 24 100 h 14 v -22 h 12 v 44 h 12 v -30 h 12 v 16 h 12 v -38 h 12 v 52 h 12 v -34 h 12 v 20 h 12 v -12 h 12 v 4 h 14" pathLength="1" />
    {Array.from({ length: 13 }).map((_, i) => (
      <line key={i} x1={30 + i * 12} y1="150" x2={30 + i * 12} y2={i % 3 === 0 ? 138 : 144} pathLength="1" />
    ))}
    <line x1="24" y1="58" x2="176" y2="58" strokeOpacity="0.4" strokeDasharray="2 5" pathLength="1" />
  </svg>
)

const DiagramaHidrogenio = () => (
  <svg className="diagrama" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <circle cx="100" cy="100" r="96" strokeOpacity="0.35" pathLength="1" />
    <circle cx="62" cy="100" r="26" pathLength="1" />
    <circle cx="138" cy="100" r="26" pathLength="1" />
    <circle cx="62" cy="100" r="2.5" fill="currentColor" stroke="none" className="pt" />
    <circle cx="138" cy="100" r="2.5" fill="currentColor" stroke="none" className="pt" />
    <line x1="62" y1="66" x2="62" y2="54" pathLength="1" />
    <path d="M 58 58 l 4 -6 l 4 6" pathLength="1" />
    <line x1="138" y1="134" x2="138" y2="146" pathLength="1" />
    <path d="M 134 142 l 4 6 l 4 -6" pathLength="1" />
    <line x1="94" y1="100" x2="106" y2="100" pathLength="1" />
    <line x1="100" y1="94" x2="100" y2="106" pathLength="1" />
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
    if (!inicio || !disco || nodes.length === 0) return

    let pInicio = centro(inicio)
    if (inicio.getBoundingClientRect().width === 0 && inicio.getBoundingClientRect().height === 0) {
      const hero = root.querySelector('.hero')
      const hr = hero.getBoundingClientRect()
      pInicio = { x: 18, y: hr.bottom - rr.top - 24 }
    }
    const pDisco = centro(disco)
    const discoR = disco.getBoundingClientRect().width / 2
    const rExt = discoR * 0.94
    const rInt = discoR * 0.42
    const espiralInicio = { x: pDisco.x, y: pDisco.y - rExt }

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

  return (
    <>
      <svg
        className="rota-svg"
        width={geo.largura}
        height={geo.altura}
        viewBox={`0 0 ${geo.largura} ${geo.altura}`}
        aria-hidden="true"
      >
        <path ref={linhaRef} className="rota-linha" d={geo.d} />
        <g
          className="disco-rot"
          style={{ transformOrigin: `${geo.centroDisco.x}px ${geo.centroDisco.y}px` }}
        >
          <path className="rota-espiral" d={geo.espiral} />
        </g>
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
    <VoyGlyph className="glifo" />
    <span>Company</span>
  </a>
)

export default function VoyTrafegoPago() {
  const rootRef = useRef(null)
  const [aberta, setAberta] = useState(0)

  useLenis()
  useReveal()
  useParallaxHero()
  useScrollSpy()

  return (
    <div className="voy-root" id="topo" ref={rootRef}>
      <CampoEstrelas />
      <div className="voy-grao" aria-hidden="true" />
      <GlowCursor />
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
            <div data-rev>
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
            <div className="hero-cena" aria-hidden="true">
              <div className="cena-glow" data-prof="0.03">
                <AsteriscoGlow uid="hero" />
              </div>
              <div className="cena-ast cena-a1" data-prof="0.1">
                <Asteroide variante={0} />
              </div>
              <div className="cena-astro-wrap" data-prof="0.06">
                <Astronauta className="cena-astro" />
              </div>
              <div className="cena-ast cena-a2" data-prof="0.045">
                <Asteroide variante={1} />
              </div>
              <div className="cena-ast cena-a3" data-prof="0.085">
                <Asteroide variante={2} />
              </div>
              <div className="cena-ast cena-a4" data-prof="0.13">
                <Asteroide variante={2} />
              </div>
              <span data-rota="inicio" style={{ position: 'absolute', top: '42%', left: '46%' }} />
            </div>
          </div>
        </section>

        {/* VOY/02 — POR QUE A MISSÃO EXISTE */}
        <section className="secao posicionamento">
          <VMarcaDagua className="v-marca-dagua" />
          <div className="voy-secao-inner">
            <div className="secao-cabeca" data-rev>
              <span className="carimbo">VOY/02 · Por que a Voy Company existe</span>
              <span className="folha">DOSSIÊ DE MISSÃO — FL. 02</span>
            </div>
            <div className="posicionamento-grid" data-rev>
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
            <div className="secao-cabeca" data-rev>
              <span className="carimbo">VOY/03 · O sistema</span>
              <span className="folha">CARGA ÚTIL — 5 INSTRUMENTOS A BORDO</span>
            </div>

            {SERVICOS.map((s, i) => (
              <article className={`encontro${i % 2 === 1 ? ' invertido' : ''}`} key={s.curto}>
                <div className="encontro-figura">
                  <span className="encontro-ancora" data-rota="node" aria-hidden="true" />
                  <div data-rev style={{ display: 'flex', flexDirection: 'inherit', alignItems: 'inherit', gap: 'inherit' }}>
                    <s.Diagrama />
                    <span className="diagrama-legenda">INSTRUMENTO 0{i + 1}</span>
                  </div>
                </div>
                <div data-rev>
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
          <div className="resumo-glow" aria-hidden="true">
            <AsteriscoGlow uid="resumo" />
          </div>
          <div className="voy-secao-inner" data-rev>
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
            <div className="secao-cabeca" data-rev>
              <span className="carimbo">VOY/04 · Como funciona</span>
              <span className="folha">PLANO DE VOO — 5 WAYPOINTS</span>
            </div>
            <ol className="voo-lista">
              {PASSOS.map((p, i) => (
                <li className="voo-passo" key={p.nome}>
                  <span className="voo-num" data-rota="wp">
                    0{i + 1}
                  </span>
                  <div data-rev>
                    <h3>{p.nome}</h3>
                    <p>{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* VOY/05 — RESULTADOS (sinal recebido) */}
        <section className="secao sinal" id="resultados">
          <div className="voy-secao-inner">
            <div className="secao-cabeca" data-rev>
              <span className="carimbo">VOY/05 · Resultados</span>
              <span className="folha">SINAL RECEBIDO NA TERRA</span>
            </div>
            <h2 data-rev>O padrão que marcas grandes já aprovaram, aplicado ao seu crescimento.</h2>
            <div className="sinal-leituras" data-rev>
              <div className="sinal-leitura">
                <span className="sinal-reg">REG 01</span>
                <span className="sinal-valor">
                  <ContadorMil />
                </span>
                <span className="sinal-rotulo">produções entregues</span>
              </div>
              <div className="sinal-leitura">
                <span className="sinal-reg">REG 02</span>
                <span className="sinal-valor">a produtora que mais cresce</span>
                <span className="sinal-rotulo">no estado</span>
              </div>
              <div className="sinal-leitura">
                <span className="sinal-reg">REG 03</span>
                <span className="sinal-valor">uma só operação</span>
                <span className="sinal-rotulo">do criativo à conversão</span>
              </div>
            </div>
            <span data-rota="via" style={{ position: 'absolute', right: '-7%', top: '55%' }} aria-hidden="true" />
          </div>
        </section>

        {/* ANEXO A — DÚVIDAS */}
        <section className="secao" id="duvidas">
          <div className="voy-secao-inner">
            <div className="secao-cabeca" data-rev>
              <span className="carimbo">Anexo A · Dúvidas</span>
              <span className="folha">PERGUNTAS DE VERIFICAÇÃO</span>
            </div>
            <div className="anexo-lista">
              {DUVIDAS.map((d, i) => (
                <div className={`anexo-item${aberta === i ? ' aberta' : ''}`} key={d.p} data-rev>
                  <button
                    className="anexo-gatilho"
                    onClick={() => setAberta(aberta === i ? -1 : i)}
                    aria-expanded={aberta === i}
                  >
                    <span className="anexo-ref">A.{i + 1}</span>
                    <h3>{d.p}</h3>
                    <i className="anexo-x" aria-hidden="true" />
                  </button>
                  <div className="anexo-corpo">
                    <div>
                      <p>{d.r}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <span data-rota="via" style={{ position: 'absolute', left: '48.5%', top: '62%' }} aria-hidden="true" />
          </div>
        </section>

        {/* GOLDEN RECORD — CTA final */}
        <section className="cta" id="diagnostico">
          <div className="cta-disco" data-rota="disco" aria-hidden="true" />
          <div className="voy-secao-inner" data-rev>
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
            <LogoEco />
            <span className="rodape-direita">Voy Company · A nova camada da Voy · {new Date().getFullYear()}</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
