import React from "react";
import { NavLink } from "react-router-dom";
import "./start.css";
import img from "./title.png";
export default function StartPage() {
  return (
    <div className="start">
      <div className="title">
        <img src={img} alt="" style={{ maxWidth: "350px" }} />
      </div>
      <div className="mode">
        <NavLink to={"/single"}>單機模式</NavLink>
        <NavLink to={"/online"}>連機模式</NavLink>
      </div>
    </div>
  );
}
