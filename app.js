// Pebble Books & Papercraft - Core Application Logic

(function () {
  'use strict';

  // State
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'featured';
  let cart = [];
  let siteConfig = {};
  let productsList = [];

  // DOM Elements
  const productsGrid = document.getElementById('productsGrid');
  const resultsCount = document.getElementById('resultsCount');
  const searchInput = document.getElementById('searchInput');
  const categoryTabs = document.getElementById('categoryTabs');
  const sortSelect = document.getElementById('sortSelect');
  const trustGridContainer = document.getElementById('trustGridContainer');

  // Modals & Drawers
  const quickViewModal = document.getElementById('quickViewModal');
  const quickViewContent = document.getElementById('quickViewContent');
  const closeQuickViewBtn = document.getElementById('closeQuickViewBtn');

  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartBtn = document.getElementById('cartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const shippingNotice = document.getElementById('shippingNotice');
  const whatsappCheckoutBtn = document.getElementById('whatsappCheckoutBtn');
  const directCheckoutBtn = document.getElementById('directCheckoutBtn');

  const checkoutModal = document.getElementById('checkoutModal');
  const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutMiniSummary = document.getElementById('checkoutMiniSummary');
  const submitViaWhatsAppBtn = document.getElementById('submitViaWhatsAppBtn');

  const successModal = document.getElementById('successModal');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const orderReceiptDetails = document.getElementById('orderReceiptDetails');

  const toastContainer = document.getElementById('toastContainer');

  // ==========================================
  // INITIALIZATION
  // ==========================================
  async function init() {
    await loadData();
    loadCartFromStorage();
    setupEventListeners();

    // Listen for changes from admin panel in another tab
    window.addEventListener('storage', async (e) => {
      if (e.key === 'pebble_site_config' || e.key === 'pebble_products') {
        await loadData();
      }
    });
  }

  async function loadData() {
    if (typeof getCloudSiteConfig === 'function') {
      siteConfig = await getCloudSiteConfig();
      productsList = await getCloudProducts();
    } else {
      siteConfig = getSiteConfig();
      productsList = getProducts();
    }
    applySiteConfig();
    renderProducts();
    updateCartUI();
  }

  // Apply dynamic texts, logos, and links
  function applySiteConfig() {
    // Brand & Logo
    const navLogo = document.getElementById('navBrandLogo');
    const footerLogo = document.getElementById('footerBrandLogo');
    const navBrandTitle = document.getElementById('navBrandTitle');
    const navBrandSubtitle = document.getElementById('navBrandSubtitle');
    const footerBrandTitle = document.getElementById('footerBrandTitle');
    const footerBrandSubtitle = document.getElementById('footerBrandSubtitle');

    if (navBrandTitle) navBrandTitle.textContent = siteConfig.brandName || 'Pebble';
    if (navBrandSubtitle) navBrandSubtitle.textContent = siteConfig.brandTagline || 'Books & Papercraft';
    if (footerBrandTitle) footerBrandTitle.textContent = siteConfig.brandName || 'Pebble';
    if (footerBrandSubtitle) footerBrandSubtitle.textContent = siteConfig.brandTagline || 'Books & Papercraft';

    if (navLogo && siteConfig.logoUrl) {
      navLogo.src = siteConfig.logoUrl;
      navLogo.alt = siteConfig.brandName || 'Pebble Logo';
    }
    if (footerLogo && siteConfig.logoUrl) {
      footerLogo.src = siteConfig.logoUrl;
      footerLogo.alt = siteConfig.brandName || 'Pebble Logo';
      footerLogo.style.filter = 'none';
    }

    // Announcement Bar
    const annBadge = document.getElementById('announcementBadge');
    const annText = document.getElementById('announcementText');
    if (annBadge) annBadge.textContent = siteConfig.announcementBadge || 'Local Craft';
    if (annText) annText.textContent = siteConfig.announcementText || '';

    // Hero Texts & Showcase Custom Image
    const heroTag = document.getElementById('heroTag');
    const heroPrefix = document.getElementById('heroTitlePrefix');
    const heroHighlight = document.getElementById('heroTitleHighlight');
    const heroDesc = document.getElementById('heroDescription');
    const heroPrimaryBtn = document.getElementById('heroPrimaryBtn');
    const heroSecondaryBtn = document.getElementById('heroSecondaryBtn');
    const heroShowcaseImg = document.getElementById('heroShowcaseImg');
    const heroDefaultMockup = document.getElementById('heroDefaultMockup');

    if (heroTag) heroTag.textContent = siteConfig.heroTag || '';
    if (heroPrefix) heroPrefix.textContent = siteConfig.heroTitlePrefix || '';
    if (heroHighlight) heroHighlight.textContent = siteConfig.heroTitleHighlight || '';
    if (heroDesc) heroDesc.textContent = siteConfig.heroDescription || '';
    if (heroPrimaryBtn && siteConfig.heroPrimaryBtnText) {
      heroPrimaryBtn.childNodes[0].nodeValue = siteConfig.heroPrimaryBtnText + ' ';
    }
    if (heroSecondaryBtn && siteConfig.heroSecondaryBtnText) {
      heroSecondaryBtn.textContent = siteConfig.heroSecondaryBtnText;
    }

    if (heroShowcaseImg && heroDefaultMockup) {
      if (siteConfig.heroImageUrl && siteConfig.heroImageUrl.trim()) {
        heroShowcaseImg.src = siteConfig.heroImageUrl;
        heroShowcaseImg.style.display = 'block';
        heroDefaultMockup.style.display = 'none';
      } else {
        heroShowcaseImg.style.display = 'none';
        heroDefaultMockup.style.display = 'block';
      }
    }

    // Catalog Section Texts
    const catTag = document.getElementById('catalogTag');
    const catTitle = document.getElementById('catalogTitle');
    const catSubtitle = document.getElementById('catalogSubtitle');
    if (catTag) catTag.textContent = siteConfig.catalogTag || 'Collection';
    if (catTitle) catTitle.textContent = siteConfig.catalogTitle || 'Our Books';
    if (catSubtitle) catSubtitle.textContent = siteConfig.catalogSubtitle || '';

    // Trust Grid Points
    if (trustGridContainer && Array.isArray(siteConfig.trustItems)) {
      const icons = [
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>'
      ];

      trustGridContainer.innerHTML = siteConfig.trustItems
        .map((item, idx) => `
          <div class="trust-item">
            <div class="trust-icon">${icons[idx % icons.length]}</div>
            <div class="trust-text">
              <h4>${escapeHtml(item.title)}</h4>
              <p>${escapeHtml(item.desc)}</p>
            </div>
          </div>
        `)
        .join('');
    }

    // Nav WhatsApp
    const navWhatsAppPill = document.getElementById('navWhatsAppPill');
    if (navWhatsAppPill) {
      const waMsg = encodeURIComponent(siteConfig.whatsappNavRedirectText || 'Hello Pebble!');
      navWhatsAppPill.href = `https://wa.me/${siteConfig.whatsappNumber || '919876543210'}?text=${waMsg}`;
    }

    // Footer Contact Channels (Gmail, Instagram, WhatsApp)
    const footerGmailCard = document.getElementById('footerGmailCard');
    const footerGmailLabel = document.getElementById('footerGmailLabel');
    if (footerGmailCard && footerGmailLabel) {
      const subject = encodeURIComponent(siteConfig.gmailSubject || 'Inquiry from Pebble Website');
      footerGmailCard.href = `mailto:${siteConfig.gmailAddress || 'pebbleee17@gmail.com'}?subject=${subject}`;
      footerGmailLabel.textContent = siteConfig.gmailAddress || 'pebbleee17@gmail.com';
    }

    const footerInstaCard = document.getElementById('footerInstaCard');
    const footerInstaLabel = document.getElementById('footerInstaLabel');
    if (footerInstaCard && footerInstaLabel) {
      footerInstaCard.href = siteConfig.instagramUrl || 'https://instagram.com/pebble.books';
      footerInstaLabel.textContent = siteConfig.instagramHandle || '@pebble.books';
    }

    const footerWhatsAppCard = document.getElementById('footerWhatsAppCard');
    const footerWhatsAppLabel = document.getElementById('footerWhatsAppLabel');
    if (footerWhatsAppCard && footerWhatsAppLabel) {
      const waMsg = encodeURIComponent(siteConfig.whatsappFooterRedirectText || 'Hello Pebble!');
      footerWhatsAppCard.href = `https://wa.me/${siteConfig.whatsappNumber || '919876543210'}?text=${waMsg}`;
      footerWhatsAppLabel.textContent = '+' + (siteConfig.whatsappNumber || '919876543210');
    }

    // Footer studio info
    const footerDesc = document.getElementById('footerBrandDesc');
    const footerAddr = document.getElementById('footerStudioAddress');
    const footerHours = document.getElementById('footerStudioHours');
    const footerCopy = document.getElementById('footerCopyright');

    if (footerDesc) footerDesc.textContent = siteConfig.studioDescription || '';
    if (footerAddr) footerAddr.textContent = siteConfig.studioAddress || '';
    if (footerHours) footerHours.textContent = siteConfig.studioHours || '';
    if (footerCopy) footerCopy.textContent = siteConfig.footerCopyrightNotice || '';
  }

  // Load cart from localStorage
  function loadCartFromStorage() {
    try {
      const saved = localStorage.getItem('pebble_cart');
      if (saved) {
        cart = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load cart from storage', e);
      cart = [];
    }
  }

  function saveCartToStorage() {
    try {
      localStorage.setItem('pebble_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to storage', e);
    }
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================
  function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderProducts();
    });

    // Category Tabs
    categoryTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.cat-tab');
      if (!tab) return;

      document.querySelectorAll('.cat-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category;
      renderProducts();
    });

    // Sorting
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });

    // Cart Drawer Open/Close
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartBackdrop.addEventListener('click', (e) => {
      if (e.target === cartBackdrop) closeCart();
    });

    // Quick View Modal Close
    closeQuickViewBtn.addEventListener('click', closeQuickView);
    quickViewModal.addEventListener('click', (e) => {
      if (e.target === quickViewModal) closeQuickView();
    });

    // Checkout Modal Open/Close
    directCheckoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your bag is empty. Add a book first!');
        return;
      }
      closeCart();
      openCheckoutModal();
    });

    closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) closeCheckoutModal();
    });

    // WhatsApp Direct Checkout from Cart Drawer
    whatsappCheckoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your bag is empty. Please select a book!');
        return;
      }
      triggerWhatsAppOrder();
    });

    // WhatsApp Order from inside Checkout Form
    submitViaWhatsAppBtn.addEventListener('click', () => {
      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const address = document.getElementById('custAddress').value.trim();
      const payMethod = document.getElementById('payMethod').value;
      const notes = document.getElementById('orderNotes').value.trim();

      triggerWhatsAppOrder({ name, phone, address, payMethod, notes });
      closeCheckoutModal();
    });

    // Standard Form Checkout Submit
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const address = document.getElementById('custAddress').value.trim();
      const payMethod = document.getElementById('payMethod').value;
      const notes = document.getElementById('orderNotes').value.trim();

      processDirectOrder({ name, phone, address, payMethod, notes });
    });

    // Close Success Modal
    closeSuccessBtn.addEventListener('click', () => {
      successModal.classList.remove('open');
      successModal.setAttribute('aria-hidden', 'true');
    });

    // Keyboard navigation & Discrete Admin Shortcut (Ctrl + Shift + A)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeQuickView();
        closeCart();
        closeCheckoutModal();
        successModal.classList.remove('open');
      } else if (e.shiftKey && (e.ctrlKey || e.metaKey) && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.href = 'admin.html';
      }
    });

    // Discrete secret double-click on footer logo
    const footerLogo = document.getElementById('footerBrandLogo');
    if (footerLogo) {
      footerLogo.style.cursor = 'pointer';
      footerLogo.title = 'Pebble Books';
      footerLogo.addEventListener('dblclick', () => {
        window.location.href = 'admin.html';
      });
    }
  }

  // Global helper for footer collection links
  window.filterCategory = function (category) {
    currentCategory = category;
    document.querySelectorAll('.cat-tab').forEach((tab) => {
      if (tab.dataset.category === category) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    renderProducts();
  };

  // ==========================================
  // PRODUCT FILTERING, SORTING & RENDERING
  // ==========================================
  function getFilteredProducts() {
    return productsList.filter((product) => {
      // Category Match
      const matchesCategory = currentCategory === 'all' || product.category === currentCategory;

      // Search Query Match (Title, Design name, pages, cover type, description)
      const matchesSearch =
        !searchQuery ||
        (product.title && product.title.toLowerCase().includes(searchQuery)) ||
        (product.designName && product.designName.toLowerCase().includes(searchQuery)) ||
        (product.categoryLabel && product.categoryLabel.toLowerCase().includes(searchQuery)) ||
        (product.pages && product.pages.toString().includes(searchQuery)) ||
        (product.ruling && product.ruling.toLowerCase().includes(searchQuery)) ||
        (product.description && product.description.toLowerCase().includes(searchQuery));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (currentSort === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (currentSort === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (currentSort === 'pages-desc') return (b.pages || 0) - (a.pages || 0);
      if (currentSort === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
      // Default: featured (bestsellers first)
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }

  function renderProducts() {
    const filtered = getFilteredProducts();

    resultsCount.innerHTML = `Showing <strong>${filtered.length}</strong> ${filtered.length === 1 ? 'book' : 'books'}`;

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="catalog-empty-state">
          <h3>No books match your criteria</h3>
          <p>Try searching for a different design name, title, or clearing your active filters.</p>
          <button class="btn-secondary" onclick="resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered
      .map((product) => {
        const coverSvgHtml = getBookCoverSvg(product);
        const origPriceHtml = product.originalPrice && product.originalPrice > product.price
          ? `<span class="price-original">₹${product.originalPrice}</span>`
          : '';

        const dimText = product.dimensions ? product.dimensions.split(' ')[0] : 'Standard';
        const gsmText = product.paperGsm ? product.paperGsm.split(' ')[0] : '100';

        return `
        <article class="product-card" data-id="${product.id}">
          <div class="card-media">
            ${product.isBestseller ? '<span class="badge-bestseller">Bestseller</span>' : ''}
            <div class="card-media-vector">
              ${coverSvgHtml}
            </div>
            <button class="quick-view-overlay-btn" onclick="openQuickView('${product.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Quick Specs
            </button>
          </div>

          <div class="card-body">
            <!-- Prominent Design Name & Number of Pages -->
            <div class="design-spec-badge-row">
              <span class="design-name-chip" title="Cover Design Name">
                🎨 ${escapeHtml(product.designName)}
              </span>
              <span class="pages-count-chip" title="Total Page Count">
                📖 ${product.pages} Pages
              </span>
            </div>

            <h3 class="card-title">${escapeHtml(product.title)}</h3>
            <div class="card-design-subtitle">Artisan Edition • ${escapeHtml(dimText)}</div>

            <!-- Mini specs chips -->
            <div class="card-specs-mini">
              <span class="spec-mini-item">${escapeHtml(product.ruling || 'Plain')}</span>
              <span class="spec-mini-item">${escapeHtml(gsmText)} GSM</span>
            </div>

            <!-- Card Price & Add to Bag -->
            <div class="card-footer-row">
              <div class="price-box">
                <div class="price-main">
                  ₹${product.price}
                  ${origPriceHtml}
                </div>
              </div>

              <button class="btn-add-cart" onclick="addToCart('${product.id}')" aria-label="Add ${escapeHtml(product.title)} to bag">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
                Add
              </button>
            </div>
          </div>
        </article>
      `;
      })
      .join('');
  }

  window.resetFilters = function () {
    currentCategory = 'all';
    searchQuery = '';
    currentSort = 'featured';
    searchInput.value = '';
    sortSelect.value = 'featured';
    document.querySelectorAll('.cat-tab').forEach((t) => {
      if (t.dataset.category === 'all') t.classList.add('active');
      else t.classList.remove('active');
    });
    renderProducts();
  };

  // ==========================================
  // QUICK VIEW MODAL
  // ==========================================
  window.openQuickView = function (productId) {
    const product = productsList.find((p) => p.id === productId);
    if (!product) return;

    const coverSvgHtml = getBookCoverSvg(product);
    const savings = product.originalPrice && product.originalPrice > product.price
      ? `<span style="font-size:0.75rem; color:#1EBE5D; font-weight:700; background:#E7F9EE; padding:2px 8px; border-radius:999px; margin-left:6px;">Save ₹${product.originalPrice - product.price}</span>`
      : '';

    quickViewContent.innerHTML = `
      <div class="quick-view-art-side">
        <div style="width: 220px; max-width: 100%;">
          ${coverSvgHtml}
        </div>
        <div style="margin-top: 18px; text-align: center;">
          <span style="display:inline-block; background: var(--color-primary-light); color: var(--color-primary); font-weight:700; font-size:0.8rem; padding: 4px 12px; border-radius: 999px;">
            Design: ${escapeHtml(product.designName)}
          </span>
        </div>
      </div>

      <div class="quick-view-details-side">
        <h2 class="modal-product-title">${escapeHtml(product.title)}</h2>
        <div class="modal-design-label">Cover Design: ${escapeHtml(product.designName)}</div>
        
        <div class="price-box" style="margin-bottom: 16px;">
          <div class="price-main" style="font-size: 1.6rem;">
            ₹${product.price}
            ${product.originalPrice ? `<span class="price-original" style="font-size: 1.05rem;">₹${product.originalPrice}</span>` : ''}
            ${savings}
          </div>
        </div>

        <p style="color: var(--color-text-body); font-size: 0.92rem; margin-bottom: 20px; line-height: 1.6;">
          ${escapeHtml(product.description || 'Crafted with premium materials and lay-flat binding.')}
        </p>

        <!-- Detailed Specification Table -->
        <table class="modal-specs-table">
          <tbody>
            <tr>
              <td class="spec-key">Design Name</td>
              <td class="spec-val" style="color: var(--color-primary); font-weight:700;">${escapeHtml(product.designName)}</td>
            </tr>
            <tr>
              <td class="spec-key">Number of Pages</td>
              <td class="spec-val" style="font-weight:700;">${product.pages} Pages</td>
            </tr>
            <tr>
              <td class="spec-key">Paper Quality</td>
              <td class="spec-val">${escapeHtml(product.paperGsm || 'Archival Quality')}</td>
            </tr>
            <tr>
              <td class="spec-key">Page Ruling</td>
              <td class="spec-val">${escapeHtml(product.ruling || 'Blank')}</td>
            </tr>
            <tr>
              <td class="spec-key">Dimensions &amp; Size</td>
              <td class="spec-val">${escapeHtml(product.dimensions || 'A5')}</td>
            </tr>
            <tr>
              <td class="spec-key">Cover Finish</td>
              <td class="spec-val">${escapeHtml(product.coverType || 'Hardcover')}</td>
            </tr>
            <tr>
              <td class="spec-key">Binding Type</td>
              <td class="spec-val">${escapeHtml(product.binding || 'Thread Bound')}</td>
            </tr>
            <tr>
              <td class="spec-key">Stock Availability</td>
              <td class="spec-val" style="color: ${product.inStock !== false ? '#1EBE5D' : '#C84646'};">
                ${product.inStock !== false ? '● In Stock (Local Small-Batch)' : '○ Out of Stock (Made to order)'}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Quantity and Action Buttons -->
        <div class="modal-qty-actions">
          <div class="qty-counter">
            <button class="qty-btn" onclick="adjustQuickViewQty(-1)" aria-label="Decrease quantity">-</button>
            <span class="qty-value" id="quickViewQty">1</span>
            <button class="qty-btn" onclick="adjustQuickViewQty(1)" aria-label="Increase quantity">+</button>
          </div>

          <button class="btn-primary" onclick="addQuickViewToCart('${product.id}')" style="flex:1;">
            Add to Bag (₹<span id="quickViewBtnTotal">${product.price}</span>)
          </button>
        </div>
      </div>
    `;

    quickViewModal.classList.add('open');
    quickViewModal.setAttribute('aria-hidden', 'false');
  };

  let quickViewQuantity = 1;
  window.adjustQuickViewQty = function (delta) {
    const qtyElem = document.getElementById('quickViewQty');
    const btnTotal = document.getElementById('quickViewBtnTotal');
    if (!qtyElem) return;

    quickViewQuantity = Math.max(1, quickViewQuantity + delta);
    qtyElem.textContent = quickViewQuantity;

    const modalTitle = document.querySelector('.modal-product-title').textContent;
    const product = productsList.find((p) => p.title === modalTitle);
    if (product && btnTotal) {
      btnTotal.textContent = product.price * quickViewQuantity;
    }
  };

  window.addQuickViewToCart = function (productId) {
    addToCart(productId, quickViewQuantity);
    quickViewQuantity = 1;
    closeQuickView();
    openCart();
  };

  function closeQuickView() {
    quickViewModal.classList.remove('open');
    quickViewModal.setAttribute('aria-hidden', 'true');
    quickViewQuantity = 1;
  }

  // ==========================================
  // SHOPPING CART MANAGEMENT
  // ==========================================
  window.addToCart = function (productId, quantity = 1) {
    const product = productsList.find((p) => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex((item) => item.id === productId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        designName: product.designName,
        pages: product.pages,
        price: product.price,
        coverColor: product.coverColor,
        patternType: product.patternType,
        customImageUrl: product.customImageUrl,
        quantity: quantity
      });
    }

    saveCartToStorage();
    updateCartUI();
    showToast(`Added "${product.designName}" (${product.pages} pages) to bag!`);
  };

  window.updateCartQty = function (productId, delta) {
    const itemIndex = cart.findIndex((item) => item.id === productId);
    if (itemIndex === -1) return;

    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
      showToast('Item removed from bag');
    }

    saveCartToStorage();
    updateCartUI();
  };

  window.removeFromCart = function (productId) {
    cart = cart.filter((item) => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
    showToast('Item removed from bag');
  };

  function updateCartUI() {
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const threshold = siteConfig.freeShippingThreshold || 799;

    // Badge
    cartCountBadge.textContent = totalCount;
    cartSubtotal.textContent = `₹${subtotal}`;

    // Free shipping tracker
    if (subtotal >= threshold) {
      shippingNotice.innerHTML = `🎉 You have unlocked <strong>FREE Local Doorstep Delivery!</strong>`;
      shippingNotice.style.background = '#E7F9EE';
      shippingNotice.style.color = '#1EBE5D';
    } else {
      const remaining = threshold - subtotal;
      shippingNotice.innerHTML = `Add <strong>₹${remaining}</strong> more to unlock <strong>FREE Local Delivery</strong>!`;
      shippingNotice.style.background = 'var(--color-secondary-light)';
      shippingNotice.style.color = 'var(--color-secondary)';
    }

    // Render Items
    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-msg">
          <div style="font-size: 3rem; margin-bottom: 10px;">📚</div>
          <h4>Your bag is currently empty</h4>
          <p>Choose from our handcrafted notebooks and journals to start writing.</p>
        </div>
      `;
    } else {
      cartItemsList.innerHTML = cart
        .map((item) => {
          return `
          <div class="cart-item">
            <div class="cart-item-thumb">
              ${item.customImageUrl 
                ? `<img src="${item.customImageUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" alt="thumb">`
                : `<div style="width: 44px; height: 60px; background: ${item.coverColor || '#C86446'}; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; color: #FFF; font-size: 0.65rem; font-weight: 700; text-align: center; padding: 2px;">
                    ${item.pages}p
                  </div>`
              }
            </div>

            <div class="cart-item-info">
              <div class="cart-item-title">${escapeHtml(item.title)}</div>
              <div class="cart-item-design">Design: ${escapeHtml(item.designName)}</div>
              <div class="cart-item-pages">${item.pages} Pages</div>

              <div class="cart-item-row-controls">
                <div class="qty-counter" style="padding: 2px;">
                  <button class="qty-btn" style="width: 24px; height: 24px; font-size: 0.9rem;" onclick="updateCartQty('${item.id}', -1)">-</button>
                  <span class="qty-value" style="padding: 0 10px; font-size: 0.85rem;">${item.quantity}</span>
                  <button class="qty-btn" style="width: 24px; height: 24px; font-size: 0.9rem;" onclick="updateCartQty('${item.id}', 1)">+</button>
                </div>

                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="cart-item-price">₹${item.price * item.quantity}</span>
                  <button class="cart-item-remove-btn" onclick="removeFromCart('${item.id}')" title="Remove">✕</button>
                </div>
              </div>
            </div>
          </div>
        `;
        })
        .join('');
    }
  }

  function openCart() {
    cartBackdrop.classList.add('open');
    cartBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeCart() {
    cartBackdrop.classList.remove('open');
    cartBackdrop.setAttribute('aria-hidden', 'true');
  }

  // ==========================================
  // WHATSAPP ORDER GENERATOR (Direct Local Order)
  // ==========================================
  function triggerWhatsAppOrder(extraDetails = null) {
    if (cart.length === 0) return;

    const threshold = siteConfig.freeShippingThreshold || 799;
    const shippingFee = siteConfig.shippingCharge || 50;
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal >= threshold ? 'FREE (Local Delivery)' : `₹${shippingFee}`;
    const grandTotal = subtotal >= threshold ? subtotal : subtotal + shippingFee;
    const storeBrand = siteConfig.brandName || 'PEBBLE';
    const waNumber = siteConfig.whatsappNumber || '919876543210';

    let message = `*NEW ORDER - ${storeBrand.toUpperCase()} BOOKS* 📚✨\n`;
    message += `Hello ${storeBrand}! I would like to place an order from your website.\n\n`;
    message += `*ORDER DETAILS:*\n`;
    message += `------------------------------------\n`;

    cart.forEach((item, idx) => {
      message += `${idx + 1}. *${item.title}*\n`;
      message += `   • *Design:* ${item.designName}\n`;
      message += `   • *Pages:* ${item.pages} Pages\n`;
      message += `   • *Qty:* ${item.quantity} × ₹${item.price} = ₹${item.quantity * item.price}\n\n`;
    });

    message += `------------------------------------\n`;
    message += `*Subtotal:* ₹${subtotal}\n`;
    message += `*Delivery:* ${shipping}\n`;
    message += `*Estimated Total:* ₹${grandTotal}\n`;

    if (extraDetails && extraDetails.name) {
      message += `\n*CUSTOMER DETAILS:*\n`;
      message += `• *Name:* ${extraDetails.name}\n`;
      if (extraDetails.phone) message += `• *Phone:* ${extraDetails.phone}\n`;
      if (extraDetails.address) message += `• *Address:* ${extraDetails.address}\n`;
      if (extraDetails.payMethod) message += `• *Payment Preference:* ${extraDetails.payMethod}\n`;
      if (extraDetails.notes) message += `• *Special Notes:* ${extraDetails.notes}\n`;
    }

    message += `\nPlease confirm availability and dispatch time. Thank you!`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${waNumber}?text=${encoded}`;

    window.open(waUrl, '_blank');
  }

  // ==========================================
  // DIRECT CHECKOUT MODAL & ORDER PROCESS
  // ==========================================
  function openCheckoutModal() {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    checkoutMiniSummary.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 8px; color: var(--color-text-main);">
        Order Summary (${cart.reduce((a, b) => a + b.quantity, 0)} items):
      </div>
      ${cart
        .map(
          (i) => `
        <div class="item-line">
          <span>${i.quantity}× <strong>${escapeHtml(i.designName)}</strong> (${i.pages} pages)</span>
          <span>₹${i.price * i.quantity}</span>
        </div>
      `
        )
        .join('')}
      <div class="item-line" style="border-top: 1px dashed var(--color-border); margin-top: 8px; padding-top: 8px; font-weight: 700;">
        <span>Total Payable:</span>
        <span style="color: var(--color-primary); font-size: 1.1rem;">₹${subtotal}</span>
      </div>
    `;

    checkoutModal.classList.add('open');
    checkoutModal.setAttribute('aria-hidden', 'false');
  }

  function closeCheckoutModal() {
    checkoutModal.classList.remove('open');
    checkoutModal.setAttribute('aria-hidden', 'true');
  }

  function processDirectOrder(details) {
    const orderId = 'PEB-' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    orderReceiptDetails.innerHTML = `
      <div style="margin-bottom: 6px;"><strong>Order ID:</strong> ${orderId}</div>
      <div style="margin-bottom: 6px;"><strong>Customer:</strong> ${escapeHtml(details.name)} (${escapeHtml(details.phone)})</div>
      <div style="margin-bottom: 6px;"><strong>Delivery To:</strong> ${escapeHtml(details.address)}</div>
      <div style="margin-bottom: 6px;"><strong>Payment Method:</strong> ${escapeHtml(details.payMethod)}</div>
      <div style="margin-bottom: 6px;"><strong>Items:</strong> ${cart.map((c) => `${c.quantity}x ${c.designName} (${c.pages}p)`).join(', ')}</div>
      <div style="margin-top: 8px; font-size: 1.05rem; font-weight: 700; color: var(--color-primary);">Total Amount: ₹${subtotal}</div>
    `;

    closeCheckoutModal();

    // Clear Cart
    cart = [];
    saveCartToStorage();
    updateCartUI();

    // Open Success Modal
    successModal.classList.add('open');
    successModal.setAttribute('aria-hidden', 'false');
    showToast('🎉 Order placed successfully!');
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'all 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Utility to prevent XSS
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
