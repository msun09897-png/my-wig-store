// ============================================
// 配置区 — 上线前修改这里
// ============================================
const CONFIG = {
  // 货币符号
  currency: '$',

  // 你的接单邮箱
  orderEmail: 'msun09897@gmail.com',

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

// ============================================
// 状态
// ============================================
let cart = JSON.parse(sessionStorage.getItem('lumiere_cart') || '[]');
let currentProduct = null;

// ============================================
// 工具函数
// ============================================
function $(id) { return document.getElementById(id); }

function saveCart() {
  sessionStorage.setItem('lumiere_cart', JSON.stringify(cart));
  updateCartUI();
}

function fmt(n) { return CONFIG.currency + n.toFixed(2); }

// ============================================
// 页面切换
// ============================================
function showPage(name, productId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $('page-' + name).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });

  if (name === 'product' && productId) {
    renderProductDetail(productId);
  }
}

// ============================================
// 渲染商品卡片
// ============================================
function productCardHTML(p) {
  const tag = p.tag ? `<span class="product-tag">${p.tag}</span>` : '';
  const oldPrice = p.oldPrice ? `<span class="old">${fmt(p.oldPrice)}</span>` : '';
  return `
    <div class="product-card" onclick="showPage('product', '${p.id}')">
      <div class="product-image">
        ${tag}
        <img src="${(p.images || [p.image])[0]}" alt="${p.name}" loading="lazy">
      </div>
      <p class="product-meta">${p.subtitle}</p>
      <h3 class="product-name">${p.name}</h3>
      <p class="product-price">${fmt(p.price)}${oldPrice}</p>
    </div>
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
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  // ── Carousel images: product images + any unique variant images ──
  const baseImages = p.images || [p.image];
  const variantImgs = p.variants
    ? [...new Set(p.variants.filter(v => v.image).map(v => v.image))]
    : [];
  carouselImages = [...new Set([...baseImages, ...variantImgs])];
  carouselIndex = 0;

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

  // ── Carousel HTML ────────────────────────────────────────────────
  const multi  = carouselImages.length > 1;
  const slides = carouselImages.map(src => `<img src="${src}" alt="${p.name}" loading="lazy">`).join('');
  const dots   = multi
    ? `<div class="carousel-dots" id="carouselDots">${carouselImages.map((_, i) => `<span class="carousel-dot${i === 0 ? ' active' : ''}" onclick="carouselGoTo(${i})"></span>`).join('')}</div>`
    : '';
  const arrows = multi ? `
    <button class="carousel-btn carousel-prev" onclick="carouselMove(-1)" aria-label="Previous">&#8249;</button>
    <button class="carousel-btn carousel-next" onclick="carouselMove(1)"  aria-label="Next">&#8250;</button>` : '';

  const reviewCount = 89 + ((p.name.length * 13 + Math.floor(p.price)) % 159);

  // ── Option buttons ───────────────────────────────────────────────
  let colorHTML = '', lengthHTML = '';

  if (p.variants) {
    const colors  = [...new Set(p.variants.map(v => v.color))];
    const lengths = [...new Set(p.variants.map(v => v.length))];
    const def     = p.variants.find(v => v.inStock) || p.variants[0];

    colorHTML = `
      <div class="detail-options">
        <label>Color</label>
        <div class="option-group" id="colorOptions">
          ${colors.map(c => `<button class="option-btn${c === def.color ? ' active' : ''}" data-value="${c}" onclick="selectOption('color','${c}',this)">${c}</button>`).join('')}
        </div>
      </div>`;
    lengthHTML = `
      <div class="detail-options">
        <label>Length</label>
        <div class="option-group" id="lengthOptions">
          ${lengths.map(l => `<button class="option-btn${l === def.length ? ' active' : ''}" data-value="${l}" onclick="selectOption('length','${l}',this)">${l}</button>`).join('')}
        </div>
      </div>`;
  } else {
    const defLenIdx = Math.floor(p.lengths.length / 2);
    colorHTML = `
      <div class="detail-options">
        <label>Color</label>
        <div class="option-group" id="colorOptions">
          ${p.colors.map((c, i) => `<button class="option-btn${i === 0 ? ' active' : ''}" data-value="${c}" onclick="selectOption('color','${c}',this)">${c}</button>`).join('')}
        </div>
      </div>`;
    lengthHTML = `
      <div class="detail-options">
        <label>Length</label>
        <div class="option-group" id="lengthOptions">
          ${p.lengths.map((l, i) => `<button class="option-btn${i === defLenIdx ? ' active' : ''}" data-value="${l}" onclick="selectOption('length','${l}',this)">${l}</button>`).join('')}
        </div>
      </div>`;
  }

  // ── Initial price & Add-to-Bag state ────────────────────────────
  const oldPriceHTML = p.oldPrice
    ? `<span class="detail-price-old">${fmt(p.oldPrice)}</span>` : '';
  let initPrice, initDisabled, initBtnLabel;
  if (p.variants) {
    const def  = p.variants.find(v => v.inStock) || p.variants[0];
    initPrice  = def.price;
    initDisabled = !def.inStock;
    initBtnLabel = def.inStock ? `Add to Bag — ${fmt(def.price)}` : 'Out of Stock';
  } else {
    initPrice    = p.price;
    initDisabled = false;
    initBtnLabel = `Add to Bag — ${fmt(p.price)}`;
  }

  $('productDetail').innerHTML = `
    <div class="carousel" id="carousel">
      <div class="carousel-track" id="carouselTrack">${slides}</div>
      ${arrows}
      ${dots}
    </div>
    <div class="detail-info">
      <p class="breadcrumb"><a href="#" onclick="showPage('shop'); return false;">Shop</a> · ${p.subtitle}</p>
      <h1>${p.name}</h1>
      <div class="detail-rating">
        <span class="stars">★★★★★</span>
        <span class="rating-text">4.9 (${reviewCount} reviews)</span>
      </div>
      <p class="detail-price" id="detailPrice">${fmt(initPrice)}${oldPriceHTML}</p>
      <p class="detail-desc">${p.description}</p>
      ${colorHTML}
      ${lengthHTML}
      <ul class="detail-features">
        ${p.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <button class="btn-add" id="addToBagBtn" onclick="addToCart()"${initDisabled ? ' disabled' : ''}>${initBtnLabel}</button>
    </div>
  `;

  // ── Touch swipe ──────────────────────────────────────────────────
  const track = $('carouselTrack');
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) carouselMove(dx < 0 ? 1 : -1);
  }, { passive: true });
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
  const oldHTML  = currentProduct.oldPrice
    ? `<span class="detail-price-old">${fmt(currentProduct.oldPrice)}</span>` : '';

  // Price display
  const priceEl = $('detailPrice');
  if (priceEl) priceEl.innerHTML = fmt(price) + oldHTML;

  // Add to Bag button
  const btn = $('addToBagBtn');
  if (btn) {
    btn.disabled    = !inStock;
    btn.textContent = inStock ? `Add to Bag — ${fmt(price)}` : 'Out of Stock';
  }

  // If this variant has its own image, jump to it in the carousel
  if (v && v.image) {
    const idx = carouselImages.indexOf(v.image);
    if (idx >= 0) carouselGoTo(idx);
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
            b.classList.toggle('active', b.dataset.value === fallback.length);
          });
        }
      }
    }
  }
  if (type === 'length') currentProduct.selectedLength = value;

  btn.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  if (currentProduct.variants) updateVariantUI();
}

// ============================================
// 购物车
// ============================================
function addToCart() {
  if (!currentProduct) return;
  const btn = $('addToBagBtn');
  if (btn && btn.disabled) return; // blocked for out-of-stock

  const v     = currentProduct.variants
    ? findVariant(currentProduct.selectedColor, currentProduct.selectedLength)
    : null;
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
      <div class="cart-item-img"><img src="${i.image}" alt=""></div>
      <div class="cart-item-info">
        <h4>${i.name}</h4>
        <p class="cart-item-meta">${i.color} · ${i.length}</p>
        <div class="cart-qty">
          <button onclick="changeQty('${i.key}', -1)">−</button>
          <span>${i.qty}</span>
          <button onclick="changeQty('${i.key}', 1)">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <span class="cart-item-price">${fmt(i.price * i.qty)}</span>
        <button class="cart-remove" onclick="removeItem('${i.key}')">Remove</button>
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
    <p class="cart-note">${shipping === 0 ? '✓ Free shipping unlocked' : `Add ${fmt(199 - subtotal)} for free shipping`} · Tax calculated at checkout</p>
    <button class="btn-checkout" onclick="openCheckout()">Checkout — ${fmt(total)}</button>
  `;
}

function toggleCart(forceOpen) {
  const drawer = $('cartDrawer');
  const overlay = $('cartOverlay');
  const open = forceOpen !== undefined ? forceOpen : !drawer.classList.contains('open');
  drawer.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

// ============================================
// 结账弹窗
// ============================================
function openCheckout() {
  if (cart.length === 0) return;

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
      <strong>Total</strong><strong>${fmt(total)}</strong>
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
  btn.textContent = 'Place Order';

  $('checkoutOverlay').classList.add('open');
  $('checkoutModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  $('checkoutOverlay').classList.remove('open');
  $('checkoutModal').classList.remove('open');
  document.body.style.overflow = '';
}

async function submitOrder(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = $('coSubmitBtn');
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
      taxes:    '0.00',
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
  } catch (err) {
    console.error('EmailJS error:', err);
    btn.disabled    = false;
    btn.textContent = 'Place Order';
    $('orderError').style.display = 'flex';
  }
}

// ============================================
// 订阅
// ============================================
function subscribe() {
  const email = $('emailInput').value.trim();
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email.');
    return;
  }
  alert('Thank you! Your 10% off code will arrive shortly.');
  $('emailInput').value = '';
  // 上线后这里可以接入 Mailchimp / EmailJS 等邮件服务
}

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // 初始化 EmailJS
  if (CONFIG.emailjs_public_key && !CONFIG.emailjs_public_key.startsWith('YOUR_')) {
    emailjs.init({ publicKey: CONFIG.emailjs_public_key });
  }
  renderProducts();
  updateCartUI();
});
