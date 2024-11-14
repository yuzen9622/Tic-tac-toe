import React, { useEffect, useState } from "react";

import "./history.css";
import { server_url } from "./servirce";
export default function HistoryComponet({ historyItem, user }) {
  const [recipientPlayer, setRecipientPlayer] = useState(null);
  const [winStateArray, setWinStateArray] = useState(historyItem?.winStatus);
  const [checkBoard, setCheckBoard] = useState(historyItem?.gameStatus);
  const fetchUser = async () => {
    try {
      let recipinetPlayerId =
        historyItem?.member1 === user?.id
          ? historyItem?.member2
          : historyItem?.member1;
      const res = await fetch(`${server_url}/user/id?id=${recipinetPlayerId}`, {
        method: "get",
        headers: { "Content-Type": "Application/json" },
      });
      if (res.ok) {
        const data = await res.json();

        setRecipientPlayer(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatDateTime = (dateTime) => {
    const time = new Date(dateTime);
    return time.toLocaleString("zh-tw", { timeZone: "Asia/Taipei" });
    // return `${time.getFullYear()}/${
    //   time.getMonth() + 1
    // }/${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${
    //   time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds()
    // }`;
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="historyCom">
      <div className="history-players">
        <p
          style={{
            fontWeight: 600,
            fontSize: "1.5em",
            ...(historyItem?.winner[1] !== "draw" &&
            parseInt(historyItem?.winner[0]) === user?.id
              ? { color: "#99cfff  " }
              : { color: "#e3242b" }),
            ...(historyItem?.winner[1] === "draw" && { color: "#333" }),
          }}
        >
          {historyItem?.winner[1] === "draw" && "平手"}
          {historyItem?.winner[1] !== "draw" &&
            parseInt(historyItem?.winner[0]) === user?.id &&
            "勝利"}
          {historyItem?.winner[1] !== "draw" &&
            parseInt(historyItem?.winner[0]) !== user?.id &&
            "失敗"}
        </p>
        <p className="recipientPlayer"> {recipientPlayer?.name}</p>
        {historyItem?.winner[1] !== "draw" && (
          <div className="winner">
            {parseInt(historyItem?.winner[0]) === recipientPlayer?.id
              ? "贏家:" + recipientPlayer?.name
              : "贏家:你"}
            {historyItem?.winner[1] !== "draw" && historyItem?.winner[1] === "O"
              ? " 狀態:O"
              : " 狀態:X"}
          </div>
        )}
        <div className="time">{formatDateTime(historyItem?.date)}</div>
      </div>
      <div className="history-state">
        <div className="state game">
          {checkBoard.map((chess, key) => (
            <button
              key={key}
              className={`chess ${
                winStateArray?.some((item) => parseInt(item) === key) &&
                historyItem?.winner[1] !== "draw" &&
                parseInt(historyItem?.winner[0]) === user?.id &&
                "winInputO"
              } ${
                winStateArray?.some((item) => parseInt(item) === key) &&
                historyItem?.winner[1] !== "draw" &&
                parseInt(historyItem?.winner[0]) !== user?.id &&
                "winInputX"
              } `}
            >
              {chess}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
