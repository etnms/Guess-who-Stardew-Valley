import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const backend = "http://localhost:8000/api/auth/login";
    const username: string = (document.querySelector("input[name='username']") as HTMLInputElement).value;
    const password: string = (document.querySelector("input[name='password']") as HTMLInputElement).value;

    console.log(username, password);
    axios
      .post(backend, { username, password })
      .then((res) => {
        navigate("/");
        console.log(res);
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
