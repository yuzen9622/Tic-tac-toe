import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./start.css";
import img from "./title.png";
export default function StartPage() {
  useEffect(() => {
    const handleLocationChange = () => {
      console.log("路徑變化了:", window.location.href);

      // 檢查是否切換到 online 頁面，並且確認是否已經重載過
      if (sessionStorage.getItem("hasReloaded") === "false") {
        console.log("即將切換到 online 頁面，先刷新一次");
        sessionStorage.setItem("hasReloaded", "true"); // 設置已重載標記
        window.location.reload(); // 重新加載頁面
      }
    };
    handleLocationChange();
  });
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
