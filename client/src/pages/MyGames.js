import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { ListItem } from 'material-ui/List';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
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
                    {this.state.games.map(game => (
                        <Col key={game._id} lg={4} md={6} xs={12}>
                            <Link style={{ color: 'white', textDecorationLine: 'none' }} to={'/game/' + game._id}>
                                <ListItem>

                                    <span>Black: {game.blackPlayer.username}</span>
                                    <div id={game._id} style={{ width: '100%' }} />
                                    <span>White: {game.whitePlayer.username} </span>
                                </ListItem>
                            </Link>
                            <button onClick={(event) => { this.gameLoad(game.pgn, game._id); event.target.remove(); }}>View game</button>
                        </Col>
                    ))}
                </Row>
            </Grid>
        );
    }
}
export default withRouter(MyGames);