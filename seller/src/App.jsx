import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ShopProfile from "./pages/ShopProfile";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Orders from "./pages/Orders";

import OrderDetails from "./pages/OrderDetails";
import SellerApproval from "./pages/SellerApproval";
import Earnings from "./pages/Earnings";


import "./App.css";


// function AppContent() {
//   const { isLoggedIn } = useAuth();

//   return (
//     <>
//       {isLoggedIn && <Header />}
//       {isLoggedIn && <Sidebar />}

//       <main className="seller-main">
//         <Routes>
//           <Route
//             path="/login"
//             element={<Login />}
//           />

//           <Route
//             path="/register"
//             element={<Register />}
//           />






          
//           <Route
//   path="/forgot-password"
//   element={<ForgotPassword />}
// />




//             <Route 
//                path="/approval-pending" 
//                element={<SellerApproval />} />









//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/shop"
//             element={
//               <ProtectedRoute>
//                 <ShopProfile />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/products"
//             element={
//               <ProtectedRoute>
//                 <Products />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/products/add"
//             element={
//               <ProtectedRoute>
//                 <AddProduct />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/products/edit/:id"
//             element={
//               <ProtectedRoute>
//                 <EditProduct />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/orders"
//             element={
//               <ProtectedRoute>
//                 <Orders />
//               </ProtectedRoute>
//             }
//           />




// <Route
//   path="/orders/:orderId"
//   element={
//     <ProtectedRoute>
//       <OrderDetails />
//     </ProtectedRoute>
//   }
// />


          
//         </Routes>
//       </main>
//     </>
//   );
// }















function AppContent() {
  const { isLoggedIn } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn && (
        <Header
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
        />
      )}

      {isLoggedIn && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {isLoggedIn && sidebarOpen && (
        <button
          type="button"
          className="seller-sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="seller-main">
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/approval-pending"
            element={<SellerApproval />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <ShopProfile />
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
            path="/products/add"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/edit/:id"
            element={
              <ProtectedRoute>
                <EditProduct />
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
  path="/earnings"
  element={
    <ProtectedRoute>
      <Earnings />
    </ProtectedRoute>
  }
/>


          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
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