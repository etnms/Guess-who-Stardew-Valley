import React, { useState } from "react";
import styles from "./Card.module.css";

interface cards {
  name: string;
  player2: boolean;
}

function Card(props: React.PropsWithChildren<cards>) {
  const { name, player2 } = props;

  const [isDiscarded, setIsDiscarded] = useState<boolean>(false);

  function discardCard(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    // Check if what is clicked is the card or a child of the card
    let type: string | undefined = "";
    // If card then identify the type, else do nothin
    try {
      type = e.currentTarget.attributes.getNamedItem("data-type")?.value;
    } catch (error) {}
    // Check the type to see if style is directly apply to card element or if it needs to be updated
    if (type !== "card") {
      // If child element then get the parent (card) to add the style
      const parent: HTMLElement | null = e.currentTarget.parentElement;
      parent?.classList.add(`${styles.discarded}`);
    } else {
      e.currentTarget.classList.add(`${styles.discarded}`);
    }

    setIsDiscarded(true);
  }

  function cancelDiscard(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    // Get the card (parent of the button)
    const parent: HTMLElement | null = e.currentTarget.parentElement;
    parent?.classList.remove(`${styles.discarded}`);
    setIsDiscarded(false);
  }

  return (
    <div
      className={`${styles.card} ${player2 ? styles.opponent : ""}`}
      data-type="card"
      onClick={(e) => discardCard(e)}>
      <p className={styles.name}>{name}</p>
      <img src={`http://localhost:8000/api/images/${name}`} alt={name}></img>
      {isDiscarded ? (
        <button className={styles["cancel-btn"]} onClick={(e) => cancelDiscard(e)}>
          Cancel
        </button>
      ) : null}
    </div>
  );
}

export default Card;
