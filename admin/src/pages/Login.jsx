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
    adminSecret: "",
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

   if (!form.phone || !form.password || !form.adminSecret) {
  setError("Phone number, password and admin secret are required.");
  return;
}

    try {
      setLoading(true);

     const response = await api.post("/auth/login", {
  phone: form.phone,
  password: form.password,
  adminSecret: form.adminSecret,
  portal: "admin",
});

      const { token, user } = response.data;

      if (user?.role !== "ADMIN") {
        setError("This account does not have admin access.");
        return;
      }

      login(token, user);

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-logo">
          M
        </div>

        <div className="admin-login-header">
          <h1>MyKasho Admin</h1>
          <p>Sign in to your admin account</p>
        </div>

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="phone">
            Phone Number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />




           <label htmlFor="adminSecret">
  Admin Secret
</label>

<input
  id="adminSecret"
  name="adminSecret"
  type="password"
  placeholder="Enter admin secret"
  value={form.adminSecret}
  onChange={handleChange}
  autoComplete="off"
/>




          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

      </div>
    </main>
  );
}

export default Login;