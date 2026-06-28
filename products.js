// ============================================
// 商品数据 �?你只需要修改这个文�?
// ============================================
// 加新商品:复制下面任何一�?{} 大括号区�?粘贴在末�?改内容�?
// 改图�?�?image 后面的链接换成你的图�?可以�?imgur.com 等免费图床上传后获取链接)�?
// 改价�?�?price 数字(美金,数字就行,不要�?$)�?
// 商品下架:删掉对应的整�?{} 区块�?
// ============================================

const PRODUCTS = [
  {
    id: "lum-011",
    name: "The Cascade Wave",
    subtitle: "13x6 HD Lace Wig | 100% Virgin Human Hair · Deep Wave",
    price: 309,
    oldPrice: 429,
    images: [
      'images/lum-011/main_01.png',
      'images/lum-011/main_02.png',
      'images/lum-011/main_03.png',
      'images/lum-011/main_04.png',
      'images/lum-011/main_05.png',
    ],
    detailImages: [
      'images/lum-011/detail_01.png',
      'images/lum-011/detail_02.png',
      'images/lum-011/detail_03.png',
      'images/lum-011/detail_04.png',
      'images/lum-011/lifestyle_01.png',
      'images/lum-011/lifestyle_02.png',
      'images/lum-011/lifestyle_03.png',
    ],
    description: "Waves that move like water. Single-donor virgin hair in a deep, uniform wave pattern, hand-tied into transparent 13x6 HD Swiss lace that vanishes at the hairline. Full-bodied, bouncy, and luminous — from a quiet morning to a room full of eyes.",
    features: [
      "13x6 HD transparent lace - undetectable on every skin tone",
      "100% virgin human hair, single-donor sourcing",
      "Deep wave pattern - full, bouncy, well-defined",
      "Pre-plucked hairline with soft baby hairs",
      "Heat-safe up to 350F - restyle, tone, or color as you like",
      "Adjustable cap with combs and elastic strap",
    ],
    variants: [
      { color: 'Natural Black', length: '16inch/40cm', price: 309, oldPrice: 429,  inStock: true, _supplierCost: 385 },
      { color: 'Natural Black', length: '18inch/45cm', price: 339, oldPrice: 469,  inStock: true, _supplierCost: 425 },
      { color: 'Natural Black', length: '20inch/50cm', price: 379, oldPrice: 529,  inStock: true, _supplierCost: 485 },
      { color: 'Natural Black', length: '22inch/55cm', price: 429, oldPrice: 599,  inStock: true, _supplierCost: 565 },
      { color: 'Natural Black', length: '24inch/60cm', price: 499, oldPrice: 699,  inStock: true, _supplierCost: 685 },
      { color: 'Natural Black', length: '26inch/65cm', price: 579, oldPrice: 809,  inStock: true, _supplierCost: 795 },
      { color: 'Natural Black', length: '28inch/70cm', price: 679, oldPrice: 949,  inStock: true, _supplierCost: 970 },
      { color: 'Natural Black', length: '30inch/75cm', price: 769, oldPrice: 1079, inStock: true, _supplierCost: 1105 },
    ],
    _supplier: {
      source: "1688/LINQI",
      productId: "937885958891",
      url: "https://detail.1688.com/offer/937885958891.html",
      shippingFromCN: 10,
      shippingToUS: 110,
    },
    featured: true,
  },
  {
    id: "lum-010",
    name: "The Platinum Bob",
    subtitle: "13x4 HD Lace Bob | 100% Virgin Human Hair · #613",
    price: 199,
    oldPrice: 279,
    images: [
      'images/lum-010/main_01.png',
      'images/lum-010/main_02.png',
      'images/lum-010/main_03.png',
      'images/lum-010/main_04.png',
      'images/lum-010/main_05.png',
    ],
    detailImages: [
      'images/lum-010/detail_01.png',
      'images/lum-010/detail_02.png',
      'images/lum-010/detail_03.png',
      'images/lum-010/detail_04.png',
      'images/lum-010/lifestyle_01.png',
      'images/lum-010/lifestyle_02.png',
      'images/lum-010/lifestyle_03.png',
    ],
    description: "A sharp, luminous bob in pure platinum #613. Bone-straight virgin human hair hand-tied into transparent 13x4 HD lace that vanishes at the hairline. Bleached, toned, and ready to wear — the kind of blonde that turns a room.",
    features: [
      "13x4 HD transparent lace - invisible hairline on every skin tone",
      "100% virgin human hair, pre-bleached #613 platinum blonde",
      "Sleek bone-straight bob, chin-to-shoulder length",
      "Heat-safe up to 350F - restyle, tone, or curl as you like",
      "Available in 150% (standard) and 180% (full) density",
      "Adjustable cap with combs and elastic strap",
    ],
    variants: [
      // ── 8 inch · 齐下巴 Bob ──
      { color: '#613 Platinum · 150% Density', length: '8inch/20cm',  price: 199, oldPrice: 279, inStock: true, _supplierCost: 210 },
      { color: '#613 Platinum · 180% Density', length: '8inch/20cm',  price: 229, oldPrice: 319, inStock: true, _supplierCost: 230 },
      // ── 10 inch ──
      { color: '#613 Platinum · 150% Density', length: '10inch/25cm', price: 229, oldPrice: 319, inStock: true, _supplierCost: 250 },
      { color: '#613 Platinum · 180% Density', length: '10inch/25cm', price: 259, oldPrice: 359, inStock: true, _supplierCost: 280 },
      // ── 12 inch ──
      { color: '#613 Platinum · 150% Density', length: '12inch/30cm', price: 259, oldPrice: 359, inStock: true, _supplierCost: 300 },
      { color: '#613 Platinum · 180% Density', length: '12inch/30cm', price: 289, oldPrice: 399, inStock: true, _supplierCost: 330 },
      // ── 14 inch · 齐肩 Bob ──
      { color: '#613 Platinum · 150% Density', length: '14inch/35cm', price: 289, oldPrice: 399, inStock: true, _supplierCost: 350 },
      { color: '#613 Platinum · 180% Density', length: '14inch/35cm', price: 319, oldPrice: 449, inStock: true, _supplierCost: 370 },
    ],
    _supplier: {
      source: "1688/LINQI",
      productId: "938478082037",
      url: "https://detail.1688.com/offer/938478082037.html",
      shippingFromCN: 10,
      shippingToUS: 110,
    },
    featured: true,
  },
  {
    id: "lum-009",
    name: "The Signature Straight",
    subtitle: "13x6 HD Lace Wig | 100% Virgin Human Hair",
    price: 289,
    oldPrice: 399,
    images: [
      'images/lum-009/main_01.png',
      'images/lum-009/main_02.png',
      'images/lum-009/main_03.png',
      'images/lum-009/main_04.png',
      'images/lum-009/main_05.png',
    ],
    detailImages: [
      'images/lum-009/detail_01.png',
      'images/lum-009/detail_02.png',
      'images/lum-009/detail_03.png',
      'images/lum-009/detail_04.png',
      'images/lum-009/lifestyle_01.png',
      'images/lum-009/lifestyle_02.png',
      'images/lum-009/lifestyle_03.png',
    ],
    description: "A wig that disappears. Single-donor virgin hair, hand-tied into transparent 13x6 HD Swiss lace that melts into any skin tone. Wear it parted deep, pulled back, or swept to one side. The hairline holds up under every styling whim.",
    features: [
      "13x6 HD transparent lace - undetectable on every skin tone",
      "100% virgin human hair, single-donor sourcing",
      "Pre-plucked hairline with soft baby hairs",
      "Heat-safe up to 350F - can be styled, toned, and colored",
      "Available in 150% (standard) and 180% (full) density",
      "Adjustable cap with combs and elastic strap",
    ],
    variants: [
      // ── 16 inch · 150% Density ──
      { color: 'Natural Black · 150% Density', length: '16inch/40cm', price: 289, oldPrice: 399, inStock: true, _supplierCost: 340 },
      { color: 'Natural Black · 180% Density', length: '16inch/40cm', price: 319, oldPrice: 449, inStock: true, _supplierCost: null },
      // ── 18 inch ──
      { color: 'Natural Black · 150% Density', length: '18inch/45cm', price: 319, oldPrice: 449, inStock: true, _supplierCost: 385 },
      { color: 'Natural Black · 180% Density', length: '18inch/45cm', price: 349, oldPrice: 489, inStock: true, _supplierCost: null },
      // ── 20 inch ──
      { color: 'Natural Black · 150% Density', length: '20inch/50cm', price: 349, oldPrice: 489, inStock: true, _supplierCost: 435 },
      { color: 'Natural Black · 180% Density', length: '20inch/50cm', price: 379, oldPrice: 529, inStock: true, _supplierCost: null },
      // ── 22 inch ──
      { color: 'Natural Black · 150% Density', length: '22inch/55cm', price: 389, oldPrice: 539, inStock: true, _supplierCost: 495 },
      { color: 'Natural Black · 180% Density', length: '22inch/55cm', price: 419, oldPrice: 589, inStock: true, _supplierCost: null },
      // ── 24 inch ──
      { color: 'Natural Black · 150% Density', length: '24inch/60cm', price: 449, oldPrice: 629, inStock: true, _supplierCost: 595 },
      { color: 'Natural Black · 180% Density', length: '24inch/60cm', price: 479, oldPrice: 669, inStock: true, _supplierCost: null },
      // ── 26 inch ──
      { color: 'Natural Black · 150% Density', length: '26inch/65cm', price: 539, oldPrice: 749, inStock: true, _supplierCost: 745 },
      { color: 'Natural Black · 180% Density', length: '26inch/65cm', price: 569, oldPrice: 799, inStock: true, _supplierCost: null },
      // ── 28 inch ──
      { color: 'Natural Black · 150% Density', length: '28inch/70cm', price: 649, oldPrice: 909, inStock: true, _supplierCost: 920 },
      { color: 'Natural Black · 180% Density', length: '28inch/70cm', price: 679, oldPrice: 949, inStock: true, _supplierCost: null },
      // ── 30 inch ──
      { color: 'Natural Black · 150% Density', length: '30inch/75cm', price: 729, oldPrice: 1019, inStock: true, _supplierCost: 1045 },
      { color: 'Natural Black · 180% Density', length: '30inch/75cm', price: 759, oldPrice: 1059, inStock: true, _supplierCost: null },
    ],
    _supplier: {
      source: "1688/LINQI",
      productId: "939003504184",
      url: "https://detail.1688.com/offer/939003504184.html",
      shippingFromCN: 10,
      shippingToUS: 110,
    },
  }
];
