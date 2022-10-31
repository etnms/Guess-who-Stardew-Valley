import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import styles from "./ActiveSessionLink.module.css";

interface IActiveSessionProps {
  sessionId: string;
  time: string;
}
function ActiveSessionLink(props: React.PropsWithChildren<IActiveSessionProps>) {
  const { sessionId, time } = props;

  const navigate: NavigateFunction = useNavigate();

  return (
    <button onClick={() => navigate(`/games/${sessionId}`)} className={styles.link}>
      {sessionId} - Ends in {time.toString().split(".")[0]} min
    </button>
  );
}

export default ActiveSessionLink;
