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
