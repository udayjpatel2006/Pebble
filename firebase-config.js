// ==========================================================================
// PEBBLE - FIREBASE CONFIGURATION & SERVICE LAYER
// ==========================================================================

// Firebase Web App Configuration for pebble-bb7ce
const firebaseConfig = {
  apiKey: "AIzaSyAYLngP5YHJwBBO-hYTCndBeW-IoWRN9IY",
  authDomain: "pebble-bb7ce.firebaseapp.com",
  projectId: "pebble-bb7ce",
  storageBucket: "pebble-bb7ce.firebasestorage.app",
  messagingSenderId: "579965463931",
  appId: "1:579965463931:web:68a0d9d45b05796baae1de",
  measurementId: "G-2BRE9CTTPM"
};

// State variables
let firebaseApp = null;
let firestoreDb = null;
let firebaseStorage = null;
let isFirebaseConfigured = false;

// Initialize Firebase
(function initFirebase() {
  if (
    typeof firebase !== "undefined" &&
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "YOUR_API_KEY"
  ) {
    try {
      firebaseApp = firebase.initializeApp(firebaseConfig);
      firestoreDb = firebase.firestore();
      firebaseStorage = firebase.storage();
      isFirebaseConfigured = true;
      console.log("[Pebble] ✅ Connected to Firebase project: pebble-bb7ce");
    } catch (err) {
      console.warn("[Pebble] Firebase initialization failed:", err);
    }
  }
})();

// ==========================================================================
// IMAGE COMPRESSION & PORTABLE CLOUD-SAFE ENCODING
// ==========================================================================

/**
 * Compress and resize an image File or raw Data URI using HTML5 Canvas
 * Guarantees output Data URI is < 280KB so Firestore documents (max 1MB)
 * and localStorage (max 5MB) never fail or throw QuotaExceededError.
 */
async function compressImageToSafeDataUri(fileOrDataUri, folder = "covers") {
  const maxDimMap = {
    logos: 400,
    qr: 600,
    covers: 800,
    hero: 1000,
    proofs: 800
  };
  const initialMaxDim = maxDimMap[folder] || 800;
  const maxChars = folder === "logos" ? 150000 : 280000;

  const rawDataUri =
    typeof fileOrDataUri === "string"
      ? fileOrDataUri
      : await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(fileOrDataUri);
        });

  if (!rawDataUri || !rawDataUri.startsWith("data:image/")) {
    return rawDataUri;
  }

  // SVGs are vector XML and already small
  if (rawDataUri.startsWith("data:image/svg+xml") && rawDataUri.length <= maxChars) {
    return rawDataUri;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        let scale = 1;
        const origW = img.naturalWidth || img.width || 800;
        const origH = img.naturalHeight || img.height || 800;

        if (origW > initialMaxDim || origH > initialMaxDim) {
          scale = initialMaxDim / Math.max(origW, origH);
        }

        let quality = 0.82;
        let resultUri = rawDataUri;

        for (let attempt = 0; attempt < 5; attempt++) {
          const w = Math.max(1, Math.round(origW * scale));
          const h = Math.max(1, Math.round(origH * scale));

          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);

          // Prefer WebP (supports alpha transparency + superior compression)
          let candidate = canvas.toDataURL("image/webp", quality);
          if (!candidate.startsWith("data:image/webp")) {
            // Fallback for browsers without WebP encoding support
            if (folder === "logos" && rawDataUri.startsWith("data:image/png") && attempt === 0) {
              candidate = canvas.toDataURL("image/png");
            } else {
              // Fill white background for JPEG fallback
              const jpgCanvas = document.createElement("canvas");
              jpgCanvas.width = w;
              jpgCanvas.height = h;
              const jpgCtx = jpgCanvas.getContext("2d");
              jpgCtx.fillStyle = "#FFFFFF";
              jpgCtx.fillRect(0, 0, w, h);
              jpgCtx.drawImage(canvas, 0, 0);
              candidate = jpgCanvas.toDataURL("image/jpeg", quality);
            }
          }

          resultUri = candidate;
          if (resultUri.length <= maxChars) {
            break;
          }

          // Step down dimensions and quality if still above cap
          scale *= 0.78;
          quality = Math.max(0.55, quality - 0.1);
        }

        resolve(resultUri);
      } catch (err) {
        console.warn("[Pebble Image] Canvas compression fallback:", err);
        resolve(rawDataUri);
      }
    };
    img.onerror = () => resolve(rawDataUri);
    img.src = rawDataUri;
  });
}

if (typeof window !== "undefined") {
  window.compressImageToSafeDataUri = compressImageToSafeDataUri;
}

/**
 * Helper to sort products consistently (newest custom books first, then default order)
 */
function sortCloudProductsList(products) {
  if (!Array.isArray(products)) return [];
  return [...products].sort((a, b) => {
    if (typeof a.sortOrder === "number" && typeof b.sortOrder === "number") {
      return a.sortOrder - b.sortOrder;
    }
    const getCreatedTime = (item) => {
      if (typeof item.createdAt === "number") return item.createdAt;
      if (typeof item.createdAt === "string") {
        const t = Date.parse(item.createdAt);
        if (!isNaN(t)) return t;
      }
      const m = String(item.id || "").match(/^peb-(\d{10,})$/);
      return m ? Number(m[1]) : 0;
    };
    const timeA = getCreatedTime(a);
    const timeB = getCreatedTime(b);
    if (timeA !== timeB) {
      return timeB - timeA; // Newest custom book first
    }
    return String(a.id || "").localeCompare(String(b.id || ""));
  });
}

// ==========================================================================
// FIRESTORE DATABASE SERVICE FUNCTIONS
// ==========================================================================

/**
 * Load all products from Firestore (fast parallel query, never re-seeds deleted sample books)
 */
async function getCloudProducts() {
  if (isFirebaseConfigured && firestoreDb) {
    try {
      let cloudDeletedIds = typeof getDeletedProductIds === "function" ? getDeletedProductIds() : [];

      const [metaResult, snapResult] = await Promise.allSettled([
        firestoreDb.collection("settings").doc("catalog_meta").get(),
        firestoreDb.collection("products").get()
      ]);

      if (metaResult.status === "fulfilled" && metaResult.value && metaResult.value.exists) {
        const metaData = metaResult.value.data() || {};
        if (Array.isArray(metaData.deletedProductIds)) {
          cloudDeletedIds = Array.from(new Set([...cloudDeletedIds, ...metaData.deletedProductIds]));
          if (typeof setDeletedProductIds === "function") {
            setDeletedProductIds(cloudDeletedIds);
          }
        }
      }

      if (snapResult.status === "fulfilled" && snapResult.value) {
        const snapshot = snapResult.value;
        const cloudProducts = [];
        snapshot.forEach((doc) => {
          const data = doc.data() || {};
          if (!data.isDeleted && !cloudDeletedIds.includes(doc.id)) {
            cloudProducts.push({ id: doc.id, ...data });
          }
        });
        try {
          localStorage.setItem("pebble_catalog_initialized", "true");
        } catch (e) {}
        return sortCloudProductsList(cloudProducts);
      }
    } catch (err) {
      console.warn("[Pebble Firebase] Firestore read notice:", err.message);
    }
  }
  return typeof getProducts === "function" ? getProducts() : [];
}

/**
 * Save / Update a single product in Firestore
 */
async function saveCloudProduct(product) {
  if (!product || !product.id) return false;

  if (typeof unmarkProductDeleted === "function") {
    unmarkProductDeleted(product.id);
  }

  if (isFirebaseConfigured && firestoreDb) {
    try {
      const copy = { ...product };
      // Ensure any embedded data URIs fit safely within Firestore's 1MB document limit
      if (copy.customImageUrl && copy.customImageUrl.startsWith("data:image/") && copy.customImageUrl.length > 280000) {
        copy.customImageUrl = await compressImageToSafeDataUri(copy.customImageUrl, "covers");
      }
      if (copy.customBackImageUrl && copy.customBackImageUrl.startsWith("data:image/") && copy.customBackImageUrl.length > 280000) {
        copy.customBackImageUrl = await compressImageToSafeDataUri(copy.customBackImageUrl, "covers");
      }

      const { id, ...data } = copy;
      const payload = {
        ...data,
        customImageUrl: data.customImageUrl || "",
        customBackImageUrl: data.customBackImageUrl || "",
        backImageUrl: data.customBackImageUrl || "",
        badge: data.badge || "",
        isDeleted: false,
        updatedAt: Date.now(),
        createdAt: data.createdAt || Date.now()
      };

      await firestoreDb.collection("products").doc(id).set(payload);

      // Update lightweight catalog_meta document
      const metaUpdate = {
        catalogInitialized: true,
        updatedAt: Date.now()
      };
      if (firebase.firestore && firebase.firestore.FieldValue) {
        metaUpdate.deletedProductIds = firebase.firestore.FieldValue.arrayRemove(id);
      }
      firestoreDb.collection("settings").doc("catalog_meta").set(metaUpdate, { merge: true }).catch(() => {});

      console.log(`[Pebble Firebase] Product "${product.designName}" (${id}) saved to Firestore.`);
      return true;
    } catch (err) {
      console.error("[Pebble Firebase] Error saving product to Firestore:", err);
      throw err;
    }
  }
  return true;
}

/**
 * Save / Synchronize an entire array of products to Firestore
 * (Used when bulk-updating categories, importing backups, or factory resetting)
 */
async function saveCloudProducts(productsList, syncDeletions = false) {
  if (!Array.isArray(productsList)) return false;
  if (isFirebaseConfigured && firestoreDb) {
    try {
      const keepIds = new Set(productsList.map((p) => p && p.id).filter(Boolean));

      if (syncDeletions) {
        const existingSnap = await firestoreDb.collection("products").get();
        const deletePromises = [];
        existingSnap.forEach((doc) => {
          if (!keepIds.has(doc.id)) {
            deletePromises.push(firestoreDb.collection("products").doc(doc.id).delete());
          }
        });
        if (deletePromises.length > 0) {
          await Promise.allSettled(deletePromises);
        }
        await firestoreDb
          .collection("settings")
          .doc("catalog_meta")
          .set({ catalogInitialized: true, deletedProductIds: [], updatedAt: Date.now() }, { merge: true })
          .catch(() => {});
      }

      for (let i = 0; i < productsList.length; i++) {
        const prod = { ...productsList[i], sortOrder: i };
        await saveCloudProduct(prod);
      }
      return true;
    } catch (err) {
      console.warn("[Pebble Firebase] Error batch-saving products to Firestore:", err.message);
      return false;
    }
  }
  return true;
}

/**
 * Delete a product permanently from Firestore
 */
async function deleteCloudProduct(productId) {
  if (!productId) return false;

  if (typeof markProductDeleted === "function") {
    markProductDeleted(productId);
  }

  if (isFirebaseConfigured && firestoreDb) {
    try {
      const metaUpdate = {
        catalogInitialized: true,
        updatedAt: Date.now()
      };
      if (firebase.firestore && firebase.firestore.FieldValue) {
        metaUpdate.deletedProductIds = firebase.firestore.FieldValue.arrayUnion(productId);
      }

      await Promise.all([
        firestoreDb.collection("products").doc(productId).delete(),
        firestoreDb.collection("settings").doc("catalog_meta").set(metaUpdate, { merge: true }).catch(() => {})
      ]);

      console.log(`[Pebble Firebase] Product ${productId} deleted from Firestore.`);
      return true;
    } catch (err) {
      console.error("[Pebble Firebase] Error deleting product from Firestore:", err);
      throw err;
    }
  }
  return true;
}

/**
 * Subscribe to real-time Firestore updates for Products and Site Config
 * Ensures any upload, edit, or delete in Admin reflects live on the Storefront immediately.
 */
function subscribeToCloudUpdates({ onProductsChange, onConfigChange } = {}) {
  if (!isFirebaseConfigured || !firestoreDb) return () => {};

  const unsubscribers = [];
  let latestRawProducts = null;

  const emitFilteredProducts = () => {
    if (typeof onProductsChange !== "function" || !Array.isArray(latestRawProducts)) return;
    const deletedIds = typeof getDeletedProductIds === "function" ? getDeletedProductIds() : [];
    const filtered = latestRawProducts.filter((p) => p && !p.isDeleted && !deletedIds.includes(p.id));
    onProductsChange(sortCloudProductsList(filtered));
  };

  if (typeof onProductsChange === "function") {
    try {
      const unsubMeta = firestoreDb
        .collection("settings")
        .doc("catalog_meta")
        .onSnapshot(
          (doc) => {
            if (doc.exists) {
              const data = doc.data() || {};
              if (Array.isArray(data.deletedProductIds) && typeof setDeletedProductIds === "function") {
                const currentDel = typeof getDeletedProductIds === "function" ? getDeletedProductIds() : [];
                setDeletedProductIds(Array.from(new Set([...currentDel, ...data.deletedProductIds])));
                emitFilteredProducts();
              }
            }
          },
          () => {}
        );
      unsubscribers.push(unsubMeta);
    } catch (e) {}

    try {
      const unsubProducts = firestoreDb.collection("products").onSnapshot(
        (snapshot) => {
          const raw = [];
          snapshot.forEach((doc) => {
            const data = doc.data() || {};
            raw.push({ id: doc.id, ...data });
          });
          latestRawProducts = raw;
          emitFilteredProducts();
        },
        (err) => {
          console.warn("[Pebble Firebase] Live products listener notice:", err.message);
        }
      );
      unsubscribers.push(unsubProducts);
    } catch (e) {
      console.warn("[Pebble Firebase] Could not attach products listener:", e.message);
    }
  }

  if (typeof onConfigChange === "function") {
    try {
      const unsubConfig = firestoreDb
        .collection("settings")
        .doc("site_config")
        .onSnapshot(
          (doc) => {
            if (doc.exists) {
              const data = doc.data() || {};
              const mergedConfig = {
                ...(typeof DEFAULT_SITE_CONFIG !== "undefined" ? DEFAULT_SITE_CONFIG : {}),
                ...data
              };
              onConfigChange(mergedConfig);
            }
          },
          (err) => {
            console.warn("[Pebble Firebase] Live site_config listener notice:", err.message);
          }
        );
      unsubscribers.push(unsubConfig);
    } catch (e) {
      console.warn("[Pebble Firebase] Could not attach site_config listener:", e.message);
    }
  }

  return () => {
    unsubscribers.forEach((unsub) => {
      if (typeof unsub === "function") unsub();
    });
  };
}

if (typeof window !== "undefined") {
  window.saveCloudProduct = saveCloudProduct;
  window.saveCloudProducts = saveCloudProducts;
  window.deleteCloudProduct = deleteCloudProduct;
  window.subscribeToCloudUpdates = subscribeToCloudUpdates;
  window.sortCloudProductsList = sortCloudProductsList;
}

/**
 * Load Site Configuration from Firestore (or fallback & auto-seed)
 */
async function getCloudSiteConfig() {
  if (isFirebaseConfigured && firestoreDb) {
    try {
      const doc = await firestoreDb.collection("settings").doc("site_config").get();
      if (doc.exists) {
        const data = doc.data() || {};
        if (Array.isArray(data.deletedProductIds) && typeof setDeletedProductIds === "function") {
          const currentDel = typeof getDeletedProductIds === "function" ? getDeletedProductIds() : [];
          setDeletedProductIds(Array.from(new Set([...currentDel, ...data.deletedProductIds])));
        }
        try {
          localStorage.setItem("pebble_catalog_initialized", "true");
        } catch (e) {}
        return { ...DEFAULT_SITE_CONFIG, ...data };
      } else {
        // Seed initial site config to Firestore
        const initial = typeof getSiteConfig === "function" ? getSiteConfig() : {};
        firestoreDb.collection("settings").doc("site_config").set(initial).catch(() => {});
        return initial;
      }
    } catch (err) {
      console.warn("[Pebble Firebase] Firestore site config notice:", err.message);
    }
  }
  return typeof getSiteConfig === "function" ? getSiteConfig() : {};
}

/**
 * Save Site Configuration to Firestore
 */
async function saveCloudSiteConfig(config) {
  if (isFirebaseConfigured && firestoreDb) {
    try {
      const copy = { ...config };
      if (copy.logoUrl && copy.logoUrl.startsWith("data:image/") && copy.logoUrl.length > 150000) {
        copy.logoUrl = await compressImageToSafeDataUri(copy.logoUrl, "logos");
      }
      if (copy.heroImageUrl && copy.heroImageUrl.startsWith("data:image/") && copy.heroImageUrl.length > 280000) {
        copy.heroImageUrl = await compressImageToSafeDataUri(copy.heroImageUrl, "hero");
      }
      if (copy.merchantQrImageUrl && copy.merchantQrImageUrl.startsWith("data:image/") && copy.merchantQrImageUrl.length > 250000) {
        copy.merchantQrImageUrl = await compressImageToSafeDataUri(copy.merchantQrImageUrl, "qr");
      }
      await firestoreDb.collection("settings").doc("site_config").set(copy, { merge: true });
      console.log("[Pebble Firebase] Site config saved to Firestore.");
      return true;
    } catch (err) {
      console.warn("[Pebble Firebase] Error saving site config to Firestore:", err.message);
      return false;
    }
  }
  return true;
}

/**
 * Upload & optimize an image file (Logo, Book Cover, QR, Payment Screenshot)
 * Returns a portable, compressed Data URI that works on both localhost and live Vercel deployments.
 */
async function uploadImageToStorage(file, folder = "uploads") {
  const optimizedDataUri = await compressImageToSafeDataUri(file, folder);

  // Save a local backup file to /uploads if running on local Node server (non-blocking)
  try {
    fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: optimizedDataUri,
        filename: file.name || `upload_${Date.now()}.webp`,
        folder: folder
      })
    }).catch(() => {});
  } catch (e) {
    // Ignore background local backup notice
  }

  return optimizedDataUri;
}

// ==========================================================================
// ORDERS MANAGEMENT (FIRESTORE + RESILIENT LOCAL FALLBACK)
// ==========================================================================

/**
 * Get all local orders from localStorage
 */
function getLocalOrders() {
  try {
    const raw = localStorage.getItem('pebble_orders');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('[Pebble Orders] Failed to read local orders:', err);
    return [];
  }
}

/**
 * Save all local orders to localStorage
 */
function saveLocalOrders(orders) {
  try {
    localStorage.setItem('pebble_orders', JSON.stringify(orders));
  } catch (err) {
    console.warn('[Pebble Orders] Failed to write local orders:', err);
  }
}

/**
 * Create a new order (Stores to Firestore & local storage with locked amount)
 */
async function createCloudOrder(orderData) {
  // Ensure order has created timestamp
  const order = {
    ...orderData,
    createdAt: orderData.createdAt || new Date().toISOString(),
    timestamp: Date.now()
  };

  // 1. Immediately save to local storage (zero latency guard)
  const localOrders = getLocalOrders();
  const existingIdx = localOrders.findIndex(o => o.id === order.id);
  if (existingIdx > -1) {
    localOrders[existingIdx] = order;
  } else {
    localOrders.unshift(order);
  }
  saveLocalOrders(localOrders);

  // 2. Persist to Firestore in background (non-blocking for instant UI response)
  if (isFirebaseConfigured && firestoreDb) {
    firestoreDb
      .collection("orders")
      .doc(order.id)
      .set(order, { merge: true })
      .then(() => {
        console.log(`[Pebble Firebase] Order ${order.id} saved to Firestore.`);
      })
      .catch((err) => {
        console.warn("[Pebble Firebase] Could not save order to Firestore:", err.message);
      });
  }

  return order;
}

/**
 * Update order payment proof / UTR reference (Customer action)
 * Sets status strictly to PAYMENT_PENDING_VERIFICATION (never auto-PAID)
 */
async function updateCloudOrderPaymentProof(orderId, utr, screenshotUrl = '') {
  const updateData = {
    utrNumber: String(utr || '').trim(),
    screenshotUrl: screenshotUrl || '',
    paymentStatus: 'PAYMENT_PENDING_VERIFICATION',
    paymentReferenceSubmittedAt: new Date().toISOString()
  };

  // 1. Update local storage
  const localOrders = getLocalOrders();
  const order = localOrders.find(o => o.id === orderId);
  if (order) {
    Object.assign(order, updateData);
    saveLocalOrders(localOrders);
  }

  // 2. Update Firestore in background
  if (isFirebaseConfigured && firestoreDb) {
    firestoreDb
      .collection("orders")
      .doc(orderId)
      .set(updateData, { merge: true })
      .then(() => {
        console.log(`[Pebble Firebase] Order ${orderId} payment proof updated in Firestore.`);
      })
      .catch((err) => {
        console.warn("[Pebble Firebase] Error updating payment proof in Firestore:", err.message);
      });
  }

  return true;
}

/**
 * Update order status (Admin only action: e.g. PAID or CANCELLED)
 */
async function updateCloudOrderStatus(orderId, newStatus, adminNotes = '') {
  const updateData = {
    paymentStatus: newStatus,
    adminNotes: adminNotes || '',
    statusUpdatedAt: new Date().toISOString()
  };

  // 1. Update local storage
  const localOrders = getLocalOrders();
  const order = localOrders.find(o => o.id === orderId);
  if (order) {
    Object.assign(order, updateData);
    saveLocalOrders(localOrders);
  }

  // 2. Update Firestore
  if (isFirebaseConfigured && firestoreDb) {
    try {
      await firestoreDb.collection("orders").doc(orderId).set(updateData, { merge: true });
      console.log(`[Pebble Firebase] Order ${orderId} status set to "${newStatus}" in Firestore.`);
    } catch (err) {
      console.warn("[Pebble Firebase] Error updating order status in Firestore:", err.message);
    }
  }

  return true;
}

/**
 * Fetch all orders (combines Firestore & local storage, sorted latest first)
 */
async function getCloudOrders() {
  const localOrders = getLocalOrders();

  if (isFirebaseConfigured && firestoreDb) {
    try {
      const snapshot = await firestoreDb.collection("orders").orderBy("timestamp", "desc").get();
      if (!snapshot.empty) {
        const cloudOrders = [];
        snapshot.forEach(doc => {
          cloudOrders.push({ id: doc.id, ...doc.data() });
        });

        // Merge cloud with local to guarantee zero data loss
        const mergedMap = new Map();
        cloudOrders.forEach(o => mergedMap.set(o.id, o));
        localOrders.forEach(o => {
          if (!mergedMap.has(o.id)) {
            mergedMap.set(o.id, o);
          }
        });

        const mergedOrders = Array.from(mergedMap.values());
        saveLocalOrders(mergedOrders);
        return mergedOrders;
      }
    } catch (err) {
      console.warn("[Pebble Firebase] Could not read orders from Firestore:", err.message);
    }
  }

  return localOrders;
}

/**
 * Delete an order permanently (Admin only action)
 */
async function deleteCloudOrder(orderId) {
  if (!orderId) return false;

  // 1. Remove from local storage
  const localOrders = getLocalOrders();
  const updatedOrders = localOrders.filter((o) => o.id !== orderId);
  saveLocalOrders(updatedOrders);

  // 2. Remove from Firestore if configured
  if (isFirebaseConfigured && firestoreDb) {
    try {
      await firestoreDb.collection("orders").doc(orderId).delete();
      console.log(`[Pebble Firebase] Order ${orderId} deleted from Firestore.`);
    } catch (err) {
      console.warn("[Pebble Firebase] Error deleting order from Firestore:", err.message);
    }
  }

  return true;
}

if (typeof window !== "undefined") {
  window.deleteCloudOrder = deleteCloudOrder;
}
