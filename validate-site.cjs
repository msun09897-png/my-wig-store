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

const errors = [];
const source = `${fs.readFileSync('products.js', 'utf8')}\n;globalThis.__PRODUCTS__ = PRODUCTS;`;
const context = {};
vm.createContext(context);
vm.runInContext(source, context);
const products = context.__PRODUCTS__;

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
}

const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
if (sitemapUrls.length !== expectedPages.length) {
  errors.push(`sitemap.xml: expected ${expectedPages.length} URLs, found ${sitemapUrls.length}`);
}

const feed = fs.readFileSync('google-merchant-feed.xml', 'utf8');
const feedIds = [...feed.matchAll(/<g:id>([^<]+)<\/g:id>/g)].map(match => match[1]);
if (feedIds.length !== products.length) {
  errors.push(`google-merchant-feed.xml: expected ${products.length} products, found ${feedIds.length}`);
}
for (const product of products) {
  if (!feedIds.includes(product.id)) errors.push(`google-merchant-feed.xml: missing ${product.id}`);
}

if (/http:\/\/(?!base\.google\.com)/.test(
  expectedPages.map(file => fs.readFileSync(file, 'utf8')).join('\n') +
  fs.readFileSync('app.js', 'utf8')
)) {
  errors.push('Insecure http:// reference found');
}

if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Validation passed: ${expectedPages.length} pages, ${products.length} products, ${sitemapUrls.length} sitemap URLs.`);
}
