
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit Indian phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/forgot-password",
        { phone }
      );

      setMessage(
        response.data.message || "OTP sent successfully."
      );
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{4,6}$/.test(otp)) {
      setError("Enter a valid OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/verify-forgot-password-otp",
        { phone, otp }
      );

      setVerificationId(response.data.verificationId);
      setMessage("OTP verified successfully.");
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!verificationId) {
      setError("Please verify your OTP first.");
      setStep(2);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/reset-password",
        {
          phone,
          verificationId,
          newPassword: password,
        }
      );

      setMessage(
        response.data.message ||
          "Password reset successfully."
      );

      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Password reset failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/forgot-password",
        { phone }
      );

      setOtp("");
      setVerificationId("");
      setStep(2);

      setMessage(
        response.data.message || "A new OTP has been sent."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to resend OTP. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-card-header">
          <h1>
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </h1>

          <p>
            {step === 1 &&
              "Enter your registered phone number to reset your password."}
            {step === 2 &&
              `Enter the OTP sent to ${phone}.`}
            {step === 3 &&
              "Create a new password for your seller account."}
          </p>
        </div>

        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="forgot-success" role="status">
            {message}
          </div>
        )}

        {step === 1 && (
          <form className="login-form" onSubmit={handleSendOtp}>
            <div className="login-field">
              <label htmlFor="forgot-phone">
                Registered Phone Number
              </label>

              <input
                id="forgot-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter your 10-digit phone number"
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="login-form" onSubmit={handleVerifyOtp}>
            <div className="login-field">
              <label htmlFor="reset-otp">OTP</label>

              <input
                id="reset-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter OTP"
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              className="forgot-secondary-button"
              onClick={handleResendOtp}
              disabled={loading}
            >
              Resend OTP
            </button>

            <button
              type="button"
              className="forgot-secondary-button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setMessage("");
              }}
              disabled={loading}
            >
              Change phone number
            </button>
          </form>
        )}

        {step === 3 && (
          <form
            className="login-form"
            onSubmit={handleResetPassword}
          >
            <div className="login-field">
              <label htmlFor="new-password">New Password</label>

              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="confirm-password">
                Confirm New Password
              </label>

              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="login-register">
          Remember your password?

          <button
            type="button"
            className="login-register-button"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </p>
      </div>
    </main>
  );
}

export default ForgotPassword;
