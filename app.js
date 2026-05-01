// ============================================
// 配置区 — 上线前修改这里
// ============================================
const CONFIG = {
  // 你的 PayPal.me 链接(注册后替换),客户结账时会跳转过去付款
  // 没注册前先留空,系统会引导客户邮件下单
  paypalMe: '',  // 例如:'https://paypal.me/yourname'

  // 你的接单邮箱(必填),客户的订单信息会发送到这里
  orderEmail: 'orders@yourdomain.com',

  // 货币符号
  currency: '$'
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
        <img src="${p.image}" alt="${p.name}" loading="lazy">
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
  $('shopGrid').innerHTML = PRODUCTS.map(productCardHTML).join('');
}

// ============================================
// 商品详情
// ============================================
function renderProductDetail(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  currentProduct = { ...p, selectedColor: p.colors[0], selectedLength: p.lengths[Math.floor(p.lengths.length / 2)] };

  const oldPrice = p.oldPrice ? `<span style="text-decoration:line-through;opacity:0.5;margin-left:12px;font-size:18px;">${fmt(p.oldPrice)}</span>` : '';

  $('productDetail').innerHTML = `
    <div class="detail-image">
      <img src="${p.image}" alt="${p.name}">
    </div>
    <div class="detail-info">
      <p class="breadcrumb"><a href="#" onclick="showPage('shop'); return false;">Shop</a> · ${p.subtitle}</p>
      <h1>${p.name}</h1>
      <p class="detail-price">${fmt(p.price)}${oldPrice}</p>
      <p class="detail-desc">${p.description}</p>

      <div class="detail-options">
        <label>Color</label>
        <div class="option-group" id="colorOptions">
          ${p.colors.map((c, i) => `<button class="option-btn ${i === 0 ? 'active' : ''}" onclick="selectOption('color', '${c}', this)">${c}</button>`).join('')}
        </div>
      </div>

      <div class="detail-options">
        <label>Length</label>
        <div class="option-group" id="lengthOptions">
          ${p.lengths.map((l, i) => `<button class="option-btn ${i === Math.floor(p.lengths.length / 2) ? 'active' : ''}" onclick="selectOption('length', '${l}', this)">${l}</button>`).join('')}
        </div>
      </div>

      <ul class="detail-features">
        ${p.features.map(f => `<li>${f}</li>`).join('')}
      </ul>

      <button class="btn-add" onclick="addToCart()">Add to Bag — ${fmt(p.price)}</button>
    </div>
  `;
}

function selectOption(type, value, btn) {
  if (type === 'color') currentProduct.selectedColor = value;
  if (type === 'length') currentProduct.selectedLength = value;
  btn.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ============================================
// 购物车
// ============================================
function addToCart() {
  if (!currentProduct) return;
  const key = currentProduct.id + '-' + currentProduct.selectedColor + '-' + currentProduct.selectedLength;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      key,
      id: currentProduct.id,
      name: currentProduct.name,
      subtitle: currentProduct.subtitle,
      image: currentProduct.image,
      price: currentProduct.price,
      color: currentProduct.selectedColor,
      length: currentProduct.selectedLength,
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
    <button class="btn-checkout" onclick="checkout()">Checkout — ${fmt(total)}</button>
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
// 结账
// ============================================
function checkout() {
  if (cart.length === 0) return;

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 199 ? 0 : 15;
  const total = subtotal + shipping;

  // 生成订单摘要
  let orderText = 'NEW ORDER — LUMIÈRE\n\n';
  cart.forEach(i => {
    orderText += `• ${i.name} (${i.color}, ${i.length}) × ${i.qty} = ${fmt(i.price * i.qty)}\n`;
  });
  orderText += `\nSubtotal: ${fmt(subtotal)}\nShipping: ${fmt(shipping)}\nTotal: ${fmt(total)}\n`;

  // 如果配置了 PayPal,跳转 PayPal
  if (CONFIG.paypalMe && CONFIG.paypalMe.startsWith('http')) {
    const note = encodeURIComponent(orderText);
    const paypalUrl = `${CONFIG.paypalMe}/${total}USD`;

    if (confirm(`Order Summary:\n\n${orderText}\nClick OK to pay with PayPal.\n\nIMPORTANT: After payment, please email your shipping address to ${CONFIG.orderEmail} along with your PayPal transaction ID.`)) {
      window.open(paypalUrl, '_blank');
      cart = [];
      saveCart();
      toggleCart(false);
    }
  } else {
    // 没有 PayPal 时,引导客户发邮件
    const subject = encodeURIComponent('New Order — LUMIÈRE');
    const body = encodeURIComponent(orderText + '\n\nPlease send me payment instructions and confirm shipping address.\n\nMy address:\n[Please fill in your shipping address]');
    window.location.href = `mailto:${CONFIG.orderEmail}?subject=${subject}&body=${body}`;
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
  renderProducts();
  updateCartUI();
});
