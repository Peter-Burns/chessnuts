import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import ChessBoard from "chessboardjs";
import $ from 'jquery';
import Chess from 'chess.js';
import '../chessboard-0.3.0.css';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import {withUser} from '../services/withUser';

window.$ = $;
window.jQuery = $;

class Game extends Component {
    state = {
        boardState: '',
        pgn: null,
        gameOver: false,
        activeGames: null,
        activeUsers: null,
        gameHistory: null,
        highestRated: null
    }
    
    startgame() {
        this.props.history.push('/startgame');
    }

    mygames() {
        this.props.history.push('/mygames');
    }
    leaderboard() {
        this.props.history.push('/leaderboard');
    }

    login() {
        this.props.history.push('/login');
    }
    moveListLoader = (moveList) => {
        this.state.game.load_pgn(moveList.join(' '));
        this.state.board.position(this.state.game.fen());
    }
    componentDidMount() {
        axios.get('/api/users/highestrated')
            .then(res => {
                this.setState({ highestRated: res.data[0] });
            })
            .catch(err => console.log(err));

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
        const oneCfg = {
            position: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R',
            showNotation: false
        }
        const twoCfg = {
            position: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R',
            showNotation: false,
            orientation: 'black'
        }
        const board1 = ChessBoard('board1', oneCfg);
        const board2 = ChessBoard('board2', twoCfg);
        this.setState({ board: board, game: game });
        $(window).resize(board.resize);
        $(window).resize(board1.resize);
        $(window).resize(board2.resize);
    }
    render() {
        const { highestRated } = this.state;
        const { user } = this.props;
        return (
            <Grid style={{ color: '#663300' }} fluid>
                <Row style={{ fontFamily: "'Montserrat', sans-serif" }} center="xs">
                    <Col lg={4} lgOffset={2} md={6} sm={9} xs={12}>
                        {user ? <div><FlatButton label='My games' backgroundColor='#ffb366' style={{ color: "#663300", fontFamily: "'Montserrat', sans-serif" }} onClick={() => this.mygames()} /><FlatButton label='Start or join a game' backgroundColor='#ffb366' style={{ color: "#663300", fontFamily: "'Montserrat', sans-serif", marginLeft:'10px' }} onClick={() => this.startgame()} /></div> : <div> <h3>Welcome to Chessnuts!</h3>
                        <p>Make an account to play, watch some of the top games going on below, or tinker around on the practice board</p></div>}
                        <h3>Top rated active games</h3>
                        <Row>
                            <Col xs={6}>
                                <div id='board1' style={{ width: '100%' }} />
                            </Col>
                            <Col xs={6}>
                                <div id='board2' style={{ width: '100%' }} />
                            </Col>
                        </Row>
                        <h4>Highest ranked player is currently {highestRated ? highestRated.username : ''} with a {highestRated ? highestRated.rating : ''} rating</h4>
                        <FlatButton backgroundColor='#ffb366' style={{ color: "#663300", fontFamily: "'Montserrat', sans-serif" }} onClick={()=>this.leaderboard()} label='See leaderboard' />
                        <p>{this.state.activeUsers} Active Users</p>
                        <p>{this.state.activeGames} Active Games</p>
                    </Col>
                    <Col lg={3} md={6} sm={9} xs={12}>
                        <h3>Test your skills on the practice board!</h3>
                        <div id="board" style={{ width: "100%" }} />
                        <FlatButton label='Reset' backgroundColor='#ffb366' style={{ color: "#663300", fontFamily: "'Montserrat', sans-serif" }} onClick={() => this.moveListLoader([])} />
                    </Col>
                    <Col lg={2}>
                        <h3>{this.state.boardState}</h3>
                        {this.state.gameOver ? <p> If you're looking for a new challenge, why not make an account? <FlatButton label='Login/Register' backgroundColor='#ffb366' style={{ color: "#663300", fontFamily: "'Montserrat', sans-serif" }} onClick={() => this.login()} /> </p> : ''}
                        {this.state.gameHistory ? <h4>Move List</h4> : ''}
                        <Row style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'hidden' }}>
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
export default withRouter(withUser(Game));