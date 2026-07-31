/*
 * Fast pre-publish validation for generated ARELVIENNE pages.
 * Run after generate-seo-pages.cjs.
 */

const fs = require('fs');
const vm = require('vm');

const expectedPages = [
  'index.html',
  'shop.html',
  'wig-guide.html',
  'about.html',
  'contact.html',
  'shipping.html',
  'returns.html',
  'privacy.html',
  'terms.html',
  'signature-straight-human-hair-wig.html',
  'platinum-blonde-bob-wig.html',
  'cascade-deep-wave-human-hair-wig.html',
  'water-wave-bob-wig.html',
  'bouncy-curl-closure-wig.html',
  'champagne-blonde-body-wave-wig.html',
  'honey-noir-highlight-straight-wig.html',
  'burgundy-bob-closure-wig.html'
];

const productPages = {
  'lum-009': 'signature-straight-human-hair-wig.html',
  'lum-010': 'platinum-blonde-bob-wig.html',
  'lum-011': 'cascade-deep-wave-human-hair-wig.html',
  'lum-012': 'water-wave-bob-wig.html',
  'lum-013': 'bouncy-curl-closure-wig.html',
  'lum-014': 'champagne-blonde-body-wave-wig.html',
  'lum-015': 'honey-noir-highlight-straight-wig.html',
  'lum-016': 'burgundy-bob-closure-wig.html'
};

const errors = [];
const source = `${fs.readFileSync('products.js', 'utf8')}\n;globalThis.__PRODUCTS__ = PRODUCTS;`;
const context = {};
vm.createContext(context);
vm.runInContext(source, context);
const products = context.__PRODUCTS__;
const allVariants = products.flatMap(product =>
  (product.variants || []).map(variant => ({ product, variant }))
);
const expectedVariantCount = 22;
const indexNowKey = 'a13da8f942954c0499bbf1244f00ff19';
const platinumVideoPath = 'videos/lum-010/platinum-bob-short-v1.mp4';
const marketingChannels = {
  pinterest: ['organic_social', 'profile'],
  instagram: ['organic_social', 'profile'],
  tiktok: ['organic_social', 'profile'],
  youtube: ['organic_video', 'channel'],
  facebook: ['organic_social', 'profile'],
  reddit: ['community', 'helpful_answers'],
  quora: ['community', 'helpful_answers']
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];
    if (quoted && character === '"' && next === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (!quoted && character === ',') {
      row.push(field);
      field = '';
    } else if (!quoted && (character === '\n' || character === '\r')) {
      if (character === '\r' && next === '\n') index += 1;
      row.push(field);
      if (row.some(value => value !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function csvRecords(file) {
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));
  const headers = rows.shift() || [];
  return rows.map(row => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])));
}

for (const file of expectedPages) {
  if (!fs.existsSync(file)) {
    errors.push(`${file}: missing`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const activeCount = (html.match(/class="page active"/g) || []).length;
  if (activeCount !== 1) errors.push(`${file}: expected one active page, found ${activeCount}`);

  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  if (!canonical?.startsWith('https://arelvienne.com/')) errors.push(`${file}: invalid canonical`);

  const schemaText = html.match(/<script id="pageSchema" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  try {
    JSON.parse(schemaText);
  } catch (error) {
    errors.push(`${file}: invalid JSON-LD (${error.message})`);
  }

  for (const href of html.matchAll(/href="(\/[^"#?]+\.html)"/g)) {
    const target = href[1].slice(1);
    if (!fs.existsSync(target)) errors.push(`${file}: broken internal link ${href[1]}`);
  }
  for (const src of html.matchAll(/(?:src|content)="(images\/[^"]+\.webp)"/g)) {
    if (!fs.existsSync(src[1])) errors.push(`${file}: missing image ${src[1]}`);
  }

  if (/lumiereluxehair|LUMIÈRE/i.test(html)) errors.push(`${file}: old brand/domain remains`);
}

for (const product of products) {
  const prices = (product.variants || []).filter(v => v.inStock).map(v => Number(v.price));
  const minimum = prices.length ? Math.min(...prices) : Number(product.price);
  if (Number(product.price) !== minimum) {
    errors.push(`${product.id}: card price ${product.price} does not match minimum in-stock price ${minimum}`);
  }
  for (const image of [...(product.images || []), ...(product.detailImages || [])]) {
    if (!fs.existsSync(image)) errors.push(`${product.id}: missing product image ${image}`);
  }

  const page = productPages[product.id];
  if (!page) {
    errors.push(`${product.id}: missing product page mapping`);
  } else if (fs.existsSync(page)) {
    const html = fs.readFileSync(page, 'utf8');
    const schemaText = html.match(/<script id="pageSchema" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    try {
      const schema = JSON.parse(schemaText);
      const variants = product.variants || [];
      if (schema.sku !== product.id) errors.push(`${page}: JSON-LD SKU does not match ${product.id}`);
      if (variants.length > 1) {
        if (schema.offers?.['@type'] !== 'AggregateOffer') {
          errors.push(`${page}: expected AggregateOffer`);
        }
        if (Number(schema.offers?.offerCount) !== variants.filter(v => v.inStock).length) {
          errors.push(`${page}: JSON-LD offerCount does not match in-stock variants`);
        }
      }
    } catch {
      // The general JSON-LD check above reports malformed markup.
    }
  }
}

if (allVariants.length !== expectedVariantCount) {
  errors.push(`products.js: expected ${expectedVariantCount} variants, found ${allVariants.length}`);
}

const variantSkus = allVariants.map(({ variant }) => variant.sku);
if (variantSkus.some(sku => !sku)) errors.push('products.js: every variant must have a stable SKU');
if (new Set(variantSkus).size !== variantSkus.length) errors.push('products.js: variant SKUs must be unique');
for (const { product, variant } of allVariants) {
  if (!variant.sku?.startsWith(`${product.id}-`)) {
    errors.push(`${product.id}: variant SKU ${variant.sku || '(missing)'} must start with ${product.id}-`);
  }
  if (!variant.color || !variant.length) errors.push(`${variant.sku}: color and length are required`);
  if (!Number.isFinite(Number(variant.price)) || Number(variant.price) <= 0) {
    errors.push(`${variant.sku}: price must be a positive number`);
  }
  if (typeof variant.inStock !== 'boolean') errors.push(`${variant.sku}: inStock must be true or false`);
}

const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
if (sitemapUrls.length !== expectedPages.length) {
  errors.push(`sitemap.xml: expected ${expectedPages.length} URLs, found ${sitemapUrls.length}`);
}

const feed = fs.readFileSync('google-merchant-feed.xml', 'utf8');
const feedItems = [...feed.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(match => match[1]);
const feedIds = feedItems.map(item => item.match(/<g:id>([^<]+)<\/g:id>/)?.[1]).filter(Boolean);
if (feedItems.length !== expectedVariantCount) {
  errors.push(`google-merchant-feed.xml: expected ${expectedVariantCount} variants, found ${feedItems.length}`);
}
if (new Set(feedIds).size !== feedIds.length) {
  errors.push('google-merchant-feed.xml: g:id values must be unique');
}
for (const { product, variant } of allVariants) {
  const item = feedItems.find(block => block.match(/<g:id>([^<]+)<\/g:id>/)?.[1] === variant.sku);
  if (!item) {
    errors.push(`google-merchant-feed.xml: missing ${variant.sku}`);
    continue;
  }
  const price = Number(item.match(/<g:price>([\d.]+) USD<\/g:price>/)?.[1]);
  const availability = item.match(/<g:availability>([^<]+)<\/g:availability>/)?.[1];
  const groupId = item.match(/<g:item_group_id>([^<]+)<\/g:item_group_id>/)?.[1];
  const link = item.match(/<link>([^<]+)<\/link>/)?.[1];
  const optionNames = [...item.matchAll(/<g:variant_option>\s*<g:name>([^<]+)<\/g:name>/g)]
    .map(match => match[1]);

  if (price !== Number(variant.price)) errors.push(`${variant.sku}: Merchant price does not match products.js`);
  if (availability !== (variant.inStock ? 'in_stock' : 'out_of_stock')) {
    errors.push(`${variant.sku}: Merchant availability does not match products.js`);
  }
  if (!item.includes('<g:title>')) errors.push(`${variant.sku}: Merchant title is missing`);
  if (!item.includes('<g:color>') || !item.includes('<g:size>')) {
    errors.push(`${variant.sku}: Merchant color or size is missing`);
  }
  if (!link?.includes(`variant=${variant.sku}`)) errors.push(`${variant.sku}: Merchant variant link is invalid`);
  if (link) {
    const trackedLink = new URL(link.replaceAll('&amp;', '&'));
    if (trackedLink.searchParams.get('utm_source') !== 'google') {
      errors.push(`${variant.sku}: Merchant link is missing Google UTM source`);
    }
    if (trackedLink.searchParams.get('utm_medium') !== 'organic_shopping') {
      errors.push(`${variant.sku}: Merchant link is missing organic shopping UTM medium`);
    }
    if (trackedLink.searchParams.get('utm_campaign') !== 'free_listings') {
      errors.push(`${variant.sku}: Merchant link is missing free listings UTM campaign`);
    }
    if (trackedLink.searchParams.get('utm_content') !== variant.sku) {
      errors.push(`${variant.sku}: Merchant UTM content must match the SKU`);
    }
  }

  if ((product.variants || []).length > 1) {
    if (groupId !== product.id) errors.push(`${variant.sku}: Merchant item_group_id must be ${product.id}`);
    if (!item.includes('<g:item_group_title>')) errors.push(`${variant.sku}: Merchant item_group_title is missing`);
    for (const name of ['color', 'length']) {
      if (!optionNames.includes(name)) errors.push(`${variant.sku}: Merchant variant option ${name} is missing`);
    }
    const usesDensity = product.variants.some(v => /\d+%\s*Density/i.test(v.color));
    if (usesDensity && !optionNames.includes('density')) {
      errors.push(`${variant.sku}: Merchant variant option density is missing`);
    }
  }
}

if (!fs.existsSync('pinterest-catalog.csv')) {
  errors.push('pinterest-catalog.csv: missing');
} else {
  const pinterestRecords = csvRecords('pinterest-catalog.csv');
  if (pinterestRecords.length !== expectedVariantCount) {
    errors.push(`pinterest-catalog.csv: expected ${expectedVariantCount} variants, found ${pinterestRecords.length}`);
  }
  if (new Set(pinterestRecords.map(record => record.id)).size !== pinterestRecords.length) {
    errors.push('pinterest-catalog.csv: variant IDs must be unique');
  }
  for (const { product, variant } of allVariants) {
    const record = pinterestRecords.find(item => item.id === variant.sku);
    if (!record) {
      errors.push(`pinterest-catalog.csv: missing ${variant.sku}`);
      continue;
    }
    if (Number.parseFloat(record.price) !== Number(variant.price)) {
      errors.push(`${variant.sku}: Pinterest price does not match products.js`);
    }
    if (record.availability !== (variant.inStock ? 'in stock' : 'out of stock')) {
      errors.push(`${variant.sku}: Pinterest availability does not match products.js`);
    }
    if (!record.title || !record.description || !record.image_link) {
      errors.push(`${variant.sku}: Pinterest title, description, or image is missing`);
    }
    if (record.brand !== 'ARELVIENNE') errors.push(`${variant.sku}: Pinterest brand is invalid`);
    if (record.google_product_category !== '181') {
      errors.push(`${variant.sku}: Pinterest Google product category must be 181`);
    }
    const trackedLink = new URL(record.link);
    if (trackedLink.searchParams.get('variant') !== variant.sku) {
      errors.push(`${variant.sku}: Pinterest variant link is invalid`);
    }
    if (trackedLink.searchParams.get('utm_source') !== 'pinterest') {
      errors.push(`${variant.sku}: Pinterest link is missing Pinterest UTM source`);
    }
    if (trackedLink.searchParams.get('utm_medium') !== 'organic_shopping') {
      errors.push(`${variant.sku}: Pinterest link is missing organic shopping UTM medium`);
    }
    if (trackedLink.searchParams.get('utm_campaign') !== 'product_catalog') {
      errors.push(`${variant.sku}: Pinterest link is missing product catalog UTM campaign`);
    }
    if (trackedLink.searchParams.get('utm_content') !== variant.sku) {
      errors.push(`${variant.sku}: Pinterest UTM content must match the SKU`);
    }
    if ((product.variants || []).length > 1 && record.item_group_id !== product.id) {
      errors.push(`${variant.sku}: Pinterest item_group_id must be ${product.id}`);
    }
  }
}

if (!fs.existsSync('marketing-utm-links.csv')) {
  errors.push('marketing-utm-links.csv: missing');
} else {
  const marketingRecords = csvRecords('marketing-utm-links.csv');
  const expectedDestinationCount = 3 + products.length;
  const expectedMarketingCount = Object.keys(marketingChannels).length * expectedDestinationCount;
  if (marketingRecords.length !== expectedMarketingCount) {
    errors.push(
      `marketing-utm-links.csv: expected ${expectedMarketingCount} links, found ${marketingRecords.length}`
    );
  }
  for (const record of marketingRecords) {
    const expected = marketingChannels[record.utm_source];
    if (!expected) {
      errors.push(`marketing-utm-links.csv: unknown source ${record.utm_source}`);
      continue;
    }
    const [medium, campaign] = expected;
    const url = new URL(record.url);
    if (url.host !== 'arelvienne.com') errors.push(`${record.platform}: UTM URL has an invalid host`);
    if (url.searchParams.get('utm_source') !== record.utm_source) {
      errors.push(`${record.platform}: UTM source does not match URL`);
    }
    if (record.utm_medium !== medium || url.searchParams.get('utm_medium') !== medium) {
      errors.push(`${record.platform}: UTM medium is invalid`);
    }
    if (record.utm_campaign !== campaign || url.searchParams.get('utm_campaign') !== campaign) {
      errors.push(`${record.platform}: UTM campaign is invalid`);
    }
    if (!record.utm_content || url.searchParams.get('utm_content') !== record.utm_content) {
      errors.push(`${record.platform}: UTM content is missing or inconsistent`);
    }
  }
}

if (!fs.existsSync('indexnow-urls.txt')) {
  errors.push('indexnow-urls.txt: missing');
} else {
  const indexNowUrls = fs.readFileSync('indexnow-urls.txt', 'utf8')
    .split(/\r?\n/)
    .map(value => value.trim())
    .filter(Boolean);
  if (indexNowUrls.length !== sitemapUrls.length) {
    errors.push(`indexnow-urls.txt: expected ${sitemapUrls.length} URLs, found ${indexNowUrls.length}`);
  }
  if (indexNowUrls.some((url, index) => url !== sitemapUrls[index])) {
    errors.push('indexnow-urls.txt: URLs must match sitemap.xml in order');
  }
}

if (!fs.existsSync(`${indexNowKey}.txt`)) {
  errors.push(`${indexNowKey}.txt: IndexNow key file is missing`);
} else if (fs.readFileSync(`${indexNowKey}.txt`, 'utf8').trim() !== indexNowKey) {
  errors.push(`${indexNowKey}.txt: IndexNow key content does not match its filename`);
}

const appSource = fs.readFileSync('app.js', 'utf8');
for (const eventName of ['view_item_list', 'select_item', 'view_item', 'add_to_cart', 'view_cart', 'begin_checkout']) {
  if (!appSource.includes(`'${eventName}'`)) errors.push(`app.js: missing GA4 ecommerce event ${eventName}`);
}
if (!appSource.includes('items:')) errors.push('app.js: GA4 ecommerce events must include an items array');
for (const eventName of ['video_start', 'video_progress', 'video_complete']) {
  if (!appSource.includes(`'${eventName}'`)) errors.push(`app.js: missing product video event ${eventName}`);
}
if (!fs.existsSync(platinumVideoPath)) {
  errors.push(`${platinumVideoPath}: product video is missing`);
} else {
  const videoSize = fs.statSync(platinumVideoPath).size;
  const videoHeader = fs.readFileSync(platinumVideoPath).subarray(4, 8).toString('ascii');
  if (videoSize < 1024 * 1024) errors.push(`${platinumVideoPath}: video file is unexpectedly small`);
  if (videoSize > 50 * 1024 * 1024) errors.push(`${platinumVideoPath}: video file is too large for mobile delivery`);
  if (videoHeader !== 'ftyp') errors.push(`${platinumVideoPath}: file is not a valid MP4 container`);
}
const platinumProduct = products.find(product => product.id === 'lum-010');
if (platinumProduct?.video?.src !== platinumVideoPath) {
  errors.push('products.js: The Platinum Bob video metadata is missing or inconsistent');
}
const platinumHtml = fs.readFileSync(productPages['lum-010'], 'utf8');
if (!platinumHtml.includes(`<source src="${platinumVideoPath}" type="video/mp4">`)) {
  errors.push(`${productPages['lum-010']}: product video markup is missing`);
}
let platinumSchema = {};
try {
  platinumSchema = JSON.parse(
    platinumHtml.match(/<script id="pageSchema" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}'
  );
} catch {
  errors.push(`${productPages['lum-010']}: unable to validate VideoObject structured data`);
}
if (platinumSchema.subjectOf?.['@type'] !== 'VideoObject') {
  errors.push(`${productPages['lum-010']}: VideoObject structured data is missing`);
}
if (platinumSchema.subjectOf?.contentUrl !== `https://arelvienne.com/${platinumVideoPath}`) {
  errors.push(`${productPages['lum-010']}: VideoObject contentUrl is invalid`);
}
if (!appSource.includes("clarityProjectId: 'xucr8jc07m'")) {
  errors.push('app.js: Microsoft Clarity project ID is missing');
}
if (!appSource.includes("window.clarity('consentv2'")) {
  errors.push('app.js: Microsoft Clarity Consent API V2 is missing');
}
if (!appSource.includes("ad_Storage: 'denied'")) {
  errors.push('app.js: Microsoft Clarity advertising storage must remain denied');
}
if (!appSource.includes('startClarity();')) {
  errors.push('app.js: Microsoft Clarity must start through the consent-gated analytics flow');
}
const generatedHtml = expectedPages.map(file => fs.readFileSync(file, 'utf8')).join('\n');
if (generatedHtml.includes('clarity.ms/tag/')) {
  errors.push('HTML pages must not load Clarity before analytics consent');
}
if (!fs.readFileSync('privacy.html', 'utf8').includes('Microsoft Clarity')) {
  errors.push('privacy.html: Microsoft Clarity disclosure is missing');
}

if (/http:\/\/(?!base\.google\.com)/.test(
  generatedHtml +
  appSource
)) {
  errors.push('Insecure http:// reference found');
}

if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Validation passed: ${expectedPages.length} pages, ${products.length} products, ` +
    `${allVariants.length} Merchant/Pinterest variants, ${sitemapUrls.length} sitemap/IndexNow URLs, ` +
    `${Object.keys(marketingChannels).length} tracked marketing channels.`
  );
}
