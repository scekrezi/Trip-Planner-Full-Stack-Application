import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const NavBar = ({ loggedInUser, setLoggedInUser }) => {

    const email = loggedInUser?.email || "";
    const initial = email ? email.charAt(0).toUpperCase() : "";

    return (
        <header className='mb-3'>
            <nav className='navbar navbar-expand navbar-premium sticky-top'>
				<div className="container">
                <div className='d-flex align-items-center w-100 justify-content-between'>

                    {/* LEFT SIDE */}
                    <div className='d-flex align-items-center'>
                        <Link className='navbar-brand' to='/'>
                            <img src={logo} alt='Travel' width='150' />
                        </Link>

                        <ul className='navbar-nav align-items-center'>

                            <li className='nav-item'>
                                <Link className="nav-link" to='/'>
                                    Home
                                </Link>
                            </li>

                            <li className='nav-item'>
                                <Link className="nav-link" to="/trips/templates/list">
                                    Explore Trip Iteneraries
                                </Link>
                            </li>

                            {loggedInUser === null ? (
                                <>
                                    <li className='nav-item'>
                                        <Link className="nav-link" to='/users/add'>
                                            Create an Account
                                        </Link>
                                    </li>
                                    <li className='nav-item'>
                                        <Link className="nav-link" to='/users/login'>
                                            Login
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className='nav-item'>
                                        <Link className="nav-link" to="/trips/add">
                                            Create a trip
                                        </Link>
                                    </li>

                                    <li className='nav-item'>
                                        <Link className="nav-link" to="/trips/myTrips">
                                            View My Trips
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* RIGHT SIDE (Avatar)*/}
                    {loggedInUser !== null && (
                        <div className="d-flex align-items-center gap-3">

                            <div className="avatar-circle" title={email}>
                                {initial}
                            </div>

                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => {
                                    localStorage.setItem("loggedInUser", null);
                                    setLoggedInUser(null);
                                }}
                            >
                                Logout
                            </button>

                        </div>
                    )}

                </div>
				</div>
            </nav>
        </header>
    );
};

export default NavBar;
