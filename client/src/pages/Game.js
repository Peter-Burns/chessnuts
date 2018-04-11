import React, { Component } from 'react';
import { Grid } from 'react-flexbox-grid';
import Board from "../components/Board";
import { withRouter } from 'react-router-dom';
import { leaveGame } from '../api';
class Game extends Component {
    componentDidMount() {
        this.props.history.listen(() => {
            leaveGame();
        });
    }
    render() {
        return (
            <Grid fluid>
                <Board gameId={this.props.match.params.id} />
            </Grid>
        );
    }
}
export default withRouter(Game);