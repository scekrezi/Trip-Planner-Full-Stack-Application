import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import Layout from "./Layout";
import UserForm from "./UserForm";
import LoginForm from "./LoginForm";
import TemplateTripsList from "./TemplateTripsList";
import MyTrips from "./MyTrips";
import TripsForm from "./TripsForm";
import DeleteTrip from "./DeleteTrip";
import { useEffect, useState } from "react"
import TripDetails from "./TripDetails";

function AppRouter() {
    const [loggedInUser, setLoggedInUser] = useState(JSON.parse(localStorage.getItem("loggedInUser")))

    const routes = [
        {
            path: "/",
            element: <Layout loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />,
            children: [
                {
                    path: "",
                    element: <div>Welcome to the trip planner</div>
                },
                {
                    path: "/users/add",
                    element: loggedInUser ? <Navigate to="/" /> : <UserForm />
                },
                 {
                    path: "/users/login",
                    element: loggedInUser ? <Navigate to="/" /> : <LoginForm setLoggedInUser={setLoggedInUser} />
                },
                {
                    path: "/trips/templates/list",
                    element: <TemplateTripsList />
                },
                {
                    path: "/trips/:tripId",
                    element: <TripDetails />
                },
                {
                    path: "/trips/myTrips",
                    element: loggedInUser ? <MyTrips loggedInUser={loggedInUser}/> : <Navigate to="/users/login" />
                },
                {
                    path: "/trips/add",
                    element: loggedInUser ? <TripsForm loggedInUser={loggedInUser}/> : <Navigate to="/users/login" />
                },
                {
                    path: "/trips/edit/:tripId",
                    element: loggedInUser ? <TripsForm loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} /> : <Navigate to="/users/login" />
                },
                {
                    path: "/trips/delete/:tripId",
                    element: loggedInUser ? <DeleteTrip loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} /> : <Navigate to="/users/login" />
                },
                {
                    path: "*",
                    element: <div>Not Found</div>
                },
            ]
        }

    ]
    const router = createBrowserRouter(routes)

    return <RouterProvider router={router} />

}

export default AppRouter;