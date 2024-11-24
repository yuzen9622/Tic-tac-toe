import React, { useCallback, useContext } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import { UserContext } from "./userContext";
export default function Navbar() {
  const { user, logout } = useContext(UserContext);

  return (
    <div className="navbar">
      <NavLink to={"/"}>首頁</NavLink>
      <NavLink to={"/online"}>線上</NavLink>
      <NavLink to={"/single"}>單機</NavLink>
      <NavLink to={"/AI"}>人機</NavLink>

      {user ? (
        <>
          <NavLink to={"/history"}>歷史</NavLink>
          <p>
            <NavLink>{user?.name}</NavLink>
          </p>
          <NavLink onClick={logout}>登出</NavLink>
        </>
      ) : (
        <>
          <NavLink to={"/online"}>登入</NavLink>
          <NavLink to={"/auth/register"}>註冊</NavLink>
        </>
      )}
    </div>
  );
}
