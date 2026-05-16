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
    id: 'lum-196224',
    name: 'Human Hair Wig Female',
    subtitle: 'Straight Clip In Hair',
    price: 224,       // 起售�?最短款),用于商品卡片展示
    oldPrice: 280,
    images: ['https://i.postimg.cc/PrGZ7FG6/1.png'],
    description: 'Crafted from 100% virgin human hair and finished with HD Swiss lace, this piece moves, bounces, and shines like the hair you were born with. Soft to the touch, undetectable at the hairline �?wear it confidently, day or night. Made to last 2+ years with proper care.',
    features: [
      '100% premium human hair',
      'HD lace front, pre-plucked',
      'Natural hairline, baby hairs styled',
      '180% density · medium cap',
      'Length: 16�?6 inch'
    ],
    variants: [
      // ── 16 inch · $224 ──────────────────────────
      { color: '#613 Bleach Blonde', length: '16inch/40cm', price: 224, inStock: true, _supplierCost: null },
      { color: '#3 Dark Auburn',   length: '16inch/40cm', price: 224, inStock: true, _supplierCost: null },
      { color: '#4 Medium Brown',   length: '16inch/40cm', price: 224, inStock: true, _supplierCost: null },
      { color: '#7 Light Brown',   length: '16inch/40cm', price: 224, inStock: true, _supplierCost: null },
      { color: '#8 Chestnut Brown',   length: '16inch/40cm', price: 224, inStock: true, _supplierCost: null },
      { color: '#12 Light Golden Brown',  length: '16inch/40cm', price: 224, inStock: true, _supplierCost: null },
      // ── 18 inch · $237 (+6%) ────────────────────
      { color: '#613 Bleach Blonde', length: '18inch/45cm', price: 237, inStock: true, _supplierCost: null },
      { color: '#3 Dark Auburn',   length: '18inch/45cm', price: 237, inStock: true, _supplierCost: null },
      { color: '#4 Medium Brown',   length: '18inch/45cm', price: 237, inStock: true, _supplierCost: null },
      { color: '#7 Light Brown',   length: '18inch/45cm', price: 237, inStock: true, _supplierCost: null },
      { color: '#8 Chestnut Brown',   length: '18inch/45cm', price: 237, inStock: true, _supplierCost: null },
      { color: '#12 Light Golden Brown',  length: '18inch/45cm', price: 237, inStock: true, _supplierCost: null },
      // ── 20 inch · $254 (+7%) ────────────────────
      { color: '#613 Bleach Blonde', length: '20inch/50cm', price: 254, inStock: true, _supplierCost: null },
      { color: '#3 Dark Auburn',   length: '20inch/50cm', price: 254, inStock: true, _supplierCost: null },
      { color: '#4 Medium Brown',   length: '20inch/50cm', price: 254, inStock: true, _supplierCost: null },
      { color: '#7 Light Brown',   length: '20inch/50cm', price: 254, inStock: true, _supplierCost: null },
      { color: '#8 Chestnut Brown',   length: '20inch/50cm', price: 254, inStock: true, _supplierCost: null },
      { color: '#12 Light Golden Brown',  length: '20inch/50cm', price: 254, inStock: true, _supplierCost: null },
      // ── 22 inch · $272 (+7%) ────────────────────
      { color: '#613 Bleach Blonde', length: '22inch/55cm', price: 272, inStock: true, _supplierCost: null },
      { color: '#3 Dark Auburn',   length: '22inch/55cm', price: 272, inStock: true, _supplierCost: null },
      { color: '#4 Medium Brown',   length: '22inch/55cm', price: 272, inStock: true, _supplierCost: null },
      { color: '#7 Light Brown',   length: '22inch/55cm', price: 272, inStock: true, _supplierCost: null },
      { color: '#8 Chestnut Brown',   length: '22inch/55cm', price: 272, inStock: true, _supplierCost: null },
      { color: '#12 Light Golden Brown',  length: '22inch/55cm', price: 272, inStock: true, _supplierCost: null },
      // ── 24 inch · $291 (+7%) ────────────────────
      { color: '#613 Bleach Blonde', length: '24inch/60cm', price: 291, inStock: true, _supplierCost: null },
      { color: '#3 Dark Auburn',   length: '24inch/60cm', price: 291, inStock: true, _supplierCost: null },
      { color: '#4 Medium Brown',   length: '24inch/60cm', price: 291, inStock: true, _supplierCost: null },
      { color: '#7 Light Brown',   length: '24inch/60cm', price: 291, inStock: true, _supplierCost: null },
      { color: '#8 Chestnut Brown',   length: '24inch/60cm', price: 291, inStock: true, _supplierCost: null },
      { color: '#12 Light Golden Brown',  length: '24inch/60cm', price: 291, inStock: true, _supplierCost: null },
      // ── 26 inch · $311 (+7%) ────────────────────
      { color: '#613 Bleach Blonde', length: '26inch/65cm', price: 311, inStock: true, _supplierCost: null },
      { color: '#3 Dark Auburn',   length: '26inch/65cm', price: 311, inStock: true, _supplierCost: null },
      { color: '#4 Medium Brown',   length: '26inch/65cm', price: 311, inStock: true, _supplierCost: null },
      { color: '#7 Light Brown',   length: '26inch/65cm', price: 311, inStock: true, _supplierCost: null },
      { color: '#8 Chestnut Brown',   length: '26inch/65cm', price: 311, inStock: true, _supplierCost: null },
      { color: '#12 Light Golden Brown',  length: '26inch/65cm', price: 311, inStock: true, _supplierCost: null },
    ],
    _supplier: {
      platform: '1688',
      shopName: '',
      productUrl: '',
      contactWeChat: '',
      costPrice: 0,
      notes: ''
    },
    featured: true
  },
  {
    id: 'lum-737816',
    name: 'Wig Long Curly Hair',
    subtitle: 'Lace Front Wig · 22"',
    price: 168,       // 起售�?14inch),用于商品卡片展示
    oldPrice: 210,
    images: ['https://i.postimg.cc/j2JsYXfj/shou-tu.png'],
    description: 'Soft, romantic body waves that catch every light. Hand-tied on HD Swiss lace for an invisible hairline, this wig holds its shape wash after wash. From beach days to boardroom moments �?effortless, every time.',
    features: [
      '100% premium human hair',
      'HD lace front, pre-plucked',
      'Natural hairline, baby hairs styled',
      '180% density · medium cap',
      'Length: 14�?4 inch'
    ],
    variants: [
      { color: '1B# Natural Black', length: '14inch/35cm', price: 168, inStock: true, _supplierCost: null  },
      { color: '1B# Natural Black', length: '16inch/40cm', price: 178, inStock: true, _supplierCost: null  },
      { color: '1B# Natural Black', length: '18inch/45cm', price: 190, inStock: true, _supplierCost: null  },
      { color: '1B# Natural Black', length: '20inch/50cm', price: 203, inStock: true, _supplierCost: null  },
      { color: '1B# Natural Black', length: '22inch/55cm', price: 217, inStock: true, _supplierCost: null  },
      { color: '1B# Natural Black', length: '24inch/60cm', price: 232, inStock: true, _supplierCost: null },
    ],
    _supplier: {
      platform: '1688',
      shopName: '',
      productUrl: '',
      contactWeChat: '',
      costPrice: 0,
      notes: ''
    },
    featured: true
  },
  {
    id: 'lum-880773',
    name: 'Hair Extensions Wig Full',
    subtitle: 'Loose Curls Lace Front · 24"',
    price: 168,       // 起售�?12inch),用于商品卡片展示
    oldPrice: 210,
    images: ['https://i.postimg.cc/zXGPPBnX/Gemini-Generated-Image-wo9guiwo9guiwo9g.png'],
    description: 'Sleek, glossy, and impossibly smooth. This silky straight piece falls like silk and feels even better. HD lace front melts away. 100% virgin hair, ready to dye, curl, or wear just as it is.',
    features: [
      '100% premium human hair',
      'HD lace front, pre-plucked',
      'Natural hairline, baby hairs styled',
      '180% density · medium cap',
      'Length: 12�?6 inch'
    ],
    variants: [
      { color: 'Natural Color', length: '12inch/30cm', price: 168, inStock: true, _supplierCost: null  },
      { color: 'Natural Color', length: '14inch/35cm', price: 178, inStock: true, _supplierCost: null  },
      { color: 'Natural Color', length: '16inch/40cm', price: 189, inStock: true, _supplierCost: null  },
      { color: 'Natural Color', length: '18inch/45cm', price: 200, inStock: true, _supplierCost: null  },
      { color: 'Natural Color', length: '20inch/50cm', price: 212, inStock: true, _supplierCost: null  },
      { color: 'Natural Color', length: '22inch/55cm', price: 225, inStock: true, _supplierCost: null },
      { color: 'Natural Color', length: '24inch/60cm', price: 239, inStock: true, _supplierCost: null },
      { color: 'Natural Color', length: '26inch/65cm', price: 253, inStock: true, _supplierCost: null },
    ],
    _supplier: {
      platform: '1688',
      shopName: '',
      productUrl: '',
      contactWeChat: '',
      costPrice: 0,
      notes: ''
    },
    featured: true
  },
  {
    id: 'lum-386669',
    name: 'Deep Wave Real Hair',
    subtitle: 'Deep Wave',
    price: 56,           // 起售�?#1B 50g 12inch),用于商品卡片展示
    oldPrice: 70,
    images: ['https://i.postimg.cc/43tgN5Nh/Gemini-Generated-Image-k3qdi3k3qdi3k3qd.png'],
    description: 'Soft, romantic body waves that catch every light. Hand-tied on HD Swiss lace for an invisible hairline, this wig holds its shape wash after wash. From beach days to boardroom moments �?effortless, every time.',
    features: [
      '100% premium human hair',
      'HD lace front, pre-plucked',
      'Natural hairline, baby hairs styled',
      '180% density · medium cap',
      'Length: 20inch/50cm'
    ],
    variants: [
      // ── #1B Natural Black · 50g (轻量入门) ──────────────────
      { color: '#1B Natural Black / 50g',  length: '12inch/30cm', price: 56,  inStock: true,  _supplierCost: null },
      { color: '#1B Natural Black / 50g',  length: '16inch/40cm', price: 64,  inStock: true,  _supplierCost: null },
      { color: '#1B Natural Black / 50g',  length: '20inch/50cm', price: 74,  inStock: true,  _supplierCost: null },
      // ── #1B Natural Black · 100g ────────────────────────────
      { color: '#1B Natural Black / 100g', length: '12inch/30cm', price: 85,  inStock: true,  _supplierCost: null },
      { color: '#1B Natural Black / 100g', length: '16inch/40cm', price: 97,  inStock: true,  _supplierCost: null },
      { color: '#1B Natural Black / 100g', length: '20inch/50cm', price: 111, inStock: true,  _supplierCost: null },
      { color: '#1B Natural Black / 100g', length: '24inch/60cm', price: 128, inStock: false, _supplierCost: null },
      // ── #4 Dark Brown · 100g ────────────────────────────────
      { color: '#4 Dark Brown / 100g',     length: '12inch/30cm', price: 88,  inStock: true,  _supplierCost: null },
      { color: '#4 Dark Brown / 100g',     length: '18inch/45cm', price: 107, inStock: true,  _supplierCost: null },
      // ── #27 Honey Blonde · 100g ─────────────────────────────
      { color: '#27 Honey Blonde / 100g',  length: '12inch/30cm', price: 88,  inStock: true,  _supplierCost: null },
      { color: '#27 Honey Blonde / 100g',  length: '18inch/45cm', price: 104, inStock: true,  _supplierCost: null },
      // ── #613 Blonde · 100g (特殊�?�?10%) ─────────────────
      { color: '#613 Blonde / 100g',       length: '12inch/30cm', price: 93,  inStock: true,  _supplierCost: null },
      { color: '#613 Blonde / 100g',       length: '18inch/45cm', price: 113, inStock: false, _supplierCost: null },
      // ── Pink / Blue 特殊�?· 100g ───────────────────────────
      { color: '#Pink Fantasy / 100g',     length: '14inch/35cm', price: 96,  inStock: true,  _supplierCost: null },
      { color: '#Blue Ocean / 100g',       length: '14inch/35cm', price: 96,  inStock: true,  _supplierCost: null },
    ],
    _supplier: {
      platform: '1688',
      shopName: '',
      productUrl: '',
      contactWeChat: '',
      costPrice: 0,
      notes: ''
    },
    featured: true
  },
  {
    id: 'lum-005',
    name: 'Vivienne',
    subtitle: 'Kinky Curly Afro · 18"',
    price: 269,          // 起售�?14inch Natural Black),用于商品卡片展示
    images: ['https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=85'],
    description: 'Voluminous, expressive, unapologetic. A celebration of natural texture, hand-tied for movement and density.',
    features: [
      '100% virgin human hair',
      'HD lace front (4×4 closure available)',
      'Pre-plucked hairline',
      '200% density · medium-large cap',
      'Length: 14�?0 inches'
    ],
    variants: [
      // ── Natural Black ────────────────────────────────────────
      { color: 'Natural Black', length: '14inch/35cm', price: 269, inStock: true,  _supplierCost: null  },
      { color: 'Natural Black', length: '16inch/40cm', price: 285, inStock: true,  _supplierCost: null  },
      { color: 'Natural Black', length: '18inch/45cm', price: 302, inStock: true,  _supplierCost: null  },
      { color: 'Natural Black', length: '20inch/50cm', price: 320, inStock: false, _supplierCost: null  },
      // ── Dark Brown (+3%) ─────────────────────────────────────
      { color: 'Dark Brown',    length: '14inch/35cm', price: 277, inStock: true,  _supplierCost: null  },
      { color: 'Dark Brown',    length: '16inch/40cm', price: 293, inStock: true,  _supplierCost: null  },
      { color: 'Dark Brown',    length: '18inch/45cm', price: 311, inStock: true,  _supplierCost: null  },
      { color: 'Dark Brown',    length: '20inch/50cm', price: 330, inStock: false, _supplierCost: null  },
    ],
    _supplier: {
      platform: '1688',
      shopName: '',
      productUrl: '',
      contactWeChat: '',
      costPrice: 0,
      notes: ''
    },
    featured: false
  },
  {
    id: 'lum-006',
    name: 'Ophélie',
    subtitle: 'Straight with Bangs · 18"',
    price: 239,          // 起售�?16inch Natural Black),用于商品卡片展示
    images: ['https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=85'],
    description: 'Sleek straight hair with classic French bangs �?the timeless, effortless look that flatters every face shape.',
    features: [
      '100% virgin human hair',
      'Wear & go construction',
      'Pre-cut bangs, no styling needed',
      '180% density · medium cap',
      'Length: 16�?0 inches'
    ],
    variants: [
      // ── Natural Black ────────────────────────────────────────
      { color: 'Natural Black', length: '16inch/40cm', price: 239, inStock: true,  _supplierCost: null  },
      { color: 'Natural Black', length: '18inch/45cm', price: 256, inStock: true,  _supplierCost: null  },
      { color: 'Natural Black', length: '20inch/50cm', price: 274, inStock: true,  _supplierCost: null  },
      // ── Dark Brown (+3%) ─────────────────────────────────────
      { color: 'Dark Brown',    length: '16inch/40cm', price: 246, inStock: true,  _supplierCost: null  },
      { color: 'Dark Brown',    length: '18inch/45cm', price: 263, inStock: false, _supplierCost: null  },
      { color: 'Dark Brown',    length: '20inch/50cm', price: 282, inStock: true,  _supplierCost: null  },
      // ── Light Brown (+5% from base, rarer color) ─────────────
      { color: 'Light Brown',   length: '16inch/40cm', price: 251, inStock: true,  _supplierCost: null  },
      { color: 'Light Brown',   length: '18inch/45cm', price: 268, inStock: true,  _supplierCost: null  },
      { color: 'Light Brown',   length: '20inch/50cm', price: 287, inStock: false, _supplierCost: null  },
    ],
    _supplier: {
      platform: '1688',
      shopName: '',
      productUrl: '',
      contactWeChat: '',
      costPrice: 0,
      notes: ''
    },
    featured: false
  },
  {
    id: 'lum-007',
    name: 'Margaux',
    subtitle: 'Water Wave Lace Front · 26"',
    price: 379,          // 起售�?22inch Natural Black),用于商品卡片展示
    tag: 'Limited',
    images: ['https://images.unsplash.com/photo-1626954079979-ec4f7b05e032?w=800&q=85'],
    description: 'Long, flowing water waves that catch light like silk ribbons. A statement piece for those who want to be seen.',
    features: [
      '100% virgin human hair',
      'HD Swiss lace front (13×6)',
      'Pre-plucked, baby hairs styled',
      '180% density · medium cap',
      'Length: 22�?8 inches'
    ],
    variants: [
      // ── Natural Black ────────────────────────────────────────
      { color: 'Natural Black',       length: '22inch/55cm', price: 379, inStock: true,  _supplierCost: null },
      { color: 'Natural Black',       length: '24inch/60cm', price: 406, inStock: true,  _supplierCost: null },
      { color: 'Natural Black',       length: '26inch/65cm', price: 434, inStock: true,  _supplierCost: null },
      { color: 'Natural Black',       length: '28inch/70cm', price: 464, inStock: true,  _supplierCost: null },
      // ── Dark Brown (+3%) ─────────────────────────────────────
      { color: 'Dark Brown',          length: '22inch/55cm', price: 391, inStock: true,  _supplierCost: null },
      { color: 'Dark Brown',          length: '24inch/60cm', price: 418, inStock: false, _supplierCost: null },
      { color: 'Dark Brown',          length: '26inch/65cm', price: 447, inStock: true,  _supplierCost: null },
      { color: 'Dark Brown',          length: '28inch/70cm', price: 478, inStock: true,  _supplierCost: null },
      // ── Burgundy Highlights (+8%, limited specialty color) ───
      { color: 'Burgundy Highlights', length: '22inch/55cm', price: 409, inStock: true,  _supplierCost: null },
      { color: 'Burgundy Highlights', length: '24inch/60cm', price: 438, inStock: true,  _supplierCost: null },
      { color: 'Burgundy Highlights', length: '26inch/65cm', price: 468, inStock: false, _supplierCost: null },
      { color: 'Burgundy Highlights', length: '28inch/70cm', price: 500, inStock: true,  _supplierCost: null },
    ],
    _supplier: {
      platform: '1688',
      shopName: '',
      productUrl: '',
      contactWeChat: '',
      costPrice: 0,
      notes: ''
    },
    featured: true
  },
  {
    id: 'lum-008',
    name: 'Inès',
    subtitle: 'Layered Wolf Cut · 16"',
    price: 249,          // 起售�?14inch Natural Black),用于商品卡片展示
    images: ['https://images.unsplash.com/photo-1600950207944-0d63e8edbc3f?w=800&q=85'],
    description: 'A bold, edgy wolf cut with feathered layers. Modern, expressive, and impossible to ignore.',
    features: [
      '100% virgin human hair',
      'HD lace front (13×4)',
      'Pre-cut layers, ready to wear',
      '180% density · medium cap',
      'Length: 14�?8 inches'
    ],
    variants: [
      // ── Natural Black ────────────────────────────────────────
      { color: 'Natural Black', length: '14inch/35cm', price: 249, inStock: true,  _supplierCost: null },
      { color: 'Natural Black', length: '16inch/40cm', price: 264, inStock: true,  _supplierCost: null },
      { color: 'Natural Black', length: '18inch/45cm', price: 280, inStock: false, _supplierCost: null },
      // ── Honey Brown (+4%) ────────────────────────────────────
      { color: 'Honey Brown',   length: '14inch/35cm', price: 259, inStock: true,  _supplierCost: null },
      { color: 'Honey Brown',   length: '16inch/40cm', price: 275, inStock: true,  _supplierCost: null },
      { color: 'Honey Brown',   length: '18inch/45cm', price: 292, inStock: true,  _supplierCost: null },
    ],
    _supplier: {
      platform: '1688',
      shopName: '',
      productUrl: '',
      contactWeChat: '',
      costPrice: 0,
      notes: ''
    },
    featured: false
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
