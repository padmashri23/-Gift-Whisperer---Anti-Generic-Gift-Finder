// Indian festival gifting context. Used to (a) render festival chips in the
// occasion selector and (b) inject culturally-aware gifting guidance into the
// AI prompt when a festival occasion is selected.

export interface Festival {
  label: string;
  emoji: string;
  /** Short, prompt-ready guidance on regional gifting norms for this festival. */
  guidance: string;
}

export const FESTIVALS: Festival[] = [
  {
    label: "Diwali",
    emoji: "🪔",
    guidance:
      "Diwali (festival of lights). Favoured gifts: premium dry-fruit and sweet boxes, decorative diyas and candles, brass/silver puja items, home decor, scented items, gold/silver coins, and personalised gift hampers. Auspicious and festive packaging matters. Avoid leather goods and predominantly black items, which are considered inauspicious.",
  },
  {
    label: "Raksha Bandhan",
    emoji: "🪢",
    guidance:
      "Raksha Bandhan (brothers and sisters). Traditionally the brother gives the sister a thoughtful gift in return for tying a rakhi. Favoured gifts: jewellery and accessories, cosmetics, gadgets, fashion, personalised keepsakes, and chocolate/sweet hampers. Make it personal to the sibling bond.",
  },
  {
    label: "Bhai Dooj",
    emoji: "🍬",
    guidance:
      "Bhai Dooj (sister-brother bond, just after Diwali). Sisters bless brothers and exchange gifts. Favoured gifts: sweets, grooming kits, gadgets, accessories, wallets, and personalised tokens of affection.",
  },
  {
    label: "Karva Chauth",
    emoji: "🌙",
    guidance:
      "Karva Chauth (wives fast for their husbands). Romantic and traditional gifts from the husband: jewellery, sarees or ethnic wear, cosmetics and skincare, sargi thalis, and heartfelt personalised gifts. Lean romantic and premium.",
  },
  {
    label: "Holi",
    emoji: "🎨",
    guidance:
      "Holi (festival of colours). Fun, playful gifts: organic/herbal gulal sets, water guns (pichkari), festive sweets like gujiya and thandai kits, bright casual clothing, and waterproof gadgets or pouches.",
  },
  {
    label: "Navratri / Durga Puja",
    emoji: "💃",
    guidance:
      "Navratri / Durga Puja (nine nights of dance and devotion). Favoured gifts: traditional wear such as chaniya choli or sarees, garba/dandiya accessories, oxidised jewellery, and devotional items. Vibrant and festive.",
  },
  {
    label: "Ganesh Chaturthi",
    emoji: "🐘",
    guidance:
      "Ganesh Chaturthi (welcoming Lord Ganesha). Favoured gifts: eco-friendly clay idols, modak and sweet boxes, devotional decor, brass puja items, and traditional offerings. Keep it devotional and eco-conscious.",
  },
  {
    label: "Pongal",
    emoji: "🌾",
    guidance:
      "Pongal (Tamil harvest festival). Favoured gifts: traditional kitchen and home items, brass/clay cookware, festive sweets and jaggery, sugarcane and harvest themes, and traditional clothing (veshti, sarees).",
  },
  {
    label: "Onam",
    emoji: "🌸",
    guidance:
      "Onam (Kerala harvest festival). Favoured gifts: traditional Kerala wear (kasavu saree and set-mundu), home decor, sadya-related kitchenware, and flower/pookalam themes. Elegant and traditional.",
  },
  {
    label: "Makar Sankranti",
    emoji: "🪁",
    guidance:
      "Makar Sankranti (kite and harvest festival). Favoured gifts: kites and kite-flying kits, til-gud (sesame-jaggery) sweets, warm winter accessories, and traditional snacks.",
  },
  {
    label: "Lohri",
    emoji: "🔥",
    guidance:
      "Lohri (Punjabi winter harvest festival). Favoured gifts: gajak, rewari and peanuts, warm clothing and shawls, festive sweets, and celebratory hampers.",
  },
  {
    label: "Eid",
    emoji: "🌙",
    guidance:
      "Eid (festival of celebration after Ramadan). Favoured gifts: new clothing and ethnic wear, attar (perfume), dates and sweet boxes, sewai/kheer kits, and personalised gifts for family. Generous and warm.",
  },
  {
    label: "Christmas",
    emoji: "🎄",
    guidance:
      "Christmas. Favoured gifts: thoughtfully wrapped presents, plum cakes and chocolate hampers, decor and ornaments, cozy items, and secret-santa-friendly novelties.",
  },
];

const FESTIVAL_BY_LABEL = new Map(FESTIVALS.map((f) => [f.label.toLowerCase(), f]));

/** Returns festival gifting guidance for an occasion label, or null if not a known festival. */
export function getFestivalGuidance(occasion?: string): string | null {
  if (!occasion) return null;
  return FESTIVAL_BY_LABEL.get(occasion.trim().toLowerCase())?.guidance ?? null;
}
