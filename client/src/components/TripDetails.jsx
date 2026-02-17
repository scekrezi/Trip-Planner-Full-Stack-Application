import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TripDetails({ loggedInUser }) {
  const navigate = useNavigate();
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);

  const [members, setMembers] = useState([]);
  const [membersError, setMembersError] = useState(null);

  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("VIEWER");
  const [addMemberError, setAddMemberError] = useState(null);
  const [addMemberSuccess, setAddMemberSuccess] = useState(null);

const isLoggedIn = !!(loggedInUser?.diyJwt);
  const loggedInUserId = loggedInUser?.id ?? loggedInUser?.userId;

  function buildHeaders() {
    const headers = { Accept: "application/json" };
    if (loggedInUser?.diyJwt) headers.authorization = loggedInUser.diyJwt;
    return headers;
  }

  function refreshMembers() {
    if (!loggedInUser?.diyJwt) return;

    setMembersError(null);
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
      .catch((err) => setMembersError(err.message));
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

        if (loggedInUser?.diyJwt) {
          refreshMembers();
        }
      })
      .catch((err) => setError(err.message));

  }, [tripId, loggedInUser, navigate]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!trip) return <div>Loading trip...</div>;

 const isTemplate = !!(trip?.isTemplate ?? trip?.template ?? trip?.is_template);

  const ownerId = trip?.owner?.userId ?? trip?.owner?.id;
  const isOwner =
    isLoggedIn && ownerId && loggedInUserId && ownerId === loggedInUserId;

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
            <div className="mt-2 d-flex gap-2 align-items-center flex-wrap">
              <span className="badge text-bg-secondary">Template</span>

              {/* */}
              {isLoggedIn && (
                <button
                  className="btn btn-sm btn-primary"
                  type="button"
                  onClick={handleUseTemplate}
                >
                  Use this template
                </button>
              )}
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

      {/* Collaborators */}
      <hr className="my-4" />

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="mb-0">Collaborators</h3>

        {canManage && (
          <button
            className="btn btn-sm btn-outline-primary"
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

      {!isLoggedIn ? (
        <div className="text-muted">Log in to view collaborators.</div>
      ) : (
        <div className="card shadow-sm rounded-3 mb-3">
          <div className="card-body">
            {membersError && (
              <div className="alert alert-danger">{membersError}</div>
            )}

            {showAddMember && canManage && (
              <form onSubmit={handleAddMember} className="mb-3">
                {addMemberError && (
                  <div className="alert alert-danger">{addMemberError}</div>
                )}
                {addMemberSuccess && (
                  <div className="alert alert-success">{addMemberSuccess}</div>
                )}

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
                  Owner can add collaborators as <strong>VIEWER</strong> or{" "}
                  <strong>EDITOR</strong>.
                </div>
              </form>
            )}

            {!members || members.length === 0 ? (
              <div className="text-muted">
                No collaborators found (or you don’t have access).
              </div>
            ) : (
              <ul className="list-group">
                {members.map((m, idx) => (
                  <li
                    key={m.user?.userId ?? m.user?.id ?? idx}
                    className="list-group-item d-flex justify-content-between align-items-start"
                  >
                    <div>
                      <div className="fw-semibold">
                        {m.user?.email
                          ? m.user.email
                          : m.user?.userId || m.user?.id
                          ? `User #${m.user?.userId ?? m.user?.id}`
                          : "Unknown user"}
                      </div>
                      <div className="text-muted small">Role: {m.role ?? "?"}</div>
                    </div>
                    <span className="badge text-bg-secondary">{m.role ?? "?"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Itinerary */}
      <hr className="my-4" />
      <h3 className="mb-3">Itinerary</h3>

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
  );
}
