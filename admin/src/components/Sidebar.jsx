// import { NavLink } from "react-router-dom";
// import "./Sidebar.css";

// function Sidebar() {
//   const menuItems = [
//     {
//       label: "Dashboard",
//       path: "/",
//       icon: "⌂",
//     },
//     {
//       label: "Riders",
//       path: "/riders",
//       icon: "🚴",
//     },
//     {
//       label: "Shops",
//       path: "/shops",
//       icon: "🏪",
//     },
//     {
//       label: "Orders",
//       path: "/orders",
//       icon: "📦",
//     },
//     {
//       label: "Products",
//       path: "/products",
//       icon: "🛍️",
//     },
//    {
//   label: "Refunds",
//   path: "/refunds",
//   icon: "↩️",
// },
// {
//   label: "Earnings",
//   path: "/earnings",
//   icon: "📊",
// },
// {
//   label: "Seller Payouts",
//   path: "/seller-payouts",
//   icon: "💰",
// },
// {
//   label: "Rider Payouts",
//   path: "/rider-payouts",
//   icon: "💸",
// },
//   ];

//   return (
//     <aside className="admin-sidebar">

//       <div className="admin-sidebar-title">
//         Management
//       </div>

//       <nav className="admin-sidebar-nav">
//         {menuItems.map((item) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             end={item.path === "/"}
//             className={({ isActive }) =>
//               `admin-sidebar-link ${
//                 isActive ? "active" : ""
//               }`
//             }
//           >
//             <span className="admin-sidebar-icon">
//               {item.icon}
//             </span>

//             <span>
//               {item.label}
//             </span>
//           </NavLink>
//         ))}
//       </nav>

//     </aside>
//   );
// }

// export default Sidebar;























import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    {
      label: "Dashboard",
      path: "/",
      icon: "⌂",
    },
    {
      label: "Riders",
      path: "/riders",
      icon: "🚴",
    },
    {
      label: "Shops",
      path: "/shops",
      icon: "🏪",
    },
    {
      label: "Orders",
      path: "/orders",
      icon: "📦",
    },
    {
      label: "Products",
      path: "/products",
      icon: "🛍️",
    },
    {
      label: "Refunds",
      path: "/refunds",
      icon: "↩️",
    },
    {
      label: "Earnings",
      path: "/earnings",
      icon: "📊",
    },
    {
      label: "Seller Payouts",
      path: "/seller-payouts",
      icon: "💰",
    },
    {
      label: "Rider Payouts",
      path: "/rider-payouts",
      icon: "💸",
    },
  ];

  return (
    <aside
      className={`admin-sidebar ${isOpen ? "sidebar-open" : ""}`}
    >
      <div className="admin-sidebar-title">
        Management
      </div>

      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              `admin-sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="admin-sidebar-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
