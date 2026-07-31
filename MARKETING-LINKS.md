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

## TikTok and Instagram traffic funnel

Checked on 2026-07-31:

- TikTok profile `@arelvienne` is public with one product video, 0 followers,
  and `arelvienne.com` written as plain bio text. TikTok says a clickable
  website profile link requires 1,000 followers or a Registered Business
  Account:
  https://support.tiktok.com/en/getting-started/setting-up-your-profile/linking-another-social-media-account
- Instagram profile links are public profile information. Use the dedicated
  profile Links field rather than placing a non-clickable URL only in bio text:
  https://www.facebook.com/help/347751748650214
- Instagram Stories support a tappable link sticker that sends viewers directly
  to the linked website:
  https://www.facebook.com/help/instagram/192168966243613
- Keep both profiles public so eligible Reels can reach people who do not follow
  the account. Public Instagram Reels can be distributed in Explore:
  https://about.fb.com/news/2020/08/introducing-instagram-reels/

Recommended profile destinations:

- TikTok Shop link:
  `https://arelvienne.com/shop.html?utm_source=tiktok&utm_medium=organic_social&utm_campaign=profile&utm_content=shop`
- Instagram Shop link:
  `https://arelvienne.com/shop.html?utm_source=instagram&utm_medium=organic_social&utm_campaign=profile&utm_content=shop`
- TikTok Platinum Bob link:
  `https://arelvienne.com/platinum-blonde-bob-wig.html?utm_source=tiktok&utm_medium=organic_social&utm_campaign=profile&utm_content=lum-010`
- Instagram Platinum Bob link:
  `https://arelvienne.com/platinum-blonde-bob-wig.html?utm_source=instagram&utm_medium=organic_social&utm_campaign=profile&utm_content=lum-010`

For each Reel or TikTok:

1. Show the product result in the first two seconds.
2. Show one proof detail such as lace, texture, color, or movement.
3. State only verified product facts and the current starting price.
4. End with one action: `Shop through the link in bio`.
5. Reshare Instagram Reels to Stories with the matching product URL in a link
   sticker, then save useful Stories to Shop, Shipping, Returns, and Wig Care
   highlights.
6. Review GA4 traffic by source/medium and compare product-page views,
   video starts, 50% progress, add-to-cart, checkout start, and purchases.

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
- Bing IndexNow: canonical URLs submitted on 2026-07-29 and resubmitted after
  the Clarity deployment on 2026-07-30 (17 URLs accepted, HTTP 200).
- Microsoft Clarity: project `xucr8jc07m`, loaded only after analytics consent;
  advertising storage remains denied.
