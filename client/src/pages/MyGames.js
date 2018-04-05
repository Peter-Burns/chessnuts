import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { List, ListItem } from 'material-ui/List';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import ChessBoard from "chessboardjs";
import $ from 'jquery';
import Chess from 'chess.js';
import '../chessboard-0.3.0.css';

window.$ = $;
window.jQuery = $;

class MyGames extends Component {
    state = {
        games: []
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
        const board = ChessBoard(gameId, game.fen());
        $(window).resize(board.resize);
    }
    render() {
        return (
            <Grid fluid>
                <Row center="xs">
                    <Col lg={4} md={6} xs={12}>
                        <List>
                            {this.state.games.map(game => (
                                <ListItem key={game._id} style={{ textAlign: 'center' }}>
                                    <a href={'/game/' + game._id} style={{ color: 'white', textDecorationLine: 'none' }}>

                                        <span>Black: {game.blackPlayer ? game.blackPlayer.username: "No player yet"}</span>
                                        <div id={game._id} style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }} />
                                        <span>White: {game.whitePlayer ? game.whitePlayer.username: "No player yet"} </span>

                                    </a>
                                    <div>
                                        <button onClick={(event) => { this.gameLoad(game.pgn, game._id); event.target.remove(); }}>View game</button>
                                    </div>
                                </ListItem>

                            ))}
                        </List>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
export default withRouter(MyGames);