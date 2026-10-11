import { useEffect, useState } from "react";
import api from "../services/api";
import "./Profile.css";

function Profile() {
  const [rider, setRider] = useState(null);

  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] =
    useState(false);
  const [statusLoading, setStatusLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/riders/me");

      setRider(response.data?.rider || null);
    } catch (error) {
      console.error(
        "Failed to load rider profile:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleStatusChange = async () => {
    if (!rider) return;

    const newStatus =
      rider.status === "AVAILABLE"
        ? "OFFLINE"
        : "AVAILABLE";

    try {
      setStatusLoading(true);
      setError("");
      setMessage("");

      const response = await api.patch(
        "/riders/status",
        {
          status: newStatus,
        }
      );

      setRider(
        response.data?.rider || {
          ...rider,
          status: newStatus,
        }
      );

      setMessage(
        newStatus === "AVAILABLE"
          ? "You are now online."
          : "You are now offline."
      );
    } catch (error) {
      console.error(
        "Failed to update rider status:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update status."
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const updateLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Location services are not supported by this browser."
      );
      return;
    }

    setLocationLoading(true);
    setError("");
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          const response = await api.patch(
            "/riders/location",
            {
              latitude,
              longitude,
            }
          );

          setRider(
            response.data?.rider || {
              ...rider,
              latitude,
              longitude,
            }
          );

          setMessage(
            "Your location has been updated successfully."
          );
        } catch (error) {
          console.error(
            "Failed to update rider location:",
            error
          );

          setError(
            error.response?.data?.message ||
              "Unable to update location."
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        let locationError =
          "Unable to get your location.";

        if (error.code === 1) {
          locationError =
            "Location permission was denied. Please allow location access.";
        }

        if (error.code === 2) {
          locationError =
            "Your current location could not be determined.";
        }

        if (error.code === 3) {
          locationError =
            "Location request timed out. Please try again.";
        }

        setError(locationError);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const getStatusLabel = (status) => {
    if (!status) return "Unknown";

    return String(status)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const getVerificationLabel = (
    verificationStatus
  ) => {
    if (!verificationStatus) {
      return "Unknown";
    }

    return String(verificationStatus)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  if (loading) {
    return (
      <main className="rider-profile-page">
        <div className="rider-profile-loading">
          Loading profile...
        </div>
      </main>
    );
  }

  return (
    <main className="rider-profile-page">
      <div className="rider-profile-container">
        <div className="rider-profile-header">
          <div>
            <h1>Profile</h1>

            <p>
              Manage your rider account information.
            </p>
          </div>

          <button
            type="button"
            className="rider-profile-refresh"
            onClick={fetchProfile}
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="rider-profile-error">
            {error}
          </div>
        )}

        {message && (
          <div className="rider-profile-message">
            {message}
          </div>
        )}

        {!rider ? (
          <div className="rider-profile-empty">
            <h2>Rider profile not found</h2>

            <p>
              Your rider profile could not be loaded.
            </p>
          </div>
        ) : (
          <>
            <section className="rider-profile-card rider-profile-main-card">
              <div className="rider-profile-avatar">
                {(
                  rider.user?.name ||
                  "R"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="rider-profile-main-info">
                <h2>
                  {rider.user?.name ||
                    "Rider"}
                </h2>

                <p>
                  {rider.user?.email ||
                    "No email added"}
                </p>

                <span className="rider-profile-role">
                  Rider
                </span>
              </div>

              <div className="rider-profile-status-area">
                <span className="rider-profile-status-label">
                  Current Status
                </span>

                <span
                  className={`rider-profile-status ${
                    rider.status === "AVAILABLE"
                      ? "available"
                      : rider.status ===
                        "ON_DELIVERY"
                      ? "on-delivery"
                      : "offline"
                  }`}
                >
                  {getStatusLabel(
                    rider.status
                  )}
                </span>
              </div>
            </section>

            <div className="rider-profile-grid">
              <section className="rider-profile-card">
                <div className="rider-profile-card-header">
                  <h2>Personal Information</h2>
                </div>

                <div className="rider-profile-info-list">
                  <div className="rider-profile-info-row">
                    <span>Full Name</span>

                    <strong>
                      {rider.user?.name ||
                        "Not available"}
                    </strong>
                  </div>

                  <div className="rider-profile-info-row">
                    <span>Phone Number</span>

                    <strong>
                      {rider.user?.phone ||
                        "Not available"}
                    </strong>
                  </div>

                  <div className="rider-profile-info-row">
                    <span>Email</span>

                    <strong>
                      {rider.user?.email ||
                        "Not added"}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="rider-profile-card">
                <div className="rider-profile-card-header">
                  <h2>Rider Account</h2>
                </div>

                <div className="rider-profile-info-list">
                  <div className="rider-profile-info-row">
                    <span>Rider ID</span>

                    <strong>
                      {rider.id || "—"}
                    </strong>
                  </div>

                  <div className="rider-profile-info-row">
                    <span>Verification</span>

                    <strong
                      className={`verification-${String(
                        rider.verificationStatus ||
                          ""
                      ).toLowerCase()}`}
                    >
                      {getVerificationLabel(
                        rider.verificationStatus
                      )}
                    </strong>
                  </div>

                  <div className="rider-profile-info-row">
                    <span>Current Status</span>

                    <strong>
                      {getStatusLabel(
                        rider.status
                      )}
                    </strong>
                  </div>
                </div>
              </section>
            </div>

            <section className="rider-profile-card rider-profile-actions-card">
              <div className="rider-profile-card-header">
                <div>
                  <h2>Availability</h2>

                  <p>
                    Control whether you are available
                    for new deliveries.
                  </p>
                </div>
              </div>

              <div className="rider-profile-action-content">
                <div>
                  <span className="action-status-label">
                    Current status
                  </span>

                  <strong>
                    {getStatusLabel(
                      rider.status
                    )}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={handleStatusChange}
                  disabled={
                    statusLoading ||
                    rider.verificationStatus !==
                      "APPROVED" ||
                    rider.status ===
                      "ON_DELIVERY"
                  }
                  className={
                    rider.status ===
                    "AVAILABLE"
                      ? "profile-offline-button"
                      : "profile-online-button"
                  }
                >
                  {statusLoading
                    ? "Updating..."
                    : rider.status ===
                      "AVAILABLE"
                    ? "Go Offline"
                    : "Go Online"}
                </button>
              </div>

              {rider.verificationStatus !==
                "APPROVED" && (
                <p className="profile-action-note">
                  Your account must be approved before
                  you can go online.
                </p>
              )}

              {rider.status ===
                "ON_DELIVERY" && (
                <p className="profile-action-note">
                  You cannot change availability while
                  you are on an active delivery.
                </p>
              )}
            </section>

            <section className="rider-profile-card">
              <div className="rider-profile-card-header">
                <div>
                  <h2>Location</h2>

                  <p>
                    Update your current location for
                    delivery assignment.
                  </p>
                </div>
              </div>

              <div className="rider-location-content">
                <div className="rider-location-values">
                  <div>
                    <span>
                      Latitude
                    </span>

                    <strong>
                      {rider.latitude ??
                        "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Longitude
                    </span>

                    <strong>
                      {rider.longitude ??
                        "Not available"}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="update-location-button"
                  onClick={updateLocation}
                  disabled={
                    locationLoading ||
                    rider.verificationStatus !==
                      "APPROVED"
                  }
                >
                  {locationLoading
                    ? "Updating Location..."
                    : "📍 Update My Location"}
                </button>
              </div>

              {rider.verificationStatus !==
                "APPROVED" && (
                <p className="profile-action-note">
                  Location updates are available after
                  rider approval.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default Profile;