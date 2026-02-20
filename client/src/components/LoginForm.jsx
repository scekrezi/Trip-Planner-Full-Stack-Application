import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const LoginForm = ({ setLoggedInUser }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:8080/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        response.json().then((userPayload) => {
          const { diyJwt } = userPayload;
          const userDataString = diyJwt.split("|")[0];
          const parsedUser = JSON.parse(userDataString);
          parsedUser.diyJwt = diyJwt;
          setLoggedInUser(parsedUser);
          localStorage.setItem("loggedInUser", JSON.stringify(parsedUser));
        });
      } else {
        response.json().then((errors) => {
          setErrors(errors);
        });
      }
    });
  };

  return (
    <div className="container py-4" style={{ maxWidth: 520 }}>
      <div className="card card-soft">
        <div className="card-body p-4">
          <div className="mb-3">
            <h2 className="page-title mb-1">Welcome back</h2>
            <div className="page-subtitle">Log in to manage your trips and collaborations.</div>
          </div>

          {errors.length > 0 && (
            <div className="alert alert-danger">
              <div className="fw-semibold mb-1">There were some errors:</div>
              <ul className="mb-0">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 btn-lg home-primary">
              Log in
            </button>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <Link className="btn btn-link p-0" to="/users/add">
                Create an account
              </Link>

              <button
                type="button"
                className="btn btn-link p-0 text-muted"
                onClick={() => navigate("/")}
              >
                Back to home
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
