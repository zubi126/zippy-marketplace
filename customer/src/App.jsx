// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import Home from "./pages/Home";
// import Products from "./pages/Products";


// import ProductDetails from "./pages/ProductDetails";
// import Cart from "./pages/Cart";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Checkout from "./pages/Checkout";
// import OrderSuccess from "./pages/OrderSuccess";
// import OrderDetails from "./pages/OrderDetails";

// import Orders from "./pages/Orders";
// import Profile from "./pages/Profile";
// import Addresses from "./pages/Addresses";
// import AddAddress from "./pages/AddAddress";
// import EditAddress from "./pages/EditAddress";
// import Shops from "./pages/Shops";
// import ShopDetails from "./pages/ShopDetails";



// import "./App.css";

// function App() {
//   return (
//     <BrowserRouter>
//  <Header />


//       <Routes>
//         <Route path="/" element={<Home />} />

//         <Route path="/products" element={<Products />} />

//         <Route path="/shops" element={<Shops />} />

//         <Route path="/shops/search" element={<Shops />} />


//         <Route path="/shops/:slug" element={<ShopDetails />} />

//         <Route path="/cart" element={<Cart />} />

//         <Route path="/login" element={<Login />} />

//         <Route path="/register" element={<Register />} />

//          <Route path="/checkout" element={<Checkout />} />

//         <Route path="/profile" element={<Profile />} />

//        <Route path="/addresses" element={<Addresses />} />

//        <Route path="/addresses/new" element={<AddAddress />} />

//        <Route path="/addresses/:id/edit" element={<EditAddress />} />


//          <Route
//   path="/order-success/:orderId"
//   element={<OrderSuccess />}
// />

//          <Route
//     path="/products/:id"
//     element={<ProductDetails />}
//   />


// <Route
//   path="/orders/:orderId"
//   element={<OrderDetails />}
// />




// <Route
//   path="/orders"
//   element={<Orders />}
// />



//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


























import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Addresses from "./pages/Addresses";
import AddAddress from "./pages/AddAddress";
import EditAddress from "./pages/EditAddress";
import Shops from "./pages/Shops";
import ShopDetails from "./pages/ShopDetails";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/shops/search" element={<Shops />} />
        <Route path="/shops/:slug" element={<ShopDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

        {/* Protected pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/addresses/new" element={<AddAddress />} />
          <Route path="/addresses/:id/edit" element={<EditAddress />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route
            path="/order-success/:orderId"
            element={<OrderSuccess />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
