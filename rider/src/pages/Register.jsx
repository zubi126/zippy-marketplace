import { useEffect,useState } from "react";
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

  const [verificationId, setVerificationId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);







   useEffect(() => {
  if (resendTimer <= 0) return;

  const timer = setInterval(() => {
    setResendTimer((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [resendTimer]);



  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };




  const sendOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!form.name || !form.phone || !form.password) {
      setError(
        "Name, phone number and password are required."
      );
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError(
        "Please enter a valid 10-digit Indian phone number."
      );
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

      const response = await api.post("/auth/send-otp", {
        phone: form.phone,
        purpose: "RIDER_REGISTRATION",
      });

     if (response.data?.success) {
  setMessage("OTP sent successfully.");
  setStep("otp");
  setResendTimer(60);
  setOtp("");
}
    } catch (error) {
      console.error("Send rider OTP error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^\d{4,6}$/.test(otp)) {
      setError("Please enter a valid OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/verify-otp", {
        phone: form.phone,
        otp,
        purpose: "RIDER_REGISTRATION",
      });

      if (response.data?.success) {
        setVerificationId(response.data.verificationId);
        setMessage("Phone number verified successfully.");

        await registerRider(
          response.data.verificationId
        );
      }
    } catch (error) {
      console.error("Verify rider OTP error:", error);

      setError(
        error.response?.data?.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const registerRider = async (verifiedId) => {
    try {
      const response = await api.post(
        "/auth/register-rider",
        {
          name: form.name,
          phone: form.phone,
          email: form.email || null,
          password: form.password,
          verificationId: verifiedId,
        }
      );

      const { token, user } = response.data;

      login(token, user);

      navigate("/");
    } catch (error) {
      console.error("Rider registration error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create rider account."
      );
    }
  };

  if (step === "otp") {
    return (
      <main className="rider-register-page">
        <div className="rider-register-card">
          <div className="rider-register-header">
            <div className="rider-register-icon">
              🚴
            </div>

            <h1>Verify Phone Number</h1>

            <p>
              Enter the OTP sent to{" "}
              <strong>{form.phone}</strong>
            </p>
          </div>

          {error && (
            <div className="rider-register-error">
              {error}
            </div>
          )}

          {message && (
            <div className="rider-register-message">
              {message}
            </div>
          )}

          <form
            className="rider-register-form"
            onSubmit={verifyOtp}
          >
            <label htmlFor="otp">
              OTP
            </label>

            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              autoComplete="one-time-code"
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify & Create Account"}
            </button>
          </form>










          <div className="rider-resend-otp">
  {resendTimer > 0 ? (
    <p>
      Didn't receive the OTP? Resend in{" "}
      <strong>{resendTimer}s</strong>
    </p>
  ) : (
    <button
      type="button"
      onClick={sendOtp}
      disabled={loading}
      className="rider-resend-button"
    >
      {loading ? "Sending..." : "Resend OTP"}
    </button>
  )}
</div>







          <button
            className="rider-register-back"
            onClick={() => {
              setStep("details");
              setOtp("");
              setError("");
              setMessage("");
            }}
          >
            ← Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="rider-register-page">
      <div className="rider-register-card">
        <div className="rider-register-header">
          <div className="rider-register-icon">
            🚴
          </div>

          <h1>Rider Registration</h1>

          <p>
            Create your rider account
          </p>
        </div>

        {error && (
          <div className="rider-register-error">
            {error}
          </div>
        )}

        {message && (
          <div className="rider-register-message">
            {message}
          </div>
        )}

        <form
          className="rider-register-form"
          onSubmit={sendOtp}
        >
          <label htmlFor="name">
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />

          <label htmlFor="phone">
            Phone Number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter 10-digit phone number"
            value={form.phone}
            onChange={handleChange}
            maxLength="10"
            autoComplete="tel"
          />

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Sending OTP..."
              : "Continue"}
          </button>
        </form>

        <p className="rider-register-login">
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