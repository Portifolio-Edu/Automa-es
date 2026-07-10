# Voy Company — Dossiê de Missão em Espaço Profundo

Site da Voy Company reconstruído do zero: um documento de voo que flutua no
espaço profundo. Fundo `#050514` com nebulosas do indigo do logo (`#1D1EB4`),
campo de estrelas e grão de filme; a tinta clara (`#F4F1E8`) escreve o dossiê;
o lima da marca (`#C6FC00`) assina sonda, grifos e estados ativos.

## Elemento de assinatura: a Rota

Uma única linha SVG contínua costura a página inteira: nasce na cena de
lançamento (hero), faz um slingshot gravitacional em volta de cada uma das
5 frentes (os "encontros"), atravessa os waypoints do plano de voo e termina
enrolada na espiral dourada do Golden Record — que gira lentamente — no CTA
final. Um marcador de sonda em lima percorre a linha conforme o scroll, com
telemetria de distância no canto.

## Marca em vetor

Os assets da identidade são recriações SVG feitas em código (nítidas em
qualquer resolução): o glifo **voy** com o eco "produtora" no rodapé, o **V**
de dois pontos como marca d'água, o **asterisco de brilho verde-lima** atrás
do hero e do resumo, **asteroides low-poly** e um **astronauta em traço
gravado** com meio-tom, na mesma linguagem dos diagramas do Golden Record que
ilustram os 5 serviços.

## Interatividade

- Scroll inercial suave (Lenis), com âncoras integradas
- Parallax de mouse na cena do hero (astronauta, asteroides, glow)
- Revelação por scroll em todas as seções; diagramas se desenham ao entrar
- Acordeão animado no Anexo A (dúvidas)
- Contador animado no "+15 mil" dos resultados
- Scrollspy no nav, glow que segue o cursor, hovers em botões e encontros
- Tudo respeita `prefers-reduced-motion` (linha já desenhada, sem parallax,
  sem sonda, conteúdo visível sem animações)

## Stack

- React 18 + Vite + Lenis
- Tipografia: Chillax (display) · Satoshi (corpo) · IBM Plex Mono (utilitária,
  self-hosted em `public/fonts`)

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
