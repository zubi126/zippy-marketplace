import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./PendingApproval.css";

function PendingApproval() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="pending-page">
      <div className="pending-card">

        <div className="pending-logo">
          M
        </div>

        <div className="pending-icon">
          ⏳
        </div>

        <h1>Account Under Review</h1>

        <p className="pending-main-text">
          Hi {user?.name || "Rider"}, your rider application is currently
          under review by our admin team.
        </p>

        <p className="pending-sub-text">
          You’ll be able to access your rider dashboard and start accepting
          deliveries once your account has been approved.
        </p>

        <div className="pending-status">
          <span className="pending-dot"></span>
          <span>Pending Approval</span>
        </div>

        <div className="pending-info">
          <div>
            <span>Name</span>
            <strong>{user?.name || "—"}</strong>
          </div>

          <div>
            <span>Phone</span>
            <strong>{user?.phone || "—"}</strong>
          </div>
        </div>

        <button
          type="button"
          className="pending-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

        <button
          type="button"
          className="pending-login"
          onClick={() => window.location.reload()}
        >
          Check Approval Status
        </button>

      </div>
    </div>
  );
}

export default PendingApproval;