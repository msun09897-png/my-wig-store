// ============================================
// 商品数据 — 你只需要修改这个文件
// ============================================
// 加新商品:复制下面任何一个 {} 大括号区块,粘贴在末尾,改内容。
// 改图片:把 image 后面的链接换成你的图片(可以用 imgur.com 等免费图床上传后获取链接)。
// 改价格:改 price 数字(美金,数字就行,不要加 $)。
// 商品下架:删掉对应的整个 {} 区块。
// ============================================

const PRODUCTS = [
  {
    id: 'lum-196224',
    name: 'Human Hair Wig Female',
    subtitle: 'Straight Clip In Hair',
    price: 224,       // 起售价(最短款),用于商品卡片展示
    oldPrice: 280,
    images: ['https://i.postimg.cc/PrGZ7FG6/1.png'],
    description: 'Crafted from 100% virgin human hair and finished with HD Swiss lace, this piece moves, bounces, and shines like the hair you were born with. Soft to the touch, undetectable at the hairline — wear it confidently, day or night. Made to last 2+ years with proper care.',
    features: [
      '100% premium human hair',
      'HD lace front, pre-plucked',
      'Natural hairline, baby hairs styled',
      '180% density · medium cap',
      'Length: 16–26 inch'
    ],
    variants: [
      // ── 16 inch · $224 ──────────────────────────
      { color: '#613 Straight', length: '16inch/40cm', price: 224, inStock: true, _supplierCost: 101 },
      { color: '#3 Straight',   length: '16inch/40cm', price: 224, inStock: true, _supplierCost: 101 },
      { color: '#4 Straight',   length: '16inch/40cm', price: 224, inStock: true, _supplierCost: 101 },
      { color: '#7 Straight',   length: '16inch/40cm', price: 224, inStock: true, _supplierCost: 101 },
      { color: '#8 Straight',   length: '16inch/40cm', price: 224, inStock: true, _supplierCost: 101 },
      { color: '#12 Straight',  length: '16inch/40cm', price: 224, inStock: true, _supplierCost: 101 },
      // ── 18 inch · $237 (+6%) ────────────────────
      { color: '#613 Straight', length: '18inch/45cm', price: 237, inStock: true, _supplierCost: 107 },
      { color: '#3 Straight',   length: '18inch/45cm', price: 237, inStock: true, _supplierCost: 107 },
      { color: '#4 Straight',   length: '18inch/45cm', price: 237, inStock: true, _supplierCost: 107 },
      { color: '#7 Straight',   length: '18inch/45cm', price: 237, inStock: true, _supplierCost: 107 },
      { color: '#8 Straight',   length: '18inch/45cm', price: 237, inStock: true, _supplierCost: 107 },
      { color: '#12 Straight',  length: '18inch/45cm', price: 237, inStock: true, _supplierCost: 107 },
      // ── 20 inch · $254 (+7%) ────────────────────
      { color: '#613 Straight', length: '20inch/50cm', price: 254, inStock: true, _supplierCost: 114 },
      { color: '#3 Straight',   length: '20inch/50cm', price: 254, inStock: true, _supplierCost: 114 },
      { color: '#4 Straight',   length: '20inch/50cm', price: 254, inStock: true, _supplierCost: 114 },
      { color: '#7 Straight',   length: '20inch/50cm', price: 254, inStock: true, _supplierCost: 114 },
      { color: '#8 Straight',   length: '20inch/50cm', price: 254, inStock: true, _supplierCost: 114 },
      { color: '#12 Straight',  length: '20inch/50cm', price: 254, inStock: true, _supplierCost: 114 },
      // ── 22 inch · $272 (+7%) ────────────────────
      { color: '#613 Straight', length: '22inch/55cm', price: 272, inStock: true, _supplierCost: 122 },
      { color: '#3 Straight',   length: '22inch/55cm', price: 272, inStock: true, _supplierCost: 122 },
      { color: '#4 Straight',   length: '22inch/55cm', price: 272, inStock: true, _supplierCost: 122 },
      { color: '#7 Straight',   length: '22inch/55cm', price: 272, inStock: true, _supplierCost: 122 },
      { color: '#8 Straight',   length: '22inch/55cm', price: 272, inStock: true, _supplierCost: 122 },
      { color: '#12 Straight',  length: '22inch/55cm', price: 272, inStock: true, _supplierCost: 122 },
      // ── 24 inch · $291 (+7%) ────────────────────
      { color: '#613 Straight', length: '24inch/60cm', price: 291, inStock: true, _supplierCost: 131 },
      { color: '#3 Straight',   length: '24inch/60cm', price: 291, inStock: true, _supplierCost: 131 },
      { color: '#4 Straight',   length: '24inch/60cm', price: 291, inStock: true, _supplierCost: 131 },
      { color: '#7 Straight',   length: '24inch/60cm', price: 291, inStock: true, _supplierCost: 131 },
      { color: '#8 Straight',   length: '24inch/60cm', price: 291, inStock: true, _supplierCost: 131 },
      { color: '#12 Straight',  length: '24inch/60cm', price: 291, inStock: true, _supplierCost: 131 },
      // ── 26 inch · $311 (+7%) ────────────────────
      { color: '#613 Straight', length: '26inch/65cm', price: 311, inStock: true, _supplierCost: 140 },
      { color: '#3 Straight',   length: '26inch/65cm', price: 311, inStock: true, _supplierCost: 140 },
      { color: '#4 Straight',   length: '26inch/65cm', price: 311, inStock: true, _supplierCost: 140 },
      { color: '#7 Straight',   length: '26inch/65cm', price: 311, inStock: true, _supplierCost: 140 },
      { color: '#8 Straight',   length: '26inch/65cm', price: 311, inStock: true, _supplierCost: 140 },
      { color: '#12 Straight',  length: '26inch/65cm', price: 311, inStock: true, _supplierCost: 140 },
    ],
    featured: true
  },
  {
    id: 'lum-737816',
    name: 'Wig Long Curly Hair',
    subtitle: 'Lace Front Wig · 22"',
    price: 168,       // 起售价(14inch),用于商品卡片展示
    oldPrice: 210,
    images: ['https://i.postimg.cc/j2JsYXfj/shou-tu.png'],
    description: 'Soft, romantic body waves that catch every light. Hand-tied on HD Swiss lace for an invisible hairline, this wig holds its shape wash after wash. From beach days to boardroom moments — effortless, every time.',
    features: [
      '100% premium human hair',
      'HD lace front, pre-plucked',
      'Natural hairline, baby hairs styled',
      '180% density · medium cap',
      'Length: 14–24 inch'
    ],
    variants: [
      { color: '1B# Natural Black', length: '14inch/35cm', price: 168, inStock: true, _supplierCost: 76  },
      { color: '1B# Natural Black', length: '16inch/40cm', price: 178, inStock: true, _supplierCost: 80  },
      { color: '1B# Natural Black', length: '18inch/45cm', price: 190, inStock: true, _supplierCost: 86  },
      { color: '1B# Natural Black', length: '20inch/50cm', price: 203, inStock: true, _supplierCost: 91  },
      { color: '1B# Natural Black', length: '22inch/55cm', price: 217, inStock: true, _supplierCost: 98  },
      { color: '1B# Natural Black', length: '24inch/60cm', price: 232, inStock: true, _supplierCost: 104 },
    ],
    featured: true
  },
  {
    id: 'lum-880773',
    name: 'Hair Extensions Wig Full',
    subtitle: 'Loose Curls Lace Front · 24"',
    price: 168,       // 起售价(12inch),用于商品卡片展示
    oldPrice: 210,
    images: ['https://i.postimg.cc/zXGPPBnX/Gemini-Generated-Image-wo9guiwo9guiwo9g.png'],
    description: 'Sleek, glossy, and impossibly smooth. This silky straight piece falls like silk and feels even better. HD lace front melts away. 100% virgin hair, ready to dye, curl, or wear just as it is.',
    features: [
      '100% premium human hair',
      'HD lace front, pre-plucked',
      'Natural hairline, baby hairs styled',
      '180% density · medium cap',
      'Length: 12–26 inch'
    ],
    variants: [
      { color: 'Natural Color', length: '自然色 ST 12inch', price: 168, inStock: true, _supplierCost: 76  },
      { color: 'Natural Color', length: '自然色 ST 14inch', price: 178, inStock: true, _supplierCost: 80  },
      { color: 'Natural Color', length: '自然色 ST 16inch', price: 189, inStock: true, _supplierCost: 85  },
      { color: 'Natural Color', length: '自然色 ST 18inch', price: 200, inStock: true, _supplierCost: 90  },
      { color: 'Natural Color', length: '自然色 ST 20inch', price: 212, inStock: true, _supplierCost: 95  },
      { color: 'Natural Color', length: '自然色 ST 22inch', price: 225, inStock: true, _supplierCost: 101 },
      { color: 'Natural Color', length: '自然色 ST 24inch', price: 239, inStock: true, _supplierCost: 108 },
      { color: 'Natural Color', length: '自然色 ST 26inch', price: 253, inStock: true, _supplierCost: 114 },
      { color: 'Natural Color', length: '自然色',           price: 168, inStock: true, _supplierCost: 76  },
    ],
    featured: true
  },
  {
    id: 'lum-386669',
    name: 'Deep Wave Real Hair',
    subtitle: 'Deep Wave',
    price: 56,
    oldPrice: 70,
    images: ['https://i.postimg.cc/43tgN5Nh/Gemini-Generated-Image-k3qdi3k3qdi3k3qd.png'],
    description: 'Soft, romantic body waves that catch every light. Hand-tied on HD Swiss lace for an invisible hairline, this wig holds its shape wash after wash. From beach days to boardroom moments — effortless, every time.',
    features: [
      '100% premium human hair',
      'HD lace front, pre-plucked',
      'Natural hairline, baby hairs styled',
      '180% density · medium cap',
      'Length: 20inch/50cm'
    ],
    colors: ['#1B/50g', '#1B/100g', '#4/27/100g', '#613/100g', '#BUG/100g', '#pink/100g', '#blue/100g', '#RED/100g', '#4/100g', '#27/100g', '#350/100g', '#30/100g', '#33/100g', '#99J/10'],
    lengths: ['12inch/30cm', '14inch/35cm', '16inch/40cm', '18inch/45cm', '20inch/50cm', '22inch/55cm', '24inch/60cm', '26inch/65cm'],
    featured: true
  },
  {
    id: 'lum-005',
    name: 'Vivienne',
    subtitle: 'Kinky Curly Afro · 18"',
    price: 269,
    images: ['https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=85'],
    description: 'Voluminous, expressive, unapologetic. A celebration of natural texture, hand-tied for movement and density.',
    features: [
      '100% virgin human hair',
      'HD lace front (4×4 closure available)',
      'Pre-plucked hairline',
      '200% density · medium-large cap',
      'Length: 18 inches'
    ],
    colors: ['Natural Black', 'Dark Brown'],
    lengths: ['14"', '16"', '18"', '20"'],
    featured: false
  },
  {
    id: 'lum-006',
    name: 'Ophélie',
    subtitle: 'Straight with Bangs · 18"',
    price: 239,
    images: ['https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=85'],
    description: 'Sleek straight hair with classic French bangs — the timeless, effortless look that flatters every face shape.',
    features: [
      '100% virgin human hair',
      'Wear & go construction',
      'Pre-cut bangs, no styling needed',
      '180% density · medium cap',
      'Length: 18 inches'
    ],
    colors: ['Natural Black', 'Dark Brown', 'Light Brown'],
    lengths: ['16"', '18"', '20"'],
    featured: false
  },
  {
    id: 'lum-007',
    name: 'Margaux',
    subtitle: 'Water Wave Lace Front · 26"',
    price: 379,
    tag: 'Limited',
    images: ['https://images.unsplash.com/photo-1626954079979-ec4f7b05e032?w=800&q=85'],
    description: 'Long, flowing water waves that catch light like silk ribbons. A statement piece for those who want to be seen.',
    features: [
      '100% virgin human hair',
      'HD Swiss lace front (13×6)',
      'Pre-plucked, baby hairs styled',
      '180% density · medium cap',
      'Length: 26 inches'
    ],
    colors: ['Natural Black', 'Dark Brown', 'Burgundy Highlights'],
    lengths: ['22"', '24"', '26"', '28"'],
    featured: true
  },
  {
    id: 'lum-008',
    name: 'Inès',
    subtitle: 'Layered Wolf Cut · 16"',
    price: 249,
    images: ['https://images.unsplash.com/photo-1600950207944-0d63e8edbc3f?w=800&q=85'],
    description: 'A bold, edgy wolf cut with feathered layers. Modern, expressive, and impossible to ignore.',
    features: [
      '100% virgin human hair',
      'HD lace front (13×4)',
      'Pre-cut layers, ready to wear',
      '180% density · medium cap',
      'Length: 16 inches'
    ],
    colors: ['Natural Black', 'Honey Brown'],
    lengths: ['14"', '16"', '18"'],
    featured: false
  }
];
