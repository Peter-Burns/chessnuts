import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import ChessBoard from "chessboardjs";
import $ from 'jquery';
import Chess from 'chess.js';
import '../chessboard-0.3.0.css';
import { withRouter } from 'react-router-dom';
import LoginButton from '../components/LoginButton';
import axios from 'axios';

window.$ = $;
window.jQuery = $;

class Game extends Component {
    state = {
        boardState: null,
        pgn: null,
        gameOver: false,
        activeGames: null,
        activeUsers: null
    }
    login() {
        this.props.history.push('/login');
    }
    componentDidMount() {
        axios.get('/api/games/numberofgames')
            .then(res => this.setState({ activeGames: res.data }))
            .catch(err => console.log(err));
        axios.get('api/users/numberofusers')
            .then(res => this.setState({ activeUsers: res.data }))
            .catch(err => console.log(err));
        const game = new Chess();
        function onDragStart(source, piece, position, orientation) {
            if (game.in_checkmate() === true || game.in_draw() === true ||
                piece.search(/^b/) !== -1) {
                return false;
            }
        };

        function makeRandomMove() {
            const possibleMoves = game.moves();

            // game over
            if (possibleMoves.length === 0) return;

            const randomIndex = Math.floor(Math.random() * possibleMoves.length);
            game.move(possibleMoves[randomIndex]);
            board.position(game.fen());
            updateStatus();
        };

        function onDrop(source, target) {
            // see if the move is legal
            const move = game.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });

            // illegal move
            if (move === null) return 'snapback';
            updateStatus();
            // make random legal move for black
            window.setTimeout(makeRandomMove, 250);
        };

        // update the board position after the piece snap
        // for castling, en passant, pawn promotion
        function onSnapEnd() {
            board.position(game.fen());
        };

        function updateStatus() {
            var status = '';

            var moveColor = 'White';
            if (game.turn() === 'b') {
                moveColor = 'Black';
            }

            // checkmate?
            if (game.in_checkmate() === true) {
                status = 'Game over, ' + moveColor + ' is in checkmate.';
            }

            // draw?
            else if (game.in_draw() === true) {
                status = 'Game over, drawn position';
            }

            // game still on
            else {
                status = moveColor + ' to move';

                // check?
                if (game.in_check() === true) {
                    status += ', ' + moveColor + ' is in check';
                }
            }
            stateUpdater(status, game.pgn(), game.game_over());
        }
        const stateUpdater = (status, pgn, gameOver) => {
            this.setState({ boardState: status, pgn: pgn, gameOver: gameOver });
        }
        const cfg = {
            draggable: true,
            position: 'start',
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        };
        const board = ChessBoard('board', cfg);
        $(window).resize(board.resize);
    }
    render() {
        return (
            <Grid fluid>
                <Row style={{ fontFamily: "'Montserrat', sans-serif" }} center="xs">
                    <Col lg={4} md={6} sm={9} xs={12}>
                        <h3>Welcome to Chessnuts!</h3>
                        <p>{this.state.activeUsers} Active Users</p>
                        <p>{this.state.activeGames} Active Games</p>
                    </Col>
                    <Col style={{}} lg={4} md={6} sm={9} xs={12}>
                        <h3>Test your skills!</h3>
                        <div id="board" style={{ width: "100%" }}>

                        </div>
                        <p>{this.state.boardState}</p>
                        {this.state.gameOver ? <p> If you're looking for a new challenge, why not make an account? <LoginButton color="#663300" onClick={() => this.login()} /> </p> : ''}
                        <p>{this.state.pgn}</p>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
export default withRouter(Game);