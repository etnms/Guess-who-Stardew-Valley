import React, { useState } from "react";
import styles from "./Card.module.css";
import { io } from "socket.io-client";

interface ICards {
  name: string;
  player2: boolean;
  sessionId: string | undefined;
}

function Card(props: React.PropsWithChildren<ICards>) {
  const { name, player2, sessionId } = props;

  const [isDiscarded, setIsDiscarded] = useState<boolean>(false);

  function discardCard(e: React.MouseEvent<HTMLDivElement, MouseEvent>, player2: boolean) {
    // If cards from player 2 then can't change them
    if (player2) return;
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

    // JS and server logic
    setIsDiscarded(true);
    const socket = io("http://127.0.0.1:8000");
    const username: string | null = sessionStorage.getItem("username");
    const isCancelled: boolean = false;
    socket.emit("discard", { name, sessionId, username, isCancelled });
  }

  function cancelDiscard(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    // Get the card (parent of the button)
    const parent: HTMLElement | null = e.currentTarget.parentElement;
    parent?.classList.remove(`${styles.discarded}`);

    // JS and server logic
    setIsDiscarded(false);
    const socket = io("http://127.0.0.1:8000");
    const username: string | null = sessionStorage.getItem("username");
    const isCancelled: boolean = true;
    socket.emit("discard", { name, sessionId, username, isCancelled });
  }

  return (
    <div
      className={`${styles.card} ${player2 ? styles.opponent : ""}`}
      data-type="card"
      data-card-name={player2 ? name : `self-${name}`}
      onClick={(e) => discardCard(e, player2)}>
      <p className={styles.name}>{name}</p>
      <img src={`${process.env.REACT_APP_SVGW_BACKEND}/api/images/${name}`} alt={name}></img>
      {isDiscarded ? (
        <button className={styles["cancel-btn"]} onClick={(e) => cancelDiscard(e)}>
          Cancel
        </button>
      ) : null}
    </div>
  );
}

export default Card;
