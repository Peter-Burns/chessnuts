import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import ChessBoard from "chessboardjs";
import $ from 'jquery';
import Chess from 'chess.js';
import '../chessboard-0.3.0.css';
import FlatButton from 'material-ui/FlatButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';

window.$ = $;
window.jQuery = $;

class MyGames extends Component {

    state = {
        games: [],
        pastGames: []
    }

    toggleViewGame(gameId) {
        $('#' + gameId).toggle();
    }

    componentDidMount() {
        axios.get('/api/games')
            .then(res => this.setState({ games: res.data }))
            .catch(err => console.log(err));
        axios.get('/api/games/pastusergames')
            .then(res => this.setState({ pastGames: res.data }))
            .catch(err => console.log(err));

    }

    gameHandle(gameId) {
        this.props.history.push('/game/' + gameId);
    }

    gameLoad(PGN, gameId) {
        const game = new Chess();
        game.load_pgn(PGN);
        const config = {
            showNotation: false,
            position: game.fen()
        };
        const board = ChessBoard(gameId, config);
        $(window).resize(board.resize);
    }

    render() {
        return (
            <Grid style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <Row>
                    <Col xs={12}>
                        <Tabs
                            tabItemContainerStyle={{ background: "#663300" }}
                            inkBarStyle={{ background: "#ffb366" }}>
                            <Tab label='Current Games'>
                                <Row>
                                    {this.state.games.length ? this.state.games.map(game => (
                                        <Col lg={3} md={4} xs={12} key={game._id} style={{ textAlign: 'center' }}>
                                            <a href={'/game/' + game._id} style={{ color: '#663300', textDecorationLine: 'none' }}>

                                                <p>{game.turn === 'b' && game.blackPlayer && (game.blackPlayer._id === this.props.user.id) ? <FontIcon className="material-icons">label</FontIcon> : ''}Black: {game.blackPlayer ? (game.blackPlayer._id === this.props.user.id ? <span style={{ fontWeight: '600' }}>{game.blackPlayer.username}</span> : game.blackPlayer.username) : "No player yet"}</p>
                                                <div id={game._id} hidden style={{ width: '100%', maxWidth: '200px', margin: '0 auto' }} />
                                                <p>{game.turn === 'w' && game.whitePlayer && (game.whitePlayer._id === this.props.user.id) ? <FontIcon className="material-icons">label_outline</FontIcon> : ''}White: {game.whitePlayer ? (game.whitePlayer._id === this.props.user.id ? <span style={{ fontWeight: '600' }}>{game.whitePlayer.username}</span> : game.whitePlayer.username) : "No player yet"} </p>

                                            </a>
                                            <div>
                                                <FlatButton hoverColor="#ffa64d" backgroundColor='#ffb366' label="View Game" style={{ color: '#663300', fontFamily: "'Montserrat', sans-serif" }} onClick={(event) => { this.gameLoad(game.pgn, game._id); this.toggleViewGame(game._id); }} />
                                            </div>
                                        </Col>

                                    )) : <Col xs={12} style={{ color: "#663300" }}>
                                            <p>
                                                No active games, would you like to
                                                <Link style={{ marginLeft: '5px' }} to='/startGame'><FlatButton label="start a game" backgroundColor='#ffb366' style={{ color: '#663300', fontFamily: "'Montserrat', sans-serif" }} /></Link >
                                                <Link style={{ marginLeft: '5px' }} to='/joinGame'><FlatButton label="or join one?" backgroundColor='#ffb366' style={{ color: '#663300', fontFamily: "'Montserrat', sans-serif" }} /></Link >
                                            </p>
                                        </Col>}
                                </Row>
                            </Tab>
                            <Tab label="Past Games">
                                <Row>
                                    {this.state.pastGames.length ? this.state.pastGames.map(game => (
                                        <Col lg={3} md={4} xs={12} key={game._id} style={{ textAlign: 'center' }}>
                                            <a href={'/game/' + game._id} style={{ color: '#663300', textDecorationLine: 'none' }}>

                                                <p>{game.turn === 'w' ? <FontIcon className="material-icons">label</FontIcon> : ''}Black: {game.blackPlayer ? (game.blackPlayer._id === this.props.user.id ? <span style={{ fontWeight: '600' }}>{game.blackPlayer.username}</span> : game.blackPlayer.username) : "No player yet"}</p>
                                                <div id={game._id} hidden style={{ width: '100%', maxWidth: '200px', margin: '0 auto' }} />
                                                <p>{game.turn === 'b' ? <FontIcon className="material-icons">label_outline</FontIcon> : ''}White: {game.whitePlayer ? (game.whitePlayer._id === this.props.user.id ? <span style={{ fontWeight: '600' }}>{game.whitePlayer.username}</span> : game.whitePlayer.username) : "No player yet"} </p>

                                            </a>
                                            <div>
                                                <FlatButton hoverColor="#ffa64d" backgroundColor='#ffb366' label="View Game" style={{ color: '#663300', fontFamily: "'Montserrat', sans-serif" }} onClick={(event) => { this.gameLoad(game.pgn, game._id); this.toggleViewGame(game._id); }} />
                                            </div>
                                        </Col>

                                    )) : <Col xs={12} style={{ color: "#663300" }}>
                                            <p>
                                                No past games, would you like to
                                                <Link style={{ marginLeft: '5px' }} to='/startGame'><FlatButton label="start a game" backgroundColor='#ffb366' style={{ color: '#663300', fontFamily: "'Montserrat', sans-serif" }} /></Link >
                                                <Link style={{ marginLeft: '5px' }} to='/joinGame'><FlatButton label="or join one?" backgroundColor='#ffb366' style={{ color: '#663300', fontFamily: "'Montserrat', sans-serif" }} /></Link >
                                            </p>
                                        </Col>}
                                </Row>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
export default withRouter(MyGames);