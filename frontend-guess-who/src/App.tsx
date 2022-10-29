import styles from "./App.module.css";
import namesData from "./names.json";
import Card from "./Components/Card";

function App() {
  function displayCards(player2: boolean) {
    return namesData.map((element) => (
      <Card name={element} key={`character_${element}`} player2={player2}/>
    ));
  }
  return (
    <div className="App">
      <h1>Stardew valley guess who</h1>
      <h2>Player 2</h2>
      <div className={`${styles["card-display"]} ${styles.opponent}`}>
        {displayCards(true)}
      </div>
      <h2>You (Player1)</h2>
      <div className={styles["card-display"]}>
        {displayCards(false)}
      </div>
    </div>
  );
}

export default App;
