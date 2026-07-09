# Voy Company — Dossiê de Missão

Site da Voy Company reconstruído do zero como um **documento de voo**: a página
nasce como um relatório impresso em papel (tinta indigo `#1D1EB4` sobre papel
`#F4F1E8`) e escurece para o espaço profundo nas seções finais — a página
literalmente sai da Terra conforme o scroll.

## Elemento de assinatura: a Rota

Uma única linha SVG contínua costura a página inteira: nasce no lançamento
(hero), faz um slingshot gravitacional em volta de cada uma das 5 frentes
(os "encontros"), atravessa os waypoints do plano de voo e termina enrolada
na espiral dourada do Golden Record, no CTA final. Um marcador de sonda
(lima `#C6FC00`) percorre a linha conforme o scroll. Com
`prefers-reduced-motion`, a linha aparece já desenhada e estática.

## Stack

- React 18 + Vite
- Tipografia: Chillax (display) · Satoshi (corpo) · IBM Plex Mono (utilitária)
- Sem dependências de UI: layout, diagramas gravados e a Rota são CSS + SVG puros

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # serve o build
```

## Pendência

O link de WhatsApp é um placeholder: troque a constante `WHATSAPP_URL` no topo
de `src/VoyTrafegoPago.jsx` pelo número real antes de publicar.
