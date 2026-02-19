import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyTrips({ loggedInUser }) {
  const navigate = useNavigate();


  const [view, setView] = useState("mine");

  const [mineUpcoming, setMineUpcoming] = useState([]);
  const [minePast, setMinePast] = useState([]);

  const [invitedUpcoming, setInvitedUpcoming] = useState([]);
  const [invitedPast, setInvitedPast] = useState([]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const headers = useMemo(() => {
    return loggedInUser?.diyJwt ? { authorization: loggedInUser.diyJwt } : null;
  }, [loggedInUser]);

  useEffect(() => {
    if (!loggedInUser?.diyJwt) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError("");

    const fetchMineUpcoming = fetch("http://localhost:8080/api/trips/mine/upcoming", { headers });
    const fetchMinePast = fetch("http://localhost:8080/api/trips/mine/past", { headers });

    const fetchInvitedUpcoming = fetch("http://localhost:8080/api/trips/invited/upcoming", { headers });
    const fetchInvitedPast = fetch("http://localhost:8080/api/trips/invited/past", { headers });

    Promise.all([fetchMineUpcoming, fetchMinePast, fetchInvitedUpcoming, fetchInvitedPast])
      .then(async ([muRes, mpRes, iuRes, ipRes]) => {
       
        if ([muRes, mpRes, iuRes, ipRes].some(r => r.status === 401)) {
          navigate("/login");
          return;
        }

        
        const all = [muRes, mpRes, iuRes, ipRes];
        for (const r of all) {
          if (!(r.status >= 200 && r.status < 300)) {
            const msg = await r.text();
            throw new Error(msg || "Failed to load trips.");
          }
        }

        const muData = await muRes.json();
        const mpData = await mpRes.json();
        const iuData = await iuRes.json();
        const ipData = await ipRes.json();

        setMineUpcoming(muData ?? []);
        setMinePast(mpData ?? []);
        setInvitedUpcoming(iuData ?? []);
        setInvitedPast(ipData ?? []);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [headers, loggedInUser, navigate]);

  function TripCard({ trip }) {
    const roleBadge = trip.myRole; 

    return (
      <div
        className="card shadow-sm rounded-3 mb-2"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/trips/${trip.tripId}`)}
      >
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-semibold d-flex align-items-center gap-2">
              {trip.city}, {trip.country}
              {roleBadge && (
                <span className="badge text-bg-info">{roleBadge}</span>
              )}
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

  const upcoming = view === "mine" ? mineUpcoming : invitedUpcoming;
  const past = view === "mine" ? minePast : invitedPast;

  const pageTitle = view === "mine" ? "My Trips" : "Trips I'm Invited To";
  const pageSubtitle =
    view === "mine"
      ? "Trips you own (upcoming and past)"
      : "Trips you can access as a collaborator (VIEWER/EDITOR)";

  return (
    <div className="container py-4" style={{ maxWidth: 980 }}>
      <div className="d-flex align-items-start justify-content-between mb-3 gap-3">
        <div>
          <h2 className="mb-1">{pageTitle}</h2>
          <small className="text-muted">{pageSubtitle}</small>

          {/* Tabs */}
          <div className="mt-3 d-flex gap-2">
            <button
              className={`btn btn-sm ${view === "mine" ? "btn-primary" : "btn-outline-primary"}`}
              type="button"
              onClick={() => setView("mine")}
            >
              My trips
            </button>

            <button
              className={`btn btn-sm ${view === "invited" ? "btn-primary" : "btn-outline-primary"}`}
              type="button"
              onClick={() => setView("invited")}
            >
              Trips I'm invited to
            </button>
          </div>
        </div>

        {/* Only show create on "mine" */}
        {view === "mine" && (
          <button className="btn btn-primary" onClick={() => navigate("/trips/add")}>
            + Create Trip
          </button>
        )}
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
                <div className="text-muted">
                  {view === "mine" ? "No upcoming trips yet." : "No upcoming invited trips."}
                </div>
              ) : (
                upcoming.map(t => <TripCard key={`${view}-up-${t.tripId}`} trip={t} />)
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
                <div className="text-muted">
                  {view === "mine" ? "No past trips yet." : "No past invited trips."}
                </div>
              ) : (
                past.map(t => <TripCard key={`${view}-past-${t.tripId}`} trip={t} />)
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
