import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function ProtectedRoute({ children }) {
  const { isLoggedIn, user } = useAuth();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkShopStatus = async () => {
      if (!isLoggedIn || user?.role !== "SHOPKEEPER") {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/shops/me/status");

        const shopStatus =
          response.data?.shop?.verificationStatus;

        setStatus(shopStatus);
      } catch (error) {
        console.error("Failed to check shop approval status:", error);

        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    checkShopStatus();
  }, [isLoggedIn, user]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "SHOPKEEPER") {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Checking shop approval...
      </div>
    );
  }

  if (status === "PENDING") {
    return <Navigate to="/approval-pending" replace />;
  }

  if (status === "REJECTED") {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Shop Registration Rejected</h2>
        <p>
          Your shop registration has been rejected by the admin.
        </p>
      </div>
    );
  }

  if (status === "SUSPENDED") {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Shop Suspended</h2>
        <p>
          Your seller account is currently suspended.
        </p>
      </div>
    );
  }

  if (status !== "APPROVED") {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Unable to verify shop status</h2>
        <p>Please try again.</p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;