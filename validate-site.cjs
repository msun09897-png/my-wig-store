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

const appSource = fs.readFileSync('app.js', 'utf8');
for (const eventName of ['view_item_list', 'select_item', 'view_item', 'add_to_cart', 'view_cart', 'begin_checkout']) {
  if (!appSource.includes(`'${eventName}'`)) errors.push(`app.js: missing GA4 ecommerce event ${eventName}`);
}
if (!appSource.includes('items:')) errors.push('app.js: GA4 ecommerce events must include an items array');

if (/http:\/\/(?!base\.google\.com)/.test(
  expectedPages.map(file => fs.readFileSync(file, 'utf8')).join('\n') +
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
    `${allVariants.length} Merchant variants, ${sitemapUrls.length} sitemap URLs.`
  );
}
