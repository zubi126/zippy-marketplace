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

    shopName: "",
    shopSlug: "",
    shopPhone: "",
    shopAddress: "",
    latitude: "",
    longitude: "",
  });

  const [otp, setOtp] = useState("");
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
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.shopName.trim()) {
      setError("Please enter your shop name.");
      return;
    }

    if (!form.shopSlug.trim()) {
      setError("Please enter your shop slug.");
      return;
    }

    if (!form.shopPhone.trim()) {
      setError("Please enter your shop phone.");
      return;
    }

    if (!form.shopAddress.trim()) {
      setError("Please enter your shop address.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/send-otp", {
        phone: form.phone,
        purpose: "SHOPKEEPER_REGISTRATION",
      });

      setStep("otp");
      setMessage("OTP sent successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to send OTP."
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

      const verifyResponse = await api.post(
        "/auth/verify-otp",
        {
          phone: form.phone,
          otp,
          purpose: "SHOPKEEPER_REGISTRATION",
        }
      );

      const verificationId =
        verifyResponse.data?.verificationId;

      if (!verificationId) {
        setError("Verification ID was not received.");
        return;
      }

      const registerResponse = await api.post(
        "/auth/register-shopkeeper",
        {
          name: form.name.trim(),
          phone: form.phone,
          email: form.email.trim() || undefined,
          password: form.password,
          verificationId,

          shopName: form.shopName.trim(),
          shopSlug: form.shopSlug.trim(),
          shopPhone: form.shopPhone.trim(),
          shopAddress: form.shopAddress.trim(),

          latitude: form.latitude
            ? Number(form.latitude)
            : null,

          longitude: form.longitude
            ? Number(form.longitude)
            : null,
        }
      );

      const { token, user } = registerResponse.data;

      login(token, user);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="seller-register-page">
      <div className="seller-register-card">
        {step === "details" ? (
          <>
            <h1>Create Seller Account</h1>

            <p>Register your shop on MyKasho</p>

            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            {message && (
              <div className="register-message">
                {message}
              </div>
            )}

            <form
              className="seller-register-form"
              onSubmit={(e) => {
                e.preventDefault();
                sendOtp();
              }}
            >
              <h2>Personal Details</h2>

              <label>Name</label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />

              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                maxLength={10}
                required
              />

              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
              />

              <label>Password</label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create password"
                required
              />

              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />

              <h2>Shop Details</h2>

              <label>Shop Name</label>

              <input
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                placeholder="Your shop name"
                required
              />

              <label>Shop Slug</label>

              <input
                name="shopSlug"
                value={form.shopSlug}
                onChange={handleChange}
                placeholder="your-shop-name"
                required
              />

              <label>Shop Phone</label>

              <input
                type="tel"
                name="shopPhone"
                value={form.shopPhone}
                onChange={handleChange}
                placeholder="Shop phone number"
                required
              />

              <label>Shop Address</label>

              <textarea
                name="shopAddress"
                value={form.shopAddress}
                onChange={handleChange}
                placeholder="Complete shop address"
                required
              />

              <label>Latitude</label>

              <input
                type="number"
                step="any"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="Optional"
              />

              <label>Longitude</label>

              <input
                type="number"
                step="any"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="Optional"
              />

              <button type="submit" disabled={loading}>
                {loading ? "Sending OTP..." : "Continue"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Verify Phone</h1>

            <p>
              Enter the OTP sent to {form.phone}
            </p>

            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            {message && (
              <div className="register-message">
                {message}
              </div>
            )}

            <form
              className="seller-register-form"
              onSubmit={(e) => {
                e.preventDefault();
                verifyOtp();
              }}
            >
              <label>OTP</label>

              <input
                name="otp"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="Enter OTP"
                maxLength={6}
                required
              />

              <button type="submit" disabled={loading}>
                {loading
                  ? "Creating Shop..."
                  : "Verify & Create Shop"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setStep("details");
                setOtp("");
                setError("");
                setMessage("");
              }}
            >
              Back
            </button>
          </>
        )}

        <p className="seller-register-login">
          Already have a seller account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </main>
  );
}

export default Register;