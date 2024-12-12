import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "./history.css";
import HistoryComponet from "./historyComponet";
import { server_url } from "./servirce";
import { Link } from "react-router-dom";

import { UserContext } from "./userContext";
export default function HistoryPage() {
  const { user } = useContext(UserContext);
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
    fetchHistory();
  }, [user]);

  return (
    <div className="history">
      <h1>歷史紀錄</h1>
      {user ? (
        <div className="history-container">
          {history ? (
            history.map((item, key) => (
              <HistoryComponet key={key} historyItem={item} user={user} />
            ))
          ) : (
            <div className="history-loading"></div>
          )}
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
