
import { useState } from 'react';
import './main.css';
import End from './end';

var o = 0;
var x = 0;
const Gameapp = () => {
    var c = 0;
    var t = 0;
    var winnub = 3;
    const [who, setwho] = useState('');
    const [player, setplayer] = useState('')
    const [Opoint, setOpoint] = useState(0);
    const [Xpoint, setXpoint] = useState(0);
    function win() {

        t++;
        var boxs = document.querySelectorAll('#box');
        if (boxs[0].value == 'o' && boxs[1].value == 'o' && boxs[2].value == 'o') {
            console.log('o win')
            return 0
        } else if ((boxs[0].value == 'o' && boxs[4].value == 'o' && boxs[8].value == 'o')) {
            return 0;

        } else if (boxs[2].value == 'o' && boxs[4].value == 'o' && boxs[6].value == 'o') {
            return 0;
        } else if (boxs[3].value == 'o' && boxs[4].value == 'o' && boxs[5].value == 'o') {

            return 0;
        } else if (boxs[6].value == 'o' && boxs[7].value == 'o' && boxs[8].value == 'o') {
            return 0;
        } else if (boxs[2].value == 'o' && boxs[5].value == 'o' && boxs[8].value == 'o') {
            return 0
        } else if (boxs[0].value == 'o' && boxs[3].value == 'o' && boxs[6].value == 'o') {
            return 0;
        } else if (boxs[1].value == 'o' && boxs[4].value == 'o' && boxs[7].value == 'o') {
            return 0;
        }

        if (boxs[0].value == 'x' && boxs[1].value == 'x' && boxs[2].value == 'x') {

            return 1
        } else if ((boxs[0].value == 'x' && boxs[4].value == 'x' && boxs[8].value == 'x')) {

            return 1
        } else if (boxs[2].value == 'x' && boxs[4].value == 'x' && boxs[6].value == 'x') {
            return 1
        } else if (boxs[3].value == 'x' && boxs[4].value == 'x' && boxs[5].value == 'x') {

            return 1
        } else if (boxs[6].value == 'x' && boxs[7].value == 'x' && boxs[8].value == 'x') {
            return 1
        } else if (boxs[2].value == 'x' && boxs[5].value == 'x' && boxs[8].value == 'x') {
            return 1
        } else if (boxs[0].value == 'x' && boxs[3].value == 'x' && boxs[6].value == 'x') {
            return 1
        } else if (boxs[1].value == 'x' && boxs[4].value == 'x' && boxs[7].value == 'x') {
            return 1
        }
        if (t == 9) {
            return 2
        }

    }
    function getactive(where) {

        var boxs = document.querySelectorAll('#box');

        if (boxs[where].value == '') {
            if (c % 2 == 0) {
                boxs[where].value = 'o';

                document.body.style.backgroundColor = "rgb(227, 36, 43,0.8)";
                document.querySelector('.name h1').style.color = "#E97451"

                document.querySelector('.name h1').innerText = "Red Time"

            } else {


                boxs[where].value = 'x';

                document.body.style.backgroundColor = "rgb(19, 56, 190, 0.8)";
                document.querySelector('.name h1').style.color = "#0096FF"

                document.querySelector('.name h1').innerText = "Blue Time"

            }

            winnub = win();
            console.log(winnub)
            console.log(t)
            if (winnub == 0) {
                setwho("獲勝");
                var timeout = window.setInterval(() => {

                    end("O獲勝");
                    setTimeout(() => {

                        document.getElementById('game').style.display = 'grid'
                        document.body.style.backgroundColor = 'rgb(19, 56, 190, 0.8)'
                        document.querySelector('.name h1').innerText = "Blue Time";
                        document.querySelector('.name h1').style.color = "rgb(19, 56, 190)";
                        clear()
                        window.clearInterval(timeout)
                    }, 3000);
                });
                o += 1;
                setOpoint(o);
            } else if (winnub == 1) {
                setwho("獲勝");
                var timeout = window.setInterval(() => {

                    end("X獲勝");
                    setTimeout(() => {

                        document.getElementById('game').style.display = 'grid'
                        document.body.style.backgroundColor = 'rgb(19, 56, 190, 0.8)'
                        document.querySelector('.name h1').innerText = "Blue Time";
                        document.querySelector('.name h1').style.color = "rgb(19, 56, 190)";
                        clear()
                        window.clearInterval(timeout)
                    }, 3000);
                });

                x += 1;
                setXpoint(x);
            } else if (winnub == 2) {
                var timeout = window.setInterval(() => {

                    end("平手")
                    setTimeout(() => {

                        document.getElementById('game').style.display = 'grid'
                        document.body.style.backgroundColor = 'rgb(19, 56, 190, 0.8)'
                        document.querySelector('h1').innerText = "Blue Time";
                        document.querySelector('h1').style.color = "rgb(19, 56, 190)";
                        clear()
                        window.clearInterval(timeout)
                    }, 3000);
                });

            }

            c++;
        }




    }




    function end(statue) {
        document.getElementById('game').style.display = 'none'
        document.body.style.backgroundColor = '#42fc67'
        document.querySelector('.name h1').innerText = statue;
        document.querySelector('.name h1').style.color = "#fff";
        t = 0;
        c = 0;
        winnub = 3;


    }

    function clear() {
        var boxs = document.querySelectorAll('#box');

        for (var i = 0; i < 9; i++) {
            boxs[i].value = '';
        }

    }
    return (
        <>
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
            <div className="game" id='game'>
                <input type="button" id="box" onClick={() => { getactive(0) }} />
                <input type="button" id="box" onClick={() => { getactive(1) }} />
                <input type="button" id="box" onClick={() => { getactive(2) }} />
                <input type="button" id="box" onClick={() => getactive(3)} />
                <input type="button" id="box" onClick={() => getactive(4)} />
                <input type="button" id="box" onClick={() => getactive(5)} />
                <input type="button" id="box" onClick={() => getactive(6)} />
                <input type="button" id="box" onClick={() => getactive(7)} />
                <input type="button" id="box" onClick={() => getactive(8)} />
            </div>

            <div className="name">
                <h1>Blue  Time</h1>

            </div>


        </>
    )
}
export default Gameapp;