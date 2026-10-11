// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import "./Login.css";

// function Login() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useAuth();

//   const [form, setForm] = useState({
//     phone: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
      
// const response = await api.post("/auth/login", {
//   phone: form.phone,
//   password: form.password,
//   portal: "customer",
// });






//       const { token, user } = response.data;

//       // Allow only CUSTOMER accounts on the customer website
//       if (user?.role !== "CUSTOMER") {
//         setError(
//           "This account cannot log in to the customer website. Please use your designated portal."
//         );
//         return;
//       }

//       login(token, user);

//       const redirectTo = location.state?.from;
//       navigate(
//         redirectTo
//           ? `${redirectTo.pathname}${redirectTo.search || ""}${redirectTo.hash || ""}`
//           : "/",
//         { replace: true }
//       );








//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           "Login failed. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <div className="login-logo">MyKasho</div>

//         <h1>Welcome Back</h1>
//         <p className="login-subtitle">
//           Login to continue shopping
//         </p>

//         {error && <div className="login-error">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <label>Phone Number</label>

//           <input
//             type="tel"
//             name="phone"
//             placeholder="Enter phone number"
//             value={form.phone}
//             onChange={handleChange}
//             required
//           />

//           <label>Password</label>

//           <input
//             type="password"
//             name="password"
//             placeholder="Enter password"
//             value={form.password}
//             onChange={handleChange}
//             required
//           />

//           <button type="submit" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="login-footer">
//           Don't have an account?{" "}
//           <span onClick={() => navigate("/register")}>
//             Create Account
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;












import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        phone: form.phone,
        password: form.password,
        portal: "customer",
      });

      const { token, user } = response.data;

      if (user?.role !== "CUSTOMER") {
        setError(
          "This account cannot log in to the customer website. Please use your designated portal."
        );
        return;
      }

      login(token, user);

      const redirectTo = location.state?.from;

      navigate(
        redirectTo
          ? `${redirectTo.pathname}${redirectTo.search || ""}${redirectTo.hash || ""}`
          : "/",
        { replace: true }
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">MyKasho</div>

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Login to continue shopping
        </p>

        {error && (
          <div className="login-error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="phone">Phone Number</label>

          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="login-forgot-password">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
