import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "./history.css";
import "./record.css";
import HistoryTr from "./historyTr";
import { server_url } from "./servirce";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "./userContext";
import HistoryComponet from "./historyComponent";

/**
 * 歷史紀錄頁面
 * @returns {React.JSX.Element} HistoryPage
 */
export default function HistoryPage() {
  /**
   * 狀態與變數
   * @property {{id: string} | null} user 當前使用者資料
   * @property {[Array | null, Function]} history 歷史紀錄資料
   * @property {[Object | null, Function]} queryHistory 選定的歷史紀錄資料
   * @property {{index: string}} index 路由參數
   */
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState(null);
  const [queryHistory, setQueryHistory] = useState(null);
  const { index } = useParams();
  const navigate = useNavigate();
  /**
   * 依據索引更新當前的歷史紀錄資料
   */
  useEffect(() => {
    if (!user?.id) navigate("/");
    if (!history) return;
    let findHistory = history[index];

    if (findHistory !== void 0) {
      setQueryHistory(findHistory);
    } else {
      setQueryHistory(null);
    }
  }, [index, history]);
  /**
   * 從伺服器獲取使用者的歷史紀錄
   * @returns {Promise<void>}
   */
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

  /**
   * 初次加載時獲取歷史紀錄資料
   */
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
