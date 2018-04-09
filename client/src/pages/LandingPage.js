import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import ChessBoard from "chessboardjs";
import $ from 'jquery';
import Chess from 'chess.js';
import '../chessboard-0.3.0.css';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import FlatButton from 'material-ui/FlatButton/FlatButton';

window.$ = $;
window.jQuery = $;

class Game extends Component {
    state = {
        boardState: null,
        pgn: null,
        gameOver: false,
        activeGames: null,
        activeUsers: null,
        gameHistory: null
    }
    login() {
        this.props.history.push('/login');
    }
    moveListLoader = (moveList) => {
        this.state.game.load_pgn(moveList.join(' '));
        this.state.board.position(this.state.game.fen());
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

            stateUpdater(status, game.pgn(), game.game_over(), game.history());
        }
        const stateUpdater = (status, pgn, gameOver, gameHistory) => {
            this.setState({ boardState: status, pgn: pgn, gameOver: gameOver, gameHistory: gameHistory });
        }
        const cfg = {
            draggable: true,
            position: 'start',
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        };
        const board = ChessBoard('board', cfg);
        this.setState({ board: board, game: game });
        $(window).resize(board.resize);
    }
    render() {
        return (
            <Grid style={{ color: '#663300' }} fluid>
                <Row style={{ fontFamily: "'Montserrat', sans-serif" }} center="xs">
                    <Col lg={4} md={6} sm={9} xs={12}>
                        <h3>Welcome to Chessnuts!</h3>
                        <p>Make an account to play, watch some of the top games going on below, or tinker around on the practice board</p>
                        <h4>Highest ranked player is currently Pete321 with a 2500 rating</h4>
                        <FlatButton backgroundColor='#ffb366' style={{ color: "#663300", fontFamily: "'Montserrat', sans-serif" }} label='See leaderboard' />
                        <p>{this.state.activeUsers} Active Users</p>
                        <p>{this.state.activeGames} Active Games</p>
                        <h3>Top rated active games</h3>
                    </Col>
                    <Col lg={3} md={6} sm={9} xs={12}>
                        <h3>Test your skills on the practice board!</h3>
                        <div id="board" style={{ width: "100%" }}>

                        </div>
                        <FlatButton label='Reset' backgroundColor='#ffb366' style={{ color: "#663300", fontFamily: "'Montserrat', sans-serif" }} onClick={() => this.moveListLoader([])} />
                    </Col>
                    <Col lg={1}>
                        <p>{this.state.boardState}</p>
                        {this.state.gameOver ? <p> If you're looking for a new challenge, why not make an account? <FlatButton label='Register' backgroundColor='#ffb366' style={{ color: "#663300", fontFamily: "'Montserrat', sans-serif" }} onClick={() => this.login()} /> </p> : ''}
                        <Row>
                            {this.state.gameHistory ? this.state.gameHistory.map((move, moveNumber, moveList) => (
                                <Col key={moveNumber} xs={6}>
                                    <FlatButton onClick={() => this.moveListLoader(moveList.slice(0, moveNumber + 1))}>{move}</FlatButton>
                                </Col>
                            )) : ''}
                        </Row>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
export default withRouter(Game);