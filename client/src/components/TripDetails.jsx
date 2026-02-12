import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TripDetails() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    setTrip(null);

    fetch(`http://localhost:8080/api/trips/${tripId}/details`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then(setTrip)
      .catch((err) => setError(err.message));
  }, [tripId]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!trip) return <div>Loading trip...</div>;

  return (
    <div>
      <h2>
        {trip.city}, {trip.country}
      </h2>

      {(trip.startDate || trip.endDate) && (
        <p className="text-muted">
          {trip.startDate ?? "?"} → {trip.endDate ?? "?"}
        </p>
      )}

      {trip.notes && <p>{trip.notes}</p>}

      <hr />

      <h3>Itinerary</h3>

      {!trip.days || trip.days.length === 0 ? (
        <p>No days yet.</p>
      ) : (
        trip.days.map((day) => (
          <div key={day.tripDayId} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{day.dayDate}</h5>
              {day.dayNotes && <p className="card-text">{day.dayNotes}</p>}

              <h6>Activities</h6>
              {!day.activities || day.activities.length === 0 ? (
                <p className="text-muted">No activities for this day.</p>
              ) : (
                <ul className="list-group">
                  {day.activities.map((a) => (
                    <li key={a.activityId} className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <strong>{a.title}</strong>
                        <span className="text-muted">
                          {a.startTime ?? ""}{a.startTime && a.endTime ? " - " : ""}{a.endTime ?? ""}
                        </span>
                      </div>
                      {a.location && <div>{a.location}</div>}
                      {a.description && <div className="text-muted">{a.description}</div>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
