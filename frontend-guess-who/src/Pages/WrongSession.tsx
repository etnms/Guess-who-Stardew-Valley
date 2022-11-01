import { useNavigate } from "react-router-dom";
import styles from "./WrongSession.module.css";

function WrongSession() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Oops! It seems that this is not a valid session</h1>
        <button onClick={() => navigate("/dashboard")} className={styles.btn}>
          Go home
        </button>
      </div>
    </div>
  );
}

export default WrongSession;
