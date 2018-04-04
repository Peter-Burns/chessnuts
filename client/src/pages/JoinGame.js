import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { ListItem } from 'material-ui/List';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import JoinButton from '../components/JoinButton';

class JoinGame extends Component {
    state = {
        games: []
    }
    componentDidMount() {
        axios.get('/api/games/join')
            .then(res => this.setState({ games: res.data }))
            .catch(err => console.log(err));
    }
    gameHandle(gameId) {
        this.props.history.push('/game/' + gameId);
    }
    joinGame(gameId, color) {
        axios.put('api/games/join/' + gameId, { color: color })
            .then(() => this.props.history.push('/mygames'))
            .catch(err => console.log(err));
    }
    render() {
        return (
            <Grid fluid>
                <Row>
                    {!this.state.games[0] ?
                        <p style={{ color: "white" }}> No joinable games, would you like to <Link to='/startGame'><button> start one?</button></Link ></p>
                        : this.state.games.map(game => (
                            <Col key={game._id} lg={4} md={6} xs={12}>
                                <ListItem>
                                    <span>White: {game.whitePlayer ? game.whitePlayer.username : <JoinButton color="white" gameId={game._id} onClick={() => this.joinGame(game._id, 'whitePlayer')} />} </span>
                                    <span>Black: {game.blackPlayer ? game.blackPlayer.username : <JoinButton color="black" gameId={game._id} onClick={() => this.joinGame(game._id, 'blackPlayer')} />} </span>
                                </ListItem>
                            </Col>
                        ))}
                </Row>
            </Grid>
        );
    }
}
export default withRouter(JoinGame);