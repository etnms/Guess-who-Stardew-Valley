import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActiveSessionLink from "../Components/ActiveSessionLink";
import Navbar from "../Components/Navbar";
import {io} from "socket.io-client";

interface IArrayGames {
  session_id: string;
  date: string;
}
function Dashboard() {
  const token = localStorage.getItem("svgw-token");
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [arrayGames, setArrayGames] = useState<any>([]);

  useEffect(() => {

    axios
      .get(`${process.env.REACT_APP_SVGW_BACKEND}/api/dashboard`, { headers: { authorization: token! } })
      .then((res) => {
        setUsername(res.data);
        sessionStorage.setItem("username", res.data);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        navigate("/");
      });

    axios
      .get(`${process.env.REACT_APP_SVGW_BACKEND}/api/games`, { headers: { Authorization: token! } })
      .then((res) => {
        setArrayGames(res.data);
      })
      .catch((err) => console.log(err));
  }, [navigate, token]);

  function createGame() {
    axios
      .post(`${process.env.REACT_APP_SVGW_BACKEND}/api/games`, {}, { headers: { Authorization: token! } })
      .then((res) => {
        console.log(res);
        // navigate(`/games/${res.data}`);
      })
      .catch((err) => console.log(err));
  }

  function displayActiveGames() {
    return arrayGames.map((game: IArrayGames) => (
      <ActiveSessionLink
        key={`active_session_${game.session_id}`}
        sessionId={game.session_id}
        time={game.date.split("Z")[0]}
      />
    ));
  }

  function joinGame() {
    const sessionId = (document.querySelector("input[name='game-id-input']") as HTMLInputElement).value;
    navigate(`/games/${sessionId}`);
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <Navbar isLoggedIn={isLoggedIn} />
      <p>Welcome {username}</p>
      <div>
        <h2>Active sessions:</h2>
        {displayActiveGames()}
      </div>
      <button onClick={() => createGame()}>Create a game</button>
      <p>Or join a game</p>
      <label htmlFor="game-id-input">Enter the session id of the game you want to join</label>
      <input name="game-id-input"></input>
      <button onClick={() => joinGame()}>Join game</button>
    </div>
  );
}

export default Dashboard;
