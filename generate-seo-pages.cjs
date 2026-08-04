/*
 * Rebuilds ARELVIENNE's crawlable product and information pages, sitemap,
 * and Google Merchant feed from index.html and products.js.
 *
 * Run after changing product data or shared page content:
 *   node generate-seo-pages.cjs
 */

const fs = require('fs');
const vm = require('vm');
const SEO_ARTICLES = require('./seo-articles.cjs');

const SITE_URL = 'https://arelvienne.com';
const BRAND = 'ARELVIENNE';
const SUPPORT_EMAIL = 'support@arelvienne.com';
const LAST_MODIFIED = '2026-08-03';
const INDEXNOW_KEY = 'a13da8f942954c0499bbf1244f00ff19';
const GOOGLE_PRODUCT_CATEGORY = '181';

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

const MARKETING_CHANNELS = [
  { platform: 'Pinterest profile', source: 'pinterest', medium: 'organic_social', campaign: 'profile' },
  { platform: 'Instagram bio', source: 'instagram', medium: 'organic_social', campaign: 'profile' },
  { platform: 'TikTok bio', source: 'tiktok', medium: 'organic_social', campaign: 'profile' },
  { platform: 'YouTube channel', source: 'youtube', medium: 'organic_video', campaign: 'channel' },
  { platform: 'Facebook page', source: 'facebook', medium: 'organic_social', campaign: 'profile' },
  { platform: 'Reddit answers', source: 'reddit', medium: 'community', campaign: 'helpful_answers' },
  { platform: 'Quora answers', source: 'quora', medium: 'community', campaign: 'helpful_answers' }
];

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

function escapeCsv(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
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

function variantDimensions(variant) {
  const densityMatch = String(variant.color).match(/(\d+)%\s*Density/i);
  const color = String(variant.color)
    .replace(/\s*·\s*\d+%\s*Density/i, '')
    .trim();
  return {
    color,
    length: String(variant.length),
    ...(densityMatch ? { density: `${densityMatch[1]}%` } : {})
  };
}

function merchantColor(color) {
  return String(color)
    .replace(/^#613\s+Platinum$/i, 'Platinum Blonde')
    .replace(/^#613\s+Blonde Body Wave$/i, 'Blonde')
    .replace(/^1B\/27\s+Honey Noir$/i, 'Natural Black/Honey Blonde');
}

function variantTitle(product, variant) {
  const dimensions = variantDimensions(variant);
  return [product.seo?.catalogTitle || product.name, dimensions.color, dimensions.length, dimensions.density]
    .filter(Boolean)
    .join(' - ');
}

function merchantDescription(product, variant) {
  const dimensions = variantDimensions(variant);
  const specifications = [
    `length: ${dimensions.length}`,
    `color: ${merchantColor(dimensions.color)}`,
    dimensions.density ? `density: ${dimensions.density}` : '',
    'material: human hair',
    'audience: adult women'
  ].filter(Boolean).join(', ');
  const features = (product.features || [])
    .map(feature => String(feature).replace(/[.!?]+$/g, ''))
    .join('; ');

  return `${product.description} This ${BRAND} variant of ${product.name} has ${specifications}. Product details: ${features}.`;
}

function variantLink(route, variant) {
  const url = new URL(route, `${SITE_URL}/`);
  url.searchParams.set('variant', variant.sku);
  return url.href;
}

function trackedUrl(path, { source, medium, campaign, content }) {
  const url = new URL(path, `${SITE_URL}/`);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', campaign);
  if (content) url.searchParams.set('utm_content', content);
  return url.href;
}

function trackedVariantLink(route, variant, tracking) {
  const url = new URL(variantLink(route, variant));
  url.searchParams.set('utm_source', tracking.source);
  url.searchParams.set('utm_medium', tracking.medium);
  url.searchParams.set('utm_campaign', tracking.campaign);
  url.searchParams.set('utm_content', variant.sku);
  return url.href;
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
  const videoMarkup = product.video ? `
        <section class="product-video-card" id="product-video" aria-labelledby="productVideoTitle">
          <div class="product-video-copy">
            <p class="eyebrow">— Watch the style —</p>
            <h2 id="productVideoTitle">${escapeHtml(product.video.title)}</h2>
            <p id="productVideoDescription">${escapeHtml(product.video.description)}</p>
          </div>
          <div class="product-video-frame">
            <video controls playsinline preload="metadata" poster="${escapeHtml(product.video.poster)}" aria-label="${escapeHtml(product.name)} product video" aria-describedby="productVideoDescription">
              <source src="${escapeHtml(product.video.src)}" type="video/mp4">
              Your browser does not support HTML video.
            </video>
          </div>
        </section>` : '';
  return `<section class="container product-detail" id="productDetail">
    <div class="product-detail-images">${imageMarkup}${videoMarkup}
    </div>
    <div class="detail-info">
      <p class="breadcrumb"><a href="/shop.html">Shop</a> · ${escapeHtml(product.subtitle)}</p>
      <h1>${escapeHtml(product.seo?.h1 || product.name)}</h1>
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
  </section>`;
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
    name: product.seo?.schemaName || product.name,
    description: product.description,
    image: images,
    sku: product.id,
    brand: { '@type': 'Brand', name: BRAND },
    material: 'Human hair',
    category: 'Wigs',
    offers: offer,
    ...(product.video ? {
      subjectOf: {
        '@type': 'VideoObject',
        name: product.video.title,
        description: product.video.description,
        thumbnailUrl: [absoluteUrl(product.video.poster)],
        uploadDate: product.video.uploadDate,
        duration: `PT${product.video.durationSeconds}S`,
        contentUrl: absoluteUrl(product.video.src),
        url: `${SITE_URL}${route}#product-video`
      }
    } : {})
  };
}

function articleSchema(article, canonical, image) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline: article.h1,
        description: article.description,
        image,
        mainEntityOfPage: canonical,
        datePublished: LAST_MODIFIED,
        dateModified: LAST_MODIFIED,
        author: { '@type': 'Organization', name: BRAND, url: SITE_URL },
        publisher: { '@type': 'Organization', name: BRAND, url: SITE_URL },
        inLanguage: 'en'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Wig Buying Guide', item: `${SITE_URL}${PAGE_ROUTES.guide}` },
          { '@type': 'ListItem', position: 3, name: article.h1, item: canonical }
        ]
      }
    ]
  };
}

function buildArticlePage(template, article) {
  const canonical = `${SITE_URL}${article.route}`;
  const image = absoluteUrl(article.image);
  const articleBody = article.body.trim().replace(/^[ \t]+$/gm, '');
  const rawHead = template.match(/<head>[\s\S]*?<\/head>/)?.[0];
  const rawAnnouncement = template.match(/<div class="announcement">[\s\S]*?<\/div>/)?.[0];
  const rawHeader = template.match(/<header class="header">[\s\S]*?<\/header>/)?.[0];
  const rawFooter = template.match(/<footer class="footer">[\s\S]*?<\/footer>/)?.[0];
  const scripts = [...template.matchAll(/<script src="(?:products|app)\.js[^>]*><\/script>/g)]
    .map(match => match[0])
    .join('\n');
  if (!rawHead || !rawAnnouncement || !rawHeader || !rawFooter || !scripts) {
    throw new Error(`Could not extract shared layout for ${article.route}`);
  }

  const head = replaceHead(rawHead, {
    title: article.title,
    description: article.description,
    canonical,
    image,
    type: 'article',
    schema: articleSchema(article, canonical, image)
  });
  const removeSpaNavigation = html => html.replace(/ onclick="showPage\([^\"]+return false;"/g, '');

  return `<!DOCTYPE html>
<html lang="en">
${head}
<body data-static-article="true">
${rawAnnouncement}
${removeSpaNavigation(rawHeader)}
<main id="page-seo-article" class="page active">
  <section class="page-header seo-article-header">
    <div class="container">
      <p class="eyebrow">— ${escapeHtml(article.eyebrow)} —</p>
      <h1>${escapeHtml(article.h1)}</h1>
      <p class="page-sub">${escapeHtml(article.intro)}</p>
      <p class="article-updated">Updated ${LAST_MODIFIED}</p>
    </div>
  </section>
  <article class="container policy-content seo-article">
    <nav class="article-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> · <a href="${PAGE_ROUTES.guide}">Wig Buying Guide</a> · ${escapeHtml(article.h1)}</nav>
    ${articleBody}
    <aside class="article-cta">
      <h2>Compare the current ARELVIENNE collection</h2>
      <p>Review each product's lace, texture, density, length, color and current price before choosing.</p>
      <a class="btn btn-primary" href="${PAGE_ROUTES.shop}">Shop human hair wigs</a>
    </aside>
  </article>
</main>
${removeSpaNavigation(rawFooter)}
${scripts}
</body>
</html>
`;
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
    const title = product.seo?.title || `${product.name} | Human Hair Wig | ${BRAND}`;
    let html = activatePage(template, 'product');
    html = html.replace(
      '<section class="container product-detail" id="productDetail"></section>',
      staticProductDetail(product)
    );
    html = replaceHead(html, {
      title,
      description: product.seo?.description || product.description,
      canonical,
      image,
      type: 'product',
      schema: productSchema(product)
    });
    fs.writeFileSync(route.slice(1), html, 'utf8');
  }

  for (const article of SEO_ARTICLES) {
    fs.writeFileSync(article.route.slice(1), buildArticlePage(template, article), 'utf8');
  }
}

function buildSitemap(products) {
  const urls = [
    { route: '/', priority: '1.0' },
    { route: PAGE_ROUTES.shop, priority: '0.9' },
    { route: PAGE_ROUTES.guide, priority: '0.8' },
    ...SEO_ARTICLES.map(article => ({ route: article.route, priority: '0.7' })),
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

function buildPinterestCatalog(products) {
  const headers = [
    'id',
    'title',
    'description',
    'link',
    'image_link',
    'additional_image_link',
    'price',
    'availability',
    'condition',
    'brand',
    'google_product_category',
    'product_type',
    'item_group_id',
    'color',
    'size',
    'material'
  ];
  const rows = products.flatMap(product => {
    const route = PRODUCT_ROUTES[product.id];
    const images = (product.images || [product.image]).map(absoluteUrl);
    const variants = product.variants?.length
      ? product.variants
      : [{ sku: product.id, color: '', length: '', price: product.price, inStock: true }];

    return variants.map(variant => {
      const dimensions = variantDimensions(variant);
      return [
        variant.sku,
        variantTitle(product, variant),
        product.seo?.description || product.description,
        trackedVariantLink(route, variant, {
          source: 'pinterest',
          medium: 'organic_shopping',
          campaign: 'product_catalog'
        }),
        images[0],
        images.slice(1, 11).join(','),
        `${Number(variant.price).toFixed(2)} USD`,
        variant.inStock ? 'in stock' : 'out of stock',
        'new',
        BRAND,
        GOOGLE_PRODUCT_CATEGORY,
        'Hair Extensions & Wigs > Wigs',
        variants.length > 1 ? product.id : '',
        merchantColor(dimensions.color),
        dimensions.length,
        'Human Hair'
      ].map(escapeCsv).join(',');
    });
  });

  fs.writeFileSync(
    'pinterest-catalog.csv',
    `${headers.map(escapeCsv).join(',')}\n${rows.join('\n')}\n`,
    'utf8'
  );
}

function buildMarketingLinks(products) {
  const destinations = [
    { name: 'Home', path: '/', content: 'home' },
    { name: 'Shop', path: PAGE_ROUTES.shop, content: 'shop' },
    { name: 'Wig guide', path: PAGE_ROUTES.guide, content: 'wig_guide' },
    ...SEO_ARTICLES.map(article => ({
      name: article.h1,
      path: article.route,
      content: article.content
    })),
    ...products.map(product => ({
      name: product.name,
      path: PRODUCT_ROUTES[product.id],
      content: product.id
    }))
  ];
  const headers = [
    'platform',
    'destination',
    'url',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content'
  ];
  const rows = MARKETING_CHANNELS.flatMap(channel =>
    destinations.map(destination => [
      channel.platform,
      destination.name,
      trackedUrl(destination.path, {
        source: channel.source,
        medium: channel.medium,
        campaign: channel.campaign,
        content: destination.content
      }),
      channel.source,
      channel.medium,
      channel.campaign,
      destination.content
    ].map(escapeCsv).join(','))
  );

  fs.writeFileSync(
    'marketing-utm-links.csv',
    `${headers.map(escapeCsv).join(',')}\n${rows.join('\n')}\n`,
    'utf8'
  );
}

function buildIndexNowUrls() {
  const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  fs.writeFileSync('indexnow-urls.txt', `${urls.join('\n')}\n`, 'utf8');
  fs.writeFileSync(`${INDEXNOW_KEY}.txt`, `${INDEXNOW_KEY}\n`, 'utf8');
}

function buildMerchantFeed(products) {
  const items = products.flatMap(product => {
    const route = PRODUCT_ROUTES[product.id];
    const image = absoluteUrl((product.images || [product.image])[0]);
    const additionalImages = (product.images || []).slice(1, 11).map(absoluteUrl);
    const shippingPrice = '0.00';
    const variants = product.variants?.length
      ? product.variants
      : [{ sku: product.id, color: '', length: '', price: product.price, inStock: true }];

    return variants.map(variant => {
      const dimensions = variantDimensions(variant);
      const title = variantTitle(product, variant);
      const description = merchantDescription(product, variant);
      const availability = variant.inStock ? 'in_stock' : 'out_of_stock';
      const groupFields = variants.length > 1
        ? `
      <g:item_group_id>${escapeXml(product.id)}</g:item_group_id>
      <g:item_group_title>${escapeXml(product.seo?.catalogTitle || `${product.name} Human Hair Wig`)}</g:item_group_title>
      ${Object.entries(dimensions).map(([name, value]) => `<g:variant_option>
        <g:name>${escapeXml(name)}</g:name>
        <g:value>${escapeXml(value)}</g:value>
      </g:variant_option>`).join('\n      ')}`
        : '';

      return `    <item>
      <g:id>${escapeXml(variant.sku)}</g:id>${groupFields}
      <g:title>${escapeXml(title)}</g:title>
      <g:structured_title>
        <g:digital_source_type>trained_algorithmic_media</g:digital_source_type>
        <g:content>${escapeXml(title)}</g:content>
      </g:structured_title>
      <g:structured_description>
        <g:digital_source_type>trained_algorithmic_media</g:digital_source_type>
        <g:content>${escapeXml(description)}</g:content>
      </g:structured_description>
      <link>${escapeXml(trackedVariantLink(route, variant, {
        source: 'google',
        medium: 'organic_shopping',
        campaign: 'free_listings'
      }))}</link>
      <g:canonical_link>${SITE_URL}${route}</g:canonical_link>
      <g:image_link>${escapeXml(image)}</g:image_link>
      ${additionalImages.map(src => `<g:additional_image_link>${escapeXml(src)}</g:additional_image_link>`).join('\n      ')}
      <g:availability>${availability}</g:availability>
      <g:price>${Number(variant.price).toFixed(2)} USD</g:price>
      <g:condition>new</g:condition>
      <g:brand>${BRAND}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:adult>no</g:adult>
      <g:age_group>adult</g:age_group>
      <g:gender>female</g:gender>
      <g:color>${escapeXml(merchantColor(dimensions.color))}</g:color>
      <g:size>${escapeXml(dimensions.length)}</g:size>
      <g:material>Human Hair</g:material>
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
    });
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
buildPinterestCatalog(products);
buildMarketingLinks(products);
buildIndexNowUrls();

console.log(
  `Generated ${Object.keys(PAGE_ROUTES).length} information pages, ${SEO_ARTICLES.length} SEO articles, ${products.length} product pages, ` +
  'Google/Pinterest feeds, marketing UTM links, sitemap.xml, and IndexNow URL list.'
);
