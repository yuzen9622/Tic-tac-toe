import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { server_url } from "./servirce";
import { useNavigate } from "react-router-dom";
/**
 * 歷史紀錄列組件
 * @returns {React.JSX.Element} 歷史紀錄列組件
 */
export default function HistoryTr({ historyItem, number, isactive }) {
  /**
   * 使用 `useContext` 取得當前使用者資訊，並設定一些狀態來管理遊戲結束狀態及對手資料。
   * @type {Object} user 當前使用者資料，來自 UserContext
   * @type {[Object | null, Function]} recipientUser 對手玩家資料
   * @type {[String | null, Function]} isWin 遊戲結果（平手、勝利、失敗）
   * @type {Function} navgative 用來進行頁面跳轉的函式
   */
  const { user } = useContext(UserContext);
  const [recipientUser, setRecipientUser] = useState(null);
  const [isWin, setIsWin] = useState(null);
  const navgative = useNavigate();

  /**
   * 根據歷史紀錄中的勝者，決定遊戲結束的狀態。
   * 依據勝者資料來設定當前使用者是勝利者、失敗者，或是平手。
   *
   * @returns {Object} 遊戲結果的狀態物件，包含 id 與狀態描述
   */
  const getWinState = () => {
    const winner = historyItem.winner[0];
    const winState = {
      DRAW: { id: -1, status: "平手" },
      WIN: { id: 1, status: "勝利" },
      LOSE: { id: 0, status: "失敗" },
    };
    if (winner === "平手") {
      return winState.DRAW;
    } else if (parseInt(winner) === user.id) {
      return winState.WIN;
    }
    return winState.LOSE;
  };

  /**
   * 使用 `useEffect` 在 `historyItem` 或 `user` 變動時獲取對手資料
   * 並根據歷史紀錄設定遊戲結束狀態。
   */
  useEffect(() => {
    /**
     *  透過對手的 ID 來獲取對手資料
     * @returns {Promise<void>}
     */
    const fetchRecipientUser = async () => {
      const recipinetPlayerId =
        historyItem?.member1 === user?.id
          ? historyItem?.member2
          : historyItem?.member1;
      if (!recipinetPlayerId || !user || !historyItem) return;

      try {
        const res = await fetch(
          `${server_url}/user/id?id=${recipinetPlayerId}`,
          {
            method: "get",
            headers: { "Content-Type": "Application/json" },
          }
        );

        const data = await res.json();
        if (data) {
          setRecipientUser(data);

          setIsWin(getWinState());
        }
      } catch (error) {}
    };
    fetchRecipientUser();
  }, [historyItem, user]);

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

  return (
    <>
      {recipientUser && (
        <tr
          className={`history_tr ${
            isWin?.id === 1 ? "win" : isWin?.id === 0 ? "lose" : ""
          } ${isactive ? "active" : ""}
          `}
          onClick={() => {
            navgative(`/history/${number}`);
          }}
        >
          <td>{isWin?.status}</td>
          <td>{recipientUser.name}</td>
          <td>{formatDateTime(historyItem?.date)}</td>
          <td>
            <i class="fa-solid fa-chevron-right"></i>
          </td>
        </tr>
      )}
    </>
  );
}
