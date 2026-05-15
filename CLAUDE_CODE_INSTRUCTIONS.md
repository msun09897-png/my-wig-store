# 任务:详情页画廊功能升级(轮播 + 缩略图栏 + 全屏放大)

## 概述

为商品详情页加多图画廊,采用 Aritzia / SSENSE 风格(左侧纵向缩略图 + 右侧主图)。
点主图能全屏放大查看(lightbox)。**不自动轮播,纯手动点击**。

**关键约束**:
- 必须**完全向后兼容**现有 8 个商品(它们 `images: ['singleUrl']` 数组里只有 1 张图)
- 单图时:不显示缩略图栏,主图依然支持点击放大
- 多图时:左缩略图 + 右主图,点缩略图带淡入切换
- 桌面端:左侧纵向缩略图(80px 宽);移动端:缩略图改横向滚动放主图下方

## 改动清单

| 文件 | 改动类型 | 大约行数 |
|---|---|---|
| `style.css` | 新增样式块 | +180 行 |
| `app.js` | 新增 ProductGallery 模块 + 修改详情页渲染逻辑 | +200 行,改 ~30 行 |
| `index.html` | 修改详情页 HTML 结构 | 改 ~10 行 |
| `uploader.html` | 升级图片字段为多图列表 + variant 级图片 | 改 ~40 行 |
| `products.js` | **不动**(现有 images 已是数组,完全兼容) | 0 |

---

## 改动 1:`style.css` — 在文件末尾追加

将下面这一整段追加到 `style.css` 末尾:

```css
/* =========================================================================
   PRODUCT GALLERY  (新增 - 详情页画廊)
   ========================================================================= */

/* 画廊容器:左缩略图 + 右主图(Aritzia / SSENSE 风格) */
.gallery {
  display: flex;
  gap: 16px;
  width: 100%;
}

/* 左侧缩略图栏(纵向) */
.gallery__thumbs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
  width: 80px;
}

.gallery__thumb {
  width: 80px;
  height: 80px;
  border: 1px solid #e5e0d8;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  background: #f7f3ec;
  transition: border-color 0.2s ease, transform 0.2s ease;
  padding: 0;
}

.gallery__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery__thumb:hover {
  border-color: #b8a888;
}

.gallery__thumb.is-active {
  border: 1.5px solid #2a2620;
}

/* 单图时整个缩略图栏隐藏 */
.gallery--single .gallery__thumbs {
  display: none;
}

/* 主图区域 */
.gallery__main {
  flex: 1;
  position: relative;
  background: #f7f3ec;
  border-radius: 6px;
  overflow: hidden;
  cursor: zoom-in;
  aspect-ratio: 1 / 1;
}

.gallery__main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.2s ease;
}

.gallery__main.is-fading img {
  opacity: 0;
}


/* =========================================================================
   LIGHTBOX  (全屏放大)
   ========================================================================= */

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(20, 18, 14, 0.92);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  cursor: zoom-out;
  animation: lightbox-in 0.2s ease;
}

.lightbox[hidden] { display: none !important; }

@keyframes lightbox-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.lightbox__img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  display: block;
  cursor: default;
  user-select: none;
  -webkit-user-drag: none;
}

.lightbox__close,
.lightbox__prev,
.lightbox__next {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  font-family: inherit;
}

.lightbox__close:hover,
.lightbox__prev:hover,
.lightbox__next:hover {
  background: rgba(255, 255, 255, 0.25);
}

.lightbox__close { top: 24px; right: 24px; }
.lightbox__prev  { left: 24px;  top: 50%; transform: translateY(-50%); }
.lightbox__next  { right: 24px; top: 50%; transform: translateY(-50%); }

.lightbox--single .lightbox__prev,
.lightbox--single .lightbox__next {
  display: none;
}

.lightbox__counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  letter-spacing: 0.05em;
}

.lightbox--single .lightbox__counter { display: none; }


/* =========================================================================
   响应式 - 移动端(≤768px)
   ========================================================================= */

@media (max-width: 768px) {
  .gallery {
    flex-direction: column;
    gap: 12px;
  }
  
  .gallery__thumbs {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 8px;
    padding-bottom: 4px;
    scrollbar-width: none;
  }
  
  .gallery__thumbs::-webkit-scrollbar { display: none; }
  
  .gallery__thumb {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
  }
  
  .gallery__main { order: -1; }
  
  .lightbox { padding: 16px; }
  
  .lightbox__close,
  .lightbox__prev,
  .lightbox__next {
    width: 40px;
    height: 40px;
  }
  
  .lightbox__close { top: 16px; right: 16px; }
  .lightbox__prev  { left: 12px; }
  .lightbox__next  { right: 12px; }
}
```

---

## 改动 2:`app.js` — 在文件末尾追加 ProductGallery 模块

将下面这一整段追加到 `app.js` 末尾:

```javascript
/* =========================================================================
   PRODUCT GALLERY MODULE  (新增)
   公开 API:
     ProductGallery.init(images, container)
     ProductGallery.update(images)
     ProductGallery.destroy()
     ProductGallery.extractImages(product, variant)
   ========================================================================= */

const ProductGallery = (function () {
  let state = {
    images: [],
    currentIndex: 0,
    container: null,
    mainImgEl: null,
    thumbsEl: null,
    lightboxEl: null,
    lightboxImgEl: null,
    keyHandler: null,
  };

  function extractImages(product, variant) {
    if (variant) {
      if (Array.isArray(variant.images) && variant.images.length > 0) {
        return variant.images.slice();
      }
      if (typeof variant.image === 'string' && variant.image) {
        return [variant.image];
      }
    }
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.slice();
    }
    if (typeof product.image === 'string' && product.image) {
      return [product.image];
    }
    return ['https://i.postimg.cc/placeholder.jpg'];
  }

  function init(images, container) {
    if (!container) {
      console.error('[Gallery] container is required');
      return;
    }
    state.container = container;
    state.images = (Array.isArray(images) && images.length > 0)
      ? images.slice()
      : ['https://i.postimg.cc/placeholder.jpg'];
    state.currentIndex = 0;
    render();
    bindEvents();
  }

  function update(images) {
    state.images = (Array.isArray(images) && images.length > 0)
      ? images.slice()
      : state.images;
    state.currentIndex = 0;
    render();
    bindEvents();
  }

  function destroy() {
    if (state.keyHandler) {
      document.removeEventListener('keydown', state.keyHandler);
      state.keyHandler = null;
    }
    closeLightbox();
    state.container = null;
    state.images = [];
    state.currentIndex = 0;
  }

  function render() {
    if (!state.container) return;
    const isSingle = state.images.length <= 1;
    const galleryClass = isSingle ? 'gallery gallery--single' : 'gallery';

    state.container.innerHTML = `
      <div class="${galleryClass}">
        <div class="gallery__thumbs">
          ${state.images.map((src, i) => `
            <button type="button" class="gallery__thumb ${i === state.currentIndex ? 'is-active' : ''}" 
                    data-index="${i}" aria-label="View image ${i + 1}">
              <img src="${src}" alt="Thumbnail ${i + 1}" loading="lazy" />
            </button>
          `).join('')}
        </div>
        <div class="gallery__main" data-action="zoom">
          <img src="${state.images[state.currentIndex]}" alt="Product image" />
        </div>
      </div>
    `;
    state.thumbsEl = state.container.querySelector('.gallery__thumbs');
    state.mainImgEl = state.container.querySelector('.gallery__main img');
  }

  function bindEvents() {
    if (!state.container) return;
    state.container.querySelectorAll('.gallery__thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const idx = Number(thumb.getAttribute('data-index'));
        switchTo(idx);
      });
    });
    const mainEl = state.container.querySelector('.gallery__main');
    if (mainEl) {
      mainEl.addEventListener('click', () => openLightbox(state.currentIndex));
    }
  }

  function switchTo(idx) {
    if (idx < 0 || idx >= state.images.length) return;
    if (idx === state.currentIndex) return;
    const mainContainer = state.container.querySelector('.gallery__main');
    if (!mainContainer || !state.mainImgEl) return;
    mainContainer.classList.add('is-fading');
    setTimeout(() => {
      state.currentIndex = idx;
      state.mainImgEl.src = state.images[idx];
      mainContainer.classList.remove('is-fading');
      state.container.querySelectorAll('.gallery__thumb').forEach((t, i) => {
        t.classList.toggle('is-active', i === idx);
      });
    }, 150);
  }

  function openLightbox(idx) {
    closeLightbox();
    const isSingle = state.images.length <= 1;
    const lightboxClass = isSingle ? 'lightbox lightbox--single' : 'lightbox';
    const lightbox = document.createElement('div');
    lightbox.className = lightboxClass;
    lightbox.innerHTML = `
      <button type="button" class="lightbox__close" aria-label="Close">✕</button>
      <button type="button" class="lightbox__prev" aria-label="Previous">‹</button>
      <img class="lightbox__img" src="${state.images[idx]}" alt="Product image" />
      <button type="button" class="lightbox__next" aria-label="Next">›</button>
      <div class="lightbox__counter">${idx + 1} / ${state.images.length}</div>
    `;
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    state.lightboxEl = lightbox;
    state.lightboxImgEl = lightbox.querySelector('.lightbox__img');
    let lbIndex = idx;

    const updateLightbox = (newIdx) => {
      if (newIdx < 0) newIdx = state.images.length - 1;
      if (newIdx >= state.images.length) newIdx = 0;
      lbIndex = newIdx;
      state.lightboxImgEl.src = state.images[newIdx];
      const counter = lightbox.querySelector('.lightbox__counter');
      if (counter) counter.textContent = `${newIdx + 1} / ${state.images.length}`;
      switchTo(newIdx);
    };

    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    state.lightboxImgEl.addEventListener('click', (e) => e.stopPropagation());
    lightbox.querySelector('.lightbox__prev').addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightbox(lbIndex - 1);
    });
    lightbox.querySelector('.lightbox__next').addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightbox(lbIndex + 1);
    });

    state.keyHandler = (e) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') updateLightbox(lbIndex - 1);
      else if (e.key === 'ArrowRight') updateLightbox(lbIndex + 1);
    };
    document.addEventListener('keydown', state.keyHandler);
  }

  function closeLightbox() {
    if (state.lightboxEl) {
      state.lightboxEl.remove();
      state.lightboxEl = null;
      state.lightboxImgEl = null;
      document.body.style.overflow = '';
    }
    if (state.keyHandler) {
      document.removeEventListener('keydown', state.keyHandler);
      state.keyHandler = null;
    }
  }

  return {
    init: init,
    update: update,
    destroy: destroy,
    extractImages: extractImages,
  };
})();

window.ProductGallery = ProductGallery;
```

---

## 改动 3:`app.js` 详情页渲染逻辑接入画廊

需要在详情页的渲染函数里(应该叫 `renderProductDetail` 或类似名字),
**找到目前渲染主图的那一行**(类似 `<img src="${product.images[0]}" ...>`),
替换为画廊容器:

### 找到这种结构(类似):

```html
<div class="product-detail-image">
  <img src="${product.images[0]}" alt="${product.name}" />
</div>
```

### 替换为:

```html
<div class="product-detail-image" id="gallery-container"></div>
```

### 然后在渲染完详情页 HTML 之后,初始化画廊:

```javascript
// 拿到当前默认 variant(如果商品有 variants 系统)
const defaultVariant = product.variants
  ? product.variants.find(v => v.inStock) || product.variants[0]
  : null;

const images = ProductGallery.extractImages(product, defaultVariant);
const container = document.getElementById('gallery-container');
ProductGallery.init(images, container);
```

### 在切换 variant 时(找到现有的 variant 切换函数,可能叫 `selectVariant` 或 `updateVariant`):

```javascript
// 在 variant 切换的处理函数里,加这一行
const newImages = ProductGallery.extractImages(product, selectedVariant);
ProductGallery.update(newImages);
```

### 在离开详情页时(返回列表 / 路由切换):

```javascript
ProductGallery.destroy();
```

**重要:具体函数名要看 app.js 实际代码,Claude Code 你要先 grep 一下 `images[0]` 或 `product-detail-image` 找到现有渲染逻辑,再改。**

---

## 改动 4:`uploader.html` 升级图片字段为多图

找到目前的"主图链接"输入字段(单 input),改为:

### 商品级图片 - 改为 textarea(一行一个 URL):

```html
<label>商品图片(一行一个 URL,第一张是主图)</label>
<textarea id="g-images" rows="5" placeholder="https://i.postimg.cc/xxxxx
https://i.postimg.cc/yyyyy
https://i.postimg.cc/zzzzz"></textarea>
<small>建议 4-8 张:正面 / 侧面 / 后面 / 戴上身 / 细节</small>
```

### Variant 级图片(可选,折叠区) - 在 variant 配置区加:

```html
<details class="advanced-section">
  <summary>📷 各 SKU 单独图片(可选,留空则用商品级图片)</summary>
  <p style="font-size:13px;color:#888;">
    如果某个颜色的图片差异很大,可以为该颜色指定专属图组。
    每行一个 URL,空行分隔不同颜色。
  </p>
  <textarea id="g-variant-images" rows="6" placeholder="Natural Black:
https://...
https://...

Honey Blonde:
https://...
https://..."></textarea>
</details>
```

### 生成代码逻辑要更新

`buildProductCode()` 函数里:
- `images:` 字段从单 URL 字符串数组改为多 URL 数组,从 `g-images` textarea 按行分割
- variant 级 `image` 字段升级为 `images: [...]`,从 `g-variant-images` 解析(如果用户填了)
- 解析逻辑:用 `\n\n` 分割颜色块,每块第一行是颜色名(去掉冒号),后续行是 URL

参考解析代码:

```javascript
function parseVariantImages(text) {
  if (!text.trim()) return {};
  const blocks = text.split(/\n\s*\n/);
  const result = {};
  blocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    const colorName = lines[0].replace(/:$/, '').trim();
    const urls = lines.slice(1);
    if (colorName && urls.length > 0) {
      result[colorName] = urls;
    }
  });
  return result;
}

// 然后生成 variant 时:
const variantImagesMap = parseVariantImages(variantImagesText);
variants.forEach(v => {
  if (variantImagesMap[v.color]) {
    v.images = variantImagesMap[v.color];
  }
});
```

生成代码格式参考(每个 variant):

```js
{ color: 'Natural Black', length: '14inch/35cm', price: 189, 
  images: ['url1', 'url2'],  // 仅当用户填了时才输出这个字段
  inStock: true, _supplierCost: 60 },
```

---

## 改动 5:`index.html` 详情页结构(可能不需要改)

如果 `app.js` 是动态生成详情页 HTML,**index.html 不需要改**。
如果 index.html 有详情页静态模板,把模板里的 `<img>` 元素改成空 div:

```html
<!-- 旧 -->
<div class="product-detail-image">
  <img id="detail-img" src="" alt="" />
</div>

<!-- 新 -->
<div class="product-detail-image" id="gallery-container"></div>
```

---

## 提交信息

```
feat: 详情页画廊 - 多图轮播 + 缩略图栏 + 全屏放大

- 新增 ProductGallery 模块(纯原生,无依赖)
- 桌面端:左侧纵向缩略图 + 右侧主图(Aritzia/SSENSE 风格)
- 移动端:主图 + 下方横向缩略图栏
- 主图点击全屏 lightbox(支持键盘左右/ESC、点击空白关闭)
- 单图自动隐藏缩略图栏 + 隐藏 lightbox 箭头(向后兼容现有 8 个商品)
- variant 切换支持图组替换,带 150ms 淡入动画
- uploader.html 升级:商品级 textarea 多图 + variant 级折叠区可选多图
- products.js 零改动,完全兼容
```

---

## 测试清单(push 后用户验证)

- [ ] **单图商品**(现有 8 个):详情页只显示主图,**没有缩略图栏**,布局看起来跟以前一样
- [ ] **单图商品**:点主图能放大,**lightbox 没有左右箭头**(因为只有 1 张)
- [ ] **多图商品**(以后上的新品):桌面端左侧 4-6 个缩略图,右侧大主图
- [ ] **多图商品**:点不同缩略图能切主图,带淡入动画(150ms)
- [ ] **多图商品**:当前选中的缩略图有米色加粗边框
- [ ] 点主图能全屏放大,显示左右切换箭头 + 计数器(2/5)
- [ ] lightbox 按键盘左右箭头可切换,ESC 关闭,点空白处关闭
- [ ] 移动端(F12 → toggle device toolbar):缩略图栏改横向滚动放主图下方
- [ ] **切换 variant**(颜色)时:如果该 variant 有自己的 images,主图组替换;没有则用商品级
- [ ] uploader.html:商品级"图片链接列表"是 textarea,能输入多行
- [ ] uploader.html:展开 variant 级图片折叠区,能按颜色填多图
- [ ] uploader.html:生成的代码 variants 里仅当填了图才有 `images: [...]` 字段

如发现任一项失败,告诉用户哪一条。
