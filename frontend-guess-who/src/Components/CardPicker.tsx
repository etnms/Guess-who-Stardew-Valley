import styles from "./CardPicker.module.css";

interface ICardPicker {
  name: string;
  setSelectedCard: Function;
}

function CardPicker(props: React.PropsWithChildren<ICardPicker>) {
  const { name, setSelectedCard } = props;

  function selectCard(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {

    setSelectedCard(name)
  }
  return (
    <div className={styles.card} onClick={(e) => selectCard(e)}>
        <p className={styles.name}>{name}</p>
      <img src={`${process.env.REACT_APP_SVGW_BACKEND}/api/images/${name}`} alt={name}></img>
    </div>
  );
}

export default CardPicker;
