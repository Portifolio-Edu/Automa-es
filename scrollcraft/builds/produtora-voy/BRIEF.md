# BRIEF — Produtora Voy

Interview run partially live (4 structural questions asked via AskUserQuestion,
answered by the client in-session) and partially synthesized from real material
gathered mid-session (the client's own concept art + the actual live site at
produtoravoy.com.br, extracted via search tooling since the domain is blocked
by this environment's egress policy for direct fetch/curl). Soft creative
parameters (exact vibe words, energy curve wording, journey phrasing) are
synthesized from that real material, not interviewed word-for-word — flagged
below wherever that's true.

## 1. Vibe (synthesized, not interviewed verbatim)

"Cosmic ambition, grounded delivery." References implied by the client's own
supplied concept art: sci-fi HUD overlays, astronaut-in-orbit imagery,
telemetry/coordinate readouts as a recurring visual motif (CapCut AI concept
renders the client generated and sent). Not a copied reference site — the
client's own material is the reference.

## 2. Journey (their structural answers + inferred sequence)

1. **Órbita** — the astronaut, the galaxy, the tagline. Recognition / awe.
2. **Aproximação** — the real "quem somos" copy, pulled verbatim from
   produtoravoy.com.br. The idea starts acquiring weight.
3. **Revelação** — real client proof (Globo, Dell, Cyrela, Melnick, CCR, Bud,
   Igui, ATM, Net, Branri, Chilli — all real logos named on the live site).
4. **Pouso** — the flight ends. Real stats counters (+15 mil produções,
   +800 marcas, +10 anos — confirmed real by the client earlier in this
   session; they match the live site's three unlabeled counters).
5. **Vozes** (grounded, ordinary scroll — the flight is over) — curated real
   testimonials from the live site, with real handles and real roles.
6. **Contato** — real contact info from the live site: contato@produtoravoy.com.br,
   +55 (51) 98195-1175, Porto Alegre – RS, @produtoravoy.

## 3. Energy curve (synthesized)

Quiet-vast → quiet-curious → building → peak (the atmosphere breaks, cosmic
grades into a grounded palette) → calm/credible → warm/resolved. Loud the
whole way would fight the "we build real things, unglamorously, very well"
subtext the testimonials carry; silent the whole way would waste the one asset
that makes this brief unlike any other audiovisual-studio brief: the client
already owns a genuine sci-fi visual identity experiment.

## 4. Feeling curve + peak

| Act | Feeling | Cause on screen |
|---|---|---|
| Órbita | Awe, distance | Galaxy fills the frame, astronaut small against it, meteors |
| Aproximação | Curiosity, weight | Real "quem somos" text assembles line by line over the astronaut reaching toward equipment |
| Revelação | Recognition, credibility | Real client names resolve out of the HUD panel language — this is not a stock claim, these are named companies |
| **Pouso (PEAK)** | **Grounding, relief, arrival** | **The cosmic grade breaks: colour shifts from the orbit's cool blue-violet to a warm, grounded amber as the last leg lands, at the same moment the real stats count up. Space becomes Porto Alegre.** |
| Vozes | Trust | Real, specific testimonials — names, roles, one line each |
| Contato | Resolve, invitation | Warm close, one CTA, real contact channel |

**Peak, as a sentence a visitor would say to a friend:** "The whole thing looks
like it's floating in space until suddenly the screen goes warm and it's just
... real people, real numbers, real Porto Alegre."

**Tell-someone sentence:** "It's the site where the studio's own sci-fi concept
art turns out to be the flight path to their actual client list."

## 5. Signature move

A live flight-telemetry rail, fixed in a HUD corner for the whole worldflight,
reusing the exact visual vocabulary the client's own concept art already
invented (coordinate-style monospace readouts, corner brackets) — except every
number on it is real and live: current waypoint name, position within the leg,
overall flight progress. The engine already publishes `--sc-seg` / `--sc-segp`
and fires `sc:waypoint` for exactly this purpose (see scrollcraft.js
"WORLDFLIGHT" section) and explicitly does not draw one itself ("a page can
draw its own route rail. The engine draws none.") — this is that rail, built
bespoke for this page. It is the same joke the client's own AI-generated mockups
were making with their garbled fake "LC: 33.3 39° LENS: 130 65k" corner tags,
except here the telemetry is true.

## 6. Range: Editorial cinematic

Client's answer. Sober, large type, generous negative space, restrained motion
outside the one engineered peak. Not brutalist, not maximalist, not dense/HUD-
everywhere (the HUD language is confined to the signature-move rail and the
worldflight itself, not sprinkled across every component).

## 7. World: continuous (worldflight)

Client's answer. No ffmpeg / no KIE_AI_API_KEY available in this environment
(confirmed via doctor.mjs) — the flight is built from still frames only,
using the engine's built-in poster push-in (scrollcraft.js: "Until a real
frame has painted, the poster carries the move"). This is a supported,
first-class worldflight shape, not a degraded one — the engine's own
comments describe exactly this fallback.

The flight is followed by an ordinary, grounded flow section (Vozes, Contato)
— the engine's own guidance for worldflight is explicit that once a normal
document-flow block is needed, "you want act mode instead," so the page
switches modes deliberately at the moment the metaphor calls for it: the
flight ends, and you land in the ordinary world.

## 8. Assets available

- The client's own 10 CapCut-AI-generated concept images (astronaut/HUD/
  galaxy renders + two full mockup compositions), sourced from their Google
  Drive folder this session.
- Real crops from those same mockups isolating real equipment reference
  photography embedded in them (cinema camera, lighting rig, drone/city,
  broadcast switcher) — used as a small proof strip, not claimed as literal
  studio photos.
- Text-only real material from produtoravoy.com.br (tagline, about paragraph,
  17 testimonials, client name list, contact details) extracted via search
  tooling, since the domain is blocked by this environment's outbound network
  policy for direct fetch (confirmed: WebFetch and curl both rejected with a
  gateway 403 / EGRESS_BLOCKED).
- **Not available**: the live site's own real studio photographs (blocked
  domain, could not download the binary image files) and any video footage
  (4 real MOV/MP4 clips exist in the client's Drive folder but ffmpeg is not
  a full build here, so nothing can be re-encoded for scrubbing). Flagged to
  the client in the final report rather than silently substituted.

## Real facts locked for this build (verified, not invented)

- Tagline: "A Voy transforma ideias em imagens que ficam."
- About: "Somos uma produtora audiovisual em crescimento no Rio Grande do Sul,
  com tecnologia de ponta e uma equipe que vive para contar histórias. Já
  ajudamos marcas como Globo, Dell e Cyrela a comunicarem o que realmente
  importa — com criatividade, estratégia e resultado." (em dash in the source
  quote is preserved only because it's a direct quotation of existing brand
  copy, never introduced in new copy written for this build.)
- Client names: Globo, Dell, Cyrela, Melnick, Bud, Igui, ATM, Net, CCR,
  Branri, Chilli, Marina.
- Stats: +15 mil produções realizadas, +800 marcas atendidas, +10 anos de
  experiência.
- Contact: contato@produtoravoy.com.br · +55 (51) 98195-1175 · Porto Alegre –
  Rio Grande do Sul · @produtoravoy.
- Curated testimonials (6, selected for specificity — real handle, real role,
  concrete claim, not generic praise):
  1. @gilmarcarvalhors, Candidato a Prefeito de Encruzilhada do Sul — "Nosso
     vídeo foi o vídeo com maior visualização na história de nosso município."
  2. @edukautz, CEO DMBank — "Rafael Vargas é um estúdio ambulante de
     criatividade... com muita competência e profissionalismo."
  3. @barbaraimobiliaria, Empreendedora — "Desafiei o Rafael a 'atualizar'
     nossa marca... Ele conseguiu inovar esta marca, moderniza-la, mudá-la sem
     tirar a sua essência."
  4. @geotropico, Diretor da Geotrópico — "A Voy criou toda identidade visual
     e um website de altíssima qualidade para a minha empresa, tudo entregue
     super rápido."
  5. @mselitebox, CEO Elite Box — "Ótimo trabalho, vídeo para minha empresa
     ficou perfeito e me ajudou muito nas vendas."
  6. @andresarate, DJ / Produtor Musical — "Já fizemos diversos vídeos e
     VIDEOCLIPES juntos e a qualidade é sempre brutal!"

No fabricated testimonial, stat, or client name appears anywhere in this
build — everything above is quoted or paraphrased from the live site's actual
content.

## Authored silence

The seam between Pouso and Vozes is the one deliberate pause: the flight
stage releases (a fixed-position, full-bleed world), and the page becomes an
ordinary document for the first time. No content plays in that transition
beat beyond the scrim clearing — it is meant to read as a small relief after
four screens of a moving world, not as a device.
