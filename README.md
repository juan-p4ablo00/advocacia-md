# Helena Vasconcelos · Advocacia — site institucional (demonstrativo)

Site estático de demonstração para escritórios de advocacia. O escritório
**Helena Vasconcelos Advogados Associados** (também **Vasconcelos & Andrade
Advogados Associados**), a equipe, o telefone, o Instagram, o endereço e as fotos são
**fictícios**: servem apenas para apresentar o modelo.

HTML5, CSS3 e JavaScript puro. Não há build, framework nem dependência de npm:
basta publicar a pasta como está.

## Estrutura

```
.
├── index.html                  Home
├── sobre.html                  Sobre nós (advogada responsável, equipe, atualização profissional)
├── areas-de-atuacao.html       Áreas de atuação (Previdenciário em destaque + demais áreas)
├── blog.html                   Informativo (listagem com filtro por área)
├── blog/
│   ├── _modelo-artigo.html     Modelo para novos artigos (noindex)
│   └── *.html                  Artigos publicados
├── contato.html                Canais + formulário com validação
├── style.css                   Todo o estilo (tokens no :root, seções comentadas)
├── script.js                   Menu mobile, animações, filtro do blog, formulário
├── assets/img/                 Imagens otimizadas (JPEG progressivo / PNG)
├── favicon.ico, favicon-32.png, apple-touch-icon.png, icon-512.png, site.webmanifest
├── robots.txt, sitemap.xml
└── vercel.json                 Cabeçalhos de cache e segurança para a Vercel
```

### Design system (em `style.css`)

| Token | Uso |
|---|---|
| `--ink` `#101318` | Preto da marca (monograma "HV") — textos, botões, rodapé |
| `--navy` `#15223b` | Azul-marinho institucional — faixa de Direito Previdenciário |
| `--paper` / `--paper-2` | Off-white e creme — fundos |
| `--brass` / `--brass-dk` / `--brass-lt` | Dourado discreto: fios, rótulos e destaques em itálico |
| `--serif` Newsreader | Títulos (editorial) |
| `--sans` Instrument Sans | Texto e interface |

Componentes reutilizáveis: `.btn` (+ `--light`, `--ghost`), `.link-arrow`, `.eyebrow`,
`.h2`, `.section` (+ `.on-dark`, `.on-navy`, `.on-cream`), `.split`, `.area-row`,
`.post-card`, `.post-item`, `.checklist`, `.steps`, `.team`, `.form`/`.field`.

Todo texto passa em contraste WCAG AA. Os dourados mais claros são usados apenas
em elementos decorativos ou sobre fundos escuros.

## Executar localmente

Qualquer servidor estático funciona. Exemplos:

```bash
python -m http.server 5510
```

```bash
npx serve .
```

Depois acesse `http://localhost:5510`. (Abrir o `index.html` direto do disco também
funciona, mas um servidor local reproduz melhor o ambiente de produção.)

## Deploy

**Vercel:** importe a pasta/repositório como projeto, *Framework Preset* “Other”,
sem comando de build e com *Output Directory* na raiz. O `vercel.json` já define
cache longo para `/assets` e cabeçalhos de segurança.

**Hospedagem comum (Hostinger, cPanel etc.):** envie o conteúdo da pasta para
`public_html`.

### Antes de publicar

1. **Domínio:** substitua `https://seudominio.com.br` pelo domínio real em todos os
   arquivos (`*.html`, `blog/*.html`, `robots.txt`, `sitemap.xml`). Uma busca e
   substituição global resolve.
2. **Registro na OAB:** inclua o número de inscrição da advogada responsável (e da sociedade,
   se houver) no rodapé, ao lado do nome do escritório.
3. **Endereço e horário:** quando confirmados, acrescente-os em `contato.html`, no
   rodapé e no bloco JSON-LD (`address.streetAddress`, `openingHours`) do `index.html`.
4. **Fotos:** as imagens atuais são de banco de imagens (ver *Créditos*). Para um
   cliente real, substitua por fotos do escritório mantendo os nomes de arquivo em
   `assets/img/` (`advogada.jpg` vertical ~900×1325; `escritorio.jpg` quadrada;
   `congresso.jpg` ~1000×850).
5. **Logotipo:** o monograma fictício está em `assets/img/hv-mark.svg`. Troque pelo
   logo do cliente (de preferência SVG) e gere novamente os favicons e o `og-image.jpg`.
6. **Remova** do rodapé a linha "Site demonstrativo — nomes, contatos e imagens fictícios.".

## Informativo (blog)

1. Duplique `blog/_modelo-artigo.html` com um nome descritivo
   (ex.: `blog/revisao-da-vida-toda.html`).
2. Remova a linha `<meta name="robots" content="noindex">`, ajuste `<title>`,
   `description`, `canonical`, `og:url`, o título, a data e o texto.
3. Em `blog.html`, acrescente um `<li class="post-item" data-category="...">` no topo
   da lista. Categorias com filtro pronto: `previdenciario`, `familia`, `consumidor`,
   `trabalhista` (para outra, basta criar um botão `data-filter` com o mesmo valor).
4. Opcional: troque um dos três cards da home (`index.html`, seção Informativo).
5. Acrescente a URL em `sitemap.xml`.

Os três artigos iniciais são textos de exemplo e devem ser revisados pelo advogado responsável antes da publicação.

## Formulário de contato

Hospedagem estática não tem servidor para enviar e-mails. Por isso o formulário
valida os campos (nome, telefone com DDD, assunto, mensagem e consentimento) e
**abre o WhatsApp do escritório com a mensagem já montada** — a pessoa só confirma
o envio. Nenhum dado fica armazenado no site.

Para receber também por e-mail, é possível conectar um serviço como Formspree,
Web3Forms ou Netlify Forms: aponte o `action` do `<form>` para o endpoint e, em
`script.js`, troque o `window.open(...)` do bloco “Formulário de contato” por um
`fetch` para esse endpoint.

O número do WhatsApp fica em uma única constante no topo de `script.js`
(`WHATSAPP_NUMBER`); os links do HTML também trazem o número para funcionar sem
JavaScript.

## Decisões técnicas

- **Sem bibliotecas de animação:** as microinterações (revelação ao rolar,
  sublinhados, setas) usam CSS e `IntersectionObserver`. GSAP/Lenis não trariam
  ganho visível para este tipo de site e adicionariam peso.
- **`prefers-reduced-motion`** respeitado; sem JavaScript todo o conteúdo aparece.
- **Ícones** em SVG inline (traço de 1,5 px), sem fonte de ícones.
- **Imagens** com `width`/`height` declarados, `loading="lazy"` abaixo da dobra e
  `fetchpriority="high"` no retrato do topo.
- **SEO:** `title`/`description` únicos por página, Open Graph, `canonical`,
  JSON-LD `LegalService`, `robots.txt` e `sitemap.xml`.
- **Acessibilidade:** HTML semântico, link “Pular para o conteúdo”, foco visível,
  menu com `aria-expanded` e fechamento por Esc, erros de formulário anunciados
  com `aria-live`.
- **Cabeçalho e rodapé** são repetidos em cada página (sem build nem includes via
  JS, o que prejudicaria SEO e o funcionamento sem JavaScript). Ao alterar um
  deles, replique a mudança nas 9 páginas.

## Créditos de imagens

Fotos da [Unsplash](https://unsplash.com), sob a [Licença Unsplash](https://unsplash.com/license)
(uso comercial gratuito):

- `advogada.jpg` — Gruescu Ovidiu — https://unsplash.com/photos/fWjqkOnfkgE
- `escritorio.jpg` — Brusk Dede — https://unsplash.com/photos/tjd5CfdDPRA
- `congresso.jpg` — Headway — https://unsplash.com/photos/F2KRf_QfCqw
