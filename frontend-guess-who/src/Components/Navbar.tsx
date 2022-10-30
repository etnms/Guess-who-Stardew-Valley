import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css"; 

interface INavbarProps {
  isLoggedIn: boolean;
  username: string;
}
function Navbar(props: React.PropsWithChildren<INavbarProps>) {
  const { isLoggedIn, username } = props;

  const navigate = useNavigate();

  function signOut() {
    localStorage.removeItem("svgw-token");
    navigate("/");
  }

  useEffect(() => {
    if (localStorage.getItem("darktheme") === "darktheme") {
      document.documentElement.setAttribute("data-color-scheme", "dark");
    } else {
      document.documentElement.setAttribute("data-color-scheme", "light");
    }
  })
  
  return (
    <nav className={styles.nav}>
      {isLoggedIn ? (
        <div className={styles["nav-signed"]}>
          <span className={styles["nav-text"]}>Welcome {username}</span>
          <button onClick={() => signOut()} className={`${styles["btn"]} ${styles["btn-sign"]}`}>Sign out</button>
        </div>
      ) : (
        <div className={styles["nav-home"]}>
          <button onClick={() => navigate("/login")}  className={`${styles["btn"]} ${styles["btn-login"]}`}>Login</button>
          <button onClick={() => navigate("/signup")}  className={`${styles["btn"]} ${styles["btn-sign"]}`}>Sign up</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
