import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./history.css";
import { server_url } from "./servirce";
import { UserContext } from "./userContext";

/**
 * 單次單次歷史紀錄
 * @returns {React.JSX.Element} HistoryComponet
 */
export default function HistoryComponet({ historyItem }) {
  /**
   * 設定當前使用者資訊，並初始化歷史紀錄相關的 state。
   * @type {Object} user 使用者資訊，來自 UserContext
   * @type {[Object | null, Function]} recipientPlayer 對手玩家資料
   * @type {[Array | null, Function]} winStateArray 勝利狀態陣列
   * @type {[Array | null, Function]} checkBoard 棋盤狀態
   */
  const { user } = useContext(UserContext);
  const [recipientPlayer, setRecipientPlayer] = useState(null);
  const [winStateArray, setWinStateArray] = useState(historyItem?.winStatus);
  const [checkBoard, setCheckBoard] = useState(historyItem?.gameStatus);
  /**
   * 透過對手的 ID 來獲取對手資料
   * 根據當前使用者的 ID，決定對手是 `member1` 還是 `member2`，並發送請求來獲取對手資料
   * 設定 `recipientPlayer` state 為對手資料
   * @returns {Promise<void>}
   */
  const fetchUser = async () => {
    setRecipientPlayer(null);
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

  /**
   * 將 UTC 時間格式化為台灣時間 (UTC +8)，並轉換為易讀格式
   * @param {string} utcTime UTC 時間字串
   * @returns {string} 格式化後的日期時間字串，格式為 YYYY/MM/DD HH:MM:SS
   */
  function formatDateTime(utcTime) {
    const date = new Date(utcTime);
    date.setHours(date.getHours() + 8);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }
  /**
   * `useEffect` 監聽 `historyItem` 和 `user` 變化，觸發 `fetchUser` 函式來獲取對手資料，
   * 並設置棋盤和勝利狀態。
   */
  useEffect(() => {
    fetchUser();
    setWinStateArray(historyItem?.winStatus);
    setCheckBoard(historyItem?.gameStatus);
  }, [historyItem, user]);

  return (
    recipientPlayer && (
      <div className="historyCom">
        <div className="history-main">
          <NavLink to="/history">
            <i class="fa-solid fa-xmark"></i>
          </NavLink>
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
                {` 狀態:${historyItem?.winner[1]}`}
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
      </div>
    )
  );
}
