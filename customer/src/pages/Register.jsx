import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState("details");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setMessage("");
  };

  const sendOtp = async () => {
    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/send-otp", {
        phone: form.phone,
        purpose: "CUSTOMER_REGISTRATION",
      });

      setStep("otp");
      setMessage("OTP sent successfully to your phone.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };









  const handleResendOtp = async () => {
    setError("");
    setMessage("");

    try {
      setLoading(true);

      const response = await api.post("/auth/send-otp", {
        phone: form.phone,
        purpose: "CUSTOMER_REGISTRATION",
      });

      setOtp("");
      setMessage(
        response.data?.message || "A new OTP has been sent to your phone."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };








  const verifyOtp = async () => {
    setError("");
    setMessage("");

    if (!/^\d{4,6}$/.test(otp)) {
      setError("Please enter a valid OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/verify-otp", {
        phone: form.phone,
        otp,
        purpose: "CUSTOMER_REGISTRATION",
      });

      const id = response.data?.verificationId;

      if (!id) {
        setError("OTP verified, but verification ID was not received.");
        return;
      }

      setVerificationId(id);

      await registerUser(id);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (id) => {
    try {
      const response = await api.post("/auth/register", {
        name: form.name.trim(),
        phone: form.phone,
        email: form.email.trim() || undefined,
        password: form.password,
        verificationId: id,
      });

      const { token, user } = response.data;

      login(token, user);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === "details") {
      sendOtp();
    } else {
      verifyOtp();
    }
  };

  return (
    <main className="register-page">
      <div className="register-card">
        <div className="register-logo">MyKasho</div>

        {step === "details" ? (
          <>
            <h1>Create Account</h1>

            <p className="register-subtitle">
              Create your account to start shopping
            </p>

            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            {message && (
              <div className="register-success">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter 10-digit phone number"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                required
              />

              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />

              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Sending OTP..." : "Continue"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Verify Phone</h1>

            <p className="register-subtitle">
              Enter the OTP sent to {form.phone}
            </p>

            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            {message && (
              <div className="register-success">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label>OTP</label>

              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                placeholder="Enter OTP"
                maxLength={6}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "Verify & Create Account"}
              </button>
            </form>





  <button
    type="button"
    className="register-back-button"
    onClick={handleResendOtp}
    disabled={loading}
  >
    {loading ? "Sending OTP..." : "Resend OTP"}
  </button>





            <button
              type="button"
              className="register-back-button"
              onClick={() => {
                setStep("details");
                setOtp("");
                setError("");
                setMessage("");
              }}
            >
              Change Phone Number
            </button>
          </>
        )}

        <p className="register-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </main>
  );
}

export default Register;