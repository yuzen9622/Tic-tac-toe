import React, { useEffect } from "react";
import { useState } from "react";
import "./history.css";
import HistoryComponet from "./historyComponet";
import { server_url } from "./servirce";
import { Link } from "react-router-dom";
export default function HistoryPage() {
  const [user, setUser] = useState(
    sessionStorage.getItem("player_info")
      ? JSON.parse(sessionStorage.getItem("player_info"))
      : null
  );
  const [history, setHistory] = useState(null);
  const fetchHistory = async () => {
    try {
      const res = await fetch(
        `${server_url}/history/userHistory?userId=${user?.id}`,
        {
          method: "get",
          headers: { "Content-Type": "Application/json" },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const reversed = data.reverse();
        setHistory(reversed);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
    fetchHistory();
  }, [user]);

  return (
    <div className="history">
      <h1>歷史紀錄</h1>
      {user ? (
        <div className="history-container">
          {history &&
            history.map((item, key) => (
              <HistoryComponet key={key} historyItem={item} user={user} />
            ))}
        </div>
      ) : (
        <div>
          <h1>
            {" "}
            <Link to={"/online"}>請先登入</Link>{" "}
          </h1>
        </div>
      )}
    </div>
  );
}
