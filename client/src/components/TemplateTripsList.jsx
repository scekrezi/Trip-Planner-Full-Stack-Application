import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function TemplateTripsList() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/trips/templates")
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((err) => setError(err.message));
  }, []);

  const filteredTrips = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return trips;

    return trips.filter((t) => {
      const haystack = `${t.city ?? ""} ${t.country ?? ""} ${t.notes ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [trips, query]);

  return (
    <div className="container py-4" style={{ maxWidth: 980 }}>
      {/* Page Header */}
      <div className="page-header mb-3">
        <div className="page-header-left">
          <h2 className="page-title mb-1">Explore Trip Itineraries</h2>
          <div className="page-subtitle">Browse templates and start planning faster.</div>
        </div>

        <div className="page-header-right">
          <div className="search-wrap">
            <input
              className="form-control search-input"
              placeholder="Search by city, country, or notes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!error && trips.length === 0 ? (
        <div className="card-premium p-4">
          <div className="text-muted">No template trips found.</div>
        </div>
      ) : (
        <>
          {!error && filteredTrips.length === 0 ? (
            <div className="card-premium p-4">
              <div className="text-muted">
                No results for <strong>{query}</strong>.
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2 mt-2">
              {filteredTrips.map((t) => (
                <div key={t.tripId} className="trip-row">
                  <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                    <div style={{ minWidth: 240 }}>
                      <div className="trip-title">
                        {t.city}, {t.country}
                      </div>

                      {t.notes && <div className="trip-notes">{t.notes}</div>}

                      {(t.startDate || t.endDate) && (
                        <div className="trip-dates">
                          {t.startDate ?? "?"} → {t.endDate ?? "?"}
                        </div>
                      )}
                    </div>

                    <Link className="btn btn-premium btn-ghost" to={`/trips/${t.tripId}`}>
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TemplateTripsList;
