import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TemplateTripsList() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/trips/templates")
      .then(res => res.json())
      .then((data) => setTrips(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h2>Explore Trip Itineraries</h2>
        
      {error && <div className="alert alert-danger">{error}</div>}

      {trips.length === 0 && !error ? (
        <p>No template trips found.</p>
      ) : (
        <div className="list-group">
          {trips.map((t) => (
            <div key={t.tripId} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">
                    {t.city}, {t.country}
                  </h5>
                  {t.notes && <p className="mb-1">{t.notes}</p>}
                  {(t.startDate || t.endDate) && (
                    <small>
                      {t.startDate ?? "?"} → {t.endDate ?? "?"}
                    </small>
                  )}
                </div>

                <Link className="btn btn-outline-primary" to={`/trips/${t.tripId}`}>
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TemplateTripsList;
