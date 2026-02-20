import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

function Layout({ loggedInUser, setLoggedInUser }) {
  return (
    <>
      <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />

      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
