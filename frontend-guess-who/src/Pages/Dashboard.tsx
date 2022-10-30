import axios from "axios";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import ActiveSessionLink from "../Components/ActiveSessionLink";
import Navbar from "../Components/Navbar";
import styles from "./Dashboard.module.css";

interface IArrayGames {
  session_id: string;
  date: string;
}

function Dashboard() {
  const token: string | null = localStorage.getItem("svgw-token");
  const navigate: NavigateFunction = useNavigate();
  const [username, setUsername] = useState<string>("");

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [arrayGames, setArrayGames] = useState<any>([]);

  useEffect(() => {
    if (localStorage.getItem("darktheme") === "darktheme") {
      document.documentElement.setAttribute("data-color-scheme", "dark");
    } else {
      document.documentElement.setAttribute("data-color-scheme", "light");
    }

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
      .get(`${process.env.REACT_APP_SVGW_BACKEND}/api/games`, { headers: { authorization: token! } })
      .then((res) => {
        setArrayGames(res.data);
      })
      .catch((err) => console.log(err));
  }, [navigate, token]);

  function createGame() {
    axios
      .post(`${process.env.REACT_APP_SVGW_BACKEND}/api/games`, {}, { headers: { authorization: token! } })
      .then((res) => {
        navigate(`/games/${res.data}`);
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
    <div className={styles.dashboard}>
      <Navbar isLoggedIn={isLoggedIn} username={username} />
      <div className={styles.wrapper}>
        <h1 className={styles["main-title"]}>Guess who? - Stardew Valley edition</h1>
        <div className={styles.list}>
          <h2 className={styles.title}>Active sessions:</h2>
          {displayActiveGames()}
        </div>
        <div className={styles["game-options"]}>
          <button onClick={() => createGame()} className={`${styles["btn"]} ${styles["btn-create"]}`}>
            Create a game
          </button>
          <h3 className={styles["join-text"]}>Or join a game</h3>
          <label htmlFor="game-id-input" className={styles["label-input-session"]}>
            Enter the session id of the game you want to join
          </label>
          <input name="game-id-input" className={styles["input-session"]}></input>
          <button onClick={() => joinGame()} className={`${styles["btn"]} ${styles["btn-join"]}`}>
            Join game
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
