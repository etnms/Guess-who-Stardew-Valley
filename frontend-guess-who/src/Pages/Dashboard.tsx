import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

function Dashboard() {
  const token = localStorage.getItem("svgw-token");
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SVGW_BACKEND}/api/dashboard`, { headers: { authorization: token! } })
      .then((res) => {
        setUsername(res.data);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        navigate("/");
      });
  });

  function createGame() {
    axios
      .get(`${process.env.REACT_APP_SVGW_BACKEND}/api/games`, { headers: { Authorization: token! } })
      .then((res) => navigate(`/game/${res.data}`))
      .catch((err) => console.log(err));
      
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <Navbar isLoggedIn={isLoggedIn} />
      <p>Welcome {username}</p>
      <button onClick={() => createGame()}>Create a game</button>
      <button>Join game</button>
      <input name="game-id-input"></input>
    </div>
  );
}

export default Dashboard;
