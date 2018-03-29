import React, { Component } from 'react';
import '../chessboard-0.3.0.css';
import ChessBoard from "chessboardjs";
import $ from 'jquery';
import Chess from 'chess.js';

window.$ = $;
window.jQuery = $;

class Board extends Component {

    componentDidMount() {
        const config = {
            position: 'start',
            orientation: 'white',
            draggable: true,
            onDrop: onDrop
        };
        const board = ChessBoard('board', config);
        const game = new Chess();
        function onDrop (source, target){
            const move = game.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });
            // illegal move
            if (move === null) return 'snapback';
        }
    }
    render() {
        return (
            <div id="board" style={{ width: "400px" }}>

            </div>
        )
    }
}
export default Board;