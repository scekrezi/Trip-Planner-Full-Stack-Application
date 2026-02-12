import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';


const NavBar = ({loggedInUser, setLoggedInUser}) => {
    return (
        <header className='mb-3'>
				<nav className='navbar navbar-expand'>
					<div className='d-flex'>
                        <Link className='navbar-brand' to='/'>
							<img src={logo} alt='Travel' width='150' />
						</Link>
						<ul className='navbar-nav'>
							{/* always-visible zone */}
							<li className='nav-item'>
								<Link className="nav-link" to='/'>
									Home
								</Link>
							</li>
							<li className='nav-item'>
								<Link className="nav-link" to="/trips/templates/list">Explore Trip Iteneraries</Link>
							</li>
							{ loggedInUser === null ?
								<>
									{/* logged-out-only */}
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
								:
								<>
									{/* logged-in-only */}
									<li className='nav-item'>
										<Link className="nav-link" to="/trips/add">Create a trip</Link>
									</li>
									<li className='nav-item'>
										<Link className="nav-link" to="/trips/myTrips">View My Trips</Link>
									</li>
									<li className='nav-item'>
										<button className="nav-link" onClick={() => {
											localStorage.setItem("loggedInUser", null)
											setLoggedInUser(null)
										}}>Logout</button>
									</li>
								</>
							}
						</ul>
					</div>
				</nav>
			</header>
    )
}

export default NavBar