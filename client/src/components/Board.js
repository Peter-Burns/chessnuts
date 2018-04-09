import React, { Component } from 'react';
import '../chessboard-0.3.0.css';
import ChessBoard from "chessboardjs";
import $ from 'jquery';
import Chess from 'chess.js';
import { pgnUpdater, postMove } from '../api';
import axios from 'axios';
import { withUser } from '../services/withUser';
import FlatButton from 'material-ui/FlatButton';
import { Row, Col } from 'react-flexbox-grid';

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
                if (user && user.id === res.data.whitePlayer) this.setState({ userColor: 'w' });
                if (user && user.id === res.data.blackPlayer) this.setState({ userColor: 'b' });
                console.log(this.state.userColor);
                game = new Chess();
                game.load_pgn(res.data.pgn);
                config = {
                    position: game.fen(),
                    orientation: 'white',
                    draggable: true,
                    onDrop: onDrop,
                    onDragStart: onDragStart,
                    onMouseoutSquare: onMouseoutSquare,
                    onMouseoverSquare: onMouseoverSquare,
                    onSnapEnd: onSnapEnd
                };
                board = ChessBoard('board', config);
                userColor = this.state.userColor;
                this.setState({ board: board });
                if (userColor === 'b') this.flipBoard();
                $(window).resize(board.resize);
            })
            .catch(err => console.log(err));

        function onDrop(source, target) {
            removeGreySquares();
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
        function removeGreySquares() {
            $('#board .square-55d63').css('background', '');
        };

        function greySquare(square) {
            const squareEl = $('#board .square-' + square);
            let background = '#a9a9a9';
            if (squareEl.hasClass('black-3c85d') === true) {
                background = '#696969';
            }
            squareEl.css('background', background);
        };

        function onMouseoverSquare(square, piece) {
            // get list of possible moves for this square
            const moves = game.moves({
                square: square,
                verbose: true
            });

            // exit if there are no moves available for this square
            if (moves.length === 0) return;

            // highlight the square they moused over
            greySquare(square);

            // highlight the possible squares for this piece
            for (let i = 0; i < moves.length; i++) {
                greySquare(moves[i].to);
            }
        };

        function onMouseoutSquare(square, piece) {
            removeGreySquares();
        };

        function onSnapEnd() {
            board.position(game.fen());
        };
    }
    flipBoard() {
        this.state.board.flip();
    }
    render() {
        return (
            <Row >
                <Col lg={4} lgOffset={3} md={6} sm={9} xs={12}>
                    <div id="board" style={{ width: "100%", marginBottom: '5px' }}>

                    </div>
                    <FlatButton label='Flip' backgroundColor='#ffb366' style={{ color: "#663300", fontFamily: "'Montserrat', sans-serif", marginRight: '10px' }} onClick={() => this.flipBoard()} />
                    <FlatButton label='Resign' hoverColor="#994d00" backgroundColor='#663300' style={{ color: '#fff3e6', fontFamily: "'Montserrat', sans-serif" }} onClick={() => this.flipBoard()} />
                </Col>
                <Col lg={2}>
                    <Row center='xs'>
                    <h4>Move List</h4>
                        {this.state.gameHistory ? this.state.gameHistory.map((move, moveNumber, moveList) => (
                            <Col key={moveNumber} xs={6}>
                                <FlatButton onClick={() => this.moveListLoader(moveList.slice(0, moveNumber + 1))}>{move}</FlatButton>
                            </Col>
                        )) : ''}
                    </Row>
                </Col>
            </Row>
        )
    }
}
export default withUser(Board);