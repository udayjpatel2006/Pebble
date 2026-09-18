// ==========================================================================
// PEBBLE BOOKS & PAPERCRAFT - CONFIGURATION & PRODUCT DATABASE
// ==========================================================================

const DEFAULT_SITE_CONFIG = {
  // Brand
  brandName: "Pebble",
  brandTagline: "Books & Papercraft",
  logoUrl: "assets/pebble-logo.svg", // SVG, Image URL, or Base64 data URL

  // Announcement Bar
  announcementBadge: "Local Craft",
  announcementText: "Handmade in small batches • Free local doorstep delivery on orders above ₹799 • Order directly via WhatsApp",

  // Hero Section
  heroTag: "Handmade Local Stationery",
  heroTitlePrefix: "Books sculpted for your thoughts, ",
  heroTitleHighlight: "crafted like pebbles.",
  heroDescription: "Discover artisanal hardbound journals, sketchbooks, and planners with custom cover designs, fountain-pen friendly pages, and lay-flat binding. Made locally with love.",
  heroPrimaryBtnText: "Explore Collection",
  heroSecondaryBtnText: "Visit Our Studio / Contact",
  heroImageUrl: "", // Custom hero visual artwork image URL or path

  // Trust / Value Highlights (4 points)
  trustItems: [
    {
      title: "Hand-Bound Quality",
      desc: "Sewn 180° lay-flat pages"
    },
    {
      title: "Custom Design",
      desc: "Custom design"
    },
    {
      title: "Local Community Made",
      desc: "Crafted locally in small batches"
    },
    {
      title: "Fast WhatsApp Orders",
      desc: "Quick doorstep dispatch"
    }
  ],

  // Catalog Section Text
  catalogTag: "Curated Collection",
  catalogTitle: "Explore Our Handcrafted Books",
  catalogSubtitle: "Browse through distinct cover designs, custom page counts, and binding techniques engineered for journaling, planning, and sketching.",

  // Contact & Social Redirects
  gmailAddress: "pebbleee17@gmail.com",
  gmailSubject: "Inquiry from Pebble Website",
  instagramHandle: "@pebble.books",
  instagramUrl: "https://instagram.com/pebble.books",
  whatsappNumber: "919876543210",
  whatsappNavRedirectText: "Hi Pebble! I would like to inquire about your books.",
  whatsappFooterRedirectText: "Hi Pebble! I visited your website and want to place an order.",

  // Studio / Physical Details
  studioAddress: "42 Artisan Way, Pebble Craft Lane",
  studioHours: "Mon – Sat: 10:00 AM – 8:00 PM",
  studioDescription: "A boutique local studio crafting bespoke books, journals, and papercraft goods. Built for thinkers, dreamers, artists, and creators who treasure physical pages.",
  
  // Store Policies
  freeShippingThreshold: 799,
  shippingCharge: 50,
  footerCopyrightNotice: "© 2026 Pebble Books & Papercraft. Handcrafted with care for book lovers."
};

const DEFAULT_PRODUCTS = [
  {
    id: "peb-001",
    title: "Artisan Hardbound Journal",
    designName: "Terracotta Botanica",
    category: "journals",
    categoryLabel: "Hardcover Journals",
    price: 499,
    originalPrice: 699,
    pages: 192,
    paperGsm: "120 GSM Bleed-Proof Ivory",
    binding: "Case-bound Section Sewn",
    coverType: "Matte Hardcover with Gold Foil Accents",
    dimensions: "A5 (14.8 × 21.0 cm)",
    ruling: "Dotted Grid (5mm)",
    inStock: true,
    rating: 4.9,
    reviewsCount: 38,
    isBestseller: true,
    description: "Handcrafted daily companion featuring the signature Terracotta Botanica cover art. Thick 120 GSM ivory pages are fountain-pen friendly with zero ink ghosting. Includes ribbon bookmark, elastic closure, and expandable inner pocket.",
    coverColor: "#C86446",
    patternType: "botanical",
    customImageUrl: "",
    customBackImageUrl: "assets/covers/peb-001-back.svg"
  },
  {
    id: "peb-002",
    title: "Celestial Night Journal",
    designName: "Midnight Constellations",
    category: "journals",
    categoryLabel: "Hardcover Journals",
    price: 549,
    originalPrice: 750,
    pages: 240,
    paperGsm: "120 GSM Acid-Free Cream",
    binding: "Lay-Flat Thread Bound",
    coverType: "Deep Velvet Touch Hardcover with Silver Foil",
    dimensions: "A5 (14.8 × 21.0 cm)",
    ruling: "Feathered Ruled (7mm)",
    inStock: true,
    rating: 5.0,
    reviewsCount: 52,
    isBestseller: true,
    description: "Deep oceanic blue canvas embossed with shimmering silver star maps and celestial constellations. 240 smooth pages engineered to open completely flat at 180 degrees for an effortless writing experience.",
    coverColor: "#1B2A47",
    patternType: "constellation",
    customImageUrl: "",
    customBackImageUrl: "assets/covers/peb-002-back.svg"
  },
  {
    id: "peb-003",
    title: "Artist Mixed Media Sketchbook",
    designName: "Nordic Slate Minimalist",
    category: "sketchbooks",
    categoryLabel: "Sketchbooks",
    price: 649,
    originalPrice: 850,
    pages: 160,
    paperGsm: "160 GSM Heavyweight Cartridge",
    binding: "Spiral Double-Wire Twin Loop",
    coverType: "Natural Textured Kraft Hardboard",
    dimensions: "Square (20.0 × 20.0 cm)",
    ruling: "Blank Artist Paper",
    inStock: true,
    rating: 4.8,
    reviewsCount: 29,
    isBestseller: false,
    description: "A premium artist sketchbook built for gouache, watercolors, fineliners, and graphite. The 160 GSM archival cartridge paper offers zero bleeding and handles light water washes with ease.",
    coverColor: "#54606E",
    patternType: "minimalist",
    customImageUrl: ""
  },
  {
    id: "peb-004",
    title: "Undated Productivity Planner",
    designName: "Sunburst Ochre",
    category: "planners",
    categoryLabel: "Planners & Organizers",
    price: 599,
    originalPrice: 799,
    pages: 220,
    paperGsm: "100 GSM Smooth Bond",
    binding: "Reinforced Section Hardbound",
    coverType: "Linen Textured Fabric Finish",
    dimensions: "B5 Medium (17.6 × 25.0 cm)",
    ruling: "Weekly & Monthly Habit Grids",
    inStock: true,
    rating: 4.9,
    reviewsCount: 44,
    isBestseller: true,
    description: "Master your days with our undated 12-month productivity planner. Designed with habit trackers, goal roadmaps, priority matrices, and dot-grid reflection spaces.",
    coverColor: "#D99B26",
    patternType: "sunburst",
    customImageUrl: "",
    customBackImageUrl: "assets/covers/peb-004-back.svg"
  },
  {
    id: "peb-005",
    title: "Pocket Thoughtbook (Set of 2)",
    designName: "Sage & Sand Duo",
    category: "pocket",
    categoryLabel: "Pocket Books",
    price: 349,
    originalPrice: 450,
    pages: 128,
    paperGsm: "90 GSM Recycled Cotton Paper",
    binding: "Singer Saddle Stitched",
    coverType: "Flexible Soft Kraft 300 GSM",
    dimensions: "Pocket (9.5 × 14.0 cm)",
    ruling: "Plain Blank & Dot Grid",
    inStock: true,
    rating: 4.7,
    reviewsCount: 19,
    isBestseller: false,
    description: "A duo of featherweight pocket notebooks created for quick sketches, sudden thoughts, and travel notes. Compact rounded corners fit smoothly into jeans, coats, or tote bags.",
    coverColor: "#4A6B5D",
    patternType: "duotone",
    customImageUrl: ""
  },
  {
    id: "peb-006",
    title: "Vintage Botanical Ledger",
    designName: "Amber Fern & Forest",
    category: "journals",
    categoryLabel: "Hardcover Journals",
    price: 529,
    originalPrice: 720,
    pages: 200,
    paperGsm: "120 GSM Warm Chamois",
    binding: "Traditional Smyth Sewn",
    coverType: "Debossed Botanical Linen Hardcover",
    dimensions: "A5 (14.8 × 21.0 cm)",
    ruling: "Vintage Ruled with Date Headers",
    inStock: true,
    rating: 4.9,
    reviewsCount: 31,
    isBestseller: false,
    description: "Inspired by 19th-century herbarium logs. Rich deep emerald fabric with warm amber fern debossing. Features double satin ribbons and archival acid-free paper designed to preserve thoughts for a lifetime.",
    coverColor: "#2F4838",
    patternType: "fern",
    customImageUrl: ""
  },
  {
    id: "peb-007",
    title: "Executive Grid Notebook",
    designName: "Charcoal Terrazzo",
    category: "spiral",
    categoryLabel: "Spiral Notebooks",
    price: 429,
    originalPrice: 599,
    pages: 180,
    paperGsm: "100 GSM High-Opacity White",
    binding: "Matte Black Wiro Ring-Bound",
    coverType: "Water-Resistant Poly-Matte Cover",
    dimensions: "B6 (12.5 × 17.6 cm)",
    ruling: "Isometric & Dot Grid",
    inStock: true,
    rating: 4.8,
    reviewsCount: 23,
    isBestseller: false,
    description: "Modern architectural terrazzo stone pattern printed on durable tear-resistant covers. Ideal for technical notes, bullet journaling, and quick daily task lists at your desk.",
    coverColor: "#2D3136",
    patternType: "terrazzo",
    customImageUrl: ""
  },
  {
    id: "peb-008",
    title: "Reflective Mindfulness Journal",
    designName: "Warm Clay Ripple",
    category: "journals",
    categoryLabel: "Hardcover Journals",
    price: 599,
    originalPrice: 800,
    pages: 240,
    paperGsm: "120 GSM Natural Felt",
    binding: "180° Layflat Hardbound",
    coverType: "Embossed Organic Pebble Waves",
    dimensions: "A5 (14.8 × 21.0 cm)",
    ruling: "Guided Daily Prompts & Dot Grid",
    inStock: true,
    rating: 5.0,
    reviewsCount: 67,
    isBestseller: true,
    description: "An intentional self-care journal with soft tactile wave embossing. Includes morning reflections, evening gratitude prompts, and 120 open free-form dotted pages.",
    coverColor: "#B56B52",
    patternType: "waves",
    customImageUrl: ""
  },
  {
    id: "peb-009",
    title: "Masterclass Drawing Book",
    designName: "Raw Umber Earth",
    category: "sketchbooks",
    categoryLabel: "Sketchbooks",
    price: 749,
    originalPrice: 999,
    pages: 140,
    paperGsm: "200 GSM Cold-Press Watercolor Paper",
    binding: "Cloth Spine Hardcover",
    coverType: "Heavy Dutch Canvas Board",
    dimensions: "A4 Large (21.0 × 29.7 cm)",
    ruling: "Heavy Texture Blank",
    inStock: true,
    rating: 4.9,
    reviewsCount: 18,
    isBestseller: false,
    description: "Created specifically for watercolorists, charcoal artists, and acrylic sketchers. 200 GSM cold-press paper with natural deckled edges and high absorbency.",
    coverColor: "#694838",
    patternType: "textured",
    customImageUrl: ""
  }
];

// ==========================================================================
// STORAGE ACCESSORS & HELPERS
// ==========================================================================

function getSiteConfig() {
  try {
    const saved = localStorage.getItem("pebble_site_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.gmailAddress || parsed.gmailAddress === 'hello.pebblebooks@gmail.com') {
        parsed.gmailAddress = 'pebbleee17@gmail.com';
      }
      if (Array.isArray(parsed.trustItems) && parsed.trustItems[1] && parsed.trustItems[1].title === 'Custom Page Layouts') {
        parsed.trustItems[1].title = 'Custom Design';
        parsed.trustItems[1].desc = 'Custom design';
      }
      return { ...DEFAULT_SITE_CONFIG, ...parsed };
    }
  } catch (e) {
    console.warn("Could not read site config from storage", e);
  }
  return { ...DEFAULT_SITE_CONFIG };
}

function saveSiteConfig(config) {
  try {
    localStorage.setItem("pebble_site_config", JSON.stringify(config));
    return true;
  } catch (e) {
    console.error("Failed to save site config", e);
    return false;
  }
}

function getProducts() {
  try {
    const saved = localStorage.getItem("pebble_products");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => {
          const defaultItem = DEFAULT_PRODUCTS.find((d) => d.id === item.id);
          if (defaultItem && defaultItem.customBackImageUrl && (!item.customBackImageUrl || !item.customBackImageUrl.trim())) {
            item.customBackImageUrl = defaultItem.customBackImageUrl;
          }
          return item;
        });
      }
    }
  } catch (e) {
    console.warn("Could not read products from storage", e);
  }
  return [...DEFAULT_PRODUCTS];
}

function saveProducts(products) {
  try {
    localStorage.setItem("pebble_products", JSON.stringify(products));
    return true;
  } catch (e) {
    console.error("Failed to save products", e);
    return false;
  }
}

function resetAllToDefaults() {
  try {
    localStorage.removeItem("pebble_site_config");
    localStorage.removeItem("pebble_products");
    return true;
  } catch (e) {
    console.error("Reset failed", e);
    return false;
  }
}

// ==========================================================================
// STRING & HTML ESCAPING UTILITY
// ==========================================================================
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

if (typeof window !== 'undefined') {
  window.escapeHtml = escapeHtml;
}

// ==========================================================================
// VECTOR ARTWORK GENERATOR
// ==========================================================================

function getBookCoverSvg(product) {
  if (!product) return '';
  try {
    if (product.customImageUrl && String(product.customImageUrl).trim()) {
      const designLabel = escapeHtml(product.designName || product.title || 'Custom Design');
      const pagesLabel = product.pages ? `${product.pages}p` : '';
      return `
        <div class="book-cover-custom-img" style="width: 100%; height: 100%; border-radius: 10px; overflow: hidden; box-shadow: 0 12px 24px rgba(25, 23, 20, 0.2); position: relative; display: flex; align-items: center; justify-content: center;">
        <img src="${product.customImageUrl}" alt="${designLabel}" loading="lazy" decoding="async" style="width: 100%; height: 100%; object-fit: contain; display: block;" onerror="this.onerror=null; this.style.display='none';" />
        <div style="position: absolute; bottom: 8px; left: 8px; right: 8px; background: rgba(255,255,255,0.92); padding: 4px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700; text-align: center; color: #232220;">
          ${designLabel} ${pagesLabel ? '• ' + pagesLabel : ''}
        </div>
      </div>
    `;
  }

  const color = product.coverColor || "#C86446";
  const pattern = product.patternType || "botanical";
  
  let patternContent = '';
  
  if (pattern === 'botanical') {
    patternContent = `
      <g stroke="#F7EDE2" stroke-width="1.2" opacity="0.45" fill="none">
        <path d="M70 240 Q100 180 140 220 T210 160" />
        <path d="M140 220 Q120 190 100 195" />
        <path d="M140 220 Q160 190 180 200" />
        <path d="M175 190 Q195 165 220 170" />
        <circle cx="100" cy="195" r="4" fill="#F7EDE2" />
        <circle cx="180" cy="200" r="4" fill="#F7EDE2" />
        <circle cx="220" cy="170" r="4" fill="#F7EDE2" />
        <path d="M60 120 Q110 90 130 50" />
        <circle cx="130" cy="50" r="5" fill="#E8A87C" opacity="0.8" />
      </g>
    `;
  } else if (pattern === 'constellation') {
    patternContent = `
      <g stroke="#C2D8FF" stroke-width="0.8" opacity="0.6" fill="none">
        <line x1="50" y1="80" x2="110" y2="60" />
        <line x1="110" y1="60" x2="160" y2="90" />
        <line x1="160" y1="90" x2="200" y2="50" />
        <line x1="110" y1="60" x2="130" y2="130" />
        <line x1="70" y1="210" x2="120" y2="180" />
        <line x1="120" y1="180" x2="190" y2="220" />
        <circle cx="50" cy="80" r="2.5" fill="#FFF" />
        <circle cx="110" cy="60" r="3.5" fill="#FFF" />
        <circle cx="160" cy="90" r="2.5" fill="#FFD166" />
        <circle cx="200" cy="50" r="4" fill="#FFF" />
        <circle cx="130" cy="130" r="2" fill="#FFF" />
        <circle cx="70" cy="210" r="3" fill="#FFF" />
        <circle cx="120" cy="180" r="4" fill="#FFD166" />
        <circle cx="190" cy="220" r="3" fill="#FFF" />
      </g>
    `;
  } else if (pattern === 'minimalist') {
    patternContent = `
      <g stroke="#DDD" stroke-width="1.5" opacity="0.3" fill="none">
        <circle cx="130" cy="150" r="70" stroke-dasharray="4 4" />
        <line x1="60" y1="150" x2="200" y2="150" />
        <circle cx="130" cy="150" r="12" fill="#EFE9DF" opacity="0.5" />
      </g>
    `;
  } else if (pattern === 'sunburst') {
    patternContent = `
      <g stroke="#FFE8B0" stroke-width="1.2" opacity="0.5" fill="none">
        <circle cx="130" cy="140" r="35" fill="#FFF6DC" opacity="0.2" />
        <line x1="130" y1="85" x2="130" y2="65" />
        <line x1="130" y1="195" x2="130" y2="215" />
        <line x1="75" y1="140" x2="55" y2="140" />
        <line x1="185" y1="140" x2="205" y2="140" />
        <line x1="91" y1="101" x2="77" y2="87" />
        <line x1="169" y1="179" x2="183" y2="193" />
        <line x1="91" y1="179" x2="77" y2="193" />
        <line x1="169" y1="101" x2="183" y2="87" />
      </g>
    `;
  } else if (pattern === 'fern') {
    patternContent = `
      <g stroke="#C6E0C9" stroke-width="1.2" opacity="0.5" fill="none">
        <path d="M130 250 Q120 150 140 60" />
        <path d="M125 210 Q95 195 90 205" />
        <path d="M128 200 Q160 185 165 195" />
        <path d="M124 160 Q90 145 85 155" />
        <path d="M127 150 Q162 135 168 145" />
        <path d="M126 110 Q98 98 95 106" />
        <path d="M132 100 Q158 90 162 98" />
      </g>
    `;
  } else if (pattern === 'waves') {
    patternContent = `
      <g stroke="#FAD9CC" stroke-width="1.8" opacity="0.4" fill="none">
        <path d="M40 90 Q130 50 220 90 T400 90" />
        <path d="M40 130 Q130 90 220 130 T400 130" />
        <path d="M40 170 Q130 130 220 170 T400 170" />
        <path d="M40 210 Q130 170 220 210 T400 210" />
      </g>
    `;
  } else if (pattern === 'terrazzo') {
    patternContent = `
      <g opacity="0.35">
        <polygon points="60,60 75,70 65,85" fill="#E89870" />
        <polygon points="170,80 185,75 180,95 165,90" fill="#E5C384" />
        <polygon points="90,160 110,155 105,175 85,170" fill="#90A4AE" />
        <polygon points="190,170 210,185 185,200" fill="#E89870" />
        <circle cx="80" cy="220" r="8" fill="#F4EAE0" />
        <circle cx="150" cy="235" r="6" fill="#D7CCC8" />
      </g>
    `;
  } else {
    patternContent = `
      <g opacity="0.2" fill="#FFF">
        <rect x="50" y="50" width="160" height="190" rx="6" fill="none" stroke="#FFF" stroke-width="1.5" stroke-dasharray="6 6"/>
        <line x1="80" y1="145" x2="180" y2="145" stroke="#FFF" stroke-width="1.5" />
      </g>
    `;
  }

  const dim = product.dimensions ? String(product.dimensions).split(' ')[0] : 'A5';

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 340" class="book-cover-vector">
      <defs>
        <linearGradient id="spine-grad-${product.id}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#000" stop-opacity="0.35"/>
          <stop offset="6%" stop-color="#FFF" stop-opacity="0.15"/>
          <stop offset="12%" stop-color="#000" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0"/>
        </linearGradient>
        <filter id="book-shadow-${product.id}" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="3" dy="4" stdDeviation="6" flood-color="#14110E" flood-opacity="0.25"/>
        </filter>
      </defs>
      
      <!-- Book Body -->
      <rect x="15" y="10" width="230" height="320" rx="10" fill="${color}" filter="url(#book-shadow-${product.id})"/>
      
      <!-- Pattern Layer -->
      ${patternContent}
      
      <!-- Book Spine Edge Highlight -->
      <rect x="15" y="10" width="28" height="320" rx="6" fill="url(#spine-grad-${product.id})"/>
      
      <!-- Gold/Cream Label Plate -->
      <rect x="42" y="115" width="176" height="88" rx="6" fill="#FDFBF7" opacity="0.94" stroke="#D3C3AD" stroke-width="1"/>
      <rect x="46" y="119" width="168" height="80" rx="4" fill="none" stroke="${color}" stroke-width="0.8" stroke-dasharray="3 2" opacity="0.7"/>
      
      <!-- Typography on Label -->
      <text x="130" y="142" font-family="'Playfair Display', Georgia, serif" font-size="11" font-weight="700" fill="#232220" text-anchor="middle" letter-spacing="0.5">PEBBLE</text>
      <text x="130" y="160" font-family="'Playfair Display', Georgia, serif" font-size="13" font-weight="700" fill="${color}" text-anchor="middle">${product.designName || ''}</text>
      <text x="130" y="180" font-family="'Inter', sans-serif" font-size="9.5" font-weight="600" fill="#696256" text-anchor="middle" letter-spacing="1">${product.pages || ''} PAGES • ${dim}</text>
      
      <!-- Ribbon Bookmark subtle peak -->
      <path d="M195 10 L195 45 L202 38 L209 45 L209 10 Z" fill="#D99B26" opacity="0.9"/>
    </svg>
  `;
  } catch (err) {
    console.warn('[Pebble] Fallback cover rendered for:', product && product.id, err);
    return `
      <div class="book-cover-custom-img" style="width: 100%; height: 100%; border-radius: 10px; background: #C86446; display: flex; align-items: center; justify-content: center; color: #FFF; font-weight: 700; font-size: 0.9rem;">
        ${escapeHtml(product && (product.designName || product.title) || 'Pebble Book')}
      </div>
    `;
  }
}

function getBookBackCoverHtml(product) {
  if (!product) return '';
  const backUrl = (product.customBackImageUrl || product.backImageUrl || '').trim();
  if (!backUrl) return '';
  try {
    const designLabel = escapeHtml(product.designName || product.title || 'Custom Design');
    return `
      <div class="book-cover-custom-img book-back-cover" style="width: 100%; height: 100%; border-radius: 10px; overflow: hidden; box-shadow: 0 12px 24px rgba(25, 23, 20, 0.2); position: relative; display: flex; align-items: center; justify-content: center;">
        <img src="${escapeHtml(backUrl)}" alt="${designLabel} - Back Page" loading="lazy" decoding="async" style="width: 100%; height: 100%; object-fit: contain; display: block;" onerror="this.onerror=null; this.src='assets/pebble-logo.svg';" />
      </div>
    `;
  } catch (err) {
    console.warn('[Pebble] Error rendering back cover:', err);
    return '';
  }
}

if (typeof window !== 'undefined') {
  window.getBookCoverSvg = getBookCoverSvg;
  window.getBookBackCoverHtml = getBookBackCoverHtml;
}
