import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TripDetails({ loggedInUser }) {
  const navigate = useNavigate();
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    setTrip(null);

    const headers = {
      Accept: "application/json",
    };


    if (loggedInUser?.diyJwt) {
      headers.authorization = loggedInUser.diyJwt;
    }

    fetch(`http://localhost:8080/api/trips/${tripId}/details`, { headers })
      .then(async (res) => {
        if (res.status === 404) {
          navigate("/notFound");
          return null;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Request failed: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setTrip(data);
      })
      .catch((err) => setError(err.message));
  }, [tripId, loggedInUser, navigate]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!trip) return <div>Loading trip...</div>;

  const isLoggedIn = !!loggedInUser?.diyJwt;
  const isTemplate = !!trip.isTemplate;


  const loggedInUserId = loggedInUser?.id ?? loggedInUser?.userId;

  const ownerId = trip?.owner?.userId ?? trip?.owner?.id;
  const isOwner = isLoggedIn && ownerId && loggedInUserId && ownerId === loggedInUserId;

  const canManage = isLoggedIn && !isTemplate && isOwner;

  return (
    <div className="container py-4" style={{ maxWidth: 980 }}>
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div>
          <h2 className="mb-1">
            {trip.city}, {trip.country}
          </h2>

          {(trip.startDate || trip.endDate) && (
            <div className="text-muted">
              {trip.startDate ?? "?"} → {trip.endDate ?? "?"}
            </div>
          )}

          {isTemplate && (
            <div className="mt-2">
              <span className="badge text-bg-secondary">Template</span>
            </div>
          )}
        </div>

        {canManage && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={() => navigate(`/trips/edit/${tripId}`)}
            >
              Edit
            </button>

            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => navigate(`/trips/${tripId}/delete`)}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {trip.notes && (
        <div className="mt-3">
          <div className="card shadow-sm rounded-3">
            <div className="card-body">
              <div className="fw-semibold mb-1">Notes</div>
              <div>{trip.notes}</div>
            </div>
          </div>
        </div>
      )}

      <hr className="my-4" />

      <h3 className="mb-3">Itinerary</h3>

      {!trip.days || trip.days.length === 0 ? (
        <div className="text-muted">No days yet.</div>
      ) : (
        trip.days.map((day) => (
          <div key={day.tripDayId} className="card shadow-sm rounded-3 mb-3">
            <div className="card-body">
              <h5 className="card-title mb-1">{day.dayDate}</h5>
              {day.dayNotes && <p className="card-text text-muted mb-3">{day.dayNotes}</p>}

              <h6 className="mb-2">Activities</h6>

              {!day.activities || day.activities.length === 0 ? (
                <div className="text-muted">No activities for this day.</div>
              ) : (
                <ul className="list-group">
                  {day.activities.map((a) => (
                    <li key={a.activityId} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <div className="fw-semibold">{a.title}</div>
                          {a.location && <div>{a.location}</div>}
                          {a.description && <div className="text-muted">{a.description}</div>}
                        </div>

                        <div className="text-muted text-nowrap">
                          {a.startTime ?? ""}
                          {a.startTime && a.endTime ? " - " : ""}
                          {a.endTime ?? ""}
                        </div>
                      </div>
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
