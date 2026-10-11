// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import "./Header.css";

// function Header() {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <header className="seller-header">
//       {/* Left */}
//       <div
//         className="seller-header-brand"
//         onClick={() => navigate("/")}
//       >
//         <div className="seller-logo">
//           M
//         </div>

//         <div className="seller-brand-text">
//           <h2>MyKasho</h2>
//           <span>Seller</span>
//         </div>
//       </div>

//       {/* Right */}
//       <div className="seller-header-right">
//         <button
//           type="button"
//           className="seller-notification-button"
//           title="Notifications"
//         >
//           <span>🔔</span>
//         </button>

//         <div className="seller-profile">
//           <div className="seller-avatar">
//             {(user?.name || "S").charAt(0).toUpperCase()}
//           </div>

//           <div className="seller-profile-info">
//             <strong>{user?.name || "Seller"}</strong>
//             <span>Shopkeeper</span>
//           </div>
//         </div>

//         <button
//           type="button"
//           className="seller-logout-button"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// }

// export default Header;






















import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

function Header({ onMenuClick, sidebarOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="seller-header">
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="seller-menu-toggle"
        onClick={onMenuClick}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* Left */}
      <div
        className="seller-header-brand"
        onClick={() => navigate("/")}
      >
        <div className="seller-logo">
          M
        </div>

        <div className="seller-brand-text">
          <h2>MyKasho</h2>
          <span>Seller</span>
        </div>
      </div>

      {/* Right */}
      <div className="seller-header-right">
        <button
          type="button"
          className="seller-notification-button"
          title="Notifications"
        >
          <span>🔔</span>
        </button>

        <div className="seller-profile">
          <div className="seller-avatar">
            {(user?.name || "S").charAt(0).toUpperCase()}
          </div>

          <div className="seller-profile-info">
            <strong>{user?.name || "Seller"}</strong>
            <span>Shopkeeper</span>
          </div>
        </div>

        <button
          type="button"
          className="seller-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
