import { useState } from "react";
import "./main.css";

var o = 0;
var x = 0;
var gameover = 0;
const Gameapp = () => {
  var c = 0;
  var t = 0;
  var winnub = 3;
  const [play, setplay] = useState();
  const [player, setplayer] = useState("");
  const [Opoint, setOpoint] = useState(0);
  const [Xpoint, setXpoint] = useState(0);
  function win() {
    t++;
    var boxs = document.querySelectorAll("#box");
    if (
      boxs[0].innerText === "o" &&
      boxs[1].innerText === "o" &&
      boxs[2].innerText === "o"
    ) {
      console.log("o win");
      return 0;
    } else if (
      boxs[0].innerText === "o" &&
      boxs[4].innerText === "o" &&
      boxs[8].innerText === "o"
    ) {
      return 0;
    } else if (
      boxs[2].innerText === "o" &&
      boxs[4].innerText === "o" &&
      boxs[6].innerText === "o"
    ) {
      return 0;
    } else if (
      boxs[3].innerText === "o" &&
      boxs[4].innerText === "o" &&
      boxs[5].innerText === "o"
    ) {
      return 0;
    } else if (
      boxs[6].innerText === "o" &&
      boxs[7].innerText === "o" &&
      boxs[8].innerText === "o"
    ) {
      return 0;
    } else if (
      boxs[2].innerText === "o" &&
      boxs[5].innerText === "o" &&
      boxs[8].innerText === "o"
    ) {
      return 0;
    } else if (
      boxs[0].innerText === "o" &&
      boxs[3].innerText === "o" &&
      boxs[6].innerText === "o"
    ) {
      return 0;
    } else if (
      boxs[1].innerText === "o" &&
      boxs[4].innerText === "o" &&
      boxs[7].innerText === "o"
    ) {
      return 0;
    }

    if (
      boxs[0].innerText === "x" &&
      boxs[1].innerText === "x" &&
      boxs[2].innerText === "x"
    ) {
      return 1;
    } else if (
      boxs[0].innerText === "x" &&
      boxs[4].innerText === "x" &&
      boxs[8].innerText === "x"
    ) {
      return 1;
    } else if (
      boxs[2].innerText === "x" &&
      boxs[4].innerText === "x" &&
      boxs[6].innerText === "x"
    ) {
      return 1;
    } else if (
      boxs[3].innerText === "x" &&
      boxs[4].innerText === "x" &&
      boxs[5].innerText === "x"
    ) {
      return 1;
    } else if (
      boxs[6].innerText === "x" &&
      boxs[7].innerText === "x" &&
      boxs[8].innerText === "x"
    ) {
      return 1;
    } else if (
      boxs[2].innerText === "x" &&
      boxs[5].innerText === "x" &&
      boxs[8].innerText === "x"
    ) {
      return 1;
    } else if (
      boxs[0].innerText === "x" &&
      boxs[3].innerText === "x" &&
      boxs[6].innerText === "x"
    ) {
      return 1;
    } else if (
      boxs[1].innerText === "x" &&
      boxs[4].innerText === "x" &&
      boxs[7].innerText === "x"
    ) {
      return 1;
    }
    if (t === 9) {
      return 2;
    }
  }
  function getactive(where) {
    var boxs = document.querySelectorAll("#box");
    if (boxs[where].innerText === "") {
      if (c % 2 === 0) {
        boxs[where].innerText = "o";
        document.body.style.backgroundColor = "rgb(227, 36, 43,0.8)";
        document.querySelector(".name h1").style.color = "#E97451";
        document.querySelector(".name h1").innerText = "Red Time";
      } else {
        boxs[where].innerText = "x";
        document.body.style.backgroundColor = "rgb(19, 56, 190, 0.8)";
        document.querySelector(".name h1").style.color = "#0096FF";
        document.querySelector(".name h1").innerText = "Blue Time";
      }

      winnub = win();

      if (winnub === 0) {
        var timeout = window.setInterval(() => {
          end("O獲勝");
          setTimeout(() => {
            document.getElementById("game").style.display = "grid";
            document.body.style.backgroundColor = "rgb(19, 56, 190, 0.8)";
            document.querySelector(".name h1").innerText = "Blue Time";
            document.querySelector(".name h1").style.color = "#0096FF";
            clear();
          }, 3000);

          window.clearInterval(timeout);
        }, 0);
        o += 1;
        setOpoint(o);
      } else if (winnub === 1) {
        var timeout = window.setInterval(() => {
          end("X獲勝");
          setTimeout(() => {
            document.getElementById("game").style.display = "grid";
            document.body.style.backgroundColor = "rgb(19, 56, 190, 0.8)";
            document.querySelector(".name h1").innerText = "Blue Time";
            document.querySelector(".name h1").style.color = "#0096FF";
            clear();
          }, 3000);

          window.clearInterval(timeout);
        });

        x += 1;
        setXpoint(x);
      } else if (winnub == 2) {
        var timeout = window.setInterval(() => {
          end("平手");
          setTimeout(() => {
            document.getElementById("game").style.display = "grid";
            document.body.style.backgroundColor = "rgb(19, 56, 190, 0.8)";
            document.querySelector("h1").innerText = "Blue Time";
            document.querySelector("h1").style.color = "#0096FF";
            clear();
          }, 3000);
          window.clearInterval(timeout);
        });
      }
      console.log(Opoint, Xpoint);
      c++;
    }
  }

  function end(statue) {
    t = 0;
    c = 0;
    winnub = 3;

    statue !== "平手" ? gameover++ : (gameover = gameover);
    console.log(gameover);

    if (gameover === 3) {
      if (o > x) {
        document.getElementById("game").style.display = "none";
        document.body.style.backgroundColor = "#0096FF";
        document.querySelector(".name h1").innerText = "Blue Win";
        document.querySelector(".name h1").style.color = "#fff";
      } else {
        document.getElementById("game").style.display = "none";
        document.body.style.backgroundColor = "#E97451";
        document.querySelector(".name h1").innerText = "Red Win";
        document.querySelector(".name h1").style.color = "#fff";
      }
    } else {
      document.getElementById("game").style.display = "none";
      document.body.style.backgroundColor = "#42fc67";
      document.querySelector(".name h1").innerText = statue;
      document.querySelector(".name h1").style.color = "#fff";
    }
  }

  function clear() {
    var boxs = document.querySelectorAll("#box");

    for (var i = 0; i < 9; i++) {
      boxs[i].innerText = "";
    }
    if (gameover === 3) {
      setOpoint(0);
      setXpoint(0);
      o = 0;
      x = 0;
      gameover = 0;
    }
  }

  return (
    <div className="single">
      <div className="point">
        <div className="ox">
          <label htmlFor="">Blue:</label>
          <input type="text" readOnly value={Opoint} />
        </div>
        <div className="ox">
          <label htmlFor="">Red:</label>
          <input type="text" readOnly value={Xpoint} />
        </div>
      </div>
      <div className="game" id="game">
        <button
          id="box"
          onClick={() => {
            getactive(0);
          }}
        />
        <button
          id="box"
          onClick={() => {
            getactive(1);
          }}
        />
        <button
          id="box"
          onClick={() => {
            getactive(2);
          }}
        />
        <button id="box" onClick={() => getactive(3)}></button>
        <button id="box" onClick={() => getactive(4)}></button>
        <button id="box" onClick={() => getactive(5)}></button>
        <button id="box" onClick={() => getactive(6)}></button>
        <button id="box" onClick={() => getactive(7)}></button>
        <button id="box" onClick={() => getactive(8)}></button>
      </div>

      <div className="name">
        <h1>Blue Time</h1>
      </div>
    </div>
  );
};
export default Gameapp;
