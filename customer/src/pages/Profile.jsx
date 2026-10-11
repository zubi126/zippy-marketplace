import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await api.get("/auth/me");

        const userData = response.data.user || response.data;

        setForm({
          name: userData.name || "",
          email: userData.email || "",
        });

        // Keep local user data updated
        localStorage.setItem("user", JSON.stringify(userData));

      } catch (error) {
        console.error("Profile fetch error:", error);

        // Fallback to user data already stored in AuthContext
        setForm({
          name: user?.name || "",
          email: user?.email || "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await api.patch("/customer/profile", {
        name: form.name,
        email: form.email,
      });

      const updatedUser = response.data.user || {
        ...user,
        name: form.name,
        email: form.email,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Keep AuthContext in sync
      if (user) {
        const token = localStorage.getItem("token");
        login(token, updatedUser);
      }

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };


const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/");
};



  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">

        <div className="profile-header">
          <span>MY ACCOUNT</span>
          <h1>My Profile</h1>
          <p>Manage your personal information.</p>
        </div>

        <div className="profile-card">

          <div className="profile-avatar">
            {form.name
              ? form.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <form onSubmit={handleSubmit} className="profile-form">

            <div className="profile-field">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="profile-field">
              <label>Phone Number</label>

              <input
                type="text"
                value={user?.phone || ""}
                disabled
              />

              <small>
                Phone number cannot be changed here.
              </small>
            </div>

            <div className="profile-field">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            {message && (
              <div className="profile-success">
                {message}
              </div>
            )}

            {error && (
              <div className="profile-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>




<button
  type="button"
  className="profile-logout-button"
  onClick={handleLogout}
>
  Logout
</button>


          </form>
        </div>

      </div>
    </main>
  );
}

export default Profile;