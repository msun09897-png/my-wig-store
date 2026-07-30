# ARELVIENNE Store

## Product update workflow

1. Update `products.js`. Every sellable variant must keep a unique, stable `sku`.
2. Confirm the matching hosted PayPal button options and prices in `app.js`.
3. Regenerate product pages, the sitemap, and the Merchant feed:

   ```powershell
   node generate-seo-pages.cjs
   ```

4. Run the pre-publish checks:

   ```powershell
   node validate-site.cjs
   ```

The validator currently expects 8 products and 22 sellable variants. It checks variant
SKUs, prices, availability, Merchant grouping, product JSON-LD, images, internal links,
the sitemap, and the required GA4 ecommerce events.

## Consent-based analytics and ecommerce funnel

Google Analytics 4 and Microsoft Clarity remain disabled until the visitor allows
analytics. Clarity project `xucr8jc07m` receives analytics consent while advertising
storage remains denied. After consent, GA4 records `view_item_list`, `select_item`,
`view_item`, `add_to_cart`, `view_cart`, and `begin_checkout`. PayPal remains the source
of truth for completed purchases, revenue, refunds, and customer payment details.
