import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const INITIAL_TRIP = {
  country: "",
  city: "",
  startDate: "",
  endDate: "",
  notes: "",
  days: []
};

const emptyDay = () => ({
  tripDayId: 0,
  dayDate: "",
  dayNotes: "",
  activities: []
});

const emptyActivity = () => ({
  activityId: 0,
  title: "",
  description: "",
  location: "",
  startTime: "",
  endTime: ""
});

export default function TripsForm({ loggedInUser, setLoggedInUser }) {
  const navigate = useNavigate();
  const { tripId } = useParams();

  const [trip, setTrip] = useState(INITIAL_TRIP);
  const [errors, setErrors] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [openDayIndex, setOpenDayIndex] = useState(0);
  const [openActivity, setOpenActivity] = useState({ dayIndex: -1, activityIndex: -1 });


  useEffect(() => {
    if (tripId === undefined) {
      setTrip(INITIAL_TRIP);
      setOpenDayIndex(0);
      setOpenActivity({ dayIndex: -1, activityIndex: -1 });
      return;
    }

    fetch(`http://localhost:8080/api/trips/${tripId}/details`, {
      headers: {
        authorization: loggedInUser?.diyJwt
      }
    })
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          return res.json();
        } else if (res.status === 401) {
          navigate("/login");
          return null;
        } else {
          navigate("/notFound");
          return null;
        }
      })
      .then(data => {
        if (!data) return;
        data.days = data.days ?? [];
        data.days.forEach(d => (d.activities = d.activities ?? []));
        setTrip(data);
        setOpenDayIndex(data.days.length ? 0 : -1);
      });
  }, [tripId, loggedInUser, navigate]);


  useEffect(() => {
    if (!tripId) return;
    if (loggedInUser && trip.owner) {
      const loggedId = loggedInUser.userId ?? loggedInUser.id;
      const ownerId = trip.owner.userId ?? trip.owner.id;

      if (loggedId && ownerId && loggedId !== ownerId) {
        localStorage.setItem("loggedInUser", null);
        setLoggedInUser(null);
      }
    }
  }, [loggedInUser, trip, tripId, setLoggedInUser]);

  function toggleDay(i) {
    setOpenDayIndex(prev => (prev === i ? -1 : i));
    setOpenActivity({ dayIndex: -1, activityIndex: -1 });
  }

  function toggleActivity(dayIndex, activityIndex) {
    setOpenActivity(prev => {
      const same = prev.dayIndex === dayIndex && prev.activityIndex === activityIndex;
      return same ? { dayIndex: -1, activityIndex: -1 } : { dayIndex, activityIndex };
    });
  }


  function handleTripChange(e) {
    const { name, value } = e.target;
    setTrip(prev => ({ ...prev, [name]: value }));
  }


  function addDay() {
    setTrip(prev => {
      const nextDays = [...(prev.days ?? []), emptyDay()];
      return { ...prev, days: nextDays };
    });

    setOpenDayIndex((trip.days ?? []).length);
    setOpenActivity({ dayIndex: -1, activityIndex: -1 });
  }

  function removeDay(dayIndex) {
    setTrip(prev => {
      const nextDays = prev.days.filter((_, i) => i !== dayIndex);
      return { ...prev, days: nextDays };
    });


    setOpenDayIndex(prev => {
      if (prev === dayIndex) return -1;
      if (prev > dayIndex) return prev - 1;
      return prev;
    });

    setOpenActivity({ dayIndex: -1, activityIndex: -1 });
  }

  function handleDayChange(dayIndex, e) {
    const { name, value } = e.target;
    setTrip(prev => {
      const copy = structuredClone(prev);
      copy.days[dayIndex][name] = value;
      return copy;
    });
  }


  function addActivity(dayIndex) {
    setTrip(prev => {
      const copy = structuredClone(prev);
      copy.days[dayIndex].activities.push(emptyActivity());
      return copy;
    });

    const newIndex = (trip.days?.[dayIndex]?.activities?.length ?? 0);
    setOpenActivity({ dayIndex, activityIndex: newIndex });
  }

  function removeActivity(dayIndex, activityIndex) {
    setTrip(prev => {
      const copy = structuredClone(prev);
      copy.days[dayIndex].activities = copy.days[dayIndex].activities.filter((_, i) => i !== activityIndex);
      return copy;
    });

    setOpenActivity(prev => {
      if (prev.dayIndex === dayIndex && prev.activityIndex === activityIndex) {
        return { dayIndex: -1, activityIndex: -1 };
      }
      if (prev.dayIndex === dayIndex && prev.activityIndex > activityIndex) {
        return { dayIndex, activityIndex: prev.activityIndex - 1 };
      }
      return prev;
    });
  }

  function handleActivityChange(dayIndex, activityIndex, e) {
    const { name, value } = e.target;
    setTrip(prev => {
      const copy = structuredClone(prev);
      copy.days[dayIndex].activities[activityIndex][name] = value;
      return copy;
    });
  }

  function normalizeTime(t) {
    if (!t) return null;
    if (/^\d{2}:\d{2}$/.test(t)) return `${t}:00`;
    return t;
  }

  function toPayload(current) {
    const payload = structuredClone(current);

    payload.notes = payload.notes ?? "";
    payload.days = payload.days ?? [];

    payload.days.forEach(d => {
      d.dayNotes = d.dayNotes ?? "";
      d.activities = d.activities ?? [];

      d.activities.forEach(a => {
        a.description = a.description === "" ? null : a.description;
        a.location = a.location === "" ? null : a.location;
        a.startTime = a.startTime === "" ? null : normalizeTime(a.startTime);
        a.endTime = a.endTime === "" ? null : normalizeTime(a.endTime);
      });
    });

    return payload;
  }


  function handleCancel() {
  

    if (tripId) {
      navigate(`/trips/${tripId}`);
    } else {
      
      navigate("/");
    }
  }

 
  function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);

    if (!loggedInUser?.diyJwt) {
      setErrors(["You must be logged in."]);
      return;
    }

    const method = tripId ? "PUT" : "POST";
    const url = tripId
      ? `http://localhost:8080/api/trips/${tripId}`
      : `http://localhost:8080/api/trips`;

    const payload = toPayload(trip);

    setIsSaving(true);

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: loggedInUser.diyJwt
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          return res.json();
        } else if (res.status === 401) {
          setErrors(["Unauthorized. Please log in again."]);
          return null;
        } else {
          return res.text().then(t => {
            setErrors([t || "Request failed."]);
            return null;
          });
        }
      })
      .then(saved => {
        if (!saved) return;
        const id = saved.tripId ?? tripId;
        navigate(`/trips/${id}`);
      })
      .finally(() => setIsSaving(false));
  }

  return (
    <div className="container py-4" style={{ maxWidth: 980 }}>
      <div className="mb-3">
        <h2 className="mb-0">{tripId ? "Edit Trip" : "Create Trip"}</h2>
        <small className="text-muted">
          {tripId ? "Update your itinerary and save changes." : "Add days and activities, then save everything at once."}
        </small>
      </div>

      {errors.length > 0 && (
        <div className="alert alert-danger">
          <div className="fw-semibold mb-1">Please fix:</div>
          <ul className="mb-0">
            {errors.map((e, idx) => <li key={idx}>{e}</li>)}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Trip Details */}
        <div className="card shadow-sm rounded-3 mb-4">
          <div className="card-header bg-white">
            <div className="fw-semibold">Trip Details</div>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Country *</label>
                <input className="form-control" name="country" value={trip.country} onChange={handleTripChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label">City *</label>
                <input className="form-control" name="city" value={trip.city} onChange={handleTripChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label">Start Date *</label>
                <input className="form-control" type="date" name="startDate" value={trip.startDate ?? ""} onChange={handleTripChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label">End Date *</label>
                <input className="form-control" type="date" name="endDate" value={trip.endDate ?? ""} onChange={handleTripChange} />
              </div>

              <div className="col-12">
                <label className="form-label">Notes</label>
                <textarea className="form-control" name="notes" rows={3} value={trip.notes ?? ""} onChange={handleTripChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Itinerary</h5>
          <small className="text-muted">{trip.days.length} day(s)</small>
        </div>

        {trip.days.length === 0 && (
          <div className="text-muted border rounded p-4 mb-4">
            No days yet. Click <span className="fw-semibold">Add Day</span> below to start building your itinerary.
          </div>
        )}

        {trip.days.map((day, dayIndex) => {
          const isOpen = openDayIndex === dayIndex;

          return (
            <div className="card shadow-sm rounded-3 mb-3" key={day.tripDayId || `day-${dayIndex}`}>
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none p-0"
                  onClick={() => toggleDay(dayIndex)}
                >
                  <span className="fw-semibold">
                    Day {dayIndex + 1}{day.dayDate ? ` — ${day.dayDate}` : ""}
                  </span>
                  <span className="ms-2 text-muted">{isOpen ? "▲" : "▼"}</span>
                </button>

                <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => removeDay(dayIndex)}>
                  Remove Day
                </button>
              </div>

              {isOpen && (
                <div className="card-body">
                  {/* Day fields */}
                  <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label">Day Date *</label>
                      <input
                        className="form-control"
                        type="date"
                        name="dayDate"
                        value={day.dayDate ?? ""}
                        onChange={(e) => handleDayChange(dayIndex, e)}
                      />
                    </div>

                    <div className="col-md-8">
                      <label className="form-label">Day Notes</label>
                      <input
                        className="form-control"
                        name="dayNotes"
                        value={day.dayNotes ?? ""}
                        onChange={(e) => handleDayChange(dayIndex, e)}
                        placeholder="Optional notes for this day..."
                      />
                    </div>
                  </div>

                  {/* Activities header */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="fw-semibold">Activities</div>
                    <button className="btn btn-sm btn-primary" type="button" onClick={() => addActivity(dayIndex)}>
                      + Add Activity
                    </button>
                  </div>

                  {day.activities.length === 0 && (
                    <div className="text-muted border rounded p-3 mt-3">
                      No activities yet. Click <span className="fw-semibold">Add Activity</span>.
                    </div>
                  )}

                  {/* Activities dropdown list */}
                  <div className="mt-3 d-flex flex-column gap-2">
                    {day.activities.map((a, activityIndex) => {
                      const aOpen =
                        openActivity.dayIndex === dayIndex && openActivity.activityIndex === activityIndex;

                      return (
                        <div className="border rounded" key={a.activityId || `a-${dayIndex}-${activityIndex}`}>
                          <div className="d-flex justify-content-between align-items-center p-2">
                            <button
                              type="button"
                              className="btn btn-link text-decoration-none p-0"
                              onClick={() => toggleActivity(dayIndex, activityIndex)}
                            >
                              <span className="fw-semibold">
                                Activity {activityIndex + 1}{a.title ? ` — ${a.title}` : ""}
                              </span>
                              <span className="ms-2 text-muted">{aOpen ? "▲" : "▼"}</span>
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              type="button"
                              onClick={() => removeActivity(dayIndex, activityIndex)}
                            >
                              Remove
                            </button>
                          </div>

                          {aOpen && (
                            <div className="p-3 border-top">
                              <div className="row g-3">
                                <div className="col-md-6">
                                  <label className="form-label">Title *</label>
                                  <input
                                    className="form-control"
                                    name="title"
                                    value={a.title ?? ""}
                                    onChange={(e) => handleActivityChange(dayIndex, activityIndex, e)}
                                  />
                                </div>

                                <div className="col-md-6">
                                  <label className="form-label">Location</label>
                                  <input
                                    className="form-control"
                                    name="location"
                                    value={a.location ?? ""}
                                    onChange={(e) => handleActivityChange(dayIndex, activityIndex, e)}
                                  />
                                </div>

                                <div className="col-md-3">
                                  <label className="form-label">Start</label>
                                  <input
                                    className="form-control"
                                    type="time"
                                    name="startTime"
                                    value={a.startTime ?? ""}
                                    onChange={(e) => handleActivityChange(dayIndex, activityIndex, e)}
                                  />
                                </div>

                                <div className="col-md-3">
                                  <label className="form-label">End</label>
                                  <input
                                    className="form-control"
                                    type="time"
                                    name="endTime"
                                    value={a.endTime ?? ""}
                                    onChange={(e) => handleActivityChange(dayIndex, activityIndex, e)}
                                  />
                                </div>

                                <div className="col-12">
                                  <label className="form-label">Description</label>
                                  <textarea
                                    className="form-control"
                                    name="description"
                                    rows={2}
                                    value={a.description ?? ""}
                                    onChange={(e) => handleActivityChange(dayIndex, activityIndex, e)}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Optional: add day button after each day */}
                  <div className="mt-3">
                    <button className="btn btn-outline-primary" type="button" onClick={addDay}>
                      + Add Another Day
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Sticky footer actions */}
        <div className="position-sticky bottom-0 bg-white border-top py-3 mt-4" style={{ zIndex: 10 }}>
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-primary" type="button" onClick={addDay}>
              + Add Day
            </button>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary" type="button" onClick={handleCancel}>
                Cancel
              </button>

              <button className="btn btn-success" type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : tripId ? "Save Changes" : "Save Trip"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
