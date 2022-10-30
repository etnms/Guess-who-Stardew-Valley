import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import styles from "./Home.module.css";
import navStyles from "../Components/Navbar.module.css";
function Home() {
  const token = localStorage.getItem("svgw-token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SVGW_BACKEND}/api/dashboard`, { headers: { authorization: token! } })
      .then((res) => {
        navigate("/dashboard");
      })
      .catch((err) => console.log(err));
  });
  return (
    <div className={styles.page}>
      <Navbar isLoggedIn={false} username="" />
      <main className={styles.home}>
        <h1 className={styles.title}>Guess who? Stardew valley edition</h1>
        <div className={styles["main-text"]}>
          <span className={styles.text}>Let's get started</span>
          <button className={`${navStyles["btn"]} ${navStyles["btn-sign"]}`}>Sign up</button>
        </div>
      </main>
    </div>
  );
}

export default Home;
