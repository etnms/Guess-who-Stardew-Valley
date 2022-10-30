import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("darktheme") === "darktheme") {
      document.documentElement.setAttribute("data-color-scheme", "dark");
    } else {
      document.documentElement.setAttribute("data-color-scheme", "light");
    }
  });
  function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const username: string = (document.querySelector("input[name='username']") as HTMLInputElement).value;
    const password: string = (document.querySelector("input[name='password']") as HTMLInputElement).value;

    axios
      .post(`${process.env.REACT_APP_SVGW_BACKEND}/api/auth/login`, { username, password })
      .then((res) => {
        localStorage.setItem("svgw-token", res.data.token);
        navigate("/dashboard");
      })
      .catch((err) => console.log(err));
  }
  return (
    <div className={styles.page}>
      <form onSubmit={(e) => login(e)} className={styles.form}>
        <h1>Login</h1>
        <label htmlFor="username">Username</label>
        <input name="username"></input>
        <label htmlFor="email">Password</label>
        <input name="password" type="password"></input>
        <button type="submit" className={styles.btn}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
