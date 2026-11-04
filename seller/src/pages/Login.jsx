// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import api from "../services/api";
// // import { useAuth } from "../context/AuthContext";
// // import "./Login.css";

// // function Login() {
// //   const navigate = useNavigate();
// //   const { login } = useAuth();

// //   const [form, setForm] = useState({
// //     phone: "",
// //     password: "",
// //   });

// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const handleChange = (e) => {
// //     setForm({
// //       ...form,
// //       [e.target.name]: e.target.value,
// //     });

// //     setError("");
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     setError("");
// //     setLoading(true);

// //     try {
// //      const response = await api.post("/auth/login", {
// //   phone: form.phone,
// //   password: form.password,
// //   portal: "seller",
// // });

// //       const { token, user } = response.data;

// //       if (user?.role !== "SHOPKEEPER") {
// //         setError(
// //           "This account is not registered as a shopkeeper."
// //         );
// //         return;
// //       }

// //       login(token, user);

// //       navigate("/");
// //     } catch (error) {
// //       setError(
// //         error.response?.data?.message ||
// //           "Login failed. Please try again."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <main className="login-page">
// //       <div className="login-card">
// //         <div className="login-card-header">
// //           <h1>Welcome Back</h1>

// //           <p>
// //             Login to your MyKasho seller account
// //           </p>
// //         </div>

// //         {error && (
// //           <div className="login-error">
// //             {error}
// //           </div>
// //         )}

// //         <form
// //           className="login-form"
// //           onSubmit={handleSubmit}
// //         >
// //           <div className="login-field">
// //             <label htmlFor="phone">
// //               Phone Number
// //             </label>

// //             <input
// //               id="phone"
// //               type="tel"
// //               name="phone"
// //               placeholder="Enter your phone number"
// //               value={form.phone}
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>

// //           <div className="login-field">
// //             <label htmlFor="password">
// //               Password
// //             </label>

// //             <input
// //               id="password"
// //               type="password"
// //               name="password"
// //               placeholder="Enter your password"
// //               value={form.password}
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>

// //           <button
// //             type="submit"
// //             className="login-button"
// //             disabled={loading}
// //           >
// //             {loading
// //               ? "Logging in..."
// //               : "Login to Seller Account"}
// //           </button>
// //         </form>

// //         <p className="login-register">
// //           Don't have a seller account?

// //           <button
// //             type="button"
// //             className="login-register-button"
// //             onClick={() => navigate("/register")}
// //           >
// //             Create Shop
// //           </button>
// //         </p>
// //       </div>
// //     </main>
// //   );
// // }

// // export default Login;



























// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import "./Login.css";

// function Login() {
// const navigate = useNavigate();
// const { login } = useAuth();

// const [form, setForm] = useState({
// phone: "",
// password: "",
// });

// const [loading, setLoading] = useState(false);
// const [error, setError] = useState("");

// const handleChange = (e) => {
// setForm({
// ...form,
// [e.target.name]: e.target.value,
// });

// setError("");

// };

// const handleSubmit = async (e) => {
// e.preventDefault();

// setError("");
// setLoading(true);

// try {
//   const response = await api.post("/auth/login", {
//     phone: form.phone,
//     password: form.password,
//     portal: "seller",
//   });

//   const { token, user } = response.data;

//   if (user?.role !== "SHOPKEEPER") {
//     setError(
//       "This account is not registered as a shopkeeper."
//     );
//     return;
//   }

//   login(token, user);
//   navigate("/");
// } catch (error) {
//   setError(
//     error.response?.data?.message ||
//       "Login failed. Please try again."
//   );
// } finally {
//   setLoading(false);
// }

// };

// return (
// <main className="login-page">
// <div className="login-card">
// <div className="login-card-header">
// <h1>Welcome Back</h1>
// <p>Login to your MyKasho seller account</p>
// </div>

//     {error && (
//       <div className="login-error">
//         {error}
//       </div>
//     )}

//     <form
//       className="login-form"
//       onSubmit={handleSubmit}
//     >
//       <div className="login-field">
//         <label htmlFor="phone">
//           Phone Number
//         </label>

//         <input
//           id="phone"
//           type="tel"
//           name="phone"
//           placeholder="Enter your phone number"
//           value={form.phone}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div className="login-field">
//         <label htmlFor="password">
//           Password
//         </label>

//         <input
//           id="password"
//           type="password"
//           name="password"
//           placeholder="Enter your password"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div className="login-forgot-password">
//         <button
//           type="button"
//           onClick={() => navigate("/forgot-password")}
//         >
//           Forgot Password?
//         </button>
//       </div>

//       <button
//         type="submit"
//         className="login-button"
//         disabled={loading}
//       >
//         {loading
//           ? "Logging in..."
//           : "Login to Seller Account"}
//       </button>
//     </form>

//     <p className="login-register">
//       Don't have a seller account?

//       <button
//         type="button"
//         className="login-register-button"
//         onClick={() => navigate("/register")}
//       >
//         Create Shop
//       </button>
//     </p>
//   </div>
// </main>

// );
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
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        phone: form.phone,
        password: form.password,
        portal: "seller",
      });

      const { token, user } = response.data;

      if (user?.role !== "SHOPKEEPER") {
        setError("This account is not registered as a shopkeeper.");
        return;
      }

      login(token, user);
      navigate("/");
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
    <main className="login-page">
      <div className="login-orb login-orb-one" />
      <div className="login-orb login-orb-two" />
      <div className="login-grid-pattern" />

      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">M</div>
          <span>
            My<span>Kasho</span>
          </span>
        </div>

        <div className="login-card-header">
          <div className="login-eyebrow">
            <span className="login-status-dot" />
            SELLER PORTAL
          </div>

          <h1>Welcome Back<span>.</span></h1>

          <p>
            Your business, your growth.
            <br />
            Sign in to manage your shop.
          </p>
        </div>

        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="phone">Phone Number</label>

            <div className="login-input-wrap">
              <span className="login-input-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 3h3l2 5-2.5 1.5a14 14 0 0 0 5 5L16 12l5 2v3c0 1.1-.9 2-2 2C10.7 19 5 13.3 5 6c0-1.7.8-3 2-3Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>

            <div className="login-input-wrap">
              <span className="login-input-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M8 10V7a4 4 0 1 1 8 0v3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 14v3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <div className="login-forgot-password">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            <span>
              {loading ? "Logging in..." : "Login to Seller Account"}
            </span>

            {!loading && (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </form>

        <div className="login-register">
          <p>New to MyKasho?</p>

          <button
            type="button"
            className="login-register-button"
            onClick={() => navigate("/register")}
          >
            Create Your Shop
          </button>
        </div>

        <div className="login-footer">
          <span>MYKASHO SELLER PLATFORM</span>
          <span>Everything. Delivered.</span>
        </div>
      </div>
    </main>
  );
}

export default Login;
