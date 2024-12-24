import React, { useEffect, useState } from "react";
import { server_url } from "./servirce";
import RecordComponent from "./recordComponent";
import "./record.css";

/**
 *  排行榜組件
 * @returns {React.JSX.Element} Record
 */
export default function Record() {
  /**
   * 狀態變數
   * @type {Array|null} winRecord 存儲按勝利次數排序的玩家信息。
   * @type {Array|null} history 存儲遊戲歷史記錄。
   */
  const [winReocrd, setWinRecord] = useState(null);
  const [history, setHistory] = useState(null);

  /**
   * 計算每個玩家的勝利次數並更新 winRecord。
   *
   * 1. 遍歷歷史記錄，將每一場比賽的勝者記錄到 winCount 陣列中。
   * 2. 如果玩家已存在於 winCount 中，則增大其勝利次數。
   * 3. 最後將 winCount 按照勝利次數排序，並設置到 winRecord 中。
   */
  function countWinner() {
    let winCount = [];
    if (!history) return;

    history.forEach((item) => {
      let winner = parseInt(item[0]);
      let isPlayer = winCount.find((w) => w.id === winner);
      if (isPlayer) {
        isPlayer.count += 1;
      } else {
        if (winner) {
          winCount.push({ id: winner, count: 1 });
        }
      }
    });
    winCount.sort((a, b) => b.count - a.count);
    setWinRecord(winCount);
  }

  /**
   * 從服務器獲取勝利歷史數據並更新 history 狀態。
   *
   * @returns {Promise<void>} 沒有返回值，直接更新 state。
   */
  async function getWinHistory() {
    try {
      const res = await fetch(`${server_url}/history/getWin`);
      const data = await res.json();

      if (data) {
        setHistory(data);
      } else {
        throw new Error("no data");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 在組件加載時，獲取歷史勝利數據。
   */
  useEffect(() => {
    getWinHistory();
  }, []);

  /**
   * 當歷史數據改變時，計算並更新勝利次數記錄。
   */
  useEffect(() => {
    if (!history) return;
    countWinner();
  }, [history]);

  return (
    <>
      <table className="record">
        <caption>排行榜</caption>
        {winReocrd && (
          <>
            <thead>
              <tr>
                <th>排名</th>
                <th>名稱</th>
                <th>勝利數</th>
              </tr>
            </thead>
            <tbody>
              {winReocrd.map((item, key) => (
                <RecordComponent key={key} item={item} number={key} />
              ))}
            </tbody>
          </>
        )}
      </table>
    </>
  );
}
