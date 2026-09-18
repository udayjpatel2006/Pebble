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
// FIRESTORE DATABASE SERVICE FUNCTIONS
// ==========================================================================

/**
 * Load all products from Firestore (or fallback & auto-seed if empty)
 */
async function getCloudProducts() {
  if (isFirebaseConfigured && firestoreDb) {
    try {
      const snapshot = await firestoreDb.collection("products").get();
      if (!snapshot.empty) {
        const cloudProducts = [];
        snapshot.forEach((doc) => {
          cloudProducts.push({ id: doc.id, ...doc.data() });
        });
        return cloudProducts;
      } else {
        // Seed default books to Firestore so the store starts populated
        console.log("[Pebble Firebase] Initializing Firestore products collection with default books...");
        const defaults = typeof getProducts === "function" ? getProducts() : [];
        for (const item of defaults) {
          const { id, ...data } = item;
          firestoreDb.collection("products").doc(id).set(data).catch(() => {});
        }
        return defaults;
      }
    } catch (err) {
      console.warn("[Pebble Firebase] Firestore read notice (check rules if access denied):", err.message);
    }
  }
  return typeof getProducts === "function" ? getProducts() : [];
}

/**
 * Save / Update a product in Firestore
 */
async function saveCloudProduct(product) {
  if (isFirebaseConfigured && firestoreDb) {
    try {
      const { id, ...data } = product;
      await firestoreDb.collection("products").doc(id).set(data, { merge: true });
      console.log(`[Pebble Firebase] Product "${product.designName}" saved to Firestore.`);
    } catch (err) {
      console.warn("[Pebble Firebase] Error saving product to Firestore:", err.message);
    }
  }
}

/**
 * Delete a product from Firestore
 */
async function deleteCloudProduct(productId) {
  if (isFirebaseConfigured && firestoreDb) {
    try {
      await firestoreDb.collection("products").doc(productId).delete();
      console.log(`[Pebble Firebase] Product ${productId} deleted from Firestore.`);
    } catch (err) {
      console.warn("[Pebble Firebase] Error deleting product from Firestore:", err.message);
    }
  }
}

/**
 * Load Site Configuration from Firestore (or fallback & auto-seed)
 */
async function getCloudSiteConfig() {
  if (isFirebaseConfigured && firestoreDb) {
    try {
      const doc = await firestoreDb.collection("settings").doc("site_config").get();
      if (doc.exists) {
        return { ...DEFAULT_SITE_CONFIG, ...doc.data() };
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
      await firestoreDb.collection("settings").doc("site_config").set(config, { merge: true });
      console.log("[Pebble Firebase] Site config saved to Firestore.");
    } catch (err) {
      console.warn("[Pebble Firebase] Error saving site config to Firestore:", err.message);
    }
  }
}

/**
 * Upload an image file (e.g. Logo or Book Cover) to Firebase Storage
 * Returns the public Download URL
 */
async function uploadImageToStorage(file, folder = "uploads") {
  // 1. Try local server upload endpoint first (instant, free, reliable, no quota limits)
  try {
    const dataUri = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: dataUri,
        filename: file.name,
        folder: folder
      })
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.url) {
        console.log("[Pebble Upload] Saved to local storage:", json.url);
        return json.url;
      }
    }
  } catch (localErr) {
    console.warn("[Pebble Upload] Local /api/upload notice:", localErr.message);
  }

  // 2. Try Firebase Storage if configured
  if (isFirebaseConfigured && firebaseStorage) {
    try {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
      const storageRef = firebaseStorage.ref().child(`${folder}/${fileName}`);
      const snapshot = await storageRef.put(file);
      const downloadUrl = await snapshot.ref.getDownloadURL();
      console.log("[Pebble Firebase] Image uploaded to Storage:", downloadUrl);
      return downloadUrl;
    } catch (err) {
      console.warn("[Pebble Firebase] Storage upload error:", err.message);
    }
  }

  // 3. Fallback: return data URI
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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

