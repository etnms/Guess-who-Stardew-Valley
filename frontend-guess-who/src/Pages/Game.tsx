import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../Components/Card";
import CardPicker from "../Components/CardPicker";
import namesData from "../names.json";
import styles from "./Game.module.css";
import { io } from "socket.io-client";
import axios from "axios";

function Game() {
  const { id } = useParams();

  const navigate = useNavigate();
  const token = localStorage.getItem("svgw-token");
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [cardPicked, setCardPicked] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [numberPlayers, setNumberPlayers] = useState<number>();
  const [btnHideText, setBtnHideText] = useState<string>("Hide opponent's cards");
  const [areCardsHidden, setAreCardsHidden] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("darktheme") === "darktheme") {
      document.documentElement.setAttribute("data-color-scheme", "dark");
    } else {
      document.documentElement.setAttribute("data-color-scheme", "light");
    }
    const socket = io("http://127.0.0.1:8000");

    socket.emit("join", id);
    socket.on("fullRoom", (roomIsFull) => {
      if (roomIsFull) {
        navigate("/dashboard");
        return;
      }
    });

    socket.on("numberPlayers", (args) => {
      setNumberPlayers(args);
    });

    socket.on("discardPlayer", ({ name, sessionId, username, isCancelled }) => {
      // Check if in same game to apply discard
      if (sessionId === id) discardOther(name, username, isCancelled);
    });
/*
    socket.on("cancelDiscard", ({ name, sessionId, username }) => {
      console.log("cancel", name, sessionId, username)
      if (sessionId === id) discardOther(name, username, true);
    });
*/
    return () => {
      socket.off("numberPlayers");
      socket.off("discardPlayer");
    };
  }, [navigate, id]);

  function displayCardsToPick() {
    return namesData.map((element) => (
      <CardPicker
        name={element}
        key={`character_${element}`}
        setSelectedCard={setSelectedCard}
        setErrorMessage={setErrorMessage}
      />
    ));
  }

  function displayCards(player2: boolean) {
    return namesData.map((element) => (
      <Card name={element} key={`character_${element}`} player2={player2} sessionId={id} />
    ));
  }

  function confirmSelection() {
    if (selectedCard === "") {
      setErrorMessage("You must select a character");
      return;
    } else {
      setCardPicked(true);
    }
  }
  function discardOther(name: string, username: string, cancelDiscard: boolean) {
    console.log(cancelDiscard)
    if (!cancelDiscard)
      if (username !== sessionStorage.getItem("username")) {
        let card = document.querySelector(`[data-card-name='${name}']`);
        card?.classList.add(styles.discarded);
      }
    if (cancelDiscard)
      if (username !== sessionStorage.getItem("username")) {
        let card = document.querySelector(`[data-card-name='${name}']`);
        card?.classList.remove(styles.discarded);
      }
  }

  function hideOponnentCards() {
    setAreCardsHidden((prev) => !prev);
    const opponentsCards = document.querySelector(`.${styles.opponent}`);
    const opponentTitle = document.querySelector(`.${styles.subtitle}`);
    opponentsCards?.classList.toggle(styles.hidden);
    opponentTitle?.classList.toggle(styles.hidden);

    if (areCardsHidden) setBtnHideText("Hide opponent's cards");
    else setBtnHideText("Show opponent's cards");
  }

  function endGame(id: string | undefined) {
    if (id === undefined) return;
    axios
      .delete(`${process.env.REACT_APP_SVGW_BACKEND}/api/games/${id}`, { headers: { authorization: token! } })
      .then((res) => {
        navigate("/dashboard");
      })
      .catch((err) => console.log(err));
  }

  return (
    <main>
      <h1 className={styles.title}>Session id: {id}</h1>
      <span className={styles["nb-players"]}>Number of players: {numberPlayers} </span>

      {!cardPicked ? (
        <div className={styles["wrapper-select"]}>
          <h2 className={styles.subtitle}>Pick a character</h2>
          <span className={styles["selected-text"]}>
            Selected character is: <code>{selectedCard} </code>
          </span>
          <button onClick={() => confirmSelection()} className={`${styles.btn} ${styles["btn-confirm"]}`}>
            Confirm selection
          </button>
          {errorMessage?.length === 0 ? null : (
            <span className={styles["error-message"]}>{errorMessage}</span>
          )}
          <div className={styles["card-display"]}>{displayCardsToPick()}</div>
        </div>
      ) : (
        <div className={styles["wrapper-main-game"]}>
          <button onClick={() => hideOponnentCards()} className={`${styles.btn} ${styles["btn-hide-cards"]}`}>
            {btnHideText}
          </button>
          <h2 className={styles.subtitle}>Opponent</h2>
          <div className={`${styles["card-display"]} ${styles.opponent}`}>{displayCards(true)}</div>
          <h2 className={styles.subtitle}>You</h2>
          <div className={styles["card-display"]}>{displayCards(false)}</div>
        </div>
      )}
      <div className={styles["btn-wrapper"]}>
        <button onClick={() => navigate("/dashboard")} className={`${styles.btn} ${styles["btn-leave"]}`}>
          Leave game
        </button>
        <button onClick={() => endGame(id)} className={`${styles.btn} ${styles["btn-end"]}`}>
          End game
        </button>
      </div>
    </main>
  );
}

export default Game;
