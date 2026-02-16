import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyTrips({ loggedInUser }) {
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loggedInUser?.diyJwt) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError("");

    const headers = {
      authorization: loggedInUser.diyJwt
    };

    const fetchUpcoming = fetch("http://localhost:8080/api/trips/mine/upcoming", { headers });
    const fetchPast = fetch("http://localhost:8080/api/trips/mine/past", { headers });

    Promise.all([fetchUpcoming, fetchPast])
      .then(async ([uRes, pRes]) => {
        if (uRes.status === 401 || pRes.status === 401) {
          navigate("/login");
          return;
        }

        if (!(uRes.status >= 200 && uRes.status < 300)) {
          const msg = await uRes.text();
          throw new Error(msg || "Failed to load upcoming trips.");
        }

        if (!(pRes.status >= 200 && pRes.status < 300)) {
          const msg = await pRes.text();
          throw new Error(msg || "Failed to load past trips.");
        }

        const uData = await uRes.json();
        const pData = await pRes.json();

        setUpcoming(uData ?? []);
        setPast(pData ?? []);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [loggedInUser, navigate]);

  function TripCard({ trip }) {
    return (
      <div
        className="card shadow-sm rounded-3 mb-2"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/trips/${trip.tripId}`)}
      >
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-semibold">
              {trip.city}, {trip.country}
            </div>
            <div className="text-muted small">
              {trip.startDate ?? "No start date"} → {trip.endDate ?? "No end date"}
            </div>
          </div>
          <span className="text-muted">›</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 980 }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-0">My Trips</h2>
          <small className="text-muted">Your upcoming and past trips</small>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/trips/add")}>
          + Create Trip
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading ? (
        <div className="text-muted">Loading...</div>
      ) : (
        <>
          {/* Upcoming */}
          <div className="card shadow-sm rounded-3 mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <div className="fw-semibold">Upcoming Trips</div>
              <span className="badge text-bg-secondary">{upcoming.length}</span>
            </div>

            <div className="card-body">
              {upcoming.length === 0 ? (
                <div className="text-muted">No upcoming trips yet.</div>
              ) : (
                upcoming.map(t => <TripCard key={t.tripId} trip={t} />)
              )}
            </div>
          </div>

          {/* Past */}
          <div className="card shadow-sm rounded-3">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <div className="fw-semibold">Past Trips</div>
              <span className="badge text-bg-secondary">{past.length}</span>
            </div>

            <div className="card-body">
              {past.length === 0 ? (
                <div className="text-muted">No past trips yet.</div>
              ) : (
                past.map(t => <TripCard key={t.tripId} trip={t} />)
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
