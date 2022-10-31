import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import ErrorMessage from "../Components/ErrorMessage";
import styles from "./Signup.module.css";

function Signup() {
  const navigate: NavigateFunction = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

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
      .catch((err) => {
        switch (err.response.data) {
          case "Empty field":
            return setErrorMessage("Error: one of the fields is empty");
          case "There was a problem":
            return setErrorMessage("Oops. There was a problem");
          case "Username already exists":
            return setErrorMessage("Error: username already exists");
          case "Email already exists":
            return setErrorMessage("Error: email already exists");
          case "password":
            return setErrorMessage("Error this password is too short");
          case "Passwords special characters":
            return setErrorMessage("Error: you need at least an uppercase letter, a lowercase letter, a special character, and a number");
          case "Passwords need to match":
            return setErrorMessage("Error: passwords need to match");
          default:
            return setErrorMessage("Oops there was a problem");
        }
      });
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
        <button type="submit" className={styles.btn}>
          Submit
        </button>
        {errorMessage=== ""? null :<ErrorMessage message={errorMessage} />}
      </form>
    </div>
  );
}

export default Signup;
