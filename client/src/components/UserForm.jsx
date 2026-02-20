import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const UserForm = () => {
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
    fetch("http://localhost:8080/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        navigate("/");
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
            <h2 className="page-title mb-1">Create your account</h2>
            <div className="page-subtitle">
              Start planning trips and collaborating instantly.
            </div>
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
              Create Account
            </button>

            <div className="text-center mt-3">
              <Link className="btn btn-link p-0" to="/users/login">
                Already have an account? Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
