/*
 * Rebuilds ARELVIENNE's crawlable product and information pages, sitemap,
 * and Google Merchant feed from index.html and products.js.
 *
 * Run after changing product data or shared page content:
 *   node generate-seo-pages.cjs
 */

const fs = require('fs');
const vm = require('vm');

const SITE_URL = 'https://arelvienne.com';
const BRAND = 'ARELVIENNE';
const SUPPORT_EMAIL = 'support@arelvienne.com';
const LAST_MODIFIED = '2026-07-25';

const PAGE_ROUTES = {
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

const PAGE_META = {
  shop: {
    title: 'Shop Human Hair Wigs | ARELVIENNE',
    description: 'Shop ARELVIENNE human hair wigs by texture, length, color, density, and lace construction.',
    schemaType: 'CollectionPage'
  },
  guide: {
    title: 'How to Choose a Human Hair Wig | ARELVIENNE Guide',
    description: 'Compare wig lace, density, length, texture, color, and cap construction before choosing a human hair wig.',
    schemaType: 'Article'
  },
  about: {
    title: 'Our Story | ARELVIENNE',
    description: 'Learn about ARELVIENNE and our approach to carefully selected human hair wig styles.',
    schemaType: 'AboutPage'
  },
  contact: {
    title: 'Contact ARELVIENNE Customer Care',
    description: 'Contact ARELVIENNE customer care for product, shipping, return, and order support.',
    schemaType: 'ContactPage'
  },
  shipping: {
    title: 'Shipping Policy | ARELVIENNE',
    description: 'Read ARELVIENNE free worldwide shipping, processing times, tracking, customs, and delivery information.',
    schemaType: 'WebPage'
  },
  returns: {
    title: 'Returns & Refunds | ARELVIENNE',
    description: 'Read the ARELVIENNE 30-day return eligibility and refund conditions.',
    schemaType: 'WebPage'
  },
  privacy: {
    title: 'Privacy Policy | ARELVIENNE',
    description: 'Learn how ARELVIENNE collects, uses, shares, and protects customer information.',
    schemaType: 'WebPage'
  },
  terms: {
    title: 'Terms of Service | ARELVIENNE',
    description: 'Read the terms that apply when using the ARELVIENNE website or placing an order.',
    schemaType: 'WebPage'
  }
};

function loadProducts() {
  const source = `${fs.readFileSync('products.js', 'utf8')}\n;globalThis.__PRODUCTS__ = PRODUCTS;`;
  const context = {};
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.__PRODUCTS__;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeXml(value) {
  return escapeHtml(value);
}

function absoluteUrl(path) {
  return new URL(path, `${SITE_URL}/`).href;
}

function availableVariants(product) {
  return (product.variants || []).filter(variant => variant.inStock);
}

function priceRange(product) {
  const prices = availableVariants(product).map(variant => Number(variant.price));
  if (!prices.length) prices.push(Number(product.price));
  return {
    low: Math.min(...prices),
    high: Math.max(...prices),
    count: Math.max(1, prices.length)
  };
}

function safeJson(data) {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

function replaceHead(html, meta) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(meta.description)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${escapeHtml(meta.canonical)}">`)
    .replace(/<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="${escapeHtml(meta.type)}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(meta.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeHtml(meta.description)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${escapeHtml(meta.canonical)}">`)
    .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${escapeHtml(meta.image)}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeHtml(meta.title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapeHtml(meta.description)}">`)
    .replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${escapeHtml(meta.image)}">`)
    .replace(
      /<script id="pageSchema" type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script id="pageSchema" type="application/ld+json">${safeJson(meta.schema)}</script>`
    );
}

function activatePage(html, pageName) {
  return html.replace(
    /<main id="page-([a-z]+)" class="page(?: active)?">/g,
    (full, name) => `<main id="page-${name}" class="page${name === pageName ? ' active' : ''}">`
  );
}

function staticCard(product) {
  const images = product.images || [product.image];
  const route = PRODUCT_ROUTES[product.id];
  return `
    <article class="product-card">
      <a class="product-card-link" href="${route}" aria-label="View ${escapeHtml(product.name)}">
        <div class="product-image">
          ${product.tag ? `<span class="product-tag">${escapeHtml(product.tag)}</span>` : ''}
          <img class="product-image-primary" src="${escapeHtml(images[0])}" alt="${escapeHtml(product.name)}" loading="lazy">
          ${images[1] ? `<img class="product-image-secondary" src="${escapeHtml(images[1])}" alt="${escapeHtml(product.name)} alternate view" loading="lazy">` : ''}
        </div>
        <div class="product-info">
          <p class="product-meta">${escapeHtml(product.subtitle)}</p>
          <h2 class="product-name">${escapeHtml(product.name)}</h2>
          <p class="product-price">$${Number(product.price).toFixed(2)}</p>
        </div>
      </a>
    </article>`;
}

function staticProductDetail(product) {
  const images = product.images || [product.image];
  const imageMarkup = images.map((src, index) => `
        <div class="stacked-image">
          <img src="${escapeHtml(src)}" alt="${escapeHtml(product.name)}${index ? ` view ${index + 1}` : ''}" loading="${index === 0 ? 'eager' : 'lazy'}">
        </div>`).join('');
  return `<div class="product-detail" id="productDetail">
    <div class="product-detail-images">${imageMarkup}
    </div>
    <div class="detail-info">
      <p class="breadcrumb"><a href="/shop.html">Shop</a> · ${escapeHtml(product.subtitle)}</p>
      <h1>${escapeHtml(product.name)}</h1>
      <p class="detail-price">From $${priceRange(product).low.toFixed(2)}</p>
      <p class="detail-desc">${escapeHtml(product.description)}</p>
      <ul class="detail-features">
        ${(product.features || []).map(feature => `<li>${escapeHtml(feature)}</li>`).join('')}
      </ul>
      <div class="static-checkout-note">
        <p>Secure PayPal checkout options load when JavaScript is enabled.</p>
      <p><a href="/shipping.html">Free worldwide shipping</a> · <a href="/returns.html">30-day returns on eligible items</a> · <a href="/contact.html">Ask customer care</a></p>
      </div>
    </div>
  </div>`;
}

function productSchema(product) {
  const route = PRODUCT_ROUTES[product.id];
  const range = priceRange(product);
  const images = (product.images || [product.image]).map(absoluteUrl);
  const offer = range.count > 1
    ? {
        '@type': 'AggregateOffer',
        url: `${SITE_URL}${route}`,
        priceCurrency: 'USD',
        lowPrice: range.low.toFixed(2),
        highPrice: range.high.toFixed(2),
        offerCount: range.count,
        availability: 'https://schema.org/InStock'
      }
    : {
        '@type': 'Offer',
        url: `${SITE_URL}${route}`,
        priceCurrency: 'USD',
        price: range.low.toFixed(2),
        availability: availableVariants(product).length === 0 && product.variants
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition'
      };
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images,
    sku: product.id,
    brand: { '@type': 'Brand', name: BRAND },
    material: 'Human hair',
    category: 'Wigs',
    offers: offer
  };
}

function pageSchema(pageName, meta, canonical, image) {
  if (pageName === 'guide') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: meta.title,
      description: meta.description,
      image,
      mainEntityOfPage: canonical,
      datePublished: LAST_MODIFIED,
      dateModified: LAST_MODIFIED,
      author: { '@type': 'Organization', name: BRAND, url: SITE_URL },
      publisher: { '@type': 'Organization', name: BRAND, url: SITE_URL },
      inLanguage: 'en'
    };
  }
  return {
    '@context': 'https://schema.org',
    '@type': meta.schemaType,
    name: meta.title,
    description: meta.description,
    url: canonical,
    isPartOf: {
      '@type': 'WebSite',
      name: `${BRAND} Human Hair Wigs`,
      url: SITE_URL
    },
    inLanguage: 'en'
  };
}

function buildPages(products) {
  const template = fs.readFileSync('index.html', 'utf8');
  const defaultImage = `${SITE_URL}/images/lum-011/main_01.webp`;

  for (const [pageName, route] of Object.entries(PAGE_ROUTES)) {
    const pageMeta = PAGE_META[pageName];
    const canonical = `${SITE_URL}${route}`;
    let html = activatePage(template, pageName);
    if (pageName === 'shop') {
      html = html.replace(
        '<div class="product-grid" id="shopGrid"></div>',
        `<div class="product-grid" id="shopGrid">${products.map(staticCard).join('')}\n    </div>`
      );
    }
    html = replaceHead(html, {
      title: pageMeta.title,
      description: pageMeta.description,
      canonical,
      image: defaultImage,
      type: pageName === 'guide' ? 'article' : 'website',
      schema: pageSchema(pageName, pageMeta, canonical, defaultImage)
    });
    fs.writeFileSync(route.slice(1), html, 'utf8');
  }

  for (const product of products) {
    const route = PRODUCT_ROUTES[product.id];
    if (!route) throw new Error(`Missing clean route for ${product.id}`);
    const canonical = `${SITE_URL}${route}`;
    const image = absoluteUrl((product.images || [product.image])[0]);
    const title = `${product.name} | Human Hair Wig | ${BRAND}`;
    let html = activatePage(template, 'product');
    html = html.replace('<div class="product-detail" id="productDetail"></div>', staticProductDetail(product));
    html = replaceHead(html, {
      title,
      description: product.description,
      canonical,
      image,
      type: 'product',
      schema: productSchema(product)
    });
    fs.writeFileSync(route.slice(1), html, 'utf8');
  }
}

function buildSitemap(products) {
  const urls = [
    { route: '/', priority: '1.0' },
    { route: PAGE_ROUTES.shop, priority: '0.9' },
    { route: PAGE_ROUTES.guide, priority: '0.8' },
    ...products.map(product => ({ route: PRODUCT_ROUTES[product.id], priority: '0.8' })),
    { route: PAGE_ROUTES.about, priority: '0.6' },
    { route: PAGE_ROUTES.contact, priority: '0.6' },
    { route: PAGE_ROUTES.shipping, priority: '0.5' },
    { route: PAGE_ROUTES.returns, priority: '0.5' },
    { route: PAGE_ROUTES.privacy, priority: '0.4' },
    { route: PAGE_ROUTES.terms, priority: '0.4' }
  ];
  const rows = urls.map(({ route, priority }) =>
    `  <url><loc>${SITE_URL}${route}</loc><lastmod>${LAST_MODIFIED}</lastmod><priority>${priority}</priority></url>`
  ).join('\n');
  fs.writeFileSync(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</urlset>\n`,
    'utf8'
  );
}

function buildMerchantFeed(products) {
  const items = products.map(product => {
    const route = PRODUCT_ROUTES[product.id];
    const range = priceRange(product);
    const image = absoluteUrl((product.images || [product.image])[0]);
    const shippingPrice = '0.00';
    const title = `${product.name} — ${product.subtitle}`;
    const availability = availableVariants(product).length === 0 && product.variants ? 'out_of_stock' : 'in_stock';
    return `    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:structured_title>
        <g:digital_source_type>trained_algorithmic_media</g:digital_source_type>
        <g:content>${escapeXml(title)}</g:content>
      </g:structured_title>
      <g:structured_description>
        <g:digital_source_type>trained_algorithmic_media</g:digital_source_type>
        <g:content>${escapeXml(product.description)}</g:content>
      </g:structured_description>
      <link>${SITE_URL}${route}</link>
      <g:image_link>${escapeXml(image)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${range.low.toFixed(2)} USD</g:price>
      <g:condition>new</g:condition>
      <g:brand>${BRAND}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:adult>no</g:adult>
      <g:product_type>Hair Extensions &amp; Wigs &gt; Wigs</g:product_type>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard</g:service>
        <g:price>${shippingPrice} USD</g:price>
        <g:min_handling_time>1</g:min_handling_time>
        <g:max_handling_time>3</g:max_handling_time>
        <g:min_transit_time>7</g:min_transit_time>
        <g:max_transit_time>15</g:max_transit_time>
      </g:shipping>
    </item>`;
  }).join('\n\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${BRAND} Human Hair Wigs</title>
    <link>${SITE_URL}/</link>
    <description>Human hair wigs with lace construction, international shipping, and published return conditions.</description>

${items}
  </channel>
</rss>
`;
  fs.writeFileSync('google-merchant-feed.xml', feed, 'utf8');
}

const products = loadProducts();
buildPages(products);
buildSitemap(products);
buildMerchantFeed(products);

console.log(`Generated ${Object.keys(PAGE_ROUTES).length} information pages, ${products.length} product pages, sitemap.xml, and google-merchant-feed.xml.`);
