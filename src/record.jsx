import React, { useEffect, useState } from "react";
import { server_url } from "./servirce";
import RecordComponent from "./recordComponent";
import "./record.css";
export default function Record() {
  const [winReocrd, setWinRecord] = useState(null);
  const [history, setHistory] = useState(null);

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

  async function getWinHistory() {
    try {
      const res = await fetch(`${server_url}/history/getWin`);
      const data = await res.json();
      console.log(data);
      if (data) {
        setHistory(data);
      } else {
        throw new Error("no data");
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getWinHistory();
  }, []);
  useEffect(() => {
    if (!history) return;
    countWinner();
  }, [history]);

  console.log(history);
  console.log(winReocrd);
  return (
    <table className="record">
      <caption>排行榜</caption>
      <thead>
        <tr>
          <th>排名</th>
          <th>名稱</th>
          <th>勝利數</th>
        </tr>
      </thead>
      <tbody>
        {winReocrd &&
          winReocrd.map((item, key) => (
            <RecordComponent key={key} item={item} number={key} />
          ))}
      </tbody>
    </table>
  );
}
