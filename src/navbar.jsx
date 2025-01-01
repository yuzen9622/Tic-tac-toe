import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import { UserContext } from "./userContext";
/**
 *  導航欄
 * @returns {React.JSX.Element} Navbar
 */
export default function Navbar() {
  /**
   * useContext
   * @type {Object} user 當前使用者資料
   * @type {Function} logout 登出函式
   */
  const { user, logout } = useContext(UserContext);

  return (
    <div className="navbar">
      {/* 所有用戶皆可見的導航連結 */}
      <NavLink to={"/"}>首頁</NavLink>
      <NavLink to={"/online"}>線上</NavLink>
      <NavLink to={"/single"}>單機</NavLink>
      <NavLink to={"/AI"}>人機</NavLink>
      <NavLink to={"/record"}>排行榜</NavLink>
      {/* 根據用戶是否登入進行條件渲染 */}
      {user ? (
        <>
          <NavLink to={"/history"}>歷史</NavLink>

          <NavLink className="user" to={"auth/profile"}>
            {user?.name}
          </NavLink>

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
