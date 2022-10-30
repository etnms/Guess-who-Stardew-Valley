import React from "react";
import { useNavigate } from "react-router-dom";

interface IActiveSessionProps {
  sessionId: string;
  time: string;
}
function ActiveSessionLink(props: React.PropsWithChildren<IActiveSessionProps>) {
  const { sessionId, time } = props;

  const navigate = useNavigate();

  return (
    <div>
        <button onClick={() => navigate(`/games/${sessionId}`)}> {sessionId} - Ends at {time}</button>
    </div>
  );
}

export default ActiveSessionLink;
