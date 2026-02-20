import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function DeleteTrip({ loggedInUser }) {
  const navigate = useNavigate();
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!loggedInUser?.diyJwt) {
      navigate("/users/login");
      return;
    }

    setIsLoading(true);
    setError("");

    fetch(`http://localhost:8080/api/trips/${tripId}/details`, {
      headers: { authorization: loggedInUser.diyJwt },
    })
      .then(async (res) => {
        if (res.status === 401) {
          navigate("/users/login");
          return null;
        }
        if (res.status === 404) {
          navigate("/notFound");
          return null;
        }
        if (!(res.status >= 200 && res.status < 300)) {
          const msg = await res.text();
          throw new Error(msg || "Failed to load trip.");
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setTrip(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [tripId, loggedInUser, navigate]);

  function handleCancel() {
    navigate(`/trips/${tripId}`);
  }

  function handleDelete() {
    setError("");
    setIsDeleting(true);

    fetch(`http://localhost:8080/api/trips/${tripId}`, {
      method: "DELETE",
      headers: { authorization: loggedInUser.diyJwt },
    })
      .then(async (res) => {
        if (res.status === 204) {
          navigate("/trips/myTrips");
          return;
        }

        if (res.status === 401) {
          navigate("/users/login");
          return;
        }

        if (res.status === 403) {
          setError("You don’t have permission to delete this trip.");
          return;
        }

        if (res.status === 404) {
          setError("Trip not found (or you are not the owner).");
          return;
        }

        const msg = await res.text();
        setError(msg || "Delete failed.");
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsDeleting(false));
  }

  return (
  <div className="container py-5" style={{ maxWidth: 760 }}>
    {error && <div className="alert alert-danger">{error}</div>}

    {isLoading ? (
      <div className="text-muted">Loading...</div>
    ) : (
      <div className="card card-soft">
        <div className="card-body p-4">

          <div className="d-flex align-items-start gap-3 mb-3">
            <div className="danger-dot">!</div>

            <div className="flex-grow-1">
              <div className="fw-semibold mb-2" style={{ fontSize: "1.1rem" }}>
                Are you sure you want to delete this trip?
              </div>

              {trip && (
                <div className="text-muted mb-2">
                  <div className="fw-semibold" style={{ color: "var(--text)" }}>
                    {trip.city}, {trip.country}
                  </div>
                  <div className="small">
                    {trip.startDate ?? "No start"} → {trip.endDate ?? "No end"}
                  </div>
                </div>
              )}

              <div className="form-text">
                This action can’t be undone.
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              className="btn btn-ghost-outline"
              type="button"
              onClick={handleCancel}
              disabled={isDeleting}
            >
              Cancel
            </button>

            <button
              className="btn btn-danger-soft"
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>

        </div>
      </div>
    )}
  </div>
);

}
