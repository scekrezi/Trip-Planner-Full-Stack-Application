import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TripDetails({ loggedInUser }) {
  const navigate = useNavigate();
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);

  const [members, setMembers] = useState([]);
  const [membersError, setMembersError] = useState(null);
  const [membersLoaded, setMembersLoaded] = useState(false);

  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("VIEWER");
  const [addMemberError, setAddMemberError] = useState(null);
  const [addMemberSuccess, setAddMemberSuccess] = useState(null);

  const isLoggedIn = !!loggedInUser?.diyJwt;
  const loggedInUserId = loggedInUser?.id ?? loggedInUser?.userId;

  function buildHeaders() {
    const headers = { Accept: "application/json" };
    if (loggedInUser?.diyJwt) headers.authorization = loggedInUser.diyJwt;
    return headers;
  }

  function refreshMembers() {
    if (!loggedInUser?.diyJwt) {
      setMembers([]);
      setMembersLoaded(true);
      return;
    }

    setMembersError(null);
    setMembersLoaded(false);

    fetch(`http://localhost:8080/api/trips/${tripId}/members`, {
      headers: buildHeaders(),
    })
      .then(async (res) => {
        if (res.status === 401) return [];
        if (res.status === 403) return [];
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Members request failed: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch((err) => setMembersError(err.message))
      .finally(() => setMembersLoaded(true));
  }

  function handleAddMember(e) {
    e.preventDefault();
    setAddMemberError(null);
    setAddMemberSuccess(null);

    const email = newMemberEmail.trim();
    if (!email) {
      setAddMemberError("Collaborator email is required.");
      return;
    }

    const body = {
      user: { email },
      role: newMemberRole,
    };

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (loggedInUser?.diyJwt) headers.authorization = loggedInUser.diyJwt;

    fetch(`http://localhost:8080/api/trips/${tripId}/members`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Add collaborator failed: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setAddMemberSuccess("Collaborator added.");
        setNewMemberEmail("");
        setNewMemberRole("VIEWER");
        refreshMembers();
      })
      .catch((err) => setAddMemberError(err.message));
  }

  function handleUseTemplate() {
    if (!trip) return;

    const templateTrip = {
      country: trip.country ?? "",
      city: trip.city ?? "",
      notes: trip.notes ?? "",
      startDate: "",
      endDate: "",
      days: (trip.days ?? []).map((d) => ({
        dayDate: "",
        dayNotes: d.dayNotes ?? "",
        activities: (d.activities ?? []).map((a) => ({
          title: a.title ?? "",
          description: a.description ?? null,
          location: a.location ?? null,
          startTime: null,
          endTime: null,
        })),
      })),
    };

    navigate("/trips/add", { state: { templateTrip } });
  }

  useEffect(() => {
    setError(null);
    setTrip(null);

    setMembers([]);
    setMembersError(null);
    setMembersLoaded(false);

    setShowAddMember(false);
    setAddMemberError(null);
    setAddMemberSuccess(null);

    fetch(`http://localhost:8080/api/trips/${tripId}/details`, {
      headers: buildHeaders(),
    })
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
        refreshMembers();
      })
      .catch((err) => setError(err.message));
  }, [tripId, loggedInUser?.diyJwt, navigate]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!trip) return <div className="container py-4" style={{ maxWidth: 980 }}>Loading trip...</div>;

  const isTemplate = !!(trip?.isTemplate ?? trip?.template ?? trip?.is_template);

  const ownerId = trip?.owner?.userId ?? trip?.owner?.id;
  const isOwner =
    isLoggedIn && ownerId && loggedInUserId && ownerId === loggedInUserId;

  const canManageMembers = isLoggedIn && !isTemplate && isOwner;

  const myMember = members.find((m) => {
    const memberUserId = m?.user?.userId ?? m?.user?.id;
    return memberUserId && loggedInUserId && memberUserId === loggedInUserId;
  });

  const myRole = (myMember?.role ?? "").toUpperCase();
  const isEditor = isLoggedIn && myRole === "EDITOR";

  const canEditTrip = isLoggedIn && !isTemplate && (isOwner || isEditor);

  const showViewOnly = isLoggedIn && !isTemplate && membersLoaded && !canEditTrip;

  return (
    <div className="container py-4" style={{ maxWidth: 980 }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
        <div>
          <h2 className="page-title mb-1">
            {trip.city}, {trip.country}
          </h2>

          {!isTemplate && (trip.startDate || trip.endDate) && (
            <div className="page-subtitle">
              {trip.startDate ?? "?"} → {trip.endDate ?? "?"}
            </div>
          )}

          {isTemplate && (
            <div className="mt-2">
              <span className="badge badge-template">Template</span>
            </div>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          {isTemplate && isLoggedIn && (
            <button className="btn btn-template" type="button" onClick={handleUseTemplate}>
              Use this template
            </button>
          )}

          {!isTemplate && canEditTrip && (
            <>
              <button
                className="btn btn-ghost-outline btn-sm"
                type="button"
                onClick={() => navigate(`/trips/edit/${tripId}`)}
              >
                Edit
              </button>

              {isOwner && (
                <button
                  className="btn btn-danger-soft btn-sm"
                  type="button"
                  onClick={() => navigate(`/trips/${tripId}/delete`)}
                >
                  Delete
                </button>
              )}
            </>
          )}

          {!isTemplate && showViewOnly && (
            <span className="badge badge-template">View only</span>
          )}
        </div>
      </div>

      {/* Notes */}
      {trip.notes && (
        <div className="card card-soft mb-4">
          <div className="card-header card-header-soft fw-semibold">Notes</div>
          <div className="card-body">{trip.notes}</div>
        </div>
      )}

      {/* Collaborators */}
      <div className="card card-soft mb-4">
        <div className="card-header card-header-soft d-flex justify-content-between align-items-center">
          <div className="fw-semibold">Collaborators</div>

          {canManageMembers && (
            <button
              className="btn btn-ghost-outline btn-sm"
              type="button"
              onClick={() => {
                setShowAddMember((v) => !v);
                setAddMemberError(null);
                setAddMemberSuccess(null);
              }}
            >
              {showAddMember ? "Close" : "Add collaborator"}
            </button>
          )}
        </div>

        <div className="card-body">
          {!isLoggedIn ? (
            <div className="text-muted">Log in to view collaborators.</div>
          ) : (
            <>
              {membersError && <div className="alert alert-danger">{membersError}</div>}

              {showAddMember && canManageMembers && (
                <form onSubmit={handleAddMember} className="mb-3">
                  {addMemberError && <div className="alert alert-danger">{addMemberError}</div>}
                  {addMemberSuccess && <div className="alert alert-success">{addMemberSuccess}</div>}

                  <div className="row g-2 align-items-end">
                    <div className="col-md-7">
                      <label className="form-label">Collaborator email</label>
                      <input
                        className="form-control"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="collab@travel.com"
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                      >
                        <option value="VIEWER">VIEWER</option>
                        <option value="EDITOR">EDITOR</option>
                      </select>
                    </div>

                    <div className="col-md-2">
                      <button className="btn btn-primary w-100" type="submit">
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="form-text mt-2">
                    Owner can add collaborators as <strong>VIEWER</strong> or <strong>EDITOR</strong>.
                  </div>
                </form>
              )}

              {!members || members.length === 0 ? (
                <div className="text-muted">
                  No collaborators found (or you don’t have access).
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {members.map((m, idx) => (
                    <div
                      key={m.user?.userId ?? m.user?.id ?? idx}
                      className="trip-row d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="trip-title">{m.user?.email ?? "Unknown"}</div>
                        <div className="trip-notes">{m.role ?? "?"}</div>
                      </div>
                      <span className="badge badge-role">{m.role ?? "?"}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Itinerary */}
      <div className="card card-soft">
        <div className="card-header card-header-soft fw-semibold">Itinerary</div>
        <div className="card-body">
          {!trip.days || trip.days.length === 0 ? (
            <div className="text-muted">No days yet.</div>
          ) : (
            trip.days.map((day) => (
              <div key={day.tripDayId} className="card shadow-sm rounded-3 mb-3">
                <div className="card-body">
                  <h5 className="card-title mb-1">{day.dayDate}</h5>
                  {day.dayNotes && (
                    <p className="card-text text-muted mb-3">{day.dayNotes}</p>
                  )}

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
                              {a.description && (
                                <div className="text-muted">{a.description}</div>
                              )}
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
      </div>
    </div>
  );
}
