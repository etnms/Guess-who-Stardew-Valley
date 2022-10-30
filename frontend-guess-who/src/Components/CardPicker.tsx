import styles from "./CardPicker.module.css";

interface ICardPicker {
  name: string;
  setSelectedCard: Function;
  setErrorMessage: Function;
}

function CardPicker(props: React.PropsWithChildren<ICardPicker>) {
  const { name, setSelectedCard, setErrorMessage } = props;

  function selectCard(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setSelectedCard(name);
    setErrorMessage("");
    // Select previous choice and remove the style
    const prevChoice = document.querySelector(`.${styles.selected}`);
    if (prevChoice !== null) prevChoice?.classList.remove(`${styles.selected}`);
    // Check if what is clicked is the card or a child of the card
    let type: string | undefined = "";
    // If card then identify the type, else do nothin
    try {
      type = e.currentTarget.attributes.getNamedItem("data-card-pick")?.value;
    } catch (error) {}
    // Check the type to see if style is directly apply to card element or if it needs to be updated
    if (type !== "pick-card") {
      // If child element then get the parent (card) to add the style
      const parent: HTMLElement | null = e.currentTarget.parentElement;
      parent?.classList.add(`${styles.selected}`);
    } else {
      e.currentTarget.classList.add(`${styles.selected}`);
    }
  }
  return (
    <div className={styles.card} onClick={(e) => selectCard(e)} data-card-pick="pick-card">
      <p className={styles.name}>{name}</p>
      <img src={`${process.env.REACT_APP_SVGW_BACKEND}/api/images/${name}`} alt={name}></img>
    </div>
  );
}

export default CardPicker;
