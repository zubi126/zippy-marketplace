// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Deliveries from "./pages/Deliveries";
// import DeliveryDetails from "./pages/DeliveryDetails";
// import Earnings from "./pages/Earnings";
// import Profile from "./pages/Profile";

// import "./App.css";

// function ProtectedRoute({ children }) {
//   const { isLoggedIn } = useAuth();

//   if (!isLoggedIn) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

// function AppContent() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       <Route
//         path="/"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/deliveries"
//         element={
//           <ProtectedRoute>
//             <Deliveries />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/deliveries/:deliveryId"
//         element={
//           <ProtectedRoute>
//             <DeliveryDetails />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/earnings"
//         element={
//           <ProtectedRoute>
//             <Earnings />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/profile"
//         element={
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         }
//       />

//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppContent />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;














// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import {
//   AuthProvider,
//   useAuth,
// } from "./context/AuthContext";

// import { useEffect, useState } from "react";

// import api from "./services/api";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Deliveries from "./pages/Deliveries";
// import DeliveryDetails from "./pages/DeliveryDetails";
// import Earnings from "./pages/Earnings";
// import Profile from "./pages/Profile";

// import "./App.css";

// function ProtectedRoute({ children }) {
//   const { isLoggedIn, user } = useAuth();

//   const [checking, setChecking] = useState(true);
//   const [approved, setApproved] = useState(false);

//   useEffect(() => {
//     const checkRiderApproval = async () => {
//       if (!isLoggedIn || user?.role !== "RIDER") {
//         setApproved(false);
//         setChecking(false);
//         return;
//       }

//       try {
//         const response = await api.get("/riders/me");

//         const rider = response.data?.rider;

//         if (
//           rider?.verificationStatus === "APPROVED"
//         ) {
//           setApproved(true);
//         } else {
//           setApproved(false);
//         }
//       } catch (error) {
//         console.error(
//           "Failed to verify rider approval:",
//           error
//         );

//         setApproved(false);
//       } finally {
//         setChecking(false);
//       }
//     };

//     checkRiderApproval();
//   }, [isLoggedIn, user]);

//   if (!isLoggedIn) {
//     return <Navigate to="/login" replace />;
//   }

//   if (user?.role !== "RIDER") {
//     return <Navigate to="/login" replace />;
//   }

//   if (checking) {
//     return (
//       <div className="rider-access-check">
//         Checking rider account...
//       </div>
//     );
//   }

//   if (!approved) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

// function AppContent() {
//   return (
//     <Routes>
//       <Route
//         path="/login"
//         element={<Login />}
//       />

//       <Route
//         path="/register"
//         element={<Register />}
//       />

//       <Route
//         path="/"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/deliveries"
//         element={
//           <ProtectedRoute>
//             <Deliveries />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/deliveries/:deliveryId"
//         element={
//           <ProtectedRoute>
//             <DeliveryDetails />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/earnings"
//         element={
//           <ProtectedRoute>
//             <Earnings />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/profile"
//         element={
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="*"
//         element={<Navigate to="/" replace />}
//       />
//     </Routes>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppContent />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;









import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";

import api from "./services/api";
import Header from "./components/Header";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import PendingApproval from "./pages/PendingApproval";
import Dashboard from "./pages/Dashboard";
import Deliveries from "./pages/Deliveries";
import DeliveryDetails from "./pages/DeliveryDetails";
import Earnings from "./pages/Earnings";
import Profile from "./pages/Profile";

import "./App.css";

function ProtectedRoute({ children }) {
  const { isLoggedIn, user } = useAuth();

  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkRiderStatus = async () => {
      if (!isLoggedIn || user?.role !== "RIDER") {
        setStatus(null);
        setChecking(false);
        return;
      }

      try {
        const response = await api.get("/riders/me");

        const rider = response.data?.rider;

        setStatus(rider?.verificationStatus || null);
      } catch (error) {
        console.error("Failed to check rider status:", error);
        setStatus(null);
      } finally {
        setChecking(false);
      }
    };

    checkRiderStatus();
  }, [isLoggedIn, user]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "RIDER") {
    return <Navigate to="/login" replace />;
  }

  if (checking) {
    return (
      <div className="rider-access-check">
        Checking rider account...
      </div>
    );
  }

  if (status === "PENDING") {
    return <Navigate to="/pending-approval" replace />;
  }

  if (status === "REJECTED") {
    return <Navigate to="/login" replace />;
  }

  if (status !== "APPROVED") {
    return <Navigate to="/login" replace />;
  }

  return (
  <>
  <Header
    menuOpen={sidebarOpen}
    onMenuClick={() => setSidebarOpen((prev) => !prev)}
    onMenuClose={() => setSidebarOpen(false)}
  />
  {children}
</>
  );
}

function AppContent() {
  return (
    <Routes>

      {/* Public routes */}
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



      {/* Pending approval page */}
      <Route
        path="/pending-approval"
        element={
          <PendingApproval />
        }
      />

      {/* Protected rider routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/deliveries"
        element={
          <ProtectedRoute>
            <Deliveries />
          </ProtectedRoute>
        }
      />

      <Route
        path="/deliveries/:deliveryId"
        element={
          <ProtectedRoute>
            <DeliveryDetails />
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
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
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