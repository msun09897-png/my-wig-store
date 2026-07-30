# ARELVIENNE Organic Marketing Links

The generated files in this repository use `products.js` as the source of truth.

## Pinterest catalog

- Hosted feed URL: `https://arelvienne.com/pinterest-catalog.csv`
- Format: CSV
- Update frequency in Pinterest: daily
- Products: 8
- Variants: 22
- Tracking campaign: `product_catalog`

Regenerate the feed after any product, variant, price, stock, image, or product-page change:

```text
node generate-seo-pages.cjs
node validate-site.cjs
```

## Organic social links

Use the URLs in `marketing-utm-links.csv` for Pinterest, Instagram, TikTok,
YouTube, Facebook, Reddit, and Quora. The file contains Home, Shop, Wig Guide,
and all eight product-page destinations.

Do not manually change the UTM names. Consistent names keep GA4 traffic-source
reports clean.

## IndexNow

After a successful production deployment:

```text
node submit-indexnow.cjs --submit
```

The script submits only canonical URLs from `indexnow-urls.txt`. The public
IndexNow verification key is intentionally stored at the site root; it is not
a password or private credential.

## Verified free-channel status

Checked on 2026-07-30:

- Pinterest merchant status: approved.
- Pinterest retail catalog: 22 in-stock products, 0 failed imports.
- Bing sitemap: success, 17 discovered URLs.
- Bing IndexNow: canonical URLs submitted on 2026-07-29.
- Microsoft Clarity: project `xucr8jc07m`, loaded only after analytics consent;
  advertising storage remains denied.
