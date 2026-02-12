import { useNavigate } from "react-router-dom";
import { useState } from "react";


const LoginForm = ({setLoggedInUser}) => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState([]);

    const handleChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        fetch("http://localhost:8080/api/user/login", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                response.json().then(userPayload => {
                    // const diyJwt = userPayload.diyJwt
                    const { diyJwt } = userPayload
                    const userDataString = diyJwt.split("|")[0]
                    const parsedUser = JSON.parse(userDataString)
                    parsedUser.diyJwt = diyJwt
                    setLoggedInUser(parsedUser)
                    localStorage.setItem("loggedInUser", JSON.stringify(parsedUser))
                })
            } else {
                response.json().then((errors) => {
                    setErrors(errors)
                })
            }
        })
    }
    return (
    <div className="row">
    <div className="col-3"></div>
        <form onSubmit={handleSubmit} className="col-6">
        <h3>Log into your account</h3>
            {errors.length > 0 && (
                <>
                    <p>There were some errors:</p>
                    <ul id="errors">
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </>
            )}

            <div className="form-group">
                <label>Email:</label>
                <input className="form-control" type="email" name="email" value={user.email} onChange={handleChange} required /> 
            </div>
            <div className="form-group">
                <label>Password:</label>
                <input className="form-control" type="password" name="password" value={user.password} onChange={handleChange} required />
            </div>
            <button type="submit">Log in</button>
        </form>
    </div>
    );
}

export default LoginForm;