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
//     setLoading(true);

//     try {
//      const response = await api.post("/auth/login", {
//   phone: form.phone,
//   password: form.password,
//   portal: "seller",
// });

//       const { token, user } = response.data;

//       if (user?.role !== "SHOPKEEPER") {
//         setError(
//           "This account is not registered as a shopkeeper."
//         );
//         return;
//       }

//       login(token, user);

//       navigate("/");
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
//     <main className="login-page">
//       <div className="login-card">
//         <div className="login-card-header">
//           <h1>Welcome Back</h1>

//           <p>
//             Login to your MyKasho seller account
//           </p>
//         </div>

//         {error && (
//           <div className="login-error">
//             {error}
//           </div>
//         )}

//         <form
//           className="login-form"
//           onSubmit={handleSubmit}
//         >
//           <div className="login-field">
//             <label htmlFor="phone">
//               Phone Number
//             </label>

//             <input
//               id="phone"
//               type="tel"
//               name="phone"
//               placeholder="Enter your phone number"
//               value={form.phone}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="login-field">
//             <label htmlFor="password">
//               Password
//             </label>

//             <input
//               id="password"
//               type="password"
//               name="password"
//               placeholder="Enter your password"
//               value={form.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="login-button"
//             disabled={loading}
//           >
//             {loading
//               ? "Logging in..."
//               : "Login to Seller Account"}
//           </button>
//         </form>

//         <p className="login-register">
//           Don't have a seller account?

//           <button
//             type="button"
//             className="login-register-button"
//             onClick={() => navigate("/register")}
//           >
//             Create Shop
//           </button>
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
setLoading(true);

try {
  const response = await api.post("/auth/login", {
    phone: form.phone,
    password: form.password,
    portal: "seller",
  });

  const { token, user } = response.data;

  if (user?.role !== "SHOPKEEPER") {
    setError(
      "This account is not registered as a shopkeeper."
    );
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
<div className="login-card">
<div className="login-card-header">
<h1>Welcome Back</h1>
<p>Login to your MyKasho seller account</p>
</div>

    {error && (
      <div className="login-error">
        {error}
      </div>
    )}

    <form
      className="login-form"
      onSubmit={handleSubmit}
    >
      <div className="login-field">
        <label htmlFor="phone">
          Phone Number
        </label>

        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="login-field">
        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
        />
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
        {loading
          ? "Logging in..."
          : "Login to Seller Account"}
      </button>
    </form>

    <p className="login-register">
      Don't have a seller account?

      <button
        type="button"
        className="login-register-button"
        onClick={() => navigate("/register")}
      >
        Create Shop
      </button>
    </p>
  </div>
</main>

);
}

export default Login;