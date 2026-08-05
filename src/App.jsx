import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';

// Every page is loaded on demand (route-based code splitting) instead of all upfront —
// visiting the home page no longer forces the browser to also fetch admin pages, the
// recharts-based analytics pages, or the leaflet map bundle before it can render.
const Home = lazy(() => import('./pages/customer/Home'));
const ShopAI = lazy(() => import('./pages/customer/ShopAI'));
const BrowseStores = lazy(() => import('./pages/customer/BrowseStores'));
const StoreDetail = lazy(() => import('./pages/customer/StoreDetail'));
const Cart = lazy(() => import('./pages/customer/Cart'));
const Checkout = lazy(() => import('./pages/customer/Checkout'));
const OrderSuccess = lazy(() => import('./pages/customer/OrderSuccess'));
const MyOrders = lazy(() => import('./pages/customer/MyOrders'));
const OrderDetail = lazy(() => import('./pages/customer/OrderDetail'));
const ReviewSubmit = lazy(() => import('./pages/customer/ReviewSubmit'));
const Profile = lazy(() => import('./pages/customer/Profile'));
const Addresses = lazy(() => import('./pages/customer/Addresses'));
const Wishlist = lazy(() => import('./pages/customer/Wishlist'));
const Settings = lazy(() => import('./pages/customer/Settings'));

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));

const StoreRegister = lazy(() => import('./pages/store-owner/StoreRegister'));
const StoreOwnerDashboard = lazy(() => import('./pages/store-owner/StoreOwnerDashboard'));
const ManageProducts = lazy(() => import('./pages/store-owner/ManageProducts'));
const ManageOrders = lazy(() => import('./pages/store-owner/ManageOrders'));
const SalesAnalytics = lazy(() => import('./pages/store-owner/SalesAnalytics'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const PendingStores = lazy(() => import('./pages/admin/PendingStores'));
const StoreVerification = lazy(() => import('./pages/admin/StoreVerification'));
const ManageCustomers = lazy(() => import('./pages/admin/ManageCustomers'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));

const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-base">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          },
        }}
      />
      <Navbar />

      <main className="flex-1 pt-16">
        <Suspense fallback={<Loader fullScreen />}>
          <Routes>
            {/* Public / customer */}
            <Route path="/" element={<Home />} />
            <Route path="/shop-ai" element={<ShopAI />} />
            <Route path="/stores" element={<BrowseStores />} />
            <Route path="/store/:id" element={<StoreDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer — requires auth */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success/:id"
              element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute roles={['customer']}>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute roles={['customer']}>
                  <OrderDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id/review"
              element={
                <ProtectedRoute roles={['customer']}>
                  <ReviewSubmit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addresses"
              element={
                <ProtectedRoute roles={['customer']}>
                  <Addresses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Store owner */}
            <Route path="/store-register" element={<StoreRegister />} />
            <Route
              path="/store-owner/dashboard"
              element={
                <ProtectedRoute roles={['storeOwner']}>
                  <StoreOwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store-owner/products"
              element={
                <ProtectedRoute roles={['storeOwner']}>
                  <ManageProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store-owner/orders"
              element={
                <ProtectedRoute roles={['storeOwner']}>
                  <ManageOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store-owner/analytics"
              element={
                <ProtectedRoute roles={['storeOwner']}>
                  <SalesAnalytics />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores/pending"
              element={
                <ProtectedRoute roles={['admin']}>
                  <PendingStores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores/:id/verify"
              element={
                <ProtectedRoute roles={['admin']}>
                  <StoreVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <ProtectedRoute roles={['admin']}>
                  <ManageCustomers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}