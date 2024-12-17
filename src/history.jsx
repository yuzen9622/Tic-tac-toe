import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "./history.css";
import "./record.css";
import HistoryTr from "./historyTr";
import { server_url } from "./servirce";
import { useParams } from "react-router-dom";
import { UserContext } from "./userContext";
import HistoryComponet from "./historyComponent";
export default function HistoryPage() {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState(null);
  const [queryHistory, setQueryHistory] = useState(null);
  const { index } = useParams();

  useEffect(() => {
    if (!history) return;
    let findHistory = history[index];

    console.log(findHistory);
    if (findHistory !== void 0) {
      setQueryHistory(findHistory);
    } else {
      setQueryHistory(null);
    }
  }, [index, history]);
  const fetchUserHistory = async () => {
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
    fetchUserHistory();
  }, [user]);

  return (
    <>
      <div className="history">
        <table className="history-container">
          <caption>歷史紀錄</caption>
          {!history && <div className="history-loading"></div>}
          <tbody>
            {history &&
              history.map((item, key) => (
                <HistoryTr
                  historyItem={item}
                  number={key}
                  key={key}
                  isactive={parseInt(index) === key}
                />
              ))}
          </tbody>
        </table>
      </div>
      {queryHistory && (
        <HistoryComponet historyItem={queryHistory} user={user} />
      )}
    </>
  );
}
