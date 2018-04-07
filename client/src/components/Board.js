import React, { Component } from 'react';
import '../chessboard-0.3.0.css';
import ChessBoard from "chessboardjs";
import $ from 'jquery';
import Chess from 'chess.js';
import { pgnUpdater, postMove } from '../api';
import axios from 'axios';
import { withUser } from '../services/withUser';

window.$ = $;
window.jQuery = $;

class Board extends Component {
    state = {
        board: '',
        userColor: ''
    }
    componentDidMount() {
        let config;
        let board;
        let game;
        let userColor;
        const { user } = this.props;
        const gameId = this.props.gameId;
        axios.get('/api/games/' + gameId)
            .then(res => {
                if (user.id === res.data.whitePlayer) this.setState({ userColor: 'w' });
                if (user.id === res.data.blackPlayer) this.setState({ userColor: 'b' });
                console.log(this.state.userColor);
                game = new Chess();
                game.load_pgn(res.data.pgn);
                config = {
                    position: game.fen(),
                    orientation: 'white',
                    draggable: true,
                    onDrop: onDrop,
                    onDragStart: onDragStart
                };
                board = ChessBoard('board', config);
                userColor = this.state.userColor;
                this.setState({ board: board });
                $(window).resize(board.resize);
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
            postMove(source, target, gameId);
        }

        function onDragStart(source, piece, position, orientation) {
            console.log(userColor);
            if (game.game_over() === true || 
            (game.turn() === 'w' && piece.search(/^b/) !== -1) || 
            (game.turn() === 'b' && piece.search(/^w/) !== -1) || 
            (game.turn() === 'w' && userColor !== 'w') || 
            (game.turn() === 'b' && userColor !== 'b')) {
                return false;
            }
        };

        pgnUpdater((err, PGN) => {
            console.log(PGN);
            game.load_pgn(PGN);
            board.position(game.fen());
        });
    }
    flipBoard() {
        this.state.board.flip();
    }
    render() {
        return (
            <div>
                <div id="board" style={{ width: "100%" }}>

                </div>
                <button onClick={() => this.flipBoard()}>Flip</button>
            </div>
        )
    }
}
export default withUser(Board);