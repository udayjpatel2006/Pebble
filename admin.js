// ==========================================================================
// PEBBLE STORE ADMIN PANEL - CLIENT LOGIC, CMS & SECURITY AUTH
// ==========================================================================

(function () {
  'use strict';

  // Security Constants
  const PASSWORD_SALT = 'pebble_security_salt_2026';
  const DEFAULT_PASSWORD = 'pebble@2026';

  // State
  let siteConfig = {};
  let productsList = [];
  let productSearchTerm = '';
  let productCategoryFilter = 'all';

  // Security & Authentication Elements
  const adminLoginGate = document.getElementById('adminLoginGate');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminPasswordInput = document.getElementById('adminPasswordInput');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const adminLoginBtn = document.getElementById('adminLoginBtn');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');

  const changePasswordForm = document.getElementById('changePasswordForm');
  const currentPasswordInput = document.getElementById('currentPasswordInput');
  const newPasswordInput = document.getElementById('newPasswordInput');
  const confirmNewPasswordInput = document.getElementById('confirmNewPasswordInput');

  // Security: OTP Password Recovery Elements
  const showForgotPwdBtn = document.getElementById('showForgotPwdBtn');
  const adminOtpResetView = document.getElementById('adminOtpResetView');
  const otpStep1 = document.getElementById('otpStep1');
  const otpStep2 = document.getElementById('otpStep2');
  const sendOtpBtn = document.getElementById('sendOtpBtn');
  const cancelOtpStep1Btn = document.getElementById('cancelOtpStep1Btn');
  const cancelOtpStep2Btn = document.getElementById('cancelOtpStep2Btn');
  const otpStep1Msg = document.getElementById('otpStep1Msg');
  const otpStep1Success = document.getElementById('otpStep1Success');
  const otpVerifyForm = document.getElementById('otpVerifyForm');
  const otpCodeInput = document.getElementById('otpCodeInput');
  const otpNewPasswordInput = document.getElementById('otpNewPasswordInput');
  const otpConfirmPasswordInput = document.getElementById('otpConfirmPasswordInput');
  const otpStep2Msg = document.getElementById('otpStep2Msg');
  const otpStep2Success = document.getElementById('otpStep2Success');
  const verifyOtpSubmitBtn = document.getElementById('verifyOtpSubmitBtn');
  const otpCountdownText = document.getElementById('otpCountdownText');
  const otpTimerCount = document.getElementById('otpTimerCount');
  const resendOtpBtn = document.getElementById('resendOtpBtn');

  const RECOVERY_EMAIL = 'pebbleee17@gmail.com';
  let generatedOtpCode = null;
  let otpExpiresAt = 0;
  let otpCountdownTimer = null;

  // DOM Elements - Navigation & Topbar
  const navTabBtns = document.querySelectorAll('.nav-tab-btn');
  const tabPanes = document.querySelectorAll('.admin-tab-pane');
  const saveTopBtn = document.getElementById('saveTopBtn');
  const productCountBadge = document.getElementById('productCountBadge');

  // DOM Elements - Logo & Brand
  const logoPreviewImg = document.getElementById('logoPreviewImg');
  const logoFileInput = document.getElementById('logoFileInput');
  const logoUrlInput = document.getElementById('logoUrlInput');
  const resetLogoBtn = document.getElementById('resetLogoBtn');
  const brandNameInput = document.getElementById('brandNameInput');
  const brandTaglineInput = document.getElementById('brandTaglineInput');

  // DOM Elements - Texts
  const annBadgeInput = document.getElementById('annBadgeInput');
  const annTextInput = document.getElementById('annTextInput');
  const heroTagInput = document.getElementById('heroTagInput');
  const heroTitlePrefixInput = document.getElementById('heroTitlePrefixInput');
  const heroTitleHighlightInput = document.getElementById('heroTitleHighlightInput');
  const heroDescInput = document.getElementById('heroDescInput');
  const heroPrimaryBtnInput = document.getElementById('heroPrimaryBtnInput');
  const heroSecondaryBtnInput = document.getElementById('heroSecondaryBtnInput');
  const heroImgPreview = document.getElementById('heroImgPreview');
  const heroImageFileInput = document.getElementById('heroImageFileInput');
  const heroImageUrlInput = document.getElementById('heroImageUrlInput');
  const clearHeroImgBtn = document.getElementById('clearHeroImgBtn');

  const trust1Title = document.getElementById('trust1Title');
  const trust1Desc = document.getElementById('trust1Desc');
  const trust2Title = document.getElementById('trust2Title');
  const trust2Desc = document.getElementById('trust2Desc');
  const trust3Title = document.getElementById('trust3Title');
  const trust3Desc = document.getElementById('trust3Desc');
  const trust4Title = document.getElementById('trust4Title');
  const trust4Desc = document.getElementById('trust4Desc');

  const catalogTagInput = document.getElementById('catalogTagInput');
  const catalogTitleInput = document.getElementById('catalogTitleInput');
  const catalogSubtitleInput = document.getElementById('catalogSubtitleInput');

  const studioDescInput = document.getElementById('studioDescInput');
  const studioAddressInput = document.getElementById('studioAddressInput');
  const studioHoursInput = document.getElementById('studioHoursInput');
  const footerCopyInput = document.getElementById('footerCopyInput');

  // DOM Elements - Contacts & Redirects
  const gmailAddressInput = document.getElementById('gmailAddressInput');
  const gmailSubjectInput = document.getElementById('gmailSubjectInput');
  const instaHandleInput = document.getElementById('instaHandleInput');
  const instaUrlInput = document.getElementById('instaUrlInput');
  const waNumberInput = document.getElementById('waNumberInput');
  const waNavRedirectInput = document.getElementById('waNavRedirectInput');
  const waFooterRedirectInput = document.getElementById('waFooterRedirectInput');

  // DOM Elements - Settings
  const freeShippingThresholdInput = document.getElementById('freeShippingThresholdInput');
  const shippingChargeInput = document.getElementById('shippingChargeInput');
  const exportBackupBtn = document.getElementById('exportBackupBtn');
  const importBackupInput = document.getElementById('importBackupInput');
  const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');

  // DOM Elements - Products
  const adminProductsTableBody = document.getElementById('adminProductsTableBody');
  const adminProductSearch = document.getElementById('adminProductSearch');
  const adminCategoryFilter = document.getElementById('adminCategoryFilter');
  const addNewBookBtn = document.getElementById('addNewBookBtn');

  // DOM Elements - Product Modal
  const productEditModal = document.getElementById('productEditModal');
  const productModalTitle = document.getElementById('productModalTitle');
  const productEditForm = document.getElementById('productEditForm');
  const closeProductModalBtn = document.getElementById('closeProductModalBtn');
  const cancelProductBtn = document.getElementById('cancelProductBtn');

  const editProductId = document.getElementById('editProductId');
  const editTitle = document.getElementById('editTitle');
  const editDesignName = document.getElementById('editDesignName');
  const editCategory = document.getElementById('editCategory');
  const editPages = document.getElementById('editPages');
  const editPrice = document.getElementById('editPrice');
  const editOriginalPrice = document.getElementById('editOriginalPrice');
  const editPaperGsm = document.getElementById('editPaperGsm');
  const editRuling = document.getElementById('editRuling');
  const editDimensions = document.getElementById('editDimensions');
  const editCoverType = document.getElementById('editCoverType');
  const editBinding = document.getElementById('editBinding');
  const coverDesignPreviewImg = document.getElementById('coverDesignPreviewImg');
  const editCustomImageFile = document.getElementById('editCustomImageFile');
  const editCustomImageUrl = document.getElementById('editCustomImageUrl');
  const clearCoverImgBtn = document.getElementById('clearCoverImgBtn');
  const backDesignPreviewImg = document.getElementById('backDesignPreviewImg');
  const editBackImageFile = document.getElementById('editBackImageFile');
  const editBackImageUrl = document.getElementById('editBackImageUrl');
  const clearBackImgBtn = document.getElementById('clearBackImgBtn');
  const editDescription = document.getElementById('editDescription');
  const editInStock = document.getElementById('editInStock');
  const editBestseller = document.getElementById('editBestseller');

  const adminToastContainer = document.getElementById('adminToastContainer');

  // ==========================================================================
  // CRYPTOGRAPHIC PASSWORD & SECURITY FUNCTIONS
  // ==========================================================================

  async function hashPassword(plainText) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText + PASSWORD_SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  async function getStoredPasswordHash() {
    // 1. Try Firestore
    if (typeof isFirebaseConfigured !== 'undefined' && isFirebaseConfigured && firestoreDb) {
      try {
        const secDoc = await firestoreDb.collection('settings').doc('security').get();
        if (secDoc.exists && secDoc.data().adminPasswordHash) {
          return secDoc.data().adminPasswordHash;
        }
      } catch (err) {
        console.warn('[Pebble Security] Firestore security read notice:', err.message);
      }
    }

    // 2. Try LocalStorage
    const localHash = localStorage.getItem('pebble_admin_pwd_hash');
    if (localHash) return localHash;

    // 3. Fallback to default hash
    const defaultHash = await hashPassword(DEFAULT_PASSWORD);
    localStorage.setItem('pebble_admin_pwd_hash', defaultHash);
    return defaultHash;
  }

  async function setStoredPasswordHash(newHash) {
    localStorage.setItem('pebble_admin_pwd_hash', newHash);

    // Save to Firestore if available
    if (typeof isFirebaseConfigured !== 'undefined' && isFirebaseConfigured && firestoreDb) {
      try {
        await firestoreDb.collection('settings').doc('security').set(
          {
            adminPasswordHash: newHash,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('[Pebble Security] Error saving password to Firestore:', err.message);
      }
    }
  }

  // ==========================================================================
  // IMAGE OPTIMIZATION & RELIABLE SERVER UPLOAD
  // ==========================================================================
  async function processAndUploadImage(file, folder = 'covers') {
    return new Promise((resolve, reject) => {
      // SVGs don't need raster canvas resizing
      if (file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const url = await uploadToServerOrFallback(e.target.result, file.name, folder);
            resolve(url);
          } catch (err) {
            resolve(e.target.result);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      // Resize and compress large images using HTML5 Canvas
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = async () => {
          try {
            const maxDim = 1200;
            let { width, height } = img;

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const isPng = file.type === 'image/png';
            const mimeType = isPng ? 'image/png' : 'image/jpeg';
            const quality = isPng ? undefined : 0.88;
            const dataUri = canvas.toDataURL(mimeType, quality);

            const url = await uploadToServerOrFallback(dataUri, file.name, folder);
            resolve(url);
          } catch (canvasErr) {
            console.warn('Canvas optimization error, falling back to direct upload:', canvasErr);
            const fallbackUrl = await uploadToServerOrFallback(e.target.result, file.name, folder);
            resolve(fallbackUrl);
          }
        };
        img.onerror = () => reject(new Error('Invalid image file format'));
        img.src = e.target.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function uploadToServerOrFallback(dataUri, originalName, folder) {
    // 1. Try local server first if available
    try {
      const resp = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: dataUri,
          filename: originalName,
          folder: folder
        })
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json.success && json.url) {
          return json.url;
        }
      }
    } catch (err) {
      console.warn('Local upload endpoint notice:', err.message);
    }

    // 2. Try Firebase Storage if configured
    if (typeof firebaseStorage !== 'undefined' && firebaseStorage && typeof isFirebaseConfigured !== 'undefined' && isFirebaseConfigured) {
      try {
        const fileName = `${Date.now()}_${originalName.replace(/[^a-zA-Z0-9._-]/g, '')}`;
        const storageRef = firebaseStorage.ref().child(`${folder}/${fileName}`);
        const byteString = atob(dataUri.split(',')[1]);
        const mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const snapshot = await storageRef.put(blob);
        const downloadUrl = await snapshot.ref.getDownloadURL();
        console.log('[Pebble Firebase Storage] Uploaded:', downloadUrl);
        return downloadUrl;
      } catch (fbErr) {
        console.warn('Firebase Storage notice:', fbErr.message);
      }
    }

    return dataUri;
  }

  // ==========================================================================
  // AUTHENTICATION & LOGIN GATE CONTROLLER
  // ==========================================================================
  let failedLoginAttempts = Number(sessionStorage.getItem('pebble_failed_attempts') || 0);
  let lockoutUntil = Number(sessionStorage.getItem('pebble_lockout_until') || 0);

  function checkAuthentication() {
    const isAuth = sessionStorage.getItem('pebble_admin_auth') === 'true';
    if (isAuth) {
      adminLoginGate.classList.add('hidden');
    } else {
      adminLoginGate.classList.remove('hidden');
      setTimeout(() => {
        if (adminPasswordInput) adminPasswordInput.focus();
      }, 200);
    }
  }

  function handleLoginError(message) {
    loginErrorMsg.textContent = message;
    loginErrorMsg.style.display = 'block';

    const card = document.querySelector('.login-gate-card');
    if (card) {
      card.classList.remove('shake');
      void card.offsetWidth; // Trigger reflow
      card.classList.add('shake');
    }
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  async function init() {
    checkAuthentication();
    await loadData();
    populateFormValues();
    renderProductsTable();
    setupEventListeners();
    updateFirebaseStatusUI();
  }

  async function loadData() {
    // 1. Instant local render first (zero latency)
    siteConfig = getSiteConfig();
    productsList = getProducts();
    if (!Array.isArray(productsList) || productsList.length === 0) {
      productsList = (typeof DEFAULT_PRODUCTS !== 'undefined' && Array.isArray(DEFAULT_PRODUCTS))
        ? [...DEFAULT_PRODUCTS]
        : [];
      saveProducts(productsList);
    }

    // 2. Resilient cloud sync with timeout guard
    if (typeof getCloudSiteConfig === 'function' && typeof getCloudProducts === 'function') {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Cloud sync timeout')), 2500)
        );

        const [cloudConfig, cloudProds] = await Promise.race([
          Promise.all([getCloudSiteConfig(), getCloudProducts()]),
          timeoutPromise
        ]);

        let hasChange = false;
        if (cloudConfig && typeof cloudConfig === 'object' && Object.keys(cloudConfig).length > 0) {
          siteConfig = cloudConfig;
          saveSiteConfig(cloudConfig);
          populateFormValues();
          hasChange = true;
        }

        if (Array.isArray(cloudProds) && cloudProds.length > 0) {
          const currentLocal = Array.isArray(productsList) ? productsList : [];
          const defProds = (typeof DEFAULT_PRODUCTS !== 'undefined' && Array.isArray(DEFAULT_PRODUCTS)) ? DEFAULT_PRODUCTS : [];

          const merged = cloudProds.map((cp) => {
            const local = currentLocal.find((p) => p.id === cp.id) || {};
            const def = defProds.find((d) => d.id === cp.id) || {};
            return {
              ...def,
              ...local,
              ...cp,
              customBackImageUrl: (cp.customBackImageUrl && cp.customBackImageUrl.trim())
                || (local.customBackImageUrl && local.customBackImageUrl.trim())
                || (def.customBackImageUrl && def.customBackImageUrl.trim())
                || '',
              customImageUrl: (cp.customImageUrl && cp.customImageUrl.trim())
                || (local.customImageUrl && local.customImageUrl.trim())
                || (def.customImageUrl && def.customImageUrl.trim())
                || ''
            };
          });

          currentLocal.forEach((lp) => {
            if (!merged.some((m) => m.id === lp.id)) {
              merged.push(lp);
            }
          });

          productsList = merged;
          saveProducts(productsList);
          renderProductsTable();
          hasChange = true;
        }
      } catch (err) {
        console.warn('[Pebble Admin] Cloud sync notice:', err.message);
      }
    }
  }

  function updateFirebaseStatusUI() {
    const statusElem = document.getElementById('firebaseStatusIndicator');
    if (statusElem) {
      if (typeof isFirebaseConfigured !== 'undefined' && isFirebaseConfigured) {
        statusElem.innerHTML = '🟢 Firebase Cloud: pebble-bb7ce';
        statusElem.style.color = '#1EBE5D';
      } else {
        statusElem.innerHTML = '🟡 Local Mode (Firebase Ready)';
        statusElem.style.color = '#D99B26';
      }
    }
  }

  function populateFormValues() {
    // Brand & Logo
    brandNameInput.value = siteConfig.brandName || 'Pebble';
    brandTaglineInput.value = siteConfig.brandTagline || 'Books & Papercraft';
    logoUrlInput.value = siteConfig.logoUrl || 'assets/pebble-logo.svg';
    logoPreviewImg.src = siteConfig.logoUrl || 'assets/pebble-logo.svg';

    // Announcement
    annBadgeInput.value = siteConfig.announcementBadge || 'Local Craft';
    annTextInput.value = siteConfig.announcementText || '';

    // Hero
    heroTagInput.value = siteConfig.heroTag || '';
    heroTitlePrefixInput.value = siteConfig.heroTitlePrefix || '';
    heroTitleHighlightInput.value = siteConfig.heroTitleHighlight || '';
    heroDescInput.value = siteConfig.heroDescription || '';
    heroPrimaryBtnInput.value = siteConfig.heroPrimaryBtnText || 'Explore Collection';
    heroSecondaryBtnInput.value = siteConfig.heroSecondaryBtnText || 'Visit Our Studio / Contact';
    if (heroImageUrlInput) heroImageUrlInput.value = siteConfig.heroImageUrl || '';
    if (heroImgPreview) heroImgPreview.src = siteConfig.heroImageUrl || 'assets/pebble-logo.svg';

    // Trust (4 points)
    const t = siteConfig.trustItems || DEFAULT_SITE_CONFIG.trustItems;
    trust1Title.value = t[0]?.title || '';
    trust1Desc.value = t[0]?.desc || '';
    trust2Title.value = t[1]?.title || '';
    trust2Desc.value = t[1]?.desc || '';
    trust3Title.value = t[2]?.title || '';
    trust3Desc.value = t[2]?.desc || '';
    trust4Title.value = t[3]?.title || '';
    trust4Desc.value = t[3]?.desc || '';

    // Catalog texts
    catalogTagInput.value = siteConfig.catalogTag || 'Curated Collection';
    catalogTitleInput.value = siteConfig.catalogTitle || 'Explore Our Handcrafted Books';
    catalogSubtitleInput.value = siteConfig.catalogSubtitle || '';

    // Studio & Footer
    studioDescInput.value = siteConfig.studioDescription || '';
    studioAddressInput.value = siteConfig.studioAddress || '';
    studioHoursInput.value = siteConfig.studioHours || '';
    footerCopyInput.value = siteConfig.footerCopyrightNotice || '';

    // Contacts
    gmailAddressInput.value = siteConfig.gmailAddress || '';
    gmailSubjectInput.value = siteConfig.gmailSubject || '';
    instaHandleInput.value = siteConfig.instagramHandle || '';
    instaUrlInput.value = siteConfig.instagramUrl || '';
    waNumberInput.value = siteConfig.whatsappNumber || '';
    waNavRedirectInput.value = siteConfig.whatsappNavRedirectText || '';
    waFooterRedirectInput.value = siteConfig.whatsappFooterRedirectText || '';

    // Settings
    freeShippingThresholdInput.value = siteConfig.freeShippingThreshold || 799;
    shippingChargeInput.value = siteConfig.shippingCharge || 50;
  }

  // ==========================================================================
  // EVENT LISTENERS
  // ==========================================================================
  function setupEventListeners() {
    // -------------------------------------------------------------
    // Security: Login Form Submission
    // -------------------------------------------------------------
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Check lockout timer
      if (lockoutUntil && Date.now() < lockoutUntil) {
        const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
        handleLoginError(`Too many failed attempts. Locked for ${remaining}s.`);
        return;
      }

      const enteredPassword = adminPasswordInput.value;
      if (!enteredPassword) return;

      adminLoginBtn.disabled = true;
      adminLoginBtn.textContent = 'Verifying...';

      const enteredHash = await hashPassword(enteredPassword);
      const storedHash = await getStoredPasswordHash();

      adminLoginBtn.disabled = false;
      adminLoginBtn.textContent = 'Unlock Admin Panel';

      if (enteredHash === storedHash) {
        // Successful login
        sessionStorage.setItem('pebble_admin_auth', 'true');
        sessionStorage.removeItem('pebble_failed_attempts');
        sessionStorage.removeItem('pebble_lockout_until');
        failedLoginAttempts = 0;
        lockoutUntil = 0;
        loginErrorMsg.style.display = 'none';
        adminPasswordInput.value = '';
        adminLoginGate.classList.add('hidden');
        showToast('🔓 Admin Panel unlocked!');
      } else {
        // Failed attempt
        failedLoginAttempts += 1;
        sessionStorage.setItem('pebble_failed_attempts', failedLoginAttempts);

        if (failedLoginAttempts >= 5) {
          lockoutUntil = Date.now() + 30000; // 30 second lockout
          sessionStorage.setItem('pebble_lockout_until', lockoutUntil);
          handleLoginError('Too many failed attempts. Access locked for 30 seconds.');
        } else {
          const left = 5 - failedLoginAttempts;
          handleLoginError(`Incorrect password. ${left} attempt${left === 1 ? '' : 's'} remaining.`);
        }
      }
    });

    // Toggle Password Visibility
    togglePasswordBtn.addEventListener('click', () => {
      if (adminPasswordInput.type === 'password') {
        adminPasswordInput.type = 'text';
        togglePasswordBtn.textContent = '🙈';
      } else {
        adminPasswordInput.type = 'password';
        togglePasswordBtn.textContent = '👁️';
      }
    });

    // Admin Logout
    adminLogoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('pebble_admin_auth');
      adminPasswordInput.value = '';
      checkAuthentication();
      showToast('🔒 Logged out of Admin Panel.');
    });

    // -------------------------------------------------------------
    // Security: Forgot Password & Email OTP Recovery (pebbleee17@gmail.com)
    // -------------------------------------------------------------
    if (showForgotPwdBtn) {
      showForgotPwdBtn.addEventListener('click', () => {
        adminLoginForm.style.display = 'none';
        adminOtpResetView.style.display = 'block';
        otpStep1.style.display = 'block';
        otpStep2.style.display = 'none';
        if (otpStep1Msg) otpStep1Msg.style.display = 'none';
        if (otpStep1Success) otpStep1Success.style.display = 'none';
      });
    }

    function returnToLoginForm() {
      if (otpCountdownTimer) clearInterval(otpCountdownTimer);
      adminOtpResetView.style.display = 'none';
      adminLoginForm.style.display = 'block';
      loginErrorMsg.style.display = 'none';
      setTimeout(() => {
        if (adminPasswordInput) adminPasswordInput.focus();
      }, 100);
    }

    if (cancelOtpStep1Btn) cancelOtpStep1Btn.addEventListener('click', returnToLoginForm);
    if (cancelOtpStep2Btn) cancelOtpStep2Btn.addEventListener('click', returnToLoginForm);

    async function handleSendOtp() {
      sendOtpBtn.disabled = true;
      sendOtpBtn.textContent = 'Generating & Sending Code...';
      if (otpStep1Msg) otpStep1Msg.style.display = 'none';

      // Generate random 6-digit numeric OTP
      generatedOtpCode = String(Math.floor(100000 + Math.random() * 900000));
      otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

      try {
        const response = await fetch('/api/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: RECOVERY_EMAIL,
            otp: generatedOtpCode
          })
        });

        const data = await response.json();

        // Transition to Step 2
        otpStep1.style.display = 'none';
        otpStep2.style.display = 'block';
        if (otpStep2Msg) otpStep2Msg.style.display = 'none';
        if (otpStep2Success) {
          otpStep2Success.textContent = `Verification code sent to ${RECOVERY_EMAIL}!`;
          otpStep2Success.style.display = 'flex';
        }

        if (otpCodeInput) {
          otpCodeInput.value = '';
          otpCodeInput.focus();
        }
        if (otpNewPasswordInput) otpNewPasswordInput.value = '';
        if (otpConfirmPasswordInput) otpConfirmPasswordInput.value = '';

        startOtpResendTimer();
        showToast(`✉️ OTP sent to ${RECOVERY_EMAIL}`);
      } catch (err) {
        console.warn('Network error reaching /api/send-otp, using local OTP session:', err);
        otpStep1.style.display = 'none';
        otpStep2.style.display = 'block';
        startOtpResendTimer();
      } finally {
        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent = '📨 Send 6-Digit OTP Code';
      }
    }

    if (sendOtpBtn) sendOtpBtn.addEventListener('click', handleSendOtp);
    if (resendOtpBtn) resendOtpBtn.addEventListener('click', handleSendOtp);

    function startOtpResendTimer() {
      let secondsLeft = 60;
      if (otpCountdownText) otpCountdownText.style.display = 'inline';
      if (resendOtpBtn) resendOtpBtn.style.display = 'none';
      if (otpTimerCount) otpTimerCount.textContent = secondsLeft;

      if (otpCountdownTimer) clearInterval(otpCountdownTimer);
      otpCountdownTimer = setInterval(() => {
        secondsLeft -= 1;
        if (otpTimerCount) otpTimerCount.textContent = secondsLeft;

        if (secondsLeft <= 0) {
          clearInterval(otpCountdownTimer);
          if (otpCountdownText) otpCountdownText.style.display = 'none';
          if (resendOtpBtn) resendOtpBtn.style.display = 'inline-block';
        }
      }, 1000);
    }

    // Verify OTP & Change Password Form Submission
    if (otpVerifyForm) {
      otpVerifyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const enteredCode = (otpCodeInput ? otpCodeInput.value : '').trim();
        const newPwd = (otpNewPasswordInput ? otpNewPasswordInput.value : '').trim();
        const confirmPwd = (otpConfirmPasswordInput ? otpConfirmPasswordInput.value : '').trim();

        if (otpStep2Msg) otpStep2Msg.style.display = 'none';

        // 1. Verify code matches
        if (!generatedOtpCode || enteredCode !== generatedOtpCode) {
          if (otpStep2Msg) {
            otpStep2Msg.textContent = 'Invalid OTP code. Please enter the correct 6-digit code.';
            otpStep2Msg.style.display = 'flex';
          }
          if (otpCodeInput) otpCodeInput.focus();
          return;
        }

        // 2. Check 10-minute expiry
        if (Date.now() > otpExpiresAt) {
          if (otpStep2Msg) {
            otpStep2Msg.textContent = 'The OTP code has expired (10 min limit). Please request a new code.';
            otpStep2Msg.style.display = 'flex';
          }
          return;
        }

        // 3. Check password length
        if (newPwd.length < 6) {
          if (otpStep2Msg) {
            otpStep2Msg.textContent = 'New password must be at least 6 characters long.';
            otpStep2Msg.style.display = 'flex';
          }
          if (otpNewPasswordInput) otpNewPasswordInput.focus();
          return;
        }

        // 4. Confirm match
        if (newPwd !== confirmPwd) {
          if (otpStep2Msg) {
            otpStep2Msg.textContent = 'New password and confirmation do not match.';
            otpStep2Msg.style.display = 'flex';
          }
          if (otpConfirmPasswordInput) otpConfirmPasswordInput.focus();
          return;
        }

        verifyOtpSubmitBtn.disabled = true;
        verifyOtpSubmitBtn.textContent = 'Updating Password...';

        try {
          // Compute new SHA-256 hash and store
          const newHash = await hashPassword(newPwd);
          await setStoredPasswordHash(newHash);

          // Clear lockout and authenticate admin
          sessionStorage.setItem('pebble_admin_auth', 'true');
          sessionStorage.removeItem('pebble_failed_attempts');
          sessionStorage.removeItem('pebble_lockout_until');
          failedLoginAttempts = 0;
          lockoutUntil = 0;
          generatedOtpCode = null;

          if (otpCountdownTimer) clearInterval(otpCountdownTimer);

          if (otpStep2Success) {
            otpStep2Success.textContent = '✅ Password changed successfully! Unlocking admin panel...';
            otpStep2Success.style.display = 'flex';
          }

          setTimeout(() => {
            adminOtpResetView.style.display = 'none';
            adminLoginForm.style.display = 'block';
            adminLoginGate.classList.add('hidden');
            showToast('🎉 Password reset verified! Welcome back to Admin Panel.');
          }, 800);
        } catch (err) {
          console.error('Password reset save error:', err);
          if (otpStep2Msg) {
            otpStep2Msg.textContent = 'Error saving new password. Please try again.';
            otpStep2Msg.style.display = 'flex';
          }
        } finally {
          verifyOtpSubmitBtn.disabled = false;
          verifyOtpSubmitBtn.textContent = '✅ Verify OTP & Save New Password';
        }
      });
    }

    // -------------------------------------------------------------
    // Security: Change Password Form Submission
    // -------------------------------------------------------------
    if (changePasswordForm) {
      changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPwd = currentPasswordInput.value;
        const newPwd = newPasswordInput.value;
        const confirmPwd = confirmNewPasswordInput.value;

        // 1. Verify current password
        const currentHash = await hashPassword(currentPwd);
        const storedHash = await getStoredPasswordHash();

        if (currentHash !== storedHash) {
          alert('Current password does not match. Please enter your existing password.');
          currentPasswordInput.focus();
          return;
        }

        // 2. Validate new password length
        if (newPwd.length < 6) {
          alert('New password must be at least 6 characters long.');
          newPasswordInput.focus();
          return;
        }

        // 3. Confirm match
        if (newPwd !== confirmPwd) {
          alert('New password and confirmation do not match.');
          confirmNewPasswordInput.focus();
          return;
        }

        // 4. Save new password hash
        const newHash = await hashPassword(newPwd);
        await setStoredPasswordHash(newHash);

        changePasswordForm.reset();
        showToast('✅ Admin password updated successfully! Please keep it secure.');
      });
    }

    // -------------------------------------------------------------
    // Tab Navigation
    // -------------------------------------------------------------
    navTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        navTabBtns.forEach((b) => b.classList.remove('active'));
        tabPanes.forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        const targetPane = document.getElementById(tabId);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    // Save Top Button
    saveTopBtn.addEventListener('click', saveAllSiteConfig);

    // Logo Upload File Handler (Optimized + Auto-Save)
    logoFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        showToast('Uploading & optimizing logo...');
        const uploadedUrl = await processAndUploadImage(file, 'logos');
        logoUrlInput.value = uploadedUrl;
        logoPreviewImg.src = uploadedUrl;

        // Auto-save immediately so the logo change is never lost
        siteConfig.logoUrl = uploadedUrl;
        saveSiteConfig(siteConfig);
        if (typeof saveCloudSiteConfig === 'function') {
          saveCloudSiteConfig(siteConfig);
        }
        showToast('✅ Logo updated & saved automatically!');
      } catch (err) {
        showToast('Logo upload error: ' + err.message);
      }
    });

    // Logo URL input change
    logoUrlInput.addEventListener('input', (e) => {
      const val = e.target.value.trim() || 'assets/pebble-logo.svg';
      logoPreviewImg.src = val;
      siteConfig.logoUrl = val;
      saveSiteConfig(siteConfig);
      if (typeof saveCloudSiteConfig === 'function') {
        saveCloudSiteConfig(siteConfig);
      }
    });

    // Reset Logo
    resetLogoBtn.addEventListener('click', () => {
      const def = 'assets/pebble-logo.svg';
      logoUrlInput.value = def;
      logoPreviewImg.src = def;
      siteConfig.logoUrl = def;
      saveSiteConfig(siteConfig);
      if (typeof saveCloudSiteConfig === 'function') {
        saveCloudSiteConfig(siteConfig);
      }
      showToast('Logo reset to default Pebble vector mark.');
    });

    // Hero Section Image Upload Handler (Optimized + Auto-Save)
    if (heroImageFileInput) {
      heroImageFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          showToast('Uploading & optimizing hero image...');
          const uploadedUrl = await processAndUploadImage(file, 'hero');
          if (heroImageUrlInput) heroImageUrlInput.value = uploadedUrl;
          if (heroImgPreview) heroImgPreview.src = uploadedUrl;

          siteConfig.heroImageUrl = uploadedUrl;
          saveSiteConfig(siteConfig);
          if (typeof saveCloudSiteConfig === 'function') {
            saveCloudSiteConfig(siteConfig);
          }
          showToast('✅ Hero image updated & saved automatically!');
        } catch (err) {
          showToast('Hero image upload error: ' + err.message);
        }
      });
    }

    if (heroImageUrlInput) {
      heroImageUrlInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (heroImgPreview) heroImgPreview.src = val || 'assets/pebble-logo.svg';
        siteConfig.heroImageUrl = val;
        saveSiteConfig(siteConfig);
        if (typeof saveCloudSiteConfig === 'function') {
          saveCloudSiteConfig(siteConfig);
        }
      });
    }

    if (clearHeroImgBtn) {
      clearHeroImgBtn.addEventListener('click', () => {
        if (heroImageUrlInput) heroImageUrlInput.value = '';
        if (heroImgPreview) heroImgPreview.src = 'assets/pebble-logo.svg';
        if (heroImageFileInput) heroImageFileInput.value = '';
        siteConfig.heroImageUrl = '';
        saveSiteConfig(siteConfig);
        if (typeof saveCloudSiteConfig === 'function') {
          saveCloudSiteConfig(siteConfig);
        }
        showToast('Hero section image cleared.');
      });
    }

    // Custom Cover Image Upload for Book (Colour selection removed)
    if (editCustomImageFile) {
      editCustomImageFile.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          showToast('Uploading & optimizing book cover...');
          const uploadedUrl = await processAndUploadImage(file, 'covers');
          editCustomImageUrl.value = uploadedUrl;
          if (coverDesignPreviewImg) {
            coverDesignPreviewImg.src = uploadedUrl;
          }
          showToast('✅ Cover design loaded! Click "Save Book Details" below.');
        } catch (err) {
          showToast('Cover upload error: ' + err.message);
        }
      });
    }

    if (editCustomImageUrl) {
      editCustomImageUrl.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (coverDesignPreviewImg) {
          coverDesignPreviewImg.src = url || 'assets/pebble-logo.svg';
        }
      });
    }

    if (clearCoverImgBtn) {
      clearCoverImgBtn.addEventListener('click', () => {
        editCustomImageUrl.value = '';
        if (coverDesignPreviewImg) {
          coverDesignPreviewImg.src = 'assets/pebble-logo.svg';
        }
        if (editCustomImageFile) editCustomImageFile.value = '';
        showToast('Front cover image cleared.');
      });
    }

    // Custom Back Cover Image Upload for Book (Optional)
    if (editBackImageFile) {
      editBackImageFile.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          showToast('Uploading & optimizing back cover...');
          const uploadedUrl = await processAndUploadImage(file, 'covers');
          if (editBackImageUrl) editBackImageUrl.value = uploadedUrl;
          if (backDesignPreviewImg) {
            backDesignPreviewImg.src = uploadedUrl;
          }
          showToast('✅ Back cover loaded! Click "Save Book Details" below.');
        } catch (err) {
          showToast('Back cover upload error: ' + err.message);
        }
      });
    }

    if (editBackImageUrl) {
      editBackImageUrl.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (backDesignPreviewImg) {
          backDesignPreviewImg.src = url || 'assets/pebble-logo.svg';
        }
      });
    }

    if (clearBackImgBtn) {
      clearBackImgBtn.addEventListener('click', () => {
        if (editBackImageUrl) editBackImageUrl.value = '';
        if (backDesignPreviewImg) {
          backDesignPreviewImg.src = 'assets/pebble-logo.svg';
        }
        if (editBackImageFile) editBackImageFile.value = '';
        showToast('Back cover image cleared.');
      });
    }

    // Product Search and Category Filtering
    adminProductSearch.addEventListener('input', (e) => {
      productSearchTerm = e.target.value.trim().toLowerCase();
      renderProductsTable();
    });

    if (adminCategoryFilter) {
      adminCategoryFilter.addEventListener('change', (e) => {
        productCategoryFilter = e.target.value;
        renderProductsTable();
      });
    }

    // Add New Book Trigger
    addNewBookBtn.addEventListener('click', openAddProductModal);

    // Product Modal Close Handlers
    closeProductModalBtn.addEventListener('click', closeProductModal);
    cancelProductBtn.addEventListener('click', closeProductModal);
    productEditModal.addEventListener('click', (e) => {
      if (e.target === productEditModal) closeProductModal();
    });

    // Product Form Submit
    productEditForm.addEventListener('submit', handleProductFormSubmit);

    // Backup & Restore
    exportBackupBtn.addEventListener('click', exportStoreBackup);
    importBackupInput.addEventListener('change', importStoreBackup);
    resetDefaultsBtn.addEventListener('click', handleFactoryReset);
  }

  // ==========================================================================
  // SAVE SITE CONFIGURATION
  // ==========================================================================
  function saveAllSiteConfig() {
    siteConfig = {
      ...siteConfig,
      brandName: brandNameInput.value.trim() || 'Pebble',
      brandTagline: brandTaglineInput.value.trim() || 'Books & Papercraft',
      logoUrl: logoUrlInput.value.trim() || 'assets/pebble-logo.svg',

      announcementBadge: annBadgeInput.value.trim(),
      announcementText: annTextInput.value.trim(),

      heroTag: heroTagInput.value.trim(),
      heroTitlePrefix: heroTitlePrefixInput.value,
      heroTitleHighlight: heroTitleHighlightInput.value,
      heroDescription: heroDescInput.value.trim(),
      heroPrimaryBtnText: heroPrimaryBtnInput.value.trim(),
      heroSecondaryBtnText: heroSecondaryBtnInput.value.trim(),
      heroImageUrl: heroImageUrlInput ? heroImageUrlInput.value.trim() : (siteConfig.heroImageUrl || ''),

      trustItems: [
        { title: trust1Title.value.trim(), desc: trust1Desc.value.trim() },
        { title: trust2Title.value.trim(), desc: trust2Desc.value.trim() },
        { title: trust3Title.value.trim(), desc: trust3Desc.value.trim() },
        { title: trust4Title.value.trim(), desc: trust4Desc.value.trim() }
      ],

      catalogTag: catalogTagInput.value.trim(),
      catalogTitle: catalogTitleInput.value.trim(),
      catalogSubtitle: catalogSubtitleInput.value.trim(),

      studioDescription: studioDescInput.value.trim(),
      studioAddress: studioAddressInput.value.trim(),
      studioHours: studioHoursInput.value.trim(),
      footerCopyrightNotice: footerCopyInput.value.trim(),

      gmailAddress: gmailAddressInput.value.trim(),
      gmailSubject: gmailSubjectInput.value.trim(),
      instagramHandle: instaHandleInput.value.trim(),
      instagramUrl: instaUrlInput.value.trim(),
      whatsappNumber: waNumberInput.value.trim().replace(/\D/g, ''),
      whatsappNavRedirectText: waNavRedirectInput.value.trim(),
      whatsappFooterRedirectText: waFooterRedirectInput.value.trim(),

      freeShippingThreshold: Number(freeShippingThresholdInput.value) || 799,
      shippingCharge: Number(shippingChargeInput.value) || 50
    };

    const success = saveSiteConfig(siteConfig);
    if (typeof saveCloudSiteConfig === 'function') {
      saveCloudSiteConfig(siteConfig);
    }

    if (success) {
      showToast('✅ All site texts, logo, and contacts saved successfully!');
    } else {
      showToast('❌ Failed to save configuration.');
    }
  }

  // ==========================================================================
  // PRODUCTS TABLE RENDERING
  // ==========================================================================
  function renderProductsTable() {
    productCountBadge.textContent = productsList.length;

    const filtered = productsList.filter((product) => {
      const matchesCat = productCategoryFilter === 'all' || product.category === productCategoryFilter;
      const matchesSearch =
        !productSearchTerm ||
        (product.title && product.title.toLowerCase().includes(productSearchTerm)) ||
        (product.designName && product.designName.toLowerCase().includes(productSearchTerm)) ||
        (product.pages && product.pages.toString().includes(productSearchTerm));
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      adminProductsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
            No books found matching your criteria.
          </td>
        </tr>
      `;
      return;
    }

    adminProductsTableBody.innerHTML = filtered
      .map((p) => {
        const thumb = p.customImageUrl
          ? `<img src="${p.customImageUrl}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;" alt="cover">`
          : `<div style="width: 100%; height: 100%; background: #FAF7F2; border: 1px dashed #C86446; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #8C7B6B; font-size: 0.65rem; font-weight: 700; border-radius: 4px;">📖<span style="font-size: 0.58rem;">${p.pages}p</span></div>`;

        const stockBadge = p.inStock !== false
          ? '<span class="badge-stock-in">In Stock</span>'
          : '<span class="badge-stock-out">Out of Stock</span>';

        const bestsellerStar = p.isBestseller ? ' ⭐' : '';
        const hasBackCover = Boolean((p.customBackImageUrl && p.customBackImageUrl.trim()) || (p.backImageUrl && p.backImageUrl.trim()));
        const backCoverBadge = hasBackCover
          ? '<span style="display:inline-block; font-size:0.68rem; font-weight:700; background:#EDE7F8; color:#7C3AED; padding:2px 6px; border-radius:999px; margin-top:3px;">Front + Back</span>'
          : '';

        return `
          <tr>
            <td>
              <div class="table-cover-thumb">
                ${thumb}
              </div>
            </td>
            <td class="table-title-cell">
              <strong>${escapeHtml(p.designName)}${bestsellerStar}</strong>
              <span style="color: var(--text-muted); font-size: 0.8rem;">${escapeHtml(p.title)}</span>
              ${backCoverBadge ? `<div>${backCoverBadge}</div>` : ''}
            </td>
            <td><strong>${p.pages}</strong> pages</td>
            <td>
              <strong>₹${p.price}</strong>
              ${p.originalPrice ? `<span style="text-decoration: line-through; color: var(--text-light); font-size: 0.8rem; margin-left: 4px;">₹${p.originalPrice}</span>` : ''}
            </td>
            <td><span style="font-size: 0.8rem; background: var(--admin-bg-body); padding: 3px 8px; border-radius: 4px;">${escapeHtml(p.categoryLabel || p.category)}</span></td>
            <td>${stockBadge}</td>
            <td>
              <div class="action-btn-row">
                <button type="button" class="btn-table-edit" onclick="editProduct('${p.id}')">Edit</button>
                <button type="button" class="btn-table-delete" onclick="deleteProduct('${p.id}')">Delete</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  // ==========================================================================
  // PRODUCT CRUD MODAL HANDLERS
  // ==========================================================================
  function openAddProductModal() {
    productModalTitle.textContent = 'Add New Book';
    productEditForm.reset();
    editProductId.value = '';
    editCustomImageUrl.value = '';
    if (coverDesignPreviewImg) {
      coverDesignPreviewImg.src = 'assets/pebble-logo.svg';
    }
    if (editCustomImageFile) editCustomImageFile.value = '';
    if (editBackImageUrl) editBackImageUrl.value = '';
    if (backDesignPreviewImg) {
      backDesignPreviewImg.src = 'assets/pebble-logo.svg';
    }
    if (editBackImageFile) editBackImageFile.value = '';
    editInStock.checked = true;
    editBestseller.checked = false;

    productEditModal.classList.add('open');
    productEditModal.setAttribute('aria-hidden', 'false');
  }

  window.editProduct = function (productId) {
    const product = productsList.find((p) => p.id === productId);
    if (!product) return;

    productModalTitle.textContent = `Edit "${product.designName}"`;
    editProductId.value = product.id;
    editTitle.value = product.title || '';
    editDesignName.value = product.designName || '';
    editCategory.value = product.category || 'journals';
    editPages.value = product.pages || 192;
    editPrice.value = product.price || 499;
    editOriginalPrice.value = product.originalPrice || '';
    editPaperGsm.value = product.paperGsm || '120 GSM Bleed-Proof Ivory';
    editRuling.value = product.ruling || 'Dotted Grid';
    editDimensions.value = product.dimensions || 'A5 (14.8 × 21.0 cm)';
    editCoverType.value = product.coverType || 'Matte Hardcover';
    editBinding.value = product.binding || '180° Lay-Flat Thread Bound';

    editCustomImageUrl.value = product.customImageUrl || '';
    if (coverDesignPreviewImg) {
      coverDesignPreviewImg.src = product.customImageUrl || 'assets/pebble-logo.svg';
    }
    if (editCustomImageFile) editCustomImageFile.value = '';

    const backUrl = product.customBackImageUrl || product.backImageUrl || '';
    if (editBackImageUrl) editBackImageUrl.value = backUrl;
    if (backDesignPreviewImg) {
      backDesignPreviewImg.src = backUrl || 'assets/pebble-logo.svg';
    }
    if (editBackImageFile) editBackImageFile.value = '';

    editDescription.value = product.description || '';
    editInStock.checked = product.inStock !== false;
    editBestseller.checked = Boolean(product.isBestseller);

    productEditModal.classList.add('open');
    productEditModal.setAttribute('aria-hidden', 'false');
  };

  function closeProductModal() {
    productEditModal.classList.remove('open');
    productEditModal.setAttribute('aria-hidden', 'true');
  }

  async function handleProductFormSubmit(e) {
    e.preventDefault();

    const id = editProductId.value.trim() || 'peb-' + Date.now();
    const categoryVal = editCategory.value;
    const categoryLabels = {
      journals: 'Hardcover Journals',
      sketchbooks: 'Sketchbooks',
      planners: 'Planners & Organizers',
      spiral: 'Spiral Notebooks',
      pocket: 'Pocket Books'
    };

    const newProduct = {
      id: id,
      title: editTitle.value.trim(),
      designName: editDesignName.value.trim(),
      category: categoryVal,
      categoryLabel: categoryLabels[categoryVal] || 'Books',
      price: Number(editPrice.value),
      originalPrice: editOriginalPrice.value ? Number(editOriginalPrice.value) : null,
      pages: Number(editPages.value),
      paperGsm: editPaperGsm.value.trim() || '120 GSM Ivory',
      binding: editBinding.value.trim() || 'Sewn Layflat',
      coverType: editCoverType.value.trim() || 'Hardcover',
      dimensions: editDimensions.value.trim() || 'A5 (14.8 × 21.0 cm)',
      ruling: editRuling.value.trim() || 'Dotted Grid',
      inStock: editInStock.checked,
      rating: 5.0,
      reviewsCount: 1,
      isBestseller: editBestseller.checked,
      description: editDescription.value.trim() || 'Crafted with premium archival paper.',
      customImageUrl: editCustomImageUrl.value.trim(),
      customBackImageUrl: editBackImageUrl ? editBackImageUrl.value.trim() : ''
    };

    const existingIndex = productsList.findIndex((p) => p.id === id);
    if (existingIndex > -1) {
      productsList[existingIndex] = { ...productsList[existingIndex], ...newProduct };
      showToast(`Book "${newProduct.designName}" updated!`);
    } else {
      productsList.unshift(newProduct);
      showToast(`Added new book "${newProduct.designName}"!`);
    }

    saveProducts(productsList);
    if (typeof saveCloudProduct === 'function') {
      try {
        await saveCloudProduct(newProduct);
      } catch (cloudErr) {
        console.warn('Cloud save warning:', cloudErr);
      }
    }
    renderProductsTable();
    closeProductModal();
  }

  window.deleteProduct = function (productId) {
    const product = productsList.find((p) => p.id === productId);
    if (!product) return;

    if (confirm(`Are you sure you want to delete "${product.designName}"?`)) {
      productsList = productsList.filter((p) => p.id !== productId);
      saveProducts(productsList);
      if (typeof deleteCloudProduct === 'function') {
        deleteCloudProduct(productId);
      }
      renderProductsTable();
      showToast(`Deleted "${product.designName}".`);
    }
  };

  // ==========================================================================
  // BACKUP EXPORT, IMPORT & RESET
  // ==========================================================================
  function exportStoreBackup() {
    const backupData = {
      siteConfig: getSiteConfig(),
      products: getProducts(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    const jsonString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `pebble-store-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Store backup JSON downloaded successfully!');
  }

  function importStoreBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.siteConfig && Array.isArray(imported.products)) {
          saveSiteConfig(imported.siteConfig);
          saveProducts(imported.products);
          loadData();
          populateFormValues();
          renderProductsTable();
          showToast('✅ Store backup imported and restored successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Could not parse JSON backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleFactoryReset() {
    if (
      confirm(
        'Are you ABSOLUTELY sure you want to restore factory defaults? This will erase all custom changes and restore original texts and sample books.'
      )
    ) {
      resetAllToDefaults();
      loadData();
      populateFormValues();
      renderProductsTable();
      showToast('🔄 Factory defaults restored successfully!');
    }
  }

  // ==========================================================================
  // TOAST UTILITY
  // ==========================================================================
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.textContent = message;

    adminToastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'all 0.25s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

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
