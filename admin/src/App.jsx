import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Riders from "./pages/Riders";
import RiderDetails from "./pages/RiderDetails";

import Shops from "./pages/Shops";


import ShopDetails from "./pages/ShopDetails";


import Orders from "./pages/Orders";
import Products from "./pages/Products";

import Refunds from "./pages/Refunds";


import Earnings from "./pages/Earnings";

import SellerPayouts from "./pages/SellerPayouts";
import RiderPayouts from "./pages/RiderPayouts";

import SellerPayoutDetails from "./pages/SellerPayoutDetails";
import RiderPayoutDetails from "./pages/RiderPayoutDetails";

import CreateSellerPayout from "./pages/CreateSellerPayout";
import CreateRiderPayout from "./pages/CreateRiderPayout";

import "./App.css";

function ProtectedRoute({ children }) {
  const { isLoggedIn, user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return (
  <>
  <Header
    menuOpen={sidebarOpen}
    onMenuClick={() => setSidebarOpen((prev) => !prev)}
    onMenuClose={() => setSidebarOpen(false)}
  />

  <div className="admin-layout">
    <Sidebar
      isOpen={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
    />

    {sidebarOpen && (
      <button
        type="button"
        className="admin-sidebar-backdrop"
        aria-label="Close navigation menu"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    <main className="admin-main">
      {children}
    </main>
  </div>
</>
  );
}

function AppContent() {
  return (
    <Routes>

      {/* Public */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Protected Admin */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      

      <Route
  path="/riders"
  element={
    <ProtectedRoute>
      <Riders />
    </ProtectedRoute>
  }
/>








    <Route
  path="/riders/:riderId"
  element={
    <ProtectedRoute>
      <RiderDetails />
    </ProtectedRoute>
  }
/>







<Route
  path="/shops"
  element={
    <ProtectedRoute>
      <Shops />
    </ProtectedRoute>
  }
/>





<Route
  path="/shops/:shopId"
  element={
    <ProtectedRoute>
      <ShopDetails />
    </ProtectedRoute>
  }
/>





<Route
  path="/rider-payouts/:riderId"
  element={
    <ProtectedRoute>
      <RiderPayoutDetails />
    </ProtectedRoute>
  }
/>



<Route
  path="/orders"
  element={
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  }
/>







<Route
  path="/products"
  element={
    <ProtectedRoute>
      <Products />
    </ProtectedRoute>
  }
/>








<Route
  path="/refunds"
  element={
    <ProtectedRoute>
      <Refunds />
    </ProtectedRoute>
  }
/>






<Route
  path="/earnings"
  element={
    <ProtectedRoute>
      <Earnings />
    </ProtectedRoute>
  }
/>







<Route
  path="/seller-payouts"
  element={
    <ProtectedRoute>
      <SellerPayouts />
    </ProtectedRoute>
  }
/>







<Route
  path="/seller-payouts/:shopId"
  element={
    <ProtectedRoute>
      <SellerPayoutDetails />
    </ProtectedRoute>
  }
/>







    <Route
  path="/create-seller-payout"
  element={
    <ProtectedRoute>
      <CreateSellerPayout />
    </ProtectedRoute>
  }
/>








      <Route
 path="/create-rider-payout"
  element={
    <ProtectedRoute>
     <CreateRiderPayout />
    </ProtectedRoute>
  }
/>







<Route
  path="/rider-payouts"
  element={
    <ProtectedRoute>
      <RiderPayouts />
    </ProtectedRoute>
  }
/>





      {/* Unknown route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;