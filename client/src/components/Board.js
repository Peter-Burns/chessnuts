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
import Dialog from 'material-ui/Dialog';

window.$ = $;
window.jQuery = $;

class Board extends Component {
    state = {
        board: '',
        game: null,
        userColor: '',
        open: false,
        flipped: false,
        gameHistory: [],
        pgn: null,
        boardState: ''
    }

    moveListLoader = (moveList) => {
        this.state.game.load_pgn(moveList.join(' '));
        this.state.board.position(this.state.game.fen());
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
                this.setState({ whitePlayer: res.data.whitePlayer ? res.data.whitePlayer.username : null });
                this.setState({ blackPlayer: res.data.blackPlayer ? res.data.blackPlayer.username : null });
                if (user && res.data.whitePlayer && user.id === res.data.whitePlayer._id) this.setState({ userColor: 'w' });
                if (user && res.data.blackPlayer && user.id === res.data.blackPlayer._id) this.setState({ userColor: 'b' });
                game = new Chess();
                game.load_pgn(res.data.pgn);
                this.setState({ gameHistory: game.history() });
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
                this.setState({ game: game });
                this.setState({ pgn: game.pgn() })
                if (userColor === 'b') this.flipBoard();
                updateStatus();
                $(window).resize(board.resize);
            })
            .catch(err => console.log(err));

        const onDrop = (source, target) => {
            if (game.pgn() !== this.state.pgn) return 'snapback';
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
            if (game.game_over() === true ||
                (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
                (game.turn() === 'w' && userColor !== 'w') ||
                (game.turn() === 'b' && userColor !== 'b')) {
                return false;
            }
        };

        pgnUpdater((err, PGN) => {
            this.setState({ pgn: PGN });
            game.load_pgn(PGN);
            this.setState({ gameHistory: game.history() });
            board.position(game.fen());
            updateStatus();
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

        const updateStatus = () => {
            let status = '';

            let moveColor = 'White';
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
            this.setState({ boardState: status })
        }
    }
    flipBoard() {
        this.state.board.flip();
        this.setState({ flipped: !this.state.flipped })
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    resignGame = () => {
        console.log('you resigned');
        axios.post('/api/games/resigngame/' + this.props.gameId, {
            turn: this.state.userColor,
            gameover: 'true',
            result: this.state.userColor === 'b' ? '1 - 0' : '0 - 1'
        })
            .then(res =>this.setState({boardState:'Game Over ' + (this.state.userColor === 'b' ? 'Black' : 'White') + ' Resigned'}))
            .catch(err => console.log(err));
        this.handleClose();
    }
    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Resign"
                onClick={this.resignGame}
            />,
        ];

        return (
            <Row center="xs">
                <Col lg={4} md={6} sm={9} xs={12}>
                    <p>{this.state.flipped ? this.state.whitePlayer : this.state.blackPlayer}</p>
                    <div id="board" style={{ width: "100%", marginBottom: '5px' }}>

                    </div>
                    <p>{this.state.flipped ? this.state.blackPlayer : this.state.whitePlayer}</p>
                    <FlatButton label='Flip' backgroundColor='#ffb366' style={{ color: "#663300", fontFamily: "'Montserrat', sans-serif", marginRight: '10px' }} onClick={() => this.flipBoard()} />
                    <FlatButton label='Resign' hoverColor="#994d00" backgroundColor='#663300' style={{ color: '#fff3e6', fontFamily: "'Montserrat', sans-serif" }} onClick={() => this.handleOpen()} />
                    <Dialog
                        title="Resign Game"
                        actions={actions}
                        onRequestClose={this.handleClose}
                        open={this.state.open}
                    >
                        Are you sure?
                    </Dialog>
                </Col>
                <Col lg={2} md={6}>
                    <h3>{this.state.boardState}</h3>
                    <h4>Move List</h4>
                    <Row style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }}>
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