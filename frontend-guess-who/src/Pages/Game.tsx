import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import Card from "../Components/Card";
import CardPicker from "../Components/CardPicker";
import namesData from "../names.json";
import styles from "./Game.module.css";
import { io } from "socket.io-client";
import axios from "axios";
import ErrorMessage from "../Components/ErrorMessage";

function Game() {
  const { id } = useParams<string>();

  const token: string | null = localStorage.getItem("svgw-token");
  const navigate: NavigateFunction = useNavigate();

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

    axios
      .get(`${process.env.REACT_APP_SVGW_BACKEND}/api/games/${id}`, { headers: { authorization: token! } })
      .then((res) => {})
      .catch((err) => {
        navigate("/session404");
      });

    const socket = io(`${process.env.REACT_APP_SVGW_BACKEND}`);

    socket.emit("join", id);

    socket.on("fullRoom" + id, (roomIsFull) => {
      if (roomIsFull) {
        navigate("/dashboard");
        return;
      }
    });

    socket.on("numberPlayers", (args) => {
      console.log(args)
      setNumberPlayers(args);
    });

    socket.on("discardPlayer", ({ name, sessionId, username, isCancelled }) => {
      // Check if in same game to apply discard
      if (sessionId === id) discardOther(name, username, isCancelled);
    });

    return () => {
      socket.off("numberPlayers");
      socket.off("discardPlayer");
    };
  }, [navigate, id, token]);

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

  function leavingGame() {
    navigate("/dashboard");
    // Wors hack ever to disconnect from socket but it works
    window.location.reload();
  }

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <h1 className={styles.title}>Session id: {id}</h1>
        <span className={styles["nb-players"]}>Number of players: {numberPlayers} </span>

        {!cardPicked ? (
          <div className={styles["wrapper-select"]}>
            <h2 className={styles.subtitle}>Pick a character</h2>

            <div className={styles["card-display"]}>{displayCardsToPick()}</div>
            <span className={styles["selected-text"]}>
              Selected character is: <code>{selectedCard} </code>
            </span>

            {errorMessage?.length === 0 ? null : <ErrorMessage message={errorMessage} />}
            <button onClick={() => confirmSelection()} className={`${styles.btn} ${styles["btn-confirm"]}`}>
              Confirm selection
            </button>
          </div>
        ) : (
          <div className={styles["wrapper-main-game"]}>
            <button
              onClick={() => hideOponnentCards()}
              className={`${styles.btn} ${styles["btn-hide-cards"]}`}>
              {btnHideText}
            </button>
            <h2 className={styles.subtitle}>Opponent</h2>
            <div className={`${styles["card-display"]} ${styles.opponent}`}>{displayCards(true)}</div>
            <h2 className={styles.subtitle}>You</h2>
            <div className={styles["card-display"]}>{displayCards(false)}</div>
          </div>
        )}
        <div className={styles["btn-wrapper"]}>
          <button onClick={() => leavingGame()} className={`${styles.btn} ${styles["btn-leave"]}`}>
            Leave game
          </button>
          <button onClick={() => endGame(id)} className={`${styles.btn} ${styles["btn-end"]}`}>
            End game
          </button>
        </div>
      </main>
    </div>
  );
}

export default Game;
