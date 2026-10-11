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
//     <header className="admin-header">
//       <div className="admin-header-container">

//         <button
//           type="button"
//           className="admin-header-brand"
//           onClick={() => navigate("/")}
//         >
//           <div className="admin-header-logo">
//             M
//           </div>

//           <div className="admin-header-brand-text">
//             <strong>
//               My<span>Kasho</span>
//             </strong>

//             <small>Admin</small>
//           </div>
//         </button>

//         <div className="admin-header-account">

//           <div className="admin-header-profile">
//             <span className="admin-header-avatar">
//               {user?.name
//                 ? user.name.charAt(0).toUpperCase()
//                 : "A"}
//             </span>

//             <div className="admin-header-user">
//               <small>Administrator</small>
//               <strong>
//                 {user?.name || "Admin"}
//               </strong>
//             </div>
//           </div>

//           <button
//             type="button"
//             className="admin-header-logout"
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

  return (
    <header className="admin-header">
      <div className="admin-header-container">

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="admin-header-menu-toggle"
          onClick={onMenuClick}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Brand */}
        <button
          type="button"
          className="admin-header-brand"
          onClick={() => {
            onMenuClose();
            navigate("/");
          }}
        >
          <div className="admin-header-logo">
            M
          </div>

          <div className="admin-header-brand-text">
            <strong>
              My<span>Kasho</span>
            </strong>

            <small>Admin</small>
          </div>
        </button>

        {/* Account */}
        <div className="admin-header-account">

          <div className="admin-header-profile">
            <span className="admin-header-avatar">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "A"}
            </span>

            <div className="admin-header-user">
              <small>Administrator</small>
              <strong>
                {user?.name || "Admin"}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="admin-header-logout"
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
