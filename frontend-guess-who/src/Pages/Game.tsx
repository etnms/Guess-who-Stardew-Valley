import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../Components/Card";
import CardPicker from "../Components/CardPicker";
import namesData from "../names.json";
import styles from "./Game.module.css";
import { io } from "socket.io-client";

function Game() {
  const { id } = useParams();

  const [selectedCard, setSelectedCard] = useState<string>("");
  const [cardPicked, setCardPicked] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [numberPlayers, setNumberPlayers] = useState<number>();

  function displayCardsToPick() {
    return namesData.map((element) => (
      <CardPicker name={element} key={`character_${element}`} setSelectedCard={setSelectedCard} />
    ));
  }

  function displayCards(player2: boolean) {
    return namesData.map((element) => <Card name={element} key={`character_${element}`} player2={player2}  sessionId={id}/>);
  }

  function confirmSelection() {
    if (selectedCard === "") {
      setErrorMessage("you must select a character");
      return;
    } else {
      setCardPicked(true);
    }
  }


  useEffect(() => {
    const socket = io("http://127.0.0.1:8000");
    socket.emit("join", id);

    socket.on("numberPlayers", (args) => {
      setNumberPlayers(args);
    })
    socket.on("discardPlayer", ({name, sessionId,username}) => {
      console.log(name, sessionId, username)
      discardOther(name, username)
     })
 
    return () => {
      socket.off("numberPlayers");
      socket.off("discardPlayer");
    };
  }, [id]);

  function discardOther(name: string, username: string) {
    if (username !== sessionStorage.getItem("username")){
    let card = document.querySelector(`[data-card-name='${name}']`);
    card?.classList.add(styles.discarded);
    }
  }

  const [btnHideText, setBtnHideText] = useState<string>("Hide opponent's cards");
  const [areCardsHidden, setAreCardsHidden] = useState<boolean>(false);

  function hideOponnentCards() {
    setAreCardsHidden(prev => !prev);
    const opponentsCards = document.querySelector(`.${styles.opponent}`);
    const opponentTitle = document.querySelector(`.${styles.title}`);
    opponentsCards?.classList.toggle(styles.hidden);
    opponentTitle?.classList.toggle(styles.hidden);

    if (areCardsHidden) 
      setBtnHideText("Hide opponent's cards");
    else 
      setBtnHideText("Show opponent's cards");
  }
  return (
    <div>
      <h1>Game</h1>
      <h2>Session id: {id}</h2>
      <p>Number of players: {numberPlayers} </p>
      <p>Your character is {selectedCard}</p>
      {!cardPicked ? (
        <div>
          <h1 >Pick a character</h1>
          <p>Selected character is {selectedCard} </p>
          <button onClick={() => confirmSelection()}>Confirm selection</button>
          {errorMessage !== "" ? <p>{errorMessage}</p> : null}
          <div className={styles["card-display"]}>{displayCardsToPick()}</div>
        </div>
      ) : (
        <div>
          <button onClick={() => hideOponnentCards()}>{btnHideText}</button>
          <h2 className={styles.title}>Player 2</h2>
          <div className={`${styles["card-display"]} ${styles.opponent}`}>{displayCards(true)}</div>
          <h2>You (Player1)</h2>
          <div className={styles["card-display"]}>{displayCards(false)}</div>
        </div>
      )}
      <button>Leave game</button>
      <button>End game</button>
    </div>
  );
}

export default Game;
