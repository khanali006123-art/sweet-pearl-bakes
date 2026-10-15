# Sweet Pearl Bakes — Production MERN Monorepo

> **"A Little Sweetness in Every Bite"**  
> Artisanal Home-Based Bakery • Dera Ismail Khan, Khyber Pakhtunkhwa, Pakistan

---

## 🎂 Features Overview

1. **Brand & Design System**: Warm bakery palette (Deep Cocoa `#3A2117`, Cream `#FFF8ED`, Gold `#C59A5B`, high-contrast text gold `#8A6428`, Playfair Display & Inter typography, 44px pill buttons, Lucide icons).
2. **Store Pages**:
   - `/`: Rich homepage with notice announcement banner, sticky navbar with live 10 AM - 10 PM open/closed status, hero with Order Now + WhatsApp CTAs, trust strip, 6 category cards, 5-step ordering process, customer reviews, FAQ teaser, and footer.
   - `/menu`: Complete catalog with category filters, live search, and quick view modal.
   - `/menu/[slug]`: Per-product details with flavor customizer, portion pricing table, and direct order link.
   - `/custom-cakes`: Bespoke event cake showcase with 3-step guide and custom quotation form with reference photo upload.
   - `/order`: Multi-step validated order form, advance notice date picker, 100% advance Easypaisa (`03169403356`) & JazzCash (`03306363356`) instructions, screenshot upload, celebratory confetti, and WhatsApp confirmation.
   - `/track`: Secure order tracking with Order Number + Phone lookup and live baking & delivery timeline without leaking customer address.
   - `/gallery`: Categorized visual gallery with accessible modal lightbox and keyboard Esc navigation.
   - `/about`, `/delivery-and-ordering`, `/faq`, `/contact`, `/privacy`, `/terms`.
3. **Owner Dashboard (`/admin`)**:
   - Real-time revenue & orders KPI counters.
   - Orders list with status filter, payment proof screenshot preview, status advancement with audit trail.
   - Products manager, inquiries inbox, newsletter subscribers list, and CSV export.
   - Default login: `admin@sweetpearlbakes.com` / `sweetpearl123`.

---

## 🚀 Running on Localhost

### 1. Install dependencies
```bash
npm install
```

### 2. Start Both Web & API concurrently
```bash
npm run dev
```

* **Frontend**: `http://localhost:3000`
* **Backend API**: `http://localhost:5000/api/v1`
* **Admin Portal**: `http://localhost:3000/admin/login`

*(Note: If MongoDB is not installed locally, the API seamlessly operates using an embedded local store with zero configuration required!)*
