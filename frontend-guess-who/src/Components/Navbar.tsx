import React from "react";
import { useNavigate } from "react-router-dom";

interface INavbarProps {
  isLoggedIn: boolean;
}
function Navbar(props: React.PropsWithChildren<INavbarProps>) {
  const { isLoggedIn } = props;

  const navigate = useNavigate();

  function signOut() {
    localStorage.removeItem("svgw-token");
    navigate("/");
  }
  
  return (
    <div>
      {isLoggedIn ? (
        <nav>
          <button onClick={() => signOut()}>Sign out</button>
        </nav>
      ) : (
        <nav>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Sign up</button>
        </nav>
      )}
    </div>
  );
}

export default Navbar;
