import React from "react";
import { useParams } from "react-router-dom";
import Card from "../Components/Card";
import namesData from "../names.json";
import styles from "./Game.module.css";

interface IGameProps {
  session_id: string;
}
function Game() {
  const { id } = useParams(); 

  console.log(id)
  function displayCards(player2: boolean) {
    return namesData.map((element) => <Card name={element} key={`character_${element}`} player2={player2} />);
  }
  return (
    <div>
      <h1>Game</h1>
      <h2>Session id:</h2>
      <h2>Player 2</h2>
      <div className={`${styles["card-display"]} ${styles.opponent}`}>{displayCards(true)}</div>
      <h2>You (Player1)</h2>
      <div className={styles["card-display"]}>{displayCards(false)}</div>
    </div>
  );
}

export default Game;
