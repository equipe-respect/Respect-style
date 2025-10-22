// server.js
// Seed 1 — servidor único que serve /loja com front (Swiper CDN) e /api/products (sample)
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

/**
 * Dados semente (sample). Você pode editar/adicionar itens aqui.
 * Cada produto tem: id, title, description, price (string), image (url), buy_link, category
 */
const SAMPLE_PRODUCTS = [
  {
    id: 'p1',
    title: 'Kimono Preto - Pro Series',
    description: 'Kimono resistente, tecido reforçado, ideal para treinos intensos.',
    price: '199.90',
    image: 'https://via.placeholder.com/800x600?text=Kimono+Pro',
    buy_link: 'https://shopee.example.com/produto1',
    category: 'kimonos'
  },
  {
    id: 'p2',
    title: 'Faixa Azul Oficial',
    description: 'Faixa de algodão resistente com costura reforçada.',
    price: '49.90',
    image: 'https://via.placeholder.com/800x600?text=Faixa+Azul',
    buy_link: 'https://shopee.example.com/produto2',
    category: 'faixas'
  },
  {
    id: 'p3',
    title: 'Mochila Jiu Jitsu',
    description: 'Mochila grande, compartimento para kimono e bolso seco.',
    price: '129.90',
    image: 'https://via.placeholder.com/800x600?text=Mochila',
    buy_link: 'https://shopee.example.com/produto3',
    category: 'acessorios'
  },
  {
    id: 'p4',
    title: 'Conjunto Promo - Kimono + Faixa',
    description: 'Pacote promocional com desconto por tempo limitado.',
    price: '219.90',
    image: 'https://via.placeholder.com/800x600?text=Promo',
    buy_link: 'https://shopee.example.com/produto4',
    category: 'ofertas'
  },
  {
    id: 'p5',
    title: 'Protetor Bucal - Performance',
    description: 'Leve e confortável, proteção para treinos duros.',
    price: '29.90',
    image: 'https://via.placeholder.com/800x600?text=Protetor+Bucal',
    buy_link: 'https://shopee.example.com/produto5',
    category: 'acessorios'
  }
];

/* ---------- API: /api/products ---------- */
/**
 * GET /api/products?category=...  (category optional: all,kimonos,faixas,acessorios,ofertas)
 * returns: { ok: true, products: [...] }
 */
app.get('/api/products', (req, res) => {
  const category = (req.query.category || 'all').toLowerCase();
  let products = SAMPLE_PRODUCTS.slice();
  if (category !== 'all') {
    products = products.filter(p => (p.category || '').toLowerCase() === category);
  }
  res.json({ ok: true, source: 'seed1', products });
});

/* ---------- Serve Front-end embutido (rota /loja) ---------- */
/**
 * Rota /loja serve um HTML completo que consome /api/products
 * Usa Swiper via CDN (sem instalar nada no front)
 */
app.get(['/','/loja','/loja/'], (req, res) => {
  res.send(`<!doctype html>
<html lang="pt-br">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Loja Respect Style • Seed 1</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />

<style>
:root{
  --bg:#0e0e10;--card:#151517;--ring:#2a2a2e;--red:#e50914;--white:#fff;--muted:#cfd0d7;
  --gradient:linear-gradient(135deg,#1f1f23,#121213);
  --cta-gradient:linear-gradient(90deg,#e50914,#ff4c4c);
}
*{box-sizing:border-box} html,body{height:100%;margin:0;font-family:'Inter',system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",Arial,sans-serif;background:var(--bg);color:var(--white)}
a{text-decoration:none;color:inherit} img{max-width:100%;display:block}

.topbar{display:flex;justify-content:space-between;align-items:center;padding:12px 20px;border-bottom:1px solid var(--ring);position:sticky;top:0;background:rgba(14,14,16,.88);backdrop-filter:blur(6px);z-index:50}
.brand{display:flex;gap:12px;align-items:center}
.brand img{width:52px;height:52px;border-radius:12px;border:2px solid var(--red);object-fit:cover}
.brand h1{font-size:20px;margin:0}
.brand .subtitle{font-size:12px;color:var(--muted)}
.support-btn{border:1px solid var(--ring);padding:8px 12px;border-radius:10px;font-weight:700;transition:all .18s}
.support-btn:hover{background:var(--red);border-color:var(--red);color:var(--white)}

.container{max-width:1100px;margin:22px auto;padding:0 16px}
.banner{width:100%;min-height:160px;border-radius:14px;background:var(--gradient);display:flex;align-items:center;gap:20px;padding:22px;color:var(--white);box-shadow:0 18px 45px rgba(0,0,0,.5)}
.banner .hero-text{flex:1}
.banner h2{margin:0;font-size:24px}
.banner p{margin:6px 0 0;color:var(--muted)}

.categories-wrap{margin-top:20px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.categories-title{font-weight:700}
.categories{display:flex;gap:12px;overflow:auto;padding:12px 6px}
.cat-btn{flex:0 0 auto;background:var(--card);border:1px solid var(--ring);padding:10px 14px;border-radius:12px;color:var(--white);cursor:pointer;transition:transform .15s,box-shadow .18s}
.cat-btn:hover{transform:translateY(-4px);box-shadow:0 10px 30px rgba(0,0,0,.45)}
.cat-btn.active{outline:2px solid rgba(229,9,20,.12);box-shadow:0 6px 20px rgba(0,0,0,.45)}

.products-section{margin-top:18px}
.swiper{padding:12px 2px}
.swiper-slide{display:flex;flex-direction:column;gap:10px;background:var(--card);border-radius:12px;padding:12px;border:1px solid var(--ring);min-height:260px}
.product-img{height:160px;border-radius:10px;overflow:hidden;background:#0b0b0b;display:flex;align-items:center;justify-content:center}
.product-img img{width:100%;height:100%;object-fit:cover}
.product-title{font-size:15px;font-weight:700}
.product-desc{font-size:13px;color:var(--muted);line-height:1.35}
.price{font-weight:800;color:var(--red);margin-top:6px}
.buy-btn{margin-top:auto;padding:10px;border-radius:10px;background:var(--cta-gradient);color:var(--white);text-align:center;cursor:pointer;font-weight:800;border:none}
.buy-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(255,0,0,.25)}

.empty-state{padding:36px;border-radius:12px;background:#0f0f10;border:1px dashed var(--ring);color:var(--muted);text-align:center}
footer{margin:32px 0 80px;color:#bdbdc6;text-align:center;font-size:13px}

@media(max-width:900px){ .banner{flex-direction:column;align-items:flex-start;height:auto} .banner h2{font-size:20px} }
@media(max-width:640px){ .banner{height:auto;padding:16px} .product-img{height:140px} }
</style>
</head>
<body>
  <div class="topbar">
    <div class="brand">
      <img src="https://via.placeholder.com/160x160?text=Logo" alt="Respect Style">
      <div>
        <h1>Respect Style</h1>
        <div class="subtitle">Loja • Portal do Aluno</div>
      </div>
    </div>
    <a class="support-btn" href="https://wa.me/5599999999999" target="_blank" rel="noopener">Suporte</a>
  </div>

  <div class="container">
    <div class="banner">
      <div class="hero-text">
        <h2>Loja Respect Style — Equipamentos e Acessórios</h2>
        <p>Selecione uma categoria, veja produtos em destaque e compre com links diretos. Esta é a seed 1 (demo).</p>
      </div>
      <div style="min-width:140px;text-align:right">
        <div style="background:#0f0f10;border-radius:10px;padding:8px 12px;border:1px solid var(--ring);">
          <div style="font-size:12px;color:var(--muted)">Atendimento</div>
          <div style="font-weight:800">WhatsApp • (99) 99999-9999</div>
        </div>
      </div>
    </div>

    <div class="categories-wrap">
      <div class="categories-title">Categorias</div>
      <div style="font-size:13px;color:var(--muted)">Toque numa categoria para filtrar</div>
    </div>
    <div class="categories" id="categories">
      <button class="cat-btn active" data-cat="all" onclick="filterCategory('all', this)">Todas</button>
      <button class="cat-btn" data-cat="kimonos" onclick="filterCategory('kimonos', this)">Kimonos</button>
      <button class="cat-btn" data-cat="faixas" onclick="filterCategory('faixas', this)">Faixas</button>
      <button class="cat-btn" data-cat="acessorios" onclick="filterCategory('acessorios', this)">Acessórios</button>
      <button class="cat-btn" data-cat="ofertas" onclick="filterCategory('ofertas', this)">Ofertas</button>
    </div>

    <div class="products-section">
      <h3 style="margin:10px 4px 8px 4px">Produtos em Destaque</h3>

      <div class="swiper mySwiper">
        <div class="swiper-wrapper" id="swiper-wrapper">
          <!-- slides vão ser injetados via JS -->
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
      </div>

      <div id="emptyState" class="empty-state" style="display:none;margin-top:12px">Nenhum produto encontrado nesta categoria.</div>
    </div>

    <footer>© Respect Style — Demo Seed 1</footer>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
  <script>
    // API relative (server serve a API nesta mesma porta)
    const API_BASE = '';

    // inicializa swiper
    const swiper = new Swiper('.mySwiper', {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });

    async function fetchProducts(category='all') {
      try {
        const res = await fetch(\`\${API_BASE}/api/products?category=\${encodeURIComponent(category)}\`);
        if(!res.ok) throw new Error('Erro na API');
        const json = await res.json();
        if(!json.ok) throw new Error('API retornou erro');
        renderProducts(json.products || []);
      } catch(err) {
        console.error(err);
        document.getElementById('emptyState').innerText = 'Erro ao carregar produtos.';
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('swiper-wrapper').innerHTML = '';
        swiper.update();
      }
    }

    function renderProducts(products) {
      const wrapper = document.getElementById('swiper-wrapper');
      wrapper.innerHTML = '';
      if(!products.length) {
        document.getElementById('emptyState').style.display = 'block';
        swiper.update();
        return;
      }
      document.getElementById('emptyState').style.display = 'none';

      products.forEach(p => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = \`
          <div class="product-img"><img src="\${escapeHtml(p.image)}" alt="\${escapeHtml(p.title)}" onerror="this.src='https://via.placeholder.com/800x600?text=Imagem'"></div>
          <div class="product-title">\${escapeHtml(p.title)}</div>
          <div class="product-desc">\${escapeHtml(p.description || '')}</div>
          <div class="price">R$\${escapeHtml(p.price)}</div>
          <button class="buy-btn" onclick="window.open('\${p.buy_link || '#'}','_blank')">Comprar</button>
        \`;
        wrapper.appendChild(slide);
      });

      // atualiza swiper após injetar slides
      setTimeout(() => swiper.update(), 60);
    }

    function escapeHtml(str=''){ return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'})[c]); }

    function filterCategory(cat, btnEl) {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      if(btnEl) btnEl.classList.add('active');
      fetchProducts(cat);
    }

    document.addEventListener('DOMContentLoaded', () => {
      filterCategory('all', document.querySelector('.cat-btn[data-cat=\"all\"]'));
    });
  </script>
</body>
</html>`);
});

/* ---------- Start server ---------- */
app.listen(PORT, () => {
  console.log(\`Seed1 server running: http://localhost:\${PORT}/loja/\`);
});
