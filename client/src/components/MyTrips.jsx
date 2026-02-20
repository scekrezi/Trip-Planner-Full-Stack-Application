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
        if ([muRes, mpRes, iuRes, ipRes].some((r) => r.status === 401)) {
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
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [headers, loggedInUser, navigate]);

  function TripCard({ trip }) {
    const roleBadge = trip.myRole;

    return (
      <div
        className="trip-row trip-row-clickable d-flex justify-content-between align-items-center"
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/trips/${trip.tripId}`)}
        onKeyDown={(e) => {
          if (e.key === "Enter") navigate(`/trips/${trip.tripId}`);
        }}
      >
        <div>
          <div className="d-flex align-items-center gap-2">
            <div className="trip-title">
              {trip.city}, {trip.country}
            </div>

            {roleBadge && (
              <span className="badge badge-role">
                {roleBadge}
              </span>
            )}
          </div>

          <div className="trip-notes">
            {trip.startDate ?? "No start date"} → {trip.endDate ?? "No end date"}
          </div>
        </div>

        <span className="chev">›</span>
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
      <div className="d-flex align-items-start justify-content-between mb-3 gap-3 flex-wrap">
        <div>
          <h2 className="page-title mb-1">{pageTitle}</h2>
          <div className="page-subtitle">{pageSubtitle}</div>

          {/* Tabs */}
          <div className="segmented mt-3">
            <button
              className={`seg-btn ${view === "mine" ? "active" : ""}`}
              type="button"
              onClick={() => setView("mine")}
            >
              My trips
            </button>

            <button
              className={`seg-btn ${view === "invited" ? "active" : ""}`}
              type="button"
              onClick={() => setView("invited")}
            >
              Invited
            </button>
          </div>
        </div>

        {view === "mine" && (
          <button className="btn btn-primary-action" onClick={() => navigate("/trips/add")}>
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
          <div className="card card-soft mb-4">
            <div className="card-header card-header-soft d-flex justify-content-between align-items-center">
              <div className="fw-semibold">Upcoming Trips</div>
              <span className="badge badge-count">{upcoming.length}</span>
            </div>

            <div className="card-body">
              {upcoming.length === 0 ? (
                <div className="text-muted">
                  {view === "mine" ? "No upcoming trips yet." : "No upcoming invited trips."}
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {upcoming.map((t) => (
                    <TripCard key={`${view}-up-${t.tripId}`} trip={t} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Past */}
          <div className="card card-soft">
            <div className="card-header card-header-soft d-flex justify-content-between align-items-center">
              <div className="fw-semibold">Past Trips</div>
              <span className="badge badge-count">{past.length}</span>
            </div>

            <div className="card-body">
              {past.length === 0 ? (
                <div className="text-muted">
                  {view === "mine" ? "No past trips yet." : "No past invited trips."}
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {past.map((t) => (
                    <TripCard key={`${view}-past-${t.tripId}`} trip={t} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
