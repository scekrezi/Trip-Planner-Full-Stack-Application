import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const INITIAL_TRIP = {
  country: "",
  city: "",
  startDate: "",
  endDate: "",
  notes: "",
  days: [],
};

const emptyDay = () => ({
  tripDayId: 0,
  dayDate: "",
  dayNotes: "",
  activities: [],
});

const emptyActivity = () => ({
  activityId: 0,
  title: "",
  description: "",
  location: "",
  startTime: "",
  endTime: "",
});

function addDays(dateString, offset) {
  if (!dateString) return "";
  const d = new Date(dateString + "T00:00:00");
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function buildTripFromTemplate(templateTrip) {
  return {
    country: templateTrip?.country ?? "",
    city: templateTrip?.city ?? "",
    startDate: "",
    endDate: "",
    notes: templateTrip?.notes ?? "",
    days: (templateTrip?.days ?? []).map((d) => ({
      tripDayId: 0,
      dayDate: "",
      dayNotes: d?.dayNotes ?? "",
      activities: (d?.activities ?? []).map((a) => ({
        activityId: 0,
        title: a?.title ?? "",
        description: a?.description ?? "",
        location: a?.location ?? "",
        startTime: "",
        endTime: "",
      })),
    })),
  };
}

export default function TripsForm({ loggedInUser, setLoggedInUser }) {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const location = useLocation();

  const templateTrip = useMemo(() => location.state?.templateTrip, [location.state]);

  const [trip, setTrip] = useState(INITIAL_TRIP);
  const [errors, setErrors] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [openDayIndex, setOpenDayIndex] = useState(0);
  const [openActivity, setOpenActivity] = useState({ dayIndex: -1, activityIndex: -1 });

  const [members, setMembers] = useState([]);
  const [membersLoaded, setMembersLoaded] = useState(false);
  const [permissionError, setPermissionError] = useState(null);

  const isLoggedIn = !!loggedInUser?.diyJwt;
  const loggedInId = loggedInUser?.userId ?? loggedInUser?.id;

  function authHeaders(extra = {}) {
    const headers = { Accept: "application/json", ...extra };
    if (loggedInUser?.diyJwt) headers.authorization = loggedInUser.diyJwt;
    return headers;
  }

  function refreshMembers(currentTripId) {
    if (!currentTripId) return;

    if (!loggedInUser?.diyJwt) {
      setMembers([]);
      setMembersLoaded(true);
      return;
    }

    setMembersLoaded(false);

    fetch(`http://localhost:8080/api/trips/${currentTripId}/members`, {
      headers: authHeaders(),
    })
      .then(async (res) => {
        if (res.status === 401) {
          setLoggedInUser?.(null);
          localStorage.removeItem("loggedInUser");
          navigate("/login");
          return [];
        }
        if (res.status === 403) {
          return [];
        }
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Members request failed: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch((e) => {
        setPermissionError(e.message);
        setMembers([]);
      })
      .finally(() => setMembersLoaded(true));
  }

  useEffect(() => {
    if (tripId !== undefined) return;

    setPermissionError(null);
    setMembers([]);
    setMembersLoaded(false);

    if (templateTrip) {
      const t = buildTripFromTemplate(templateTrip);
      setTrip(t);
      setOpenDayIndex(t.days.length ? 0 : -1);
      setOpenActivity({ dayIndex: -1, activityIndex: -1 });
    } else {
      setTrip(INITIAL_TRIP);
      setOpenDayIndex(0);
      setOpenActivity({ dayIndex: -1, activityIndex: -1 });
    }
  }, [tripId, templateTrip]);

  useEffect(() => {
    if (tripId === undefined) return;

    setPermissionError(null);
    setErrors([]);
    setMembers([]);
    setMembersLoaded(false);

    fetch(`http://localhost:8080/api/trips/${tripId}/details`, {
      headers: authHeaders(),
    })
      .then(async (res) => {
        if (res.status >= 200 && res.status < 300) {
          return res.json();
        } else if (res.status === 401) {
          setLoggedInUser?.(null);
          localStorage.removeItem("loggedInUser");
          navigate("/login");
          return null;
        } else if (res.status === 403) {
          setPermissionError("You don’t have permission to view/edit this trip.");
          return null;
        } else if (res.status === 404) {
          navigate("/notFound");
          return null;
        } else {
          const text = await res.text();
          setPermissionError(text || "Request failed.");
          return null;
        }
      })
      .then((data) => {
        if (!data) return;
        data.days = data.days ?? [];
        data.days.forEach((d) => (d.activities = d.activities ?? []));
        setTrip(data);
        setOpenDayIndex(data.days.length ? 0 : -1);

        refreshMembers(tripId);
      })
      .catch((e) => setPermissionError(e.message));
  }, [tripId, loggedInUser?.diyJwt, navigate]);

  const ownerId = trip?.owner?.userId ?? trip?.owner?.id;
  const isOwner = !!(isLoggedIn && loggedInId && ownerId && loggedInId === ownerId);

  const myMember = members.find((m) => {
    const memberId = m?.user?.userId ?? m?.user?.id;
    return memberId && loggedInId && memberId === loggedInId;
  });
  const myRole = (myMember?.role ?? "").toUpperCase();
  const isEditor = !!(isLoggedIn && myRole === "EDITOR");

  const canEditTrip = !!(tripId ? (isOwner || isEditor) : true);

  useEffect(() => {
    if (!tripId) return;
    if (!isLoggedIn) return;
    if (!membersLoaded) return;
    if (!canEditTrip) {
      setPermissionError("View-only: you don’t have permission to edit this trip.");
      navigate(`/trips/${tripId}`);
    }
  }, [tripId, isLoggedIn, membersLoaded, canEditTrip, navigate]);

  function toggleDay(i) {
    setOpenDayIndex((prev) => (prev === i ? -1 : i));
    setOpenActivity({ dayIndex: -1, activityIndex: -1 });
  }

  function toggleActivity(dayIndex, activityIndex) {
    setOpenActivity((prev) => {
      const same = prev.dayIndex === dayIndex && prev.activityIndex === activityIndex;
      return same ? { dayIndex: -1, activityIndex: -1 } : { dayIndex, activityIndex };
    });
  }

  function handleTripChange(e) {
    const { name, value } = e.target;

    if (name === "startDate") {
      setTrip((prev) => {
        const copy = structuredClone(prev);
        copy.startDate = value;

        if (copy.days?.length) {
          copy.days = copy.days.map((d, idx) => ({
            ...d,
            dayDate: value ? addDays(value, idx) : "",
          }));
        }
        return copy;
      });
      return;
    }

    setTrip((prev) => ({ ...prev, [name]: value }));
  }

  function addDay() {
    setTrip((prev) => {
      const nextDays = [...(prev.days ?? []), emptyDay()];
      const start = prev.startDate;
      const newIndex = nextDays.length - 1;
      if (start) nextDays[newIndex].dayDate = addDays(start, newIndex);
      return { ...prev, days: nextDays };
    });

    setOpenDayIndex((trip.days ?? []).length);
    setOpenActivity({ dayIndex: -1, activityIndex: -1 });
  }

  function removeDay(dayIndex) {
    setTrip((prev) => {
      const nextDays = prev.days.filter((_, i) => i !== dayIndex);

      if (prev.startDate) {
        nextDays.forEach((d, idx) => {
          d.dayDate = addDays(prev.startDate, idx);
        });
      }

      return { ...prev, days: nextDays };
    });

    setOpenDayIndex((prev) => {
      if (prev === dayIndex) return -1;
      if (prev > dayIndex) return prev - 1;
      return prev;
    });

    setOpenActivity({ dayIndex: -1, activityIndex: -1 });
  }

  const lockDayDates = tripId === undefined && !!templateTrip;

  function handleDayChange(dayIndex, e) {
    if (lockDayDates && e.target.name === "dayDate") {
      return;
    }

    const { name, value } = e.target;
    setTrip((prev) => {
      const copy = structuredClone(prev);
      copy.days[dayIndex][name] = value;
      return copy;
    });
  }

  function addActivity(dayIndex) {
    setTrip((prev) => {
      const copy = structuredClone(prev);
      copy.days[dayIndex].activities.push(emptyActivity());
      return copy;
    });

    const newIndex = trip.days?.[dayIndex]?.activities?.length ?? 0;
    setOpenActivity({ dayIndex, activityIndex: newIndex });
  }

  function removeActivity(dayIndex, activityIndex) {
    setTrip((prev) => {
      const copy = structuredClone(prev);
      copy.days[dayIndex].activities = copy.days[dayIndex].activities.filter((_, i) => i !== activityIndex);
      return copy;
    });

    setOpenActivity((prev) => {
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
    setTrip((prev) => {
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

    payload.days.forEach((d) => {
      d.dayNotes = d.dayNotes ?? "";
      d.activities = d.activities ?? [];

      d.activities.forEach((a) => {
        a.description = a.description === "" ? null : a.description;
        a.location = a.location === "" ? null : a.location;
        a.startTime = a.startTime === "" ? null : normalizeTime(a.startTime);
        a.endTime = a.endTime === "" ? null : normalizeTime(a.endTime);
      });
    });

    return payload;
  }

  function handleCancel() {
    if (tripId) navigate(`/trips/${tripId}`);
    else navigate("/");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);

    if (!loggedInUser?.diyJwt) {
      setErrors(["You must be logged in."]);
      return;
    }

    if (tripId && !canEditTrip) {
      setErrors(["View-only: you don’t have permission to edit this trip."]);
      return;
    }

    if (templateTrip && !trip.startDate) {
      setErrors(["Please choose a Start Date so we can generate Day dates from the template."]);
      return;
    }

    const method = tripId ? "PUT" : "POST";
    const url = tripId ? `http://localhost:8080/api/trips/${tripId}` : `http://localhost:8080/api/trips`;

    const payload = toPayload(trip);

    setIsSaving(true);

    fetch(url, {
      method,
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (res.status >= 200 && res.status < 300) {
          return res.json();
        }
        if (res.status === 401) {
          setErrors(["Unauthorized. Please log in again."]);
          return null;
        }
        if (res.status === 403) {
          setErrors(["Forbidden. You don’t have permission to save changes."]);
          return null;
        }
        const t = await res.text();
        setErrors([t || "Request failed."]);
        return null;
      })
      .then((saved) => {
        if (!saved) return;
        const id = saved.tripId ?? tripId;
        navigate(`/trips/${id}`);
      })
      .finally(() => setIsSaving(false));
  }

  if (permissionError) {
    return (
      <div className="container py-4" style={{ maxWidth: 980 }}>
        <div className="alert alert-danger">{permissionError}</div>
        <button className="btn btn-outline-secondary" type="button" onClick={handleCancel}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 980 }}>
      <div className="mb-3">
        <h2 className="page-title mb-1">
          {tripId ? "Edit Trip" : templateTrip ? "Create Trip from Template" : "Create Trip"}
        </h2>
        <div className="page-subtitle">
          {tripId
            ? "Update your itinerary and save changes."
            : templateTrip
            ? "Pick dates, review the itinerary, then save your own copy."
            : "Add days and activities, then save everything at once."}
        </div>
      </div>

      {errors.length > 0 && (
        <div className="alert alert-danger">
          <div className="fw-semibold mb-1">Please fix:</div>
          <ul className="mb-0">
            {errors.map((e, idx) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Trip Details */}
        <div className="card card-soft mb-4">
          <div className="card-header card-header-soft">
            <div className="fw-semibold">Trip Details</div>
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  Country <span className="required">*</span>
                </label>
                <input className="form-control" name="country" value={trip.country} onChange={handleTripChange} required/>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  City <span className="required">*</span>
                </label>
                <input className="form-control" name="city" value={trip.city} onChange={handleTripChange} required/>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Start Date <span className="required">*</span>
                </label>
                <input
                  className="form-control"
                  type="date"
                  name="startDate"
                  value={trip.startDate ?? ""}
                  onChange={handleTripChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  End Date <span className="required">*</span>
                </label>
                <input
                  className="form-control"
                  type="date"
                  name="endDate"
                  value={trip.endDate ?? ""}
                  onChange={handleTripChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Notes</label>
                <textarea className="form-control" name="notes" rows={3} value={trip.notes ?? ""} onChange={handleTripChange} />
              </div>

              {templateTrip && (
                <div className="col-12">
                  <div className="alert alert-info mb-0">
                    Template loaded. Choose a <strong>Start Date</strong> to auto-fill Day dates.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Itinerary */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0 fw-semibold">Itinerary</h5>
          <small className="text-muted">{trip.days.length} day(s)</small>
        </div>

        {trip.days.length === 0 && (
          <div className="empty-soft mb-4">
            No days yet. Click <span className="fw-semibold">Add Day</span> below to start building your itinerary.
          </div>
        )}

        {trip.days.map((day, dayIndex) => {
          const isOpen = openDayIndex === dayIndex;

          return (
            <div className="card card-soft mb-3" key={day.tripDayId || `day-${dayIndex}`}>
              <div className="card-header card-header-soft d-flex justify-content-between align-items-center">
                <button type="button" className="btn btn-link text-decoration-none p-0" onClick={() => toggleDay(dayIndex)}>
                  <span className="fw-semibold">
                    Day {dayIndex + 1}
                    {day.dayDate ? ` — ${day.dayDate}` : ""}
                  </span>
                  <span className="ms-2 text-muted">{isOpen ? "▲" : "▼"}</span>
                </button>

                <button className="btn btn-sm btn-danger-soft" type="button" onClick={() => removeDay(dayIndex)}>
                  Remove Day
                </button>
              </div>

              {isOpen && (
                <div className="card-body">
                  <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label">
                        Day Date <span className="required">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="date"
                        name="dayDate"
                        value={day.dayDate ?? ""}
                        onChange={(e) => handleDayChange(dayIndex, e)}
                        disabled={lockDayDates}
                      />
                      {lockDayDates && <div className="form-text">Generated from Start Date.</div>}
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

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="fw-semibold">Activities</div>
                    <button className="btn btn-sm btn-template" type="button" onClick={() => addActivity(dayIndex)}>
                      + Add Activity
                    </button>
                  </div>

                  {day.activities.length === 0 && (
                    <div className="empty-soft mt-3">
                      No activities yet. Click <span className="fw-semibold">Add Activity</span>.
                    </div>
                  )}

                  <div className="mt-3 d-flex flex-column gap-2">
                    {day.activities.map((a, activityIndex) => {
                      const aOpen = openActivity.dayIndex === dayIndex && openActivity.activityIndex === activityIndex;

                      return (
                        <div className="activity-shell" key={a.activityId || `a-${dayIndex}-${activityIndex}`}>
                          <div className="d-flex justify-content-between align-items-center p-2">
                            <button
                              type="button"
                              className="btn btn-link text-decoration-none p-0"
                              onClick={() => toggleActivity(dayIndex, activityIndex)}
                            >
                              <span className="fw-semibold">
                                Activity {activityIndex + 1}
                                {a.title ? ` — ${a.title}` : ""}
                              </span>
                              <span className="ms-2 text-muted">{aOpen ? "▲" : "▼"}</span>
                            </button>

                            <button
                              className="btn btn-sm btn-danger-soft"
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
                                  <label className="form-label">
                                    Title <span className="required">*</span>
                                  </label>
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

                  <div className="mt-3">
                    <button className="btn btn-ghost-outline" type="button" onClick={addDay}>
                      + Add Another Day
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Sticky footer actions (same behavior, nicer look) */}
        <div className="form-footer mt-4" style={{ zIndex: 10 }}>
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-ghost-outline" type="button" onClick={addDay}>
              + Add Day
            </button>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary" type="button" onClick={handleCancel}>
                Cancel
              </button>

              <button className="btn btn-primary-action" type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : tripId ? "Save Changes" : "Save Trip"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
