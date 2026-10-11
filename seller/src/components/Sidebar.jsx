// import { NavLink } from "react-router-dom";
// import "./Sidebar.css";

// function Sidebar() {
//   return (
//     <aside className="seller-sidebar">
//       <div className="sidebar-menu">

//         <div className="sidebar-section-title">
//           MAIN MENU
//         </div>

//         <nav className="sidebar-nav">
//           <NavLink
//             to="/"
//             end
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? "active" : ""}`
//             }
//           >
//             <span className="sidebar-icon">⌂</span>
//             <span>Dashboard</span>
//           </NavLink>

//           <NavLink
//             to="/shop"
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? "active" : ""}`
//             }
//           >
//             <span className="sidebar-icon">▣</span>
//             <span>Shop Profile</span>
//           </NavLink>

//           <NavLink
//             to="/products"
//             end
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? "active" : ""}`
//             }
//           >
//             <span className="sidebar-icon">▤</span>
//             <span>Products</span>
//           </NavLink>

//           <NavLink
//             to="/products/add"
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? "active" : ""}`
//             }
//           >
//             <span className="sidebar-icon">＋</span>
//             <span>Add Product</span>
//           </NavLink>

//           <NavLink
//             to="/orders"
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? "active" : ""}`
//             }
//           >
//             <span className="sidebar-icon">▱</span>
//             <span>Orders</span>
//           </NavLink>
//         </nav>

//       </div>

//       <div className="sidebar-bottom">
//         <div className="sidebar-help">
//           <div className="sidebar-help-icon">?</div>

//           <div>
//             <strong>Need Help?</strong>
//             <span>Contact support</span>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;






















import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`seller-sidebar ${isOpen ? "sidebar-open" : ""}`}
    >
      <div className="sidebar-menu">

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">⌂</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/shop"
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">▣</span>
            <span>Shop Profile</span>
          </NavLink>

          <NavLink
            to="/products"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">▤</span>
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/products/add"
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">＋</span>
            <span>Add Product</span>
          </NavLink>

          <NavLink
            to="/orders"
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">▱</span>
            <span>Orders</span>
          </NavLink>
        </nav>

      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-help">
          <div className="sidebar-help-icon">?</div>

          <div>
            <strong>Need Help?</strong>
            <span>Contact support</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
