# 🟣 Pebble — Handcrafted Books, Journals & Papercraft

> **Artisanal E-Commerce Storefront & Real-Time Admin CMS**  
> Sculpted for thought, crafted like pebbles. Designed for thinkers, dreamers, writers, and creators who cherish physical pages.

---

## 📖 Overview

**Pebble** is a modern, lightweight, artisanal e-commerce web platform and Content Management System (CMS) dedicated to handcrafted, lay-flat bound journals, mixed-media sketchbooks, and productivity planners.

Built with a focus on minimalism, tactile aesthetics, and performance, Pebble combines a customer-facing storefront with a password-protected admin dashboard featuring live CMS editing, visual image uploads, automated WhatsApp order dispatch, and secure OTP password recovery via Gmail.

---

## 🎨 Visual Identity & Aesthetic System

Pebble features a distinctive, organic visual design inspired by smoothed river stones and artisanal papercraft:

- 🟣 **Light Lavender / Pastel Purple Background (`#F7F4FB`)**: Soft, clean, and airy backdrop with pure white surface cards.
- ⚫ **Black Pebble Elements (`#121016`)**: Organic, floating pebble stone SVGs with smooth floating keyframe animations.
- 🟣 **Lavender / Pastel Purple Highlights (`#8B5CF6`, `#7C3AED`)**: Vibrant yet gentle accent colors applied to brand typography, buttons, pills, badges, and focus rings.
- 🌊 **Micro-Animations**: Smooth `@keyframes floatPebble1`, `floatPebble2`, and `floatSlow` providing an elegant floating effect on book showcases and decorative stones.

---

## ✨ Key Features

### 🛍️ Artisanal Storefront (`index.html`)
- **Live Search & Instant Filtering**: Real-time search across book titles, cover designs, rulings, and page counts.
- **Hero Section Visual Showcase**: Features dynamic hero artwork managed via CMS, accompanied by floating black pebble silhouettes.
- **Quick-View Book Modal**: Deep-dive book inspector displaying archival paper weights (120+ GSM), ruling options (Dotted, Ruled, Blank), dimensions, and binding details.
- **Interactive Cart Drawer**: Real-time subtotal calculations, item quantity adjustment, and dynamic free shipping progress bar.
- **Dual Checkout Options**:
  - **Direct Order Form**: Captures customer shipping details, local delivery address, and payment preference (COD, UPI / QR Scan).
  - **One-Click WhatsApp Checkout**: Generates a pre-filled, formatted WhatsApp message with full order items, quantities, pricing, and customer delivery notes.
- **Direct Connect Channels**: Integrated links for Gmail, Instagram (`@pebble.books`), and WhatsApp.

### ⚙️ Private Admin Panel & CMS (`admin.html`)
- **Security & Access Control**:
  - **Private Gate**: Salted SHA-256 password verification with failed-attempt lockout throttling.
  - **Gmail OTP Password Reset**: Secure 2-step verification code delivered to `pebbleee17@gmail.com` using Nodemailer, complete with a 10-minute expiry window and a 60-second resend countdown timer.
- **Storefront Texts & Value Pillars CMS**:
  - Customize announcement bar badge and text.
  - Live edit Hero section heading, highlight spans, description, and action button labels.
  - Manage Value Propositions (e.g., *100% Archival Paper*, *Custom Design*, *Lay-Flat 180° Binding*, *Local Small Batch*).
- **Hero Artwork Image Management**:
  - Upload custom artwork or provide an external image URL.
  - Automatic Canvas-based image dimension optimization with live preview.
- **Brand Typography & Logo**:
  - Upload custom brand logos with auto-save.
  - Permanent HTML brand typography beside the logo ensures brand text never vanishes when a custom emblem is uploaded.
- **Book Catalog & Inventory Manager**:
  - Add, edit, and delete products.
  - Set titles, design names, categories, page counts, paper GSM, rulings, cover types, pricing, and stock status.
  - Direct file upload for book cover designs (stored locally in `/uploads/` and served dynamically).
- **Store Backup & Restore**:
  - Single-click JSON export and import for instant store database snapshots.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | HTML5, CSS3 (Custom Properties, Flexbox, CSS Grid, Keyframe Animations), Modern Vanilla JavaScript (ES6+) |
| **Backend / Server** | Node.js native `http` module (`server.js`), static file server, Base64 JSON upload endpoint |
| **Email / Security** | Nodemailer (Gmail App Password integration), SHA-256 Web Crypto API, salted hash authentication |
| **Cloud Integration** | Firebase Firestore & Storage support (`firebase-config.js`) |
| **Icons & Typography** | Google Fonts (*Playfair Display*, *Plus Jakarta Sans*, *Inter*), Custom SVG vectors |

---

## 📂 Project Structure

```text
Pebble/
├── index.html            # Main storefront HTML
├── styles.css            # Storefront design system, theme variables & animations
├── app.js                # Storefront application logic (cart, search, checkout)
├── products.js           # Default product catalog & site configuration data store
├── admin.html            # Private CMS & Admin Dashboard interface
├── admin.css             # Admin dashboard styling
├── admin.js              # Admin controller, authentication & CMS logic
├── server.js             # Node.js backend server, upload endpoint & OTP emailer
├── firebase-config.js    # Firebase Firestore and Cloud Storage integration
├── start-pebble.bat      # Windows one-click launcher for server and browser tabs
├── package.json          # Dependencies and scripts (Nodemailer, Firebase)
├── .gitignore            # Git exclusion rules (node_modules, .env)
├── assets/
│   └── pebble-logo.svg   # Default organic pebble vector emblem
└── uploads/              # Local server storage for uploaded covers and logos
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 16.x or newer recommended)
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/udayjpatel2006/Pebble.git
cd Pebble
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables (Optional for Gmail OTP)
To enable automated OTP password recovery emails, create a `.env` file in the project root:
```env
GMAIL_USER=pebbleee17@gmail.com
GMAIL_APP_PASSWORD=your_16_digit_app_password
```
*(Alternatively, pass them directly via environment variables or PowerShell before starting).*

### 5. Run the Server
Start the local server using npm:
```bash
npm start
```
Or on Windows, simply double-click **`start-pebble.bat`**.

### 6. Access the Application
- **Storefront**: [http://localhost:8000/](http://localhost:8000/)
- **Admin Panel**: [http://localhost:8000/admin.html](http://localhost:8000/admin.html)

### 7. Deploying to Vercel
1. Import this repository into **[Vercel](https://vercel.com/)**.
2. Framework Preset: **Other** (Root Directory: `./`).
3. Add Environment Variables in your Vercel Project Settings:
   - `GMAIL_USER`: `pebbleee17@gmail.com`
   - `GMAIL_APP_PASSWORD`: Your 16-digit Gmail App Password
4. Click **Deploy**. Vercel will instantly host your storefront globally on the Edge Network with zero configuration!

---

## 🔒 Security & Admin Access

- **Initial Admin Password**: `pebble@2026`
- **Password Reset**: Click **"Forgot Password?"** on the admin login screen to dispatch a 6-digit OTP code to the registered administrator email (`pebbleee17@gmail.com`).
- **Data Protection**: All sensitive tokens and credentials are excluded via `.gitignore`.

---

## 📄 License

This project is licensed under the ISC License.
