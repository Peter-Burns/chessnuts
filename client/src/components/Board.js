import React, { Component } from 'react';
import '../chessboard-0.3.0.css';
import ChessBoard from "chessboardjs";
import $ from 'jquery';
import Chess from 'chess.js';
import { pgnUpdater, postMove } from '../api';
import axios from 'axios';

window.$ = $;
window.jQuery = $;

class Board extends Component {

    componentDidMount() {
        let config;
        let board;
        let game;
        axios.get('/api/games/5abbd6815980aa2a5099ade2')
            .then(res => {
                game = new Chess();
                game.load_pgn(res.data.pgn);
                config = {
                    position: game.fen(),
                    orientation: 'white',
                    draggable: true,
                    onDrop: onDrop
                };
                board = ChessBoard('board', config);
            })
            .catch(err => console.log(err));

        function onDrop(source, target) {
            const move = game.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });
            // illegal move
            if (move === null) return 'snapback';
            postMove(source, target, '5abbd6815980aa2a5099ade2');
        }
        pgnUpdater((err, PGN) => {
            console.log(PGN); 
            game.load_pgn(PGN); 
            board.position(game.fen()); 
        });
    }
    render() {
        return (
            <div id="board" style={{ width: "60%" }}>

            </div>
        )
    }
}
export default Board;