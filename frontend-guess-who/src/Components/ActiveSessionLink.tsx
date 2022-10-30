import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ActiveSessionLink.module.css";

interface IActiveSessionProps {
  sessionId: string;
  time: string;
}
function ActiveSessionLink(props: React.PropsWithChildren<IActiveSessionProps>) {
  const { sessionId, time } = props;

  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(`/games/${sessionId}`)} className={styles.link}>
      {sessionId} - Ends at {time}
    </button>
  );
}

export default ActiveSessionLink;
