import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import { withUser } from '../services/withUser';
import Toggle from 'material-ui/Toggle';
import ChessBoard from "chessboardjs";
import '../chessboard-0.3.0.css';
import $ from 'jquery';

window.$ = $;
window.jQuery = $;

class StartGame extends Component {
    state = {
        white: true,
        board: null
    }

    componentDidMount() {
        const board = ChessBoard('board', 'start');
        $(window).resize(board.resize);
        this.setState({ board: board });
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
    render() {
        return (
            <Grid fluid>
                <Row center="md">
                    <Col lg={4} md={6} sm={9} xs={12} >
                        <form onSubmit={(event) => this.createGame(event)}>
                            <div id="board" style={{ width: '100%', maxWidth: '600px' }} />
                            <div>
                                <Toggle
                                    style={{ maxWidth: 250 }}
                                    // label={this.state.white ? 'White' : 'Black'}
                                    toggled={this.state.white}
                                    thumbStyle={{ backgroundColor: 'black' }}
                                    trackStyle={{ backgroundColor: 'gery' }}
                                    thumbSwitchedStyle={{ backgroundColor: 'white' }}
                                    trackSwitchedStyle={{ backgroundColor: 'grey' }}
                                    onToggle={(event, isChecked) => this.changeColor(event, isChecked)}
                                />
                            </div>
                            <div>
                                <FlatButton hoverColor="#994d00" backgroundColor='#663300' style={{ color: '#fff3e6' }} label='Create Game' type="submit">
                                </FlatButton>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
export default withUser(StartGame);