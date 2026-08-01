import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/customer/Home';
import ShopAI from './pages/customer/ShopAI';
import BrowseStores from './pages/customer/BrowseStores';
import StoreDetail from './pages/customer/StoreDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderSuccess from './pages/customer/OrderSuccess';
import MyOrders from './pages/customer/MyOrders';
import OrderDetail from './pages/customer/OrderDetail';
import ReviewSubmit from './pages/customer/ReviewSubmit';
import Profile from './pages/customer/Profile';
import Addresses from './pages/customer/Addresses';
import Wishlist from './pages/customer/Wishlist';
import Settings from './pages/customer/Settings';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import StoreRegister from './pages/store-owner/StoreRegister';
import StoreOwnerDashboard from './pages/store-owner/StoreOwnerDashboard';
import ManageProducts from './pages/store-owner/ManageProducts';
import ManageOrders from './pages/store-owner/ManageOrders';
import SalesAnalytics from './pages/store-owner/SalesAnalytics';

import AdminDashboard from './pages/admin/AdminDashboard';
import PendingStores from './pages/admin/PendingStores';
import StoreVerification from './pages/admin/StoreVerification';
import ManageCustomers from './pages/admin/ManageCustomers';
import AdminOrders from './pages/admin/AdminOrders';
import Analytics from './pages/admin/Analytics';

import NotFound from './pages/NotFound';

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

      <main className="flex-1">
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
      </main>

      <Footer />
    </div>
  );
}