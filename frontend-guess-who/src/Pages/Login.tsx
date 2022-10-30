import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

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
    <div>
      <form onSubmit={(e) => login(e)}>
        <h1>Login</h1>
        <label htmlFor="username">Username</label>
        <input name="username"></input>
        <label htmlFor="email">Password</label>
        <input name="password" type="password"></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;
