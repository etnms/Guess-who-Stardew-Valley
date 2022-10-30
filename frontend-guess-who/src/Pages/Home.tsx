import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

function Home() {
  const token = localStorage.getItem("svgw-token");
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SVGW_BACKEND}/api/dashboard`, { headers: { authorization: token! } })
      .then((res) => {
        navigate("/dashboard");
      })
      .catch((err) => console.log(err));
  });
  return (
    <div>
      <Navbar isLoggedIn={false} username="" />
      <h1>Stardew valley guess who</h1>
    </div>
  );
}

export default Home;
