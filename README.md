# Trustore — Frontend 🛒

> **AI-powered hyperlocal grocery marketplace frontend built with React, Vite, Tailwind CSS, Leaflet, and Razorpay.**

Trustore is a modern grocery marketplace that connects customers with **admin-verified local stores**.

The frontend provides the complete user experience for AI-powered grocery shopping, intelligent store clustering, nearby-store discovery, multi-store carts, checkout, order tracking, store-owner management, and platform administration.

It is designed to work against the Trustore Express/MongoDB API contract.

---

# ✨ Features

## 🤖 AI Shopping Assistant

Turn a natural-language grocery list into an intelligent shopping experience.

Example:

```text
I need 2kg rice, 1 litre milk, bread, tea and cooking oil.
```

The frontend:

```text
Natural Language Input
        │
        ▼
Groq Product Extraction
        │
        ▼
Structured Product List
        │
        ▼
Customer Location
        │
        ▼
Dynamic Store Clustering
        │
        ▼
Ranked Store Clusters
        │
        ▼
Best Match
        │
        ▼
Add Products to Cart
```

The UI includes:

* AI input interface
* Loading/thinking state
* Extracted product pills
* Product quantities and units
* Cluster search state
* Ranked cluster cards
* Score breakdown
* Best-match highlighting
* Missing-product detection
* 100-meter border-store recommendation
* Add-to-cart functionality

---

# 🧠 Dynamic Store Clustering UI

The frontend consumes the clustering API and presents the results visually.

Each cluster displays:

* Product availability
* Distance
* Delivery efficiency
* Store ratings
* Overall cluster score
* Participating stores
* Missing products
* Border-store recommendations

Example:

```text
┌─────────────────────────────────────────────┐
│ 🏆 BEST MATCH                               │
│                                             │
│ 7 of 8 products available • 500m away       │
│                                             │
│ Product Availability   ███████████  85%     │
│ Distance               ██████████   78%     │
│ Delivery Efficiency    ███████████  92%     │
│ Store Ratings          ██████████   80%     │
│                                             │
│ Fresh Mart • Daily Needs • +1               │
│                                             │
│ ⚠️ Soap unavailable                         │
│ 📍 Nearby border store has Soap             │
│                                             │
│       [ Add to Cart — ₹450 ]                │
└─────────────────────────────────────────────┘
```

---

# 🎨 Design System

Trustore uses a premium marketplace interface inspired by modern SaaS products and quick-commerce platforms.

### Theme

* Light mode by default
* Dark mode toggle
* CSS variables
* Persistent theme preference using `localStorage`

Theme key:

```text
trustore-theme
```

### Light Mode

```css
--bg-base: #FFFFFF;
--bg-surface: #F8FAFC;
--bg-card: #FFFFFF;
--bg-input: #F1F5F9;

--accent: #00C896;
--accent-dark: #00A87A;

--text-primary: #0F172A;
--text-secondary: #475569;
--text-muted: #94A3B8;

--border: #E2E8F0;
```

### Dark Mode

```css
--bg-base: #080B14;
--bg-surface: #0F1521;
--bg-card: #141C2E;
--bg-input: #1A2236;

--accent: #00D4AA;
--accent-dark: #00B891;

--text-primary: #F1F5F9;
--text-secondary: #94A3B8;
--text-muted: #475569;
```

---

# 🔤 Typography

Trustore uses a three-font hierarchy:

| Font          | Usage                          |
| ------------- | ------------------------------ |
| Syne          | Headings                       |
| DM Sans       | Body and UI                    |
| Space Grotesk | Prices, numbers and statistics |

The visual language focuses on:

* Clean cards
* Subtle borders
* Rounded corners
* Pill-shaped primary actions
* Smooth transitions
* Strong typography
* Teal brand accents
* Responsive layouts

---

# 🧰 Tech Stack

| Technology        | Purpose                    |
| ----------------- | -------------------------- |
| React             | UI framework               |
| Vite              | Frontend tooling           |
| Tailwind CSS      | Styling                    |
| React Router      | Client-side routing        |
| Axios             | API communication          |
| React Context API | Global application state   |
| useReducer        | Complex state management   |
| Leaflet           | Maps                       |
| React Leaflet     | React map integration      |
| Razorpay Checkout | Payments                   |
| Recharts          | Analytics                  |
| React Hot Toast   | Notifications              |
| Lucide React      | Icons                      |
| localStorage      | Theme and cart persistence |

---

# 📁 Project Structure

```text
client/
│
├── public/
│   └── sounds/
│       └── notification.mp3
│
├── src/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── store/
│   │   │   ├── StoreCard.jsx
│   │   │   ├── VerifiedBadge.jsx
│   │   │   └── StoreMap.jsx
│   │   │
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   └── ProductSearch.jsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── CartItem.jsx
│   │   │   └── CartSummary.jsx
│   │   │
│   │   ├── cluster/
│   │   │   ├── ClusterCard.jsx
│   │   │   ├── ClusterMap.jsx
│   │   │   └── ClusterScore.jsx
│   │   │
│   │   ├── ai/
│   │   │   ├── AIShoppingAssistant.jsx
│   │   │   ├── ExtractedProductsList.jsx
│   │   │   └── AITypingIndicator.jsx
│   │   │
│   │   ├── order/
│   │   │   ├── OrderCard.jsx
│   │   │   ├── OrderTimeline.jsx
│   │   │   └── OrderStatusBadge.jsx
│   │   │
│   │   └── review/
│   │       ├── ReviewCard.jsx
│   │       ├── ReviewForm.jsx
│   │       └── StarRating.jsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── customer/
│   │   │   ├── Home.jsx
│   │   │   ├── ShopAI.jsx
│   │   │   ├── BrowseStores.jsx
│   │   │   ├── StoreDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Addresses.jsx
│   │   │
│   │   ├── store-owner/
│   │   │   ├── StoreRegister.jsx
│   │   │   ├── StoreOwnerDashboard.jsx
│   │   │   ├── ManageProducts.jsx
│   │   │   ├── ManageOrders.jsx
│   │   │   └── SalesAnalytics.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── PendingStores.jsx
│   │   │   ├── StoreVerification.jsx
│   │   │   ├── ManageCustomers.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   └── Analytics.jsx
│   │   │
│   │   └── NotFound.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   ├── CartContext.jsx
│   │   └── LocationContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   ├── useCart.js
│   │   ├── useLocation.js
│   │   └── useCluster.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── storeService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   ├── aiService.js
│   │   ├── clusterService.js
│   │   └── paymentService.js
│   │
│   ├── utils/
│   │   ├── formatPrice.js
│   │   ├── formatDate.js
│   │   └── geoUtils.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

# 🧩 Application Architecture

Trustore separates global state, API communication, reusable UI, and pages.

```text
                    App
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Context     Router     Services
          │          │          │
          │          ▼          ▼
          │        Pages       Axios API
          │          │
          ▼          ▼
       Hooks     Components
          │          │
          └────┬─────┘
               ▼
          User Interface
```

---

# 🌐 API Configuration

Create:

```text
.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

If `VITE_API_URL` is not provided, the application uses:

```text
http://localhost:5000/api
```

The API service is responsible for communicating with the Trustore Express backend.

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone <repository-url>
cd trustore/client
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

```bash
cp .env.example .env
```

Then configure:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

# 🛣️ Application Routes

## Public Routes

| Route        | Page                  |
| ------------ | --------------------- |
| `/`          | Customer Home         |
| `/shop-ai`   | AI Shopping Assistant |
| `/stores`    | Browse Stores         |
| `/store/:id` | Store Details         |
| `/login`     | Login                 |
| `/register`  | Registration          |

---

## Customer Routes

| Route                | Page            |
| -------------------- | --------------- |
| `/cart`              | Cart            |
| `/checkout`          | Checkout        |
| `/order-success/:id` | Order Success   |
| `/orders`            | My Orders       |
| `/profile`           | Profile         |
| `/addresses`         | Saved Addresses |

---

## Store Owner Routes

| Route                    | Page               |
| ------------------------ | ------------------ |
| `/store-register`        | Store Registration |
| `/store-owner/dashboard` | Store Dashboard    |
| `/store-owner/products`  | Product Management |
| `/store-owner/orders`    | Order Management   |
| `/store-owner/analytics` | Sales Analytics    |

---

## Admin Routes

| Route                   | Page                |
| ----------------------- | ------------------- |
| `/admin`                | Admin Dashboard     |
| `/admin/stores/pending` | Pending Stores      |
| `/admin/stores/:id`     | Store Verification  |
| `/admin/customers`      | Customer Management |
| `/admin/products`       | Product Management  |
| `/admin/orders`         | Platform Orders     |
| `/admin/analytics`      | Platform Analytics  |

---

# 🔐 Authentication

Authentication is handled through:

```text
AuthContext
     │
     ├── Login
     ├── Register
     ├── Logout
     ├── Current User
     └── Role
```

Protected pages use:

```text
ProtectedRoute
```

Role-specific access prevents users from entering pages intended for another role.

```text
Customer
   └── Customer pages

Store Owner
   └── Store management pages

Admin
   └── Platform administration pages
```

---

# 🛒 Cart Architecture

The cart uses:

```text
React Context
+
localStorage
```

Each cart item stores its associated `storeId`.

This is important because a cluster may contain products from multiple stores.

Example:

```json
{
  "productId": "product123",
  "storeId": "store456",
  "name": "Basmati Rice",
  "quantity": 2,
  "price": 180
}
```

At checkout, cart items can be grouped by store:

```text
Cart
 │
 ├── Fresh Mart
 │     ├── Rice
 │     └── Milk
 │
 ├── Daily Needs
 │     ├── Bread
 │     └── Tea
 │
 └── Border Store
       └── Soap
```

This corresponds to the backend's one-order-per-store architecture.

---

# 📍 Location System

Trustore uses browser geolocation for nearby-store discovery.

The location flow is:

```text
Browser
   │
   ▼
Location Permission
   │
   ├── Allowed
   │     │
   │     ▼
   │  Latitude/Longitude
   │
   └── Denied
         │
         ▼
     Manual Address
```

Location state is managed through:

```text
LocationContext
```

and:

```text
useLocation()
```

---

# 🗺️ Leaflet Maps

Trustore uses:

* Leaflet
* React Leaflet
* OpenStreetMap

No paid map API key is required.

Maps are used for:

* Nearby stores
* Store locations
* Customer location
* Store registration pin
* Cluster visualization

Leaflet CSS is imported once in:

```text
src/main.jsx
```

This ensures map tiles and Leaflet controls render correctly.

---

# 🏪 Store Browsing

The store browser supports:

* Store search
* Category filtering
* Distance filtering
* Rating filtering
* Grid/list presentation
* Map view
* Verified-store badges
* Store details

Only verified stores should be displayed to customers.

The visual verification indicator is provided by:

```text
VerifiedBadge
```

---

# 🏪 Store Detail

The store detail page provides:

```text
Store Information
       │
       ├── Logo
       ├── Name
       ├── Verified Badge
       ├── Rating
       ├── Address
       └── Location
              │
              ▼
         Product Catalog
              │
              ▼
         Customer Reviews
```

Products can be added directly to the cart.

---

# 🏪 Store Owner Experience

Store owners have a dedicated management interface.

## Registration Wizard

```text
Step 1
Basic Information
      ↓
Step 2
Address + Map Pin
      ↓
Step 3
Document Upload
      ↓
Step 4
Review & Submit
```

Documents include:

* Aadhaar
* Shop License

After registration, the store remains pending until an administrator verifies it.

---

# 📊 Store Owner Dashboard

The dashboard provides:

* Verification status
* Admin rejection note
* Product statistics
* Active orders
* Revenue
* Ratings
* Recent orders
* Product management
* Order management
* Sales analytics

Analytics are visualized using:

```text
Recharts
```

---

# 🛡️ Admin Dashboard

The admin interface provides platform-level controls.

### Store Verification

Admins can:

```text
View Pending Store
       │
       ├── View Documents
       │
       ├── Approve
       │
       └── Reject + Reason
```

### Customer Management

Admins can:

* View customers
* Block customers
* Unblock customers

### Platform Management

Admins can view:

* Stores
* Orders
* Products
* Revenue
* Order trends
* Platform analytics

---

# 💳 Razorpay Checkout

The frontend integrates Razorpay Checkout.

The flow is:

```text
Checkout
   │
   ▼
Create Backend Order
   │
   ▼
Create Razorpay Order
   │
   ▼
Open Razorpay Checkout
   │
   ▼
Payment
   │
   ▼
Receive Razorpay Response
   │
   ▼
Send Response to Backend
   │
   ▼
Server Signature Verification
   │
   ▼
Order Success
```

The frontend does **not** independently mark an order as paid.

Payment verification is performed by the backend.

---

# 🔔 Notifications

React Hot Toast is used for user feedback.

Examples:

```text
✓ Product added to cart
✓ Store registered successfully
✓ Payment successful
⚠ Please allow location access
✕ Unable to load stores
✕ Payment verification failed
```

The application is designed to provide friendly error states when API requests fail.

---

# 🤖 AI Interaction States

The AI assistant intentionally provides multiple UI states.

```text
Idle
 │
 ▼
Submitting
 │
 ▼
"Understanding your list..."
 │
 ▼
Products Extracted
 │
 ▼
"Finding the best stores..."
 │
 ▼
Clusters Loaded
 │
 ▼
Best Cluster Displayed
```

The assistant uses:

```text
1 second submit debounce
```

and maintains a minimum:

```text
1.5 second thinking state
```

This follows the project's Groq free-tier design requirements and prevents the interface from appearing to respond unnaturally fast.

---

# 📡 API Service Layer

Frontend API calls are separated into dedicated services.

```text
services/
├── api.js
├── authService.js
├── storeService.js
├── productService.js
├── orderService.js
├── aiService.js
├── clusterService.js
└── paymentService.js
```

This keeps API communication separate from UI components.

For example:

```text
Component
    │
    ▼
Service
    │
    ▼
Axios
    │
    ▼
Express API
```

---

# 🧪 Verification

The frontend was checked for:

* Relative import resolution
* Routed-page compilation
* Component references
* TypeScript/compiler validation
* Leaflet CSS integration
* API endpoint wiring

The frontend verification reported:

```text
24 routed pages
0 compilation errors
```

The application was designed against the Trustore API contract so that the client and backend can be developed independently.

---

# ⚠️ Backend Dependency

The frontend requires the Trustore backend for real application data.

Without the backend:

```text
UI
 │
 ▼
API Request
 │
 ▼
No Express Server
 │
 ▼
Friendly Error Toast
```

Once the backend is running and `VITE_API_URL` points to it, the same pages can consume live:

* Users
* Stores
* Products
* AI extraction
* Store clusters
* Orders
* Payments
* Reviews
* Addresses
* Admin data

---

# 🔗 Frontend ↔ Backend

Trustore is designed as two independently runnable applications:

```text
trustore/
│
├── client/
│   └── React + Vite
│
└── server/
    └── Express + MongoDB
```

Communication:

```text
React Client
     │
     │ HTTP / JSON / Multipart
     ▼
Express API
     │
     ├── MongoDB
     ├── Groq
     ├── Razorpay
     ├── Cloudinary
     └── Nominatim
```

Development URLs:

```text
Frontend
http://localhost:5173

Backend
http://localhost:5000

API
http://localhost:5000/api
```

---

# 📦 Expected Dependencies

Typical frontend dependencies include:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.18.0",
    "axios": "^1.6.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.294.0",
    "recharts": "^2.9.0"
  },
  "devDependencies": {
    "vite": "^4.5.0",
    "tailwindcss": "^3.3.5",
    "@tailwindcss/forms": "^0.5.7",
    "autoprefixer": "^10.4.16"
  }
}
```

Always use the project's actual `package.json` as the authoritative dependency list.

---

# 📱 Responsive Design

The UI is designed for:

```text
Desktop
   │
   ├── Two-column AI interface
   ├── Dashboard layouts
   ├── Maps + grids
   └── Analytics

Tablet
   │
   ├── Adaptive grids
   ├── Collapsible navigation
   └── Responsive cards

Mobile
   │
   ├── Stacked layouts
   ├── Touch-friendly controls
   ├── Horizontal category/store sections
   └── Mobile-friendly checkout
```

---

# 🎯 User Journeys

## Customer

```text
Landing Page
    ↓
Allow Location
    ↓
AI Shopping Assistant
    ↓
Enter Grocery List
    ↓
AI Extraction
    ↓
Dynamic Store Clustering
    ↓
Best Cluster
    ↓
Add Products
    ↓
Cart
    ↓
Checkout
    ↓
Razorpay
    ↓
Order Tracking
    ↓
Review
```

## Store Owner

```text
Register
   ↓
Store Information
   ↓
Location
   ↓
Documents
   ↓
Submit
   ↓
Admin Verification
   ↓
Approved
   ↓
Manage Products
   ↓
Receive Orders
   ↓
Update Order Status
   ↓
View Analytics
```

## Admin

```text
Admin Login
    ↓
Dashboard
    ↓
Pending Stores
    ↓
Review Documents
    ↓
Approve / Reject
    ↓
Manage Customers
    ↓
Manage Orders
    ↓
Platform Analytics
```

---

# 🚧 Current Scope

The frontend includes the core Trustore user interfaces:

* Authentication
* Customer marketplace
* AI shopping assistant
* Store discovery
* Store details
* Leaflet maps
* Location management
* Local-storage cart
* Checkout
* Razorpay integration
* Order tracking
* Reviews
* Store-owner registration
* Store-owner dashboard
* Product management
* Order management
* Sales analytics
* Admin dashboard
* Store verification
* Customer management
* Platform orders
* Platform analytics
* Light/dark theme

The following item is intentionally not part of the current implementation:

```text
CartDrawer
```

The full `/cart` page currently provides the cart experience.

---

# 🔮 Future Improvements

Potential frontend improvements include:

* Slide-in `CartDrawer`
* Advanced product filtering
* Better product matching visualization
* Cluster comparison animations
* Skeleton loading states across every page
* Offline-friendly cart synchronization
* PWA support
* Push notifications
* Improved accessibility
* Image optimization
* Route-level code splitting
* Lazy loading for maps and analytics
* Production error monitoring
* Automated frontend tests

---

# 🚢 Production Build

Create a production build:

```bash
npm run build
```

Preview it locally:

```bash
npm run preview
```

Before deployment, make sure:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_RAZORPAY_KEY_ID=your_production_or_test_key
```

is correctly configured.

---

# ☁️ Deployment

Recommended deployment architecture:

```text
                 ┌───────────────────┐
                 │  Trustore Client  │
                 │      Vercel       │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │  Trustore Server  │
                 │      Render       │
                 └─────────┬─────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
     MongoDB Atlas     Cloudinary          Groq
          │
          ▼
      Razorpay
```

The frontend is completely deployable independently from the backend.

---

# 🧑‍💻 Development Philosophy

The Trustore frontend is organized around three principles:

### Simple

Customers should be able to describe what they need without manually searching through hundreds of products.

### Intelligent

The UI exposes the reasoning behind the store recommendation instead of simply showing an unexplained result.

### Trustworthy

Verified-store indicators, clear order states, transparent cluster scores, and payment confirmation give users confidence throughout the shopping process.

---

# 🛒 Trustore

**AI-powered shopping for trusted local stores.**

> *"Shop only from trusted local stores."*
