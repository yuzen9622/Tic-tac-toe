import React from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
export default function Navbar() {
  return (
    <div className="navbar">
      <NavLink to={"/"}>首頁</NavLink>
      <NavLink to={"/online"}>線上</NavLink>
      <NavLink to={"/single"}>單機</NavLink>
      <NavLink to={"/history"}>歷史</NavLink>
    </div>
  );
}
