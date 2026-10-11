// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import "./Login.css";

// function Login() {
//   const navigate = useNavigate();
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

//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");

//     if (!form.phone || !form.password) {
//       setError("Phone number and password are required.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await api.post("/auth/login", {
//   phone: form.phone,
//   password: form.password,
//   portal: "rider",
// });

//       const { token, user } = response.data;

//       if (user?.role !== "RIDER") {
//         setError("This account is not registered as a rider.");
//         return;
//       }

//       login(token, user);

//       navigate("/");
//     } catch (error) {
//       console.error("Rider login error:", error);

//       setError(
//         error.response?.data?.message ||
//           "Login failed. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="rider-login-page">
//       <div className="rider-login-card">
//         <div className="rider-login-header">
//           <div className="rider-login-icon">🚴</div>

//           <h1>Rider Login</h1>

//           <p>
//             Login to manage your deliveries
//           </p>
//         </div>

//         {error && (
//           <div className="rider-login-error">
//             {error}
//           </div>
//         )}

//         <form
//           className="rider-login-form"
//           onSubmit={handleSubmit}
//         >
//           <label htmlFor="phone">
//             Phone Number
//           </label>

//           <input
//             id="phone"
//             type="tel"
//             name="phone"
//             placeholder="Enter your phone number"
//             value={form.phone}
//             onChange={handleChange}
//             maxLength="10"
//             autoComplete="tel"
//           />

//           <label htmlFor="password">
//             Password
//           </label>

//           <input
//             id="password"
//             type="password"
//             name="password"
//             placeholder="Enter your password"
//             value={form.password}
//             onChange={handleChange}
//             autoComplete="current-password"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="rider-login-register">
//           Don't have a rider account?{" "}
//           <span onClick={() => navigate("/register")}>
//             Register
//           </span>
//         </p>
//       </div>
//     </main>
//   );
// }

// export default Login;






















import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
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

    if (!form.phone || !form.password) {
      setError("Phone number and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        phone: form.phone,
        password: form.password,
        portal: "rider",
      });

      const { token, user } = response.data;

      if (user?.role !== "RIDER") {
        setError("This account is not registered as a rider.");
        return;
      }

      login(token, user);
      navigate("/");
    } catch (error) {
      console.error("Rider login error:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="rider-login-page">
      <div className="rider-login-card">
        <div className="rider-login-header">
          <div className="rider-login-icon">🚴</div>

          <h1>Rider Login</h1>

          <p>Login to manage your deliveries</p>
        </div>

        {error && (
          <div className="rider-login-error">
            {error}
          </div>
        )}

        <form
          className="rider-login-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="phone">Phone Number</label>

          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={handleChange}
            maxLength="10"
            autoComplete="tel"
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          <div className="rider-forgot-password">
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

        <p className="rider-login-register">
          Don't have a rider account?{" "}
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </main>
  );
}

export default Login;
