import React from "react";
import { NavLink } from "react-router-dom";
import "./start.css";
import img from "./title.png";
/**
 * 用戶界面顯示選擇遊戲模式的區塊。
 *

 * @returns {React.JSX.Element} StartPage
 *
 * - 包含一個顯示遊戲標題的區塊，並在其中載入一張圖片。
 * - 包含三個 `NavLink` 元素，每個 `NavLink` 元素導向不同的路徑，分別是單機模式、連機模式和人機模式。
 */
export default function StartPage() {
  return (
    <div className="start">
      <div className="title">
        <img src={img} alt="" loading="lazy" style={{ maxWidth: "350px" }} />
      </div>
      <div className="mode">
        <NavLink to={"/single"}>單機模式</NavLink>
        <NavLink to={"/online"}>連機模式</NavLink>
        <NavLink to={"/AI"}>人機模式</NavLink>
      </div>
    </div>
  );
}
