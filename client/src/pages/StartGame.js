import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import { withUser } from '../services/withUser';
import Toggle from 'material-ui/Toggle';
import ChessBoard from "chessboardjs";
import '../chessboard-0.3.0.css';
import $ from 'jquery';
import { Tabs, Tab } from 'material-ui/Tabs';
import JoinButton from '../components/JoinButton';
import { ListItem } from 'material-ui/List';

window.$ = $;
window.jQuery = $;

class StartGame extends Component {
    state = {
        white: true,
        board: null,
        games: []
    }

    componentDidMount() {
        const board = ChessBoard('board', 'start');
        $(window).resize(board.resize);
        this.setState({ board: board });
        axios.get('/api/games/join')
            .then(res => this.setState({ games: res.data }))
            .catch(err => console.log(err));
    }
    changeColor(event, isChecked) {
        this.setState({ white: isChecked });
        this.state.board.flip();
    }
    createGame(event) {
        event.preventDefault();
        const { history, user } = this.props;
        const playerColor = this.state.white ? "whitePlayer" : "blackPlayer";
        axios.post('/api/games', { [playerColor]: user.id })
            .then(history.push('/mygames'))
            .catch(err => console.log(err));
    }
    handleChange = (value) => {
        this.setState({
            value: value,
        });
    }
    joinGame(gameId, color) {
        axios.put('api/games/join/' + gameId, { color: color })
            .then(() => this.props.history.push('/mygames'))
            .catch(err => console.log(err));
    }
    render() {
        return (
            <Grid >
                <Row center="xs">
                    <Col xs={12}>
                        <Tabs
                            value={this.state.value}
                            onChange={this.handleChange}
                            tabItemContainerStyle={{ background: "#663300" }}
                            inkBarStyle={{ background: "#ffb366" }}>
                            <Tab value="start" label="Start Game">
                                <Row center="xs">
                                    <Col center="xs" xs={12} >
                                        <form onSubmit={(event) => this.createGame(event)}>
                                            <div id="board" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }} />
                                            <span>
                                                <Toggle
                                                    style={{ maxWidth: 50, margin: '0 auto' }}
                                                    toggled={this.state.white}
                                                    thumbStyle={{ backgroundColor: 'black' }}
                                                    trackStyle={{ backgroundColor: 'grey' }}
                                                    thumbSwitchedStyle={{ backgroundColor: 'white' }}
                                                    trackSwitchedStyle={{ backgroundColor: 'grey' }}
                                                    onToggle={(event, isChecked) => this.changeColor(event, isChecked)}
                                                />
                                            </span>
                                            <div>
                                                <FlatButton hoverColor="#994d00" backgroundColor='#663300' style={{ color: '#fff3e6', fontFamily: "'Montserrat', sans-serif" }} label='Create Game' type="submit">
                                                </FlatButton>
                                            </div>
                                        </form>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab value="join" label="Join Game">
                                <Row center="xs">
                                    {!this.state.games[0] ?
                                        <p style={{ color: "#663300", fontFamily: "'Montserrat', sans-serif" }}> No joinable games, would you like to <FlatButton label="start one?" onClick={()=>this.setState({value:'start'})}hoverColor="#994d00" backgroundColor='#663300' style={{ color: '#fff3e6', fontFamily: "'Montserrat', sans-serif" }} /></p>
                                        : this.state.games.map(game => (
                                            <Col key={game._id} md={9} xs={12}>
                                                <ListItem>
                                                    <span>White: {game.whitePlayer ? game.whitePlayer.username : <JoinButton onClick={() => this.joinGame(game._id, 'whitePlayer')} />} </span>
                                                    <span>Black: {game.blackPlayer ? game.blackPlayer.username : <JoinButton onClick={() => this.joinGame(game._id, 'blackPlayer')} />} </span>
                                                </ListItem>
                                            </Col>
                                        ))}
                                </Row>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
export default withUser(StartGame);