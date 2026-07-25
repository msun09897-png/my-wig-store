// ============================================
// 配置区 — 上线前修改这里
// ============================================
const CONFIG = {
  brand: 'LUMIÈRE',
  siteUrl: 'https://lumiereluxehair.com',
  supportEmail: 'msun09897@gmail.com',

  // 货币符号
  currency: '$',

  // 你的接单邮箱
  orderEmail: 'msun09897@gmail.com',

  // 上线 Google Analytics 后填入，例如 G-XXXXXXXXXX
  ga4MeasurementId: '',

  // PayPal 商业账户应用的公开 Client ID。不要在前端放 Secret。
  paypalClientId: '',

  // ── EmailJS 配置 ──────────────────────────────
  // 1. 去 emailjs.com 注册后,在 Account → API Keys 找到 Public Key
  // 2. 创建一个 Email Service,记下 Service ID
  // 3. 创建两个 Email Template,记下各自的 Template ID
  //    template_order   : 发给你(店主)的订单通知
  //    template_confirm : 发给客户的确认邮件
  emailjs_public_key:      '7-ZFvmpvafF6YcAyf',
  emailjs_service_id:      'service_lumiere',
  emailjs_template_order:  'template_order',
  emailjs_template_confirm:'template_confirm',
};

const PAYPAL = {
  merchantId: 'KWR6CWBTTXL8E',
  products: {
    'lum-011': [{ label: 'Choose length', id: 'KP3HVJJ7WKXV4' }],
    'lum-010': [{ label: 'Choose length & density', id: 'QTZ5UNUSEC2KQ' }],
    'lum-009': [
      { label: '150% Density — choose length', id: 'V5BFQPGJPJ8ZY' },
      { label: '180% Density — choose length', id: 'T9ZJAEGHSU2NW' },
    ],
    'lum-012': [{ label: 'Natural Black · Short Bob', id: '2N33RDAMSQX7W' }],
    'lum-013': [{ label: 'Natural Black · 16 inch · 200% Density', id: '2QMQBXLXZEX7Y' }],
    'lum-014': [{ label: 'Choose length', id: '4G3DLY34JJYFC' }],
    'lum-015': [{ label: 'Choose length', id: 'W5Q6MM8BRK3J8' }],
    'lum-016': [{ label: 'Choose length', id: '8PWSUPUXX3TBN' }],
  },
};

let paypalCartReady = false;

function initPayPalCart(attempt = 0) {
  if (window.cartPaypal?.Cart) {
    if (!paypalCartReady) {
      window.cartPaypal.Cart({ id: 'pp-view-cart' });
      paypalCartReady = true;
    }
    return;
  }
  if (attempt < 40) window.setTimeout(() => initPayPalCart(attempt + 1), 250);
}

function mountPayPalProduct(productId, attempt = 0) {
  const mount = $('paypalPurchase');
  const buttons = PAYPAL.products[productId] || [];
  if (!mount || buttons.length === 0) return;

  if (attempt === 0) {
    mount.innerHTML = buttons.map(button => `
      <div class="paypal-product-option">
        <p class="paypal-option-label">${button.label}</p>
        <paypal-add-to-cart-button data-id="${button.id}"></paypal-add-to-cart-button>
      </div>
    `).join('');
  }

  if (window.cartPaypal?.AddToCart) {
    buttons.forEach(button => window.cartPaypal.AddToCart({ id: button.id }));
    return;
  }
  if (attempt < 40) {
    window.setTimeout(() => mountPayPalProduct(productId, attempt + 1), 250);
  } else {
    mount.innerHTML = `<p class="paypal-load-error">Secure checkout could not load. Please refresh the page or email <a href="mailto:${CONFIG.supportEmail}">${CONFIG.supportEmail}</a> for help.</p>`;
  }
}

// ============================================
// 状态
// ============================================
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('lumiere_cart') || '[]');
    return Array.isArray(saved) ? saved.filter(i => i && i.key && i.qty > 0) : [];
  } catch {
    try { localStorage.removeItem('lumiere_cart'); } catch {}
    return [];
  }
}

let cart = [];
let currentProduct = null;

// ============================================
// 工具函数
// ============================================
function $(id) { return document.getElementById(id); }

function saveCart() {
  try {
    localStorage.setItem('lumiere_cart', JSON.stringify(cart));
  } catch (err) {
    console.warn('Shopping bag could not be saved in this browser.', err);
  }
  updateCartUI();
}

function fmt(n) { return CONFIG.currency + n.toFixed(2); }

// ============================================
// 页面切换
// ============================================
const PAGE_META = {
  home: {
    title: 'LUMIÈRE — Premium Human Hair Wigs',
    description: 'Premium human hair wigs with HD lace, worldwide shipping, and 30-day returns.'
  },
  shop: {
    title: 'Shop Human Hair Wigs | LUMIÈRE',
    description: 'Shop LUMIÈRE human hair wigs by texture, length, color, and lace construction.'
  },
  about: {
    title: 'Our Story | LUMIÈRE',
    description: 'Learn about LUMIÈRE and our approach to carefully selected human hair wigs.'
  },
  contact: {
    title: 'Contact LUMIÈRE',
    description: 'Contact LUMIÈRE customer care for product, shipping, and order support.'
  },
  shipping: {
    title: 'Shipping Policy | LUMIÈRE',
    description: 'Read LUMIÈRE processing, shipping, customs, and delivery information.'
  },
  returns: {
    title: 'Returns & Refunds | LUMIÈRE',
    description: 'Read the LUMIÈRE 30-day return and refund policy.'
  },
  privacy: {
    title: 'Privacy Policy | LUMIÈRE',
    description: 'Learn how LUMIÈRE collects, uses, and protects customer information.'
  },
  terms: {
    title: 'Terms of Service | LUMIÈRE',
    description: 'Read the terms that apply when using the LUMIÈRE website or placing an order.'
  }
};

function routeUrl(name, productId) {
  if (name === 'home') return '/';
  if (name === 'product' && productId) return `/?product=${encodeURIComponent(productId)}`;
  return `/?page=${encodeURIComponent(name)}`;
}

function setMeta(name, productId) {
  const product = name === 'product' ? PRODUCTS.find(p => p.id === productId) : null;
  const meta = product
    ? {
        title: `${product.name} | Human Hair Wig | LUMIÈRE`,
        description: product.description,
        image: (product.images || [product.image])[0]
      }
    : PAGE_META[name] || PAGE_META.home;
  const canonical = CONFIG.siteUrl + routeUrl(name, productId);
  const image = meta.image
    ? new URL(meta.image, CONFIG.siteUrl + '/').href
    : `${CONFIG.siteUrl}/images/lum-011/main_01.webp`;

  document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', image);

  const schema = $('pageSchema');
  if (schema) {
    const data = product
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: (product.images || [product.image]).map(src => new URL(src, CONFIG.siteUrl + '/').href),
          sku: product.id,
          brand: { '@type': 'Brand', name: CONFIG.brand },
          offers: {
            '@type': 'Offer',
            url: canonical,
            priceCurrency: 'USD',
            price: String(product.price),
            availability: 'https://schema.org/InStock'
          }
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: CONFIG.brand,
          url: CONFIG.siteUrl,
          email: CONFIG.supportEmail
        };
    schema.textContent = JSON.stringify(data);
  }
}

function trackEvent(name, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  if (typeof window.gtag === 'function') window.gtag('event', name, params);
}

function showPage(name, productId, options = {}) {
  const target = $('page-' + name);
  if (!target) return;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });

  if (name !== 'product') ProductGallery.destroy();

  if (name === 'product' && productId) {
    renderProductDetail(productId);
    trackEvent('view_item', { item_id: productId, item_name: currentProduct?.name });
  }

  setMeta(name, productId);
  closeMobileNav();
  if (options.updateHistory !== false) {
    history.pushState({ name, productId }, '', routeUrl(name, productId));
  }
}

function handleRoute() {
  const params = new URLSearchParams(location.search);
  const productId = params.get('product');
  const page = params.get('page');
  if (productId && PRODUCTS.some(p => p.id === productId)) {
    showPage('product', productId, { updateHistory: false });
  } else if (page && PAGE_META[page]) {
    showPage(page, null, { updateHistory: false });
  } else {
    showPage('home', null, { updateHistory: false });
  }
}

function toggleMobileNav(forceOpen) {
  const menu = $('mobileNav');
  const button = $('mobileMenuBtn');
  if (!menu || !button) return;
  const open = forceOpen !== undefined ? forceOpen : !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  document.body.classList.toggle('mobile-menu-open', open);
}

function closeMobileNav() {
  toggleMobileNav(false);
}

// ============================================
// 渲染商品卡片
// ============================================
function productCardHTML(p) {
  const tag = p.tag ? `<span class="product-tag">${p.tag}</span>` : '';
  const imgs = p.images || (p.image ? [p.image] : []);
  const secondaryImg = imgs.length > 1
    ? `<img class="product-image-secondary" src="${imgs[1]}" alt="${p.name}" loading="lazy">`
    : '';
  return `
    <article class="product-card">
      <a class="product-card-link" href="${routeUrl('product', p.id)}"
         onclick="showPage('product', '${p.id}'); return false;"
         aria-label="View ${p.name}">
      <div class="product-image">
        ${tag}
        <img class="product-image-primary" src="${imgs[0] || ''}" alt="${p.name}" loading="lazy">
        ${secondaryImg}
      </div>
      <div class="product-info">
        <p class="product-meta">${p.subtitle}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-price">${fmt(p.price)}</p>
      </div>
      </a>
    </article>
  `;
}

function renderProducts() {
  const featured = PRODUCTS.filter(p => p.featured);
  $('featuredGrid').innerHTML = featured.map(productCardHTML).join('');
  applyFilters();
}

// ============================================
// 筛选 & 搜索
// ============================================
const shopFilters = { style: '', length: '', query: '' };

function selectFilter(group, value, btn) {
  shopFilters[group] = value;
  btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

function applyFilters() {
  const searchEl = $('shopSearch');
  if (searchEl) {
    shopFilters.query = searchEl.value.trim().toLowerCase();
    const clearBtn = $('searchClear');
    if (clearBtn) clearBtn.style.display = shopFilters.query ? 'flex' : 'none';
  }
  const filtered = PRODUCTS.filter(matchesFilters);
  const grid = $('shopGrid');
  const noRes = $('shopNoResults');
  if (filtered.length) {
    grid.innerHTML = filtered.map(productCardHTML).join('');
    if (noRes) noRes.style.display = 'none';
  } else {
    grid.innerHTML = '';
    if (noRes) noRes.style.display = 'flex';
  }
}

function matchesFilters(p) {
  const { style, length, query } = shopFilters;
  const nameText = (p.name + ' ' + p.subtitle).toLowerCase();
  const fullText = (nameText + ' ' + (p.description || '')).toLowerCase();

  if (query && !fullText.includes(query)) return false;

  if (style) {
    const matched =
      (style === 'straight' && nameText.includes('straight')) ||
      (style === 'curly'    && (nameText.includes('curl') || nameText.includes('kinky'))) ||
      (style === 'wavy'     && (nameText.includes('wave') || nameText.includes('wavy'))) ||
      (style === 'short'    && (nameText.includes('wolf') || nameText.includes('bang') || nameText.includes('short')));
    if (!matched) return false;
  }

  if (length) {
    const hasLen = (p.lengths || []).some(l => {
      const m = l.match(/(\d+)\s*inch/i) || l.match(/^(\d+)["]/);
      if (!m) return false;
      const n = parseInt(m[1]);
      if (length === 'short')  return n <= 16;
      if (length === 'medium') return n >= 18 && n <= 22;
      if (length === 'long')   return n >= 24;
    });
    if (!hasLen) return false;
  }

  return true;
}

function clearSearch() {
  $('shopSearch').value = '';
  applyFilters();
}

function resetFilters() {
  shopFilters.style = '';
  shopFilters.length = '';
  shopFilters.query = '';
  if ($('shopSearch')) $('shopSearch').value = '';
  document.querySelectorAll('#filterStyle .filter-btn, #filterLength .filter-btn').forEach(b => {
    b.classList.toggle('active', b.textContent === 'All');
  });
  applyFilters();
}

// ============================================
// 商品详情 + 轮播
// ============================================
let carouselIndex = 0;
let carouselImages = [];
let touchStartX = 0;

function renderProductDetail(id) {
  ProductGallery.destroy();
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  // ── Init currentProduct ──────────────────────────────────────────
  if (p.variants) {
    const def = p.variants.find(v => v.inStock) || p.variants[0];
    currentProduct = { ...p, selectedColor: def.color, selectedLength: def.length };
  } else {
    currentProduct = {
      ...p,
      selectedColor:  p.colors[0],
      selectedLength: p.lengths[Math.floor(p.lengths.length / 2)],
    };
  }

  // ── Initial price ───────────────────────────────────────────────
  let initPrice;
  if (p.variants) {
    const def  = p.variants.find(v => v.inStock) || p.variants[0];
    initPrice  = def.price;
  } else {
    initPrice    = p.price;
  }

  const stackedImgs = (p.images || []).map((src, index) =>
    `<div class="stacked-image"><img src="${src}" alt="${p.name}" loading="${index === 0 ? 'eager' : 'lazy'}"${index === 0 ? ' fetchpriority="high"' : ''}></div>`
  ).join('');

  $('productDetail').innerHTML = `
    <div class="product-detail-images">${stackedImgs}</div>
    <div class="detail-info">
      <p class="breadcrumb"><a href="${routeUrl('shop')}" onclick="showPage('shop'); return false;">Shop</a> · ${p.subtitle}</p>
      <h1>${p.name}</h1>
      <p class="detail-price" id="detailPrice">From ${fmt(initPrice)}</p>
      <p class="detail-desc">${p.description}</p>
      <ul class="detail-features">
        ${p.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <section class="paypal-purchase" aria-labelledby="paypalPurchaseTitle">
        <div class="paypal-purchase-head">
          <p class="eyebrow">— Secure checkout —</p>
          <h2 id="paypalPurchaseTitle">Select options and add to cart</h2>
          <p>Pay securely with PayPal, eligible cards, or Apple Pay. PayPal will collect your delivery address at checkout.</p>
        </div>
        <div id="paypalPurchase" aria-live="polite"></div>
        <p class="paypal-shipping-note">${p.id === 'lum-012' ? '$15 worldwide shipping for this item.' : 'Free worldwide shipping for this item.'} Duties and import taxes may apply.</p>
      </section>
    </div>
  `;
  mountPayPalProduct(p.id);

  // ── Detail gallery (full-width section below) ────────────────────
  const detailGalleryEl = $('product-detail-gallery');
  if (detailGalleryEl) {
    if (p.detailImages && p.detailImages.length > 0) {
      detailGalleryEl.innerHTML = p.detailImages.map(src =>
        `<img src="${src}" alt="${p.name}" loading="lazy">`
      ).join('');
    } else {
      detailGalleryEl.innerHTML = '';
    }
  }
}

function carouselUpdateUI() {
  $('carouselTrack').style.transform = `translateX(-${carouselIndex * 100}%)`;
  const dots = document.querySelectorAll('.carousel-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === carouselIndex));
}

function carouselMove(dir) {
  carouselIndex = (carouselIndex + dir + carouselImages.length) % carouselImages.length;
  carouselUpdateUI();
}

function carouselGoTo(i) {
  carouselIndex = i;
  carouselUpdateUI();
}

// ============================================
// Variant helpers
// ============================================
function findVariant(color, length) {
  return (currentProduct?.variants || []).find(v => v.color === color && v.length === length) ?? null;
}

function updateVariantUI() {
  const v        = findVariant(currentProduct.selectedColor, currentProduct.selectedLength);
  const price    = v ? v.price : currentProduct.price;
  const inStock  = v ? v.inStock : true;

  // Price display
  const priceEl = $('detailPrice');
  if (priceEl) priceEl.textContent = fmt(price);

  // Add to Bag button
  const btn = $('addToBagBtn');
  if (btn) {
    btn.disabled    = !inStock;
    btn.textContent = inStock ? `Add to Bag — ${fmt(price)}` : 'Out of Stock';
  }

}

function selectOption(type, value, btn) {
  if (type === 'color') {
    currentProduct.selectedColor = value;
    // For variant products: if the current length doesn't exist under the new colour,
    // fall back to the first inStock length for that colour.
    if (currentProduct.variants) {
      const forColor = currentProduct.variants.filter(v => v.color === value);
      const stillValid = forColor.some(v => v.length === currentProduct.selectedLength);
      if (!stillValid) {
        const fallback = forColor.find(v => v.inStock) || forColor[0];
        if (fallback) {
          currentProduct.selectedLength = fallback.length;
          document.querySelectorAll('#lengthOptions .option-btn').forEach(b => {
            const active = b.dataset.value === fallback.length;
            b.classList.toggle('active', active);
            b.setAttribute('aria-pressed', String(active));
          });
        }
      }
    }
  }
  if (type === 'length') currentProduct.selectedLength = value;

  btn.parentElement.querySelectorAll('.option-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');

  if (currentProduct.variants) updateVariantUI();
}

// ============================================
// 购物车
// ============================================
function addToCart() {
  if (!currentProduct) {
    showPage('shop');
    return;
  }
  const btn = $('addToBagBtn');
  if (btn && btn.disabled) return; // blocked for out-of-stock

  const v = currentProduct.variants
    ? findVariant(currentProduct.selectedColor, currentProduct.selectedLength)
    : null;
  if (currentProduct.variants && (!v || !v.inStock)) {
    alert('Please select an available color and length.');
    return;
  }
  const price = v ? v.price : currentProduct.price;
  const image = (v && v.image) || (currentProduct.images || [currentProduct.image])[0];

  const key      = currentProduct.id + '-' + currentProduct.selectedColor + '-' + currentProduct.selectedLength;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      key,
      id:       currentProduct.id,
      name:     currentProduct.name,
      subtitle: currentProduct.subtitle,
      image,
      price,
      color:    currentProduct.selectedColor,
      length:   currentProduct.selectedLength,
      qty: 1
    });
  }
  saveCart();
  trackEvent('add_to_cart', {
    currency: 'USD',
    value: price,
    item_id: currentProduct.id,
    item_name: currentProduct.name,
    item_variant: `${currentProduct.selectedColor} / ${currentProduct.selectedLength}`
  });
  toggleCart(true);
}

function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
  saveCart();
}

function removeItem(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
}

function updateCartUI() {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  $('cartCount').textContent = totalQty;
  $('cartCount').style.display = totalQty > 0 ? 'flex' : 'none';

  if (cart.length === 0) {
    $('cartBody').innerHTML = `
      <div class="cart-empty">
        <p>Your bag is empty.</p>
        <button class="btn-secondary" onclick="toggleCart(); showPage('shop');">Discover styles</button>
      </div>
    `;
    $('cartFooter').innerHTML = '';
    return;
  }

  $('cartBody').innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${i.image}" alt="${i.name}"></div>
      <div class="cart-item-info">
        <h4>${i.name}</h4>
        <p class="cart-item-meta">${i.color} · ${i.length}</p>
        <div class="cart-qty">
          <button type="button" aria-label="Decrease quantity of ${i.name}" onclick="changeQty('${i.key}', -1)">−</button>
          <span>${i.qty}</span>
          <button type="button" aria-label="Increase quantity of ${i.name}" onclick="changeQty('${i.key}', 1)">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <span class="cart-item-price">${fmt(i.price * i.qty)}</span>
        <button type="button" class="cart-remove" onclick="removeItem('${i.key}')">Remove</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 199 ? 0 : 15;
  const total = subtotal + shipping;

  $('cartFooter').innerHTML = `
    <div class="cart-total">
      <span>Subtotal</span>
      <span>${fmt(subtotal)}</span>
    </div>
    <p class="cart-note">${shipping === 0 ? '✓ Free shipping unlocked' : `Add ${fmt(199 - subtotal)} for free shipping`} · Duties and taxes may apply</p>
    <button type="button" class="btn-checkout" onclick="openCheckout()">Continue — ${fmt(total)}</button>
  `;
}

function toggleCart(forceOpen) {
  const drawer = $('cartDrawer');
  const overlay = $('cartOverlay');
  const button = document.querySelector('[aria-controls="cartDrawer"]');
  const open = forceOpen !== undefined ? forceOpen : !drawer.classList.contains('open');
  drawer.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  button?.setAttribute('aria-expanded', String(open));
  button?.setAttribute('aria-label', open ? 'Close shopping bag' : 'Open shopping bag');
  document.body.style.overflow = open ? 'hidden' : '';
}

// ============================================
// 结账弹窗
// ============================================
function openCheckout() {
  if (cart.length === 0) return;
  toggleCart(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 199 ? 0 : 15;
  const total    = subtotal + shipping;

  // 渲染订单摘要
  $('checkoutSummary').innerHTML = `
    <div class="co-summary-title">Order Summary</div>
    ${cart.map(i => `
      <div class="co-item">
        <img src="${i.image}" alt="">
        <div class="co-item-info">
          <strong>${i.name}</strong>
          <span>${i.color} · ${i.length} · Qty ${i.qty}</span>
        </div>
        <span class="co-item-price">${fmt(i.price * i.qty)}</span>
      </div>`).join('')}
    <div class="co-totals">
      <span>Subtotal</span><span>${fmt(subtotal)}</span>
      <span>Shipping</span><span>${shipping === 0 ? '<em>Free</em>' : fmt(shipping)}</span>
      <span>Duties &amp; taxes</span><span>Not included</span>
      <strong>Estimated total</strong><strong>${fmt(total)}</strong>
    </div>
  `;

  // 重置表单到初始状态
  const form = $('checkoutForm');
  form.reset();
  form.style.display = '';
  $('orderSuccess').style.display = 'none';
  $('orderError').style.display   = 'none';
  const btn = $('coSubmitBtn');
  btn.disabled = false;
  btn.textContent = 'Send Order Request';

  $('checkoutOverlay').classList.add('open');
  $('checkoutModal').classList.add('open');
  $('checkoutModal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => $('coName')?.focus(), 0);
  trackEvent('begin_checkout', { currency: 'USD', value: total, items: cart.length });
}

function closeCheckout() {
  $('checkoutOverlay').classList.remove('open');
  $('checkoutModal').classList.remove('open');
  $('checkoutModal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

async function submitOrder(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = $('coSubmitBtn');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const data = Object.fromEntries(new FormData(form));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 199 ? 0 : 15;
  const total    = subtotal + shipping;

  // order_id: LUM + 时间戳后6位
  const orderId = 'LUM' + String(Date.now()).slice(-6);

  // {{#orders}} 循环数据 — name 含颜色和长度
  const orders = cart.map(i => ({
    name:  `${i.name} — ${i.color}, ${i.length}`,
    units: i.qty,
    price: (i.price * i.qty).toFixed(2)
  }));

  // 国家放最前面
  const shippingAddr = [
    data.address_country,
    data.address_street,
    data.address_city,
    data.address_state,
    data.address_zip
  ].filter(Boolean).join(', ');

  const params = {
    order_id:         orderId,
    customer_name:    data.customer_name,
    customer_email:   data.customer_email,
    customer_phone:   data.customer_phone || '—',
    shipping_address: shippingAddr,
    order_notes:      data.order_notes    || '—',
    orders,                                          // {{#orders}} 循环
    cost: {
      shipping: shipping === 0 ? 'Free' : shipping.toFixed(2),
      taxes:    'Not included',
      total:    total.toFixed(2)
    }
  };

  btn.disabled    = true;
  btn.textContent = 'Sending…';
  $('orderError').style.display = 'none';

  try {
    // 发给店主
    await emailjs.send(
      CONFIG.emailjs_service_id,
      CONFIG.emailjs_template_order,
      { ...params, to_email: CONFIG.orderEmail }
    );
    // 发给客户
    await emailjs.send(
      CONFIG.emailjs_service_id,
      CONFIG.emailjs_template_confirm,
      { ...params, to_email: data.customer_email }
    );

    cart = [];
    saveCart();
    form.style.display = 'none';
    $('orderSuccess').style.display = 'flex';
    $('successName').textContent    = data.customer_name;
    $('successEmail').textContent   = data.customer_email;
    $('successOrderId').textContent = orderId;
    trackEvent('order_request_submitted', {
      currency: 'USD',
      value: total,
      order_id: orderId
    });
  } catch (err) {
    console.error('EmailJS error:', err);
    btn.disabled    = false;
    btn.textContent = 'Send Order Request';
    $('orderError').style.display = 'flex';
  }
}

// ============================================
// 订阅
// ============================================
function initAnalytics() {
  if (!CONFIG.ga4MeasurementId) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CONFIG.ga4MeasurementId)}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', CONFIG.ga4MeasurementId, { anonymize_ip: true });
}

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // 初始化 EmailJS
  if (
    CONFIG.emailjs_public_key &&
    !CONFIG.emailjs_public_key.startsWith('YOUR_') &&
    typeof window.emailjs !== 'undefined'
  ) {
    window.emailjs.init({ publicKey: CONFIG.emailjs_public_key });
  }
  initAnalytics();
  initPayPalCart();
  renderProducts();
  updateCartUI();
  handleRoute();
});

window.addEventListener('popstate', handleRoute);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMobileNav();
    if ($('cartDrawer')?.classList.contains('open')) toggleCart(false);
    if ($('checkoutModal')?.classList.contains('open')) closeCheckout();
  }
});

/* =========================================================================
   PRODUCT GALLERY STUB
   Gallery replaced by stacked images in renderProductDetail.
   destroy() clears the full-width detail section on page navigation.
   ========================================================================= */
const ProductGallery = (function () {
  function destroy() {
    const g = document.getElementById('product-detail-gallery');
    if (g) g.innerHTML = '';
  }
  function init() {}
  function update() {}
  return { init, update, destroy };
})();

window.ProductGallery = ProductGallery;
