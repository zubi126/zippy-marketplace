// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import "./Header.css";

// function Header() {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//     navigate("/login", { replace: true });
//   };

//   return (
//     <header className="rider-header">
//       <div className="rider-header-container">

//         {/* Logo */}
//         <button
//           type="button"
//           className="rider-header-brand"
//           onClick={() => navigate("/")}
//         >
//           <div className="rider-header-logo">
//             M
//           </div>

//           <div className="rider-header-brand-text">
//             <strong>
//               My<span>Kasho</span>
//             </strong>

//             <small>
//               Rider
//             </small>
//           </div>
//         </button>

//         {/* Navigation */}
//         <nav className="rider-header-nav">

//           <button
//             type="button"
//             onClick={() => navigate("/")}
//           >
//             Dashboard
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               navigate("/deliveries")
//             }
//           >
//             Deliveries
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               navigate("/earnings")
//             }
//           >
//             Earnings
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               navigate("/profile")
//             }
//           >
//             Profile
//           </button>

//         </nav>

//         {/* Account */}
//         <div className="rider-header-account">

//           <button
//             type="button"
//             className="rider-header-profile"
//             onClick={() =>
//               navigate("/profile")
//             }
//           >
//             <span className="rider-header-avatar">
//               {user?.name
//                 ? user.name.charAt(0).toUpperCase()
//                 : "R"}
//             </span>

//             <span className="rider-header-user">
//               <small>Rider</small>

//               <strong>
//                 {user?.name || "Profile"}
//               </strong>
//             </span>
//           </button>

//           <button
//             type="button"
//             className="rider-header-logout"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>

//         </div>

//       </div>
//     </header>
//   );
// }

// export default Header;



















import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

function Header({ menuOpen, onMenuClick, onMenuClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onMenuClose();
    navigate("/login", { replace: true });
  };

  const handleNavigation = (path) => {
    navigate(path);
    onMenuClose();
  };

  return (
    <header className="rider-header">
      <div className="rider-header-container">
        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="rider-header-menu-toggle"
          onClick={onMenuClick}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Logo */}
        <button
          type="button"
          className="rider-header-brand"
          onClick={() => handleNavigation("/")}
        >
          <div className="rider-header-logo">M</div>

          <div className="rider-header-brand-text">
            <strong>
              My<span>Kasho</span>
            </strong>
            <small>Rider</small>
          </div>
        </button>

        {/* Navigation */}
        <nav
          className={`rider-header-nav ${
            menuOpen ? "mobile-menu-open" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => handleNavigation("/")}
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => handleNavigation("/deliveries")}
          >
            Deliveries
          </button>

          <button
            type="button"
            onClick={() => handleNavigation("/earnings")}
          >
            Earnings
          </button>

          <button
            type="button"
            onClick={() => handleNavigation("/profile")}
          >
            Profile
          </button>
        </nav>

        {/* Account */}
        <div className="rider-header-account">
          <button
            type="button"
            className="rider-header-profile"
            onClick={() => handleNavigation("/profile")}
          >
            <span className="rider-header-avatar">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "R"}
            </span>

            <span className="rider-header-user">
              <small>Rider</small>
              <strong>{user?.name || "Profile"}</strong>
            </span>
          </button>

          <button
            type="button"
            className="rider-header-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;