import { Link } from "react-router-dom";

export default function Home({ loggedInUser }) {
  const isLoggedIn = !!loggedInUser?.diyJwt;

  return (
    <div className="home-wrap">
      <div className="home-hero card-soft">
        <div className="home-pill">Travel Planner</div>

        <h1 className="home-title">Plan trips smarter. Together.</h1>

        <p className="home-subtitle">
          Build day-by-day itineraries, invite collaborators, and start from curated templates.
          All in one clean workspace.
        </p>

        <div className="home-actions">
          {isLoggedIn ? (
            <>
              <Link to="/trips/add" className="btn btn-primary btn-lg home-primary">
                Create a Trip
              </Link>
              <Link to="/trips/templates/list" className="btn btn-ghost-outline btn-lg">
                Explore Templates
              </Link>
            </>
          ) : (
            <>
              <Link to="/users/login" className="btn btn-primary btn-lg home-primary">
                Log In
              </Link>
              <Link to="/users/add" className="btn btn-ghost-outline btn-lg">
                Create Account
              </Link>
            </>
          )}
        </div>

        <div className="home-metrics">
          <div className="home-metric">
            <div className="home-metric-title">Templates</div>
            <div className="home-metric-sub">Start from curated itineraries</div>
          </div>

          <div className="home-metric">
            <div className="home-metric-title">Collaborators</div>
            <div className="home-metric-sub">Invite friends as Viewer/Editor</div>
          </div>

          <div className="home-metric">
            <div className="home-metric-title">Itinerary</div>
            <div className="home-metric-sub">Days + activities, organized</div>
          </div>
        </div>
      </div>
    </div>
  );
}
