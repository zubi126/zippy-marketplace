
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

function EyeIcon({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3L21 21M10.6 10.6a2 2 0 002.8 2.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.9 5.2A10.8 10.8 0 0112 5c5.5 0 9 7 9 7a15 15 0 01-3.1 3.8M6.2 6.2C4.1 7.6 3 12 3 12s3.5 7 9 7c1.2 0 2.3-.3 3.3-.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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

  const renderPasswordField = (
    label,
    name,
    value,
    visible,
    toggleVisibility,
    placeholder
  ) => (
    <div className="register-field">
      <label htmlFor={name}>{label}</label>

      <div className="register-password-wrap">
        <input
          id={name}
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={
            name === "password"
              ? "new-password"
              : "new-password"
          }
          required
        />

        <button
          type="button"
          className="password-toggle"
          onClick={toggleVisibility}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          <EyeIcon visible={visible} />
        </button>
      </div>
    </div>
  );

  return (
    <main className="seller-register-page">
      <div className="register-background-shape register-shape-one" />
      <div className="register-background-shape register-shape-two" />

      <div className="seller-register-card">
        <div className="register-brand">
          <div className="register-brand-mark">M</div>
          <span>MyKasho</span>
          <span className="register-brand-dot">.</span>
          <span className="register-brand-label">SELLER</span>
        </div>

        {step === "details" ? (
          <>
            <div className="register-heading">
              <span className="register-eyebrow">
                START SELLING WITH MYKASHO
              </span>
              <h1>Create your seller account</h1>
              <p>
                Set up your account and bring your shop online.
              </p>
            </div>

            <div className="register-step-indicator">
              <div className="register-step active">
                <span>1</span>
                <div>
                  <strong>Your details</strong>
                  <small>Account and shop information</small>
                </div>
              </div>
              <div className="register-step-line" />
              <div className="register-step">
                <span>2</span>
                <div>
                  <strong>Verification</strong>
                  <small>Verify your phone number</small>
                </div>
              </div>
            </div>

            {error && (
              <div className="register-alert register-error" role="alert">
                <span>!</span>
                {error}
              </div>
            )}

            {message && (
              <div className="register-alert register-message" role="status">
                <span>✓</span>
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
              <section className="register-section">
                <div className="register-section-heading">
                  <span className="register-section-icon">01</span>
                  <div>
                    <h2>Personal details</h2>
                    <p>Tell us a little about yourself.</p>
                  </div>
                </div>

                <div className="register-fields-grid">
                  <div className="register-field register-full-width">
                    <label htmlFor="name">Full name</label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="register-field">
                    <label htmlFor="phone">Mobile number</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      inputMode="numeric"
                      autoComplete="tel-national"
                      required
                    />
                  </div>

                  <div className="register-field">
                    <label htmlFor="email">
                      Email address <span className="optional-label">Optional</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>

                  {renderPasswordField(
                    "Create password",
                    "password",
                    form.password,
                    showPassword,
                    () => setShowPassword((prev) => !prev),
                    "At least 6 characters"
                  )}

                  {renderPasswordField(
                    "Confirm password",
                    "confirmPassword",
                    form.confirmPassword,
                    showConfirmPassword,
                    () => setShowConfirmPassword((prev) => !prev),
                    "Enter your password again"
                  )}
                </div>

                <p className="register-password-hint">
                  Use at least 6 characters. You can tap the eye icon
                  to check what you have typed.
                </p>
              </section>

              <div className="register-section-divider" />

              <section className="register-section">
                <div className="register-section-heading">
                  <span className="register-section-icon">02</span>
                  <div>
                    <h2>Shop details</h2>
                    <p>Information customers will use to find your shop.</p>
                  </div>
                </div>

                <div className="register-fields-grid">
                  <div className="register-field">
                    <label htmlFor="shopName">Shop name</label>
                    <input
                      id="shopName"
                      name="shopName"
                      value={form.shopName}
                      onChange={handleChange}
                      placeholder="Enter your shop name"
                      required
                    />
                  </div>

                  <div className="register-field">
                    <label htmlFor="shopSlug">Shop URL name</label>
                    <input
                      id="shopSlug"
                      name="shopSlug"
                      value={form.shopSlug}
                      onChange={handleChange}
                      placeholder="your-shop-name"
                      required
                    />
                  </div>

                  <div className="register-field register-full-width">
                    <label htmlFor="shopPhone">Shop phone number</label>
                    <input
                      id="shopPhone"
                      type="tel"
                      name="shopPhone"
                      value={form.shopPhone}
                      onChange={handleChange}
                      placeholder="Enter shop contact number"
                      autoComplete="tel"
                      required
                    />
                  </div>

                  <div className="register-field register-full-width">
                    <label htmlFor="shopAddress">Shop address</label>
                    <textarea
                      id="shopAddress"
                      name="shopAddress"
                      value={form.shopAddress}
                      onChange={handleChange}
                      placeholder="Enter your complete shop address"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="register-field">
                    <label htmlFor="latitude">
                      Latitude <span className="optional-label">Optional</span>
                    </label>
                    <input
                      id="latitude"
                      type="number"
                      step="any"
                      name="latitude"
                      value={form.latitude}
                      onChange={handleChange}
                      placeholder="e.g. 33.731"
                    />
                  </div>

                  <div className="register-field">
                    <label htmlFor="longitude">
                      Longitude <span className="optional-label">Optional</span>
                    </label>
                    <input
                      id="longitude"
                      type="number"
                      step="any"
                      name="longitude"
                      value={form.longitude}
                      onChange={handleChange}
                      placeholder="e.g. 75.148"
                    />
                  </div>
                </div>
              </section>

              <button
                className="register-submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="register-spinner" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Continue to verification
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>

              <p className="register-secure-note">
                Your information is protected and securely submitted.
              </p>
            </form>
          </>
        ) : (
          <div className="register-otp-screen">
            <div className="register-otp-icon">✉</div>

            <div className="register-heading">
              <span className="register-eyebrow">ONE LAST STEP</span>
              <h1>Verify your phone</h1>
              <p>
                Enter the OTP sent to{" "}
                <strong>+91 {form.phone}</strong>
              </p>
            </div>

            <div className="register-step-indicator">
              <div className="register-step completed">
                <span>✓</span>
                <div>
                  <strong>Your details</strong>
                  <small>Completed</small>
                </div>
              </div>
              <div className="register-step-line active-line" />
              <div className="register-step active">
                <span>2</span>
                <div>
                  <strong>Verification</strong>
                  <small>Enter your OTP</small>
                </div>
              </div>
            </div>

            {error && (
              <div className="register-alert register-error" role="alert">
                <span>!</span>
                {error}
              </div>
            )}

            {message && (
              <div className="register-alert register-message" role="status">
                <span>✓</span>
                {message}
              </div>
            )}

            <form
              className="seller-register-form register-otp-form"
              onSubmit={(e) => {
                e.preventDefault();
                verifyOtp();
              }}
            >
              <div className="register-field">
                <label htmlFor="otp">Verification code</label>
                <input
                  id="otp"
                  className="register-otp-input"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter OTP"
                  maxLength={6}
                  required
                />
              </div>

              <button
                className="register-submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="register-spinner" />
                    Creating your shop...
                  </>
                ) : (
                  <>
                    Verify & Create Shop
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>

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
              ← Back to registration details
            </button>
          </div>
        )}

        <div className="seller-register-login">
          Already have a seller account?{" "}
          <button type="button" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>

        <div className="register-footer-note">
          <span>MYKASHO</span>
          <span>Everything. Delivered.</span>
        </div>
      </div>
    </main>
  );
}

export default Register;










// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import "./Register.css";

// function Register() {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [step, setStep] = useState("details");

//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     password: "",
//     confirmPassword: "",

//     shopName: "",
//     shopSlug: "",
//     shopPhone: "",
//     shopAddress: "",
//     latitude: "",
//     longitude: "",
//   });

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });

//     setError("");
//     setMessage("");
//   };

//   const sendOtp = async () => {
//     setError("");
//     setMessage("");

//     if (!form.name.trim()) {
//       setError("Please enter your name.");
//       return;
//     }

//     if (!/^[6-9]\d{9}$/.test(form.phone)) {
//       setError("Please enter a valid 10-digit phone number.");
//       return;
//     }

//     if (!form.password || form.password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     if (form.password !== form.confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     if (!form.shopName.trim()) {
//       setError("Please enter your shop name.");
//       return;
//     }

//     if (!form.shopSlug.trim()) {
//       setError("Please enter your shop slug.");
//       return;
//     }

//     if (!form.shopPhone.trim()) {
//       setError("Please enter your shop phone.");
//       return;
//     }

//     if (!form.shopAddress.trim()) {
//       setError("Please enter your shop address.");
//       return;
//     }

//     try {
//       setLoading(true);

//       await api.post("/auth/send-otp", {
//         phone: form.phone,
//         purpose: "SHOPKEEPER_REGISTRATION",
//       });

//       setStep("otp");
//       setMessage("OTP sent successfully.");
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           "Unable to send OTP."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOtp = async () => {
//     setError("");
//     setMessage("");

//     if (!/^\d{4,6}$/.test(otp)) {
//       setError("Please enter a valid OTP.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const verifyResponse = await api.post(
//         "/auth/verify-otp",
//         {
//           phone: form.phone,
//           otp,
//           purpose: "SHOPKEEPER_REGISTRATION",
//         }
//       );

//       const verificationId =
//         verifyResponse.data?.verificationId;

//       if (!verificationId) {
//         setError("Verification ID was not received.");
//         return;
//       }

//       const registerResponse = await api.post(
//         "/auth/register-shopkeeper",
//         {
//           name: form.name.trim(),
//           phone: form.phone,
//           email: form.email.trim() || undefined,
//           password: form.password,
//           verificationId,

//           shopName: form.shopName.trim(),
//           shopSlug: form.shopSlug.trim(),
//           shopPhone: form.shopPhone.trim(),
//           shopAddress: form.shopAddress.trim(),

//           latitude: form.latitude
//             ? Number(form.latitude)
//             : null,

//           longitude: form.longitude
//             ? Number(form.longitude)
//             : null,
//         }
//       );

//       const { token, user } = registerResponse.data;

//       login(token, user);

//       navigate("/");
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           "Registration failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="seller-register-page">
//       <div className="seller-register-card">
//         {step === "details" ? (
//           <>
//             <h1>Create Seller Account</h1>

//             <p>Register your shop on MyKasho</p>

//             {error && (
//               <div className="register-error">
//                 {error}
//               </div>
//             )}

//             {message && (
//               <div className="register-message">
//                 {message}
//               </div>
//             )}

//             <form
//               className="seller-register-form"
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 sendOtp();
//               }}
//             >
//               <h2>Personal Details</h2>

//               <label>Name</label>

//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Your full name"
//                 required
//               />

//               <label>Phone</label>

//               <input
//                 type="tel"
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 placeholder="10-digit phone number"
//                 maxLength={10}
//                 required
//               />

//               <label>Email</label>

//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="Email address"
//               />

//               <label>Password</label>

//               <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Create password"
//                 required
//               />

//               <label>Confirm Password</label>

//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={form.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="Confirm password"
//                 required
//               />

//               <h2>Shop Details</h2>

//               <label>Shop Name</label>

//               <input
//                 name="shopName"
//                 value={form.shopName}
//                 onChange={handleChange}
//                 placeholder="Your shop name"
//                 required
//               />

//               <label>Shop Slug</label>

//               <input
//                 name="shopSlug"
//                 value={form.shopSlug}
//                 onChange={handleChange}
//                 placeholder="your-shop-name"
//                 required
//               />

//               <label>Shop Phone</label>

//               <input
//                 type="tel"
//                 name="shopPhone"
//                 value={form.shopPhone}
//                 onChange={handleChange}
//                 placeholder="Shop phone number"
//                 required
//               />

//               <label>Shop Address</label>

//               <textarea
//                 name="shopAddress"
//                 value={form.shopAddress}
//                 onChange={handleChange}
//                 placeholder="Complete shop address"
//                 required
//               />

//               <label>Latitude</label>

//               <input
//                 type="number"
//                 step="any"
//                 name="latitude"
//                 value={form.latitude}
//                 onChange={handleChange}
//                 placeholder="Optional"
//               />

//               <label>Longitude</label>

//               <input
//                 type="number"
//                 step="any"
//                 name="longitude"
//                 value={form.longitude}
//                 onChange={handleChange}
//                 placeholder="Optional"
//               />

//               <button type="submit" disabled={loading}>
//                 {loading ? "Sending OTP..." : "Continue"}
//               </button>
//             </form>
//           </>
//         ) : (
//           <>
//             <h1>Verify Phone</h1>

//             <p>
//               Enter the OTP sent to {form.phone}
//             </p>

//             {error && (
//               <div className="register-error">
//                 {error}
//               </div>
//             )}

//             {message && (
//               <div className="register-message">
//                 {message}
//               </div>
//             )}

//             <form
//               className="seller-register-form"
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 verifyOtp();
//               }}
//             >
//               <label>OTP</label>

//               <input
//                 name="otp"
//                 value={otp}
//                 onChange={(e) =>
//                   setOtp(
//                     e.target.value.replace(/\D/g, "")
//                   )
//                 }
//                 placeholder="Enter OTP"
//                 maxLength={6}
//                 required
//               />

//               <button type="submit" disabled={loading}>
//                 {loading
//                   ? "Creating Shop..."
//                   : "Verify & Create Shop"}
//               </button>
//             </form>

//             <button
//               type="button"
//               onClick={() => {
//                 setStep("details");
//                 setOtp("");
//                 setError("");
//                 setMessage("");
//               }}
//             >
//               Back
//             </button>
//           </>
//         )}

//         <p className="seller-register-login">
//           Already have a seller account?{" "}
//           <span onClick={() => navigate("/login")}>
//             Login
//           </span>
//         </p>
//       </div>
//     </main>
//   );
// }

// export default Register;














