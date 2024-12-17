import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { server_url } from "./servirce";
import { useNavigate } from "react-router-dom";
export default function HistoryTr({ historyItem, number, isactive }) {
  const { user } = useContext(UserContext);
  const [recipientUser, setRecipientUser] = useState(null);
  const [isWin, setIsWin] = useState(null);
  const navgative = useNavigate();

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
  useEffect(() => {
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
