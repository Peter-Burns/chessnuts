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

window.$ = $;
window.jQuery = $;

class MyGames extends Component {
    state = {
        games: []
    }
    toggleViewGame(gameId) {
        $('#' + gameId).toggle();
    }
    componentDidMount() {
        axios.get('/api/games')
            .then(res => this.setState({ games: res.data }))
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
            <Grid>
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

                                                <p>Black: {game.blackPlayer ? game.blackPlayer.username : "No player yet"}</p>
                                                <div id={game._id} hidden style={{ width: '100%', maxWidth: '200px', margin: '0 auto' }} />
                                                <p>White: {game.whitePlayer ? game.whitePlayer.username : "No player yet"} </p>

                                            </a>
                                            <div>
                                                <FlatButton hoverColor="#994d00" backgroundColor='#663300' style={{ color: '#fff3e6' }} onClick={(event) => { this.gameLoad(game.pgn, game._id); this.toggleViewGame(game._id); }}>View game</FlatButton>
                                            </div>
                                        </Col>

                                    )) : <Col xs={12} style={{ color: "#663300" }}>
                                            <p>
                                                No active games, would you like to
                                                <Link style={{ marginLeft: '5px' }} to='/startGame'><FlatButton label="start a game" backgroundColor='#ffb366' style={{color: '#663300'}} /></Link >
                                                <Link style={{ marginLeft: '5px' }} to='/joinGame'><FlatButton label="or join one?" backgroundColor='#ffb366' style={{color: '#663300'}} /></Link >
                                            </p>
                                        </Col>}
                                </Row>
                            </Tab>
                            <Tab label="Past Games">
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
export default withRouter(MyGames);