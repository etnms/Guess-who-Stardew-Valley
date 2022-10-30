import axios from "axios";
import React, { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";

function Signup() {
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("darktheme") === "darktheme") {
      document.documentElement.setAttribute("data-color-scheme", "dark");
    } else {
      document.documentElement.setAttribute("data-color-scheme", "light");
    }
  });

  function signup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const username: string = (document.querySelector("input[name='username']") as HTMLInputElement).value;
    const email: string = (document.querySelector("input[name='email']") as HTMLInputElement).value;
    const password: string = (document.querySelector("input[name='password']") as HTMLInputElement).value;
    const confirmPassword: string = (
      document.querySelector("input[name='confirm-password']") as HTMLInputElement
    ).value;

    axios
      .post(`${process.env.REACT_APP_SVGW_BACKEND}/api/auth/signup`, {
        username,
        email,
        password,
        confirmPassword,
      })
      .then((res) => {
        localStorage.setItem("svgw-token", res.data.token);
        navigate("/dashboard");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={styles.page}>
      <form onSubmit={(e) => signup(e)} className={styles.form}>
        <h1>Signup</h1>
        <label htmlFor="username">Username</label>
        <input name="username"></input>
        <label htmlFor="email">Email</label>
        <input name="email" type="email"></input>
        <label htmlFor="email">Password</label>
        <input name="password" type="password"></input>
        <label htmlFor="confirm-password">Confirm password</label>
        <input name="confirm-password" type="password"></input>
        <button type="submit" className={styles.btn}>Submit</button>
      </form>
    </div>
  );
}

export default Signup;
