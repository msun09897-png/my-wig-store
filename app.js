// ============================================
// 配置区 — 上线前修改这里
// ============================================
const CONFIG = {
  brand: 'ARELVIENNE',
  siteUrl: 'https://arelvienne.com',
  supportEmail: 'support@arelvienne.com',

  // 货币符号
  currency: '$',

  // Google Analytics 4 web stream
  ga4MeasurementId: 'G-BLRPGQR6G3',

  // Microsoft Clarity project. Loaded only after analytics consent.
  clarityProjectId: 'xucr8jc07m',

  // PayPal 商业账户应用的公开 Client ID。不要在前端放 Secret。
  paypalClientId: '',
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
    const cartButton = document.querySelector('paypal-cart-button[data-id="pp-view-cart"]');
    if (cartButton && !paypalCartAnalyticsReady) {
      cartButton.addEventListener('click', trackPayPalCartOpen, { capture: true });
      paypalCartAnalyticsReady = true;
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
    mount.querySelectorAll('paypal-add-to-cart-button').forEach((element, index) => {
      element.addEventListener(
        'click',
        event => {
          if (isPayPalAddToCartAction(event)) {
            trackPayPalAddToCart(productId, buttons[index]);
          }
        },
        { capture: true }
      );
    });
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

let currentProduct = null;
let lastCartAnalyticsItem = null;
let paypalCartAnalyticsReady = false;

// ============================================
// 工具函数
// ============================================
function $(id) { return document.getElementById(id); }

function fmt(n) { return CONFIG.currency + n.toFixed(2); }

// ============================================
// 页面切换
// ============================================
const PAGE_META = {
  home: {
    title: 'ARELVIENNE — Premium Human Hair Wigs',
    description: 'Premium human hair wigs with HD lace, worldwide shipping, and 30-day returns.'
  },
  shop: {
    title: 'Shop Human Hair Wigs | ARELVIENNE',
    description: 'Shop ARELVIENNE human hair wigs by texture, length, color, and lace construction.'
  },
  about: {
    title: 'Our Story | ARELVIENNE',
    description: 'Learn about ARELVIENNE and our approach to carefully selected human hair wigs.'
  },
  guide: {
    title: 'How to Choose a Human Hair Wig | ARELVIENNE Guide',
    description: 'Learn how to choose wig lace, density, length, texture, color, and cap construction before buying a human hair wig.'
  },
  contact: {
    title: 'Contact ARELVIENNE',
    description: 'Contact ARELVIENNE customer care for product, shipping, and order support.'
  },
  shipping: {
    title: 'Shipping Policy | ARELVIENNE',
    description: 'Read ARELVIENNE processing, shipping, customs, and delivery information.'
  },
  returns: {
    title: 'Returns & Refunds | ARELVIENNE',
    description: 'Read the ARELVIENNE 30-day return and refund policy.'
  },
  privacy: {
    title: 'Privacy Policy | ARELVIENNE',
    description: 'Learn how ARELVIENNE collects, uses, and protects customer information.'
  },
  terms: {
    title: 'Terms of Service | ARELVIENNE',
    description: 'Read the terms that apply when using the ARELVIENNE website or placing an order.'
  }
};

const PAGE_ROUTES = {
  home: '/',
  shop: '/shop.html',
  guide: '/wig-guide.html',
  about: '/about.html',
  contact: '/contact.html',
  shipping: '/shipping.html',
  returns: '/returns.html',
  privacy: '/privacy.html',
  terms: '/terms.html'
};

const PRODUCT_ROUTES = {
  'lum-009': '/signature-straight-human-hair-wig.html',
  'lum-010': '/platinum-blonde-bob-wig.html',
  'lum-011': '/cascade-deep-wave-human-hair-wig.html',
  'lum-012': '/water-wave-bob-wig.html',
  'lum-013': '/bouncy-curl-closure-wig.html',
  'lum-014': '/champagne-blonde-body-wave-wig.html',
  'lum-015': '/honey-noir-highlight-straight-wig.html',
  'lum-016': '/burgundy-bob-closure-wig.html'
};

function routeUrl(name, productId) {
  if (name === 'product' && productId) {
    return PRODUCT_ROUTES[productId] || `/?product=${encodeURIComponent(productId)}`;
  }
  return PAGE_ROUTES[name] || `/?page=${encodeURIComponent(name)}`;
}

function setMeta(name, productId, variantSku) {
  const product = name === 'product' ? PRODUCTS.find(p => p.id === productId) : null;
  const selectedVariant = product?.variants?.find(variant => variant.sku === variantSku);
  const meta = product
    ? {
        title: `${product.name} | Human Hair Wig | ARELVIENNE`,
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
  document.querySelector('meta[property="og:type"]')?.setAttribute(
    'content',
    product ? 'product' : name === 'guide' ? 'article' : 'website'
  );
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', meta.title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', meta.description);
  document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', image);

  const schema = $('pageSchema');
  if (schema) {
    const availableVariants = product?.variants?.filter(variant => variant.inStock) || [];
    const variantPrices = availableVariants.map(variant => variant.price);
    const lowPrice = variantPrices.length ? Math.min(...variantPrices) : product?.price;
    const highPrice = variantPrices.length ? Math.max(...variantPrices) : product?.price;
    const data = product
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: (product.images || [product.image]).map(src => new URL(src, CONFIG.siteUrl + '/').href),
          sku: selectedVariant?.sku || product.id,
          brand: { '@type': 'Brand', name: CONFIG.brand },
          material: 'Human hair',
          category: 'Wigs',
          offers: selectedVariant
            ? {
                '@type': 'Offer',
                url: `${canonical}?variant=${encodeURIComponent(selectedVariant.sku)}`,
                priceCurrency: 'USD',
                price: String(selectedVariant.price),
                availability: selectedVariant.inStock
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
                itemCondition: 'https://schema.org/NewCondition'
              }
            : availableVariants.length > 1
            ? {
                '@type': 'AggregateOffer',
                url: canonical,
                priceCurrency: 'USD',
                lowPrice: String(lowPrice),
                highPrice: String(highPrice),
                offerCount: availableVariants.length,
                availability: 'https://schema.org/InStock'
              }
            : {
                '@type': 'Offer',
                url: canonical,
                priceCurrency: 'USD',
                price: String(lowPrice),
                availability: availableVariants.length === 0 && product.variants
                  ? 'https://schema.org/OutOfStock'
                  : 'https://schema.org/InStock',
                itemCondition: 'https://schema.org/NewCondition'
              }
        }
      : name === 'guide'
        ? {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: meta.title,
            description: meta.description,
            image,
            mainEntityOfPage: canonical,
            datePublished: '2026-07-25',
            dateModified: '2026-07-27',
            author: {
              '@type': 'Organization',
              name: CONFIG.brand,
              url: CONFIG.siteUrl
            },
            publisher: {
              '@type': 'Organization',
              name: CONFIG.brand,
              url: CONFIG.siteUrl
            },
            inLanguage: 'en'
          }
        : {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': `${CONFIG.siteUrl}/#organization`,
              name: CONFIG.brand,
              url: CONFIG.siteUrl,
              email: CONFIG.supportEmail
            },
            {
              '@type': 'WebSite',
              '@id': `${CONFIG.siteUrl}/#website`,
              name: `${CONFIG.brand} Human Hair Wigs`,
              url: CONFIG.siteUrl,
              publisher: { '@id': `${CONFIG.siteUrl}/#organization` },
              inLanguage: 'en'
            }
          ]
        };
    schema.textContent = JSON.stringify(data);
  }
}

function getDefaultVariant(product) {
  return product?.variants?.find(variant => variant.inStock) || product?.variants?.[0] || null;
}

function getSelectedVariant(product = currentProduct) {
  if (!product?.variants) return null;
  return product.variants.find(variant =>
    variant.color === product.selectedColor && variant.length === product.selectedLength
  ) || product.variants.find(variant => variant.sku === product.selectedSku) || getDefaultVariant(product);
}

function ga4Item(product, variant, options = {}) {
  const price = Number(variant?.price ?? product?.price);
  const variantLabel = options.variantLabel ||
    [variant?.color, variant?.length].filter(Boolean).join(' · ') ||
    undefined;
  return {
    item_id: options.itemId || variant?.sku || product.id,
    item_name: product.name,
    item_brand: CONFIG.brand,
    item_category: 'Human Hair Wigs',
    ...(variantLabel ? { item_variant: variantLabel } : {}),
    ...(options.listId ? { item_list_id: options.listId } : {}),
    ...(options.listName ? { item_list_name: options.listName } : {}),
    ...(Number.isFinite(options.index) ? { index: options.index } : {}),
    price,
    quantity: options.quantity || 1
  };
}

function ecommerceParams(items, extra = {}) {
  const value = items.reduce((sum, item) =>
    sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  return {
    currency: 'USD',
    value: Number(value.toFixed(2)),
    items,
    ...extra
  };
}

function isPayPalAddToCartAction(event) {
  const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
  return path.some(node => {
    if (!(node instanceof HTMLElement)) return false;
    const isButton = node.matches('button, input[type="submit"], [role="button"]');
    if (!isButton) return false;
    const label = [
      node.getAttribute('aria-label'),
      node.getAttribute('title'),
      node.getAttribute('value'),
      node.textContent
    ].filter(Boolean).join(' ');
    return /(add.*cart|添加.*购物车|ajouter.*panier|añadir.*carrito|adicionar.*carrinho|warenkorb|カートに追加|장바구니)/i.test(label);
  });
}

function trackEvent(name, params = {}) {
  if (analyticsStarted && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
    return;
  }
  if (getAnalyticsConsent() !== 'denied') {
    pendingAnalyticsEvents.push({ name, params });
  }
}

function trackProductList(products, listId, listName) {
  const items = products.map((product, index) =>
    ga4Item(product, getDefaultVariant(product), { index, listId, listName })
  );
  if (items.length) trackEvent('view_item_list', { item_list_id: listId, item_list_name: listName, items });
}

function selectProduct(productId, listId, listName) {
  const product = PRODUCTS.find(item => item.id === productId);
  if (product) {
    const item = ga4Item(product, getDefaultVariant(product), { listId, listName });
    trackEvent('select_item', { item_list_id: listId, item_list_name: listName, items: [item] });
  }
  showPage('product', productId);
}

function trackPayPalAddToCart(productId, paypalButton) {
  const product = PRODUCTS.find(item => item.id === productId);
  if (!product) return;
  const exactVariant = currentProduct?.selectionSource === 'merchant_variant'
    ? getSelectedVariant(currentProduct)
    : null;
  const item = ga4Item(product, exactVariant, {
    itemId: exactVariant?.sku || product.id,
    variantLabel: exactVariant
      ? [exactVariant.color, exactVariant.length].join(' · ')
      : paypalButton.label
  });
  lastCartAnalyticsItem = item;
  trackEvent('add_to_cart', ecommerceParams([item], {
    checkout_provider: 'PayPal',
    selection_source: exactVariant ? 'merchant_variant_link' : 'paypal_hosted_button'
  }));
}

function trackPayPalCartOpen() {
  const fallbackProduct = currentProduct?.id ? PRODUCTS.find(item => item.id === currentProduct.id) : null;
  const item = lastCartAnalyticsItem ||
    (fallbackProduct ? ga4Item(fallbackProduct, getSelectedVariant(currentProduct)) : null);
  trackEvent('paypal_cart_open', { checkout_provider: 'PayPal' });
  if (!item) return;
  const params = ecommerceParams([item], { checkout_provider: 'PayPal' });
  trackEvent('view_cart', params);
  trackEvent('begin_checkout', { ...params, checkout_step: 'paypal_cart_opened' });
}

function showPage(name, productId, options = {}) {
  const target = $('page-' + name);
  if (!target) return;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });

  if (name !== 'product') ProductGallery.destroy();

  if (name === 'product' && productId) {
    renderProductDetail(productId, options.variantSku);
    const variant = getSelectedVariant(currentProduct);
    trackEvent('view_item', ecommerceParams([
      ga4Item(currentProduct, variant)
    ]));
  } else if (name === 'shop') {
    trackProductList(PRODUCTS.filter(matchesFilters), 'shop_all', 'Shop All');
  } else if (name === 'home') {
    trackProductList(PRODUCTS.filter(product => product.featured), 'featured_styles', 'Featured Styles');
  }

  setMeta(name, productId, options.variantSku);
  closeMobileNav();
  if (options.updateHistory !== false) {
    history.pushState({ name, productId }, '', routeUrl(name, productId));
  }
}

function handleRoute() {
  const pathname = location.pathname.replace(/\/{2,}/g, '/');
  const params = new URLSearchParams(location.search);
  const productIdFromPath = Object.keys(PRODUCT_ROUTES)
    .find(id => PRODUCT_ROUTES[id] === pathname);
  const pageFromPath = Object.keys(PAGE_ROUTES)
    .find(name => PAGE_ROUTES[name] === pathname || (name === 'home' && pathname === '/index.html'));
  const productId = productIdFromPath || params.get('product');
  const page = pageFromPath || params.get('page');
  if (productId && PRODUCTS.some(p => p.id === productId)) {
    showPage('product', productId, {
      updateHistory: false,
      variantSku: params.get('variant')
    });
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
function productCardHTML(p, listId, listName) {
  const tag = p.tag ? `<span class="product-tag">${p.tag}</span>` : '';
  const imgs = p.images || (p.image ? [p.image] : []);
  const secondaryImg = imgs.length > 1
    ? `<img class="product-image-secondary" src="${imgs[1]}" alt="${p.name}" loading="lazy">`
    : '';
  return `
    <article class="product-card">
      <a class="product-card-link" href="${routeUrl('product', p.id)}"
         onclick="selectProduct('${p.id}', '${listId}', '${listName}'); return false;"
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
  $('featuredGrid').innerHTML = featured
    .map(product => productCardHTML(product, 'featured_styles', 'Featured Styles'))
    .join('');
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
    grid.innerHTML = filtered
      .map(product => productCardHTML(product, 'shop_all', 'Shop All'))
      .join('');
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

function renderProductDetail(id, variantSku) {
  ProductGallery.destroy();
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  // ── Init currentProduct ──────────────────────────────────────────
  if (p.variants) {
    const requested = p.variants.find(variant => variant.sku === variantSku);
    const def = requested || p.variants.find(v => v.inStock) || p.variants[0];
    currentProduct = {
      ...p,
      selectedSku: def.sku,
      selectedColor: def.color,
      selectedLength: def.length,
      selectionSource: requested ? 'merchant_variant' : 'default'
    };
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
    initPrice = getSelectedVariant(currentProduct).price;
  } else {
    initPrice    = p.price;
  }

  const productImages = p.images || [];
  const primaryImage = productImages.slice(0, 1).map(src =>
    `<div class="stacked-image"><img src="${src}" alt="${p.name}" loading="eager" fetchpriority="high"></div>`
  ).join('');
  const secondaryImages = productImages.slice(1).map((src, index) =>
    `<div class="stacked-image"><img src="${src}" alt="${p.name} view ${index + 2}" loading="lazy"></div>`
  ).join('');
  const selectedVariant = getSelectedVariant(currentProduct);
  const merchantVariantNote = currentProduct.selectionSource === 'merchant_variant'
    ? `<p class="merchant-variant-note">Selected listing option: ${selectedVariant.color} · ${selectedVariant.length}. Confirm the same option in PayPal before adding to cart.</p>`
    : '';

  $('productDetail').innerHTML = `
    <div class="product-detail-images product-detail-images-primary">${primaryImage}</div>
    <div class="detail-info">
      <p class="breadcrumb"><a href="${routeUrl('shop')}" onclick="showPage('shop'); return false;">Shop</a> · ${p.subtitle}</p>
      <h1>${p.name}</h1>
      <p class="detail-price" id="detailPrice">${currentProduct.selectionSource === 'merchant_variant' ? '' : 'From '}${fmt(initPrice)}</p>
      ${merchantVariantNote}
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
        <p class="paypal-shipping-note">Free worldwide shipping for this item. Duties and import taxes may apply.</p>
        <div class="purchase-policy-links">
          <p>By completing checkout, you agree to our
            <a href="${routeUrl('terms')}" onclick="showPage('terms'); return false;">Terms</a>
            and acknowledge our
            <a href="${routeUrl('privacy')}" onclick="showPage('privacy'); return false;">Privacy Policy</a>.
          </p>
          <p>
            <a href="${routeUrl('shipping')}" onclick="showPage('shipping'); return false;">Shipping: 1–3 business days processing, then an estimated 7–15 business days</a>
            ·
            <a href="${routeUrl('returns')}" onclick="showPage('returns'); return false;">30-day returns on eligible items</a>
          </p>
        </div>
      </section>
    </div>
    <div class="product-detail-images product-detail-images-secondary">${secondaryImages}</div>
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
  if (v) {
    currentProduct.selectedSku = v.sku;
    currentProduct.selectionSource = 'site_option';
  }

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
// 数据分析与访客同意
// ============================================
const ANALYTICS_CONSENT_KEY = 'arelvienne_analytics_consent';
let analyticsStarted = false;
let clarityStarted = false;
let pendingAnalyticsEvents = [];

function getAnalyticsConsent() {
  try {
    return window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  } catch {
    return null;
  }
}

function saveAnalyticsConsent(value) {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  } catch {
    // The choice still applies for the current page when storage is unavailable.
  }
}

function startClarity() {
  if (!CONFIG.clarityProjectId || clarityStarted) return;
  clarityStarted = true;

  window.clarity = window.clarity || function () {
    (window.clarity.q = window.clarity.q || []).push(arguments);
  };
  window.clarity('consentv2', {
    ad_Storage: 'denied',
    analytics_Storage: 'granted'
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(CONFIG.clarityProjectId)}?ref=bwt`;
  script.dataset.arelvienneAnalytics = 'clarity';
  document.head.appendChild(script);
}

function startAnalytics() {
  if ((!CONFIG.ga4MeasurementId && !CONFIG.clarityProjectId) || analyticsStarted) return;
  analyticsStarted = true;

  if (CONFIG.ga4MeasurementId) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', CONFIG.ga4MeasurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    pendingAnalyticsEvents.forEach(({ name, params }) => {
      window.gtag('event', name, params);
    });
    pendingAnalyticsEvents = [];

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CONFIG.ga4MeasurementId)}`;
    document.head.appendChild(script);
  }

  startClarity();
}

function closeAnalyticsBanner() {
  $('analyticsConsent')?.remove();
}

function showAnalyticsBanner() {
  closeAnalyticsBanner();
  const banner = document.createElement('section');
  banner.id = 'analyticsConsent';
  banner.className = 'analytics-consent';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-labelledby', 'analyticsConsentTitle');
  banner.setAttribute('aria-describedby', 'analyticsConsentText');
  banner.innerHTML = `
    <div class="analytics-consent-copy">
      <h2 id="analyticsConsentTitle">Your privacy choices</h2>
      <p id="analyticsConsentText">We use Google Analytics 4 and Microsoft Clarity to understand visits, create heatmaps and session replays, and improve our store. Analytics stays off unless you allow it. Necessary storage for checkout and security may still be used. <a href="/privacy.html">Privacy Policy</a></p>
    </div>
    <div class="analytics-consent-actions">
      <button type="button" class="analytics-consent-secondary" data-analytics-choice="denied">Necessary only</button>
      <button type="button" class="analytics-consent-primary" data-analytics-choice="granted">Allow analytics</button>
    </div>
  `;

  banner.querySelectorAll('[data-analytics-choice]').forEach(button => {
    button.addEventListener('click', () => {
      const choice = button.dataset.analyticsChoice;
      saveAnalyticsConsent(choice);
      if (choice === 'denied' && analyticsStarted) {
        pendingAnalyticsEvents = [];
        window.gtag?.('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
        window.clarity?.('consentv2', {
          ad_Storage: 'denied',
          analytics_Storage: 'denied'
        });
        window.clarity?.('consent', false);
        window.location.reload();
        return;
      }
      if (choice === 'denied') pendingAnalyticsEvents = [];
      closeAnalyticsBanner();
      if (choice === 'granted') startAnalytics();
    });
  });
  document.body.appendChild(banner);
}

function initAnalyticsConsent() {
  if (!CONFIG.ga4MeasurementId && !CONFIG.clarityProjectId) return;

  const footer = document.querySelector('footer');
  if (footer && !$('analyticsSettings')) {
    const settings = document.createElement('button');
    settings.id = 'analyticsSettings';
    settings.type = 'button';
    settings.className = 'analytics-settings';
    settings.textContent = 'Cookie settings';
    settings.addEventListener('click', showAnalyticsBanner);
    footer.appendChild(settings);
  }

  const consent = getAnalyticsConsent();
  if (consent === 'granted') {
    startAnalytics();
  } else if (consent !== 'denied') {
    showAnalyticsBanner();
  }
}

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initAnalyticsConsent();
  initPayPalCart();
  renderProducts();
  handleRoute();
});

window.addEventListener('popstate', handleRoute);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMobileNav();
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
