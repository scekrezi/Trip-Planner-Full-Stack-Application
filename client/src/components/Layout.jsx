import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"

function Layout({loggedInUser, setLoggedInUser}) {
    return (
        <div className='container'>
        <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
        <main>
            <h1 className='mb-3'>Travel Planner</h1>
            { loggedInUser && <h2>Welcome, {loggedInUser.email}!</h2> }
            <Outlet />
        </main>
        </div>
    )

}

export default Layout;