import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./start.css";
export default function StartPage() {
  return (
    <div className="start">
      <div className="title">
        <h1>Tic Tac TOE</h1>
      </div>
      <div className="mode">
        <NavLink to={"/single"}>單機模式</NavLink>
        <NavLink to={"/online"}>連機模式</NavLink>
      </div>
    </div>
  );
}
