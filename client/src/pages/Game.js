import React, { Component } from 'react';
import { Grid } from 'react-flexbox-grid';
import Board from "../components/Board";


class Game extends Component {
    componentDidMount() {

    }
    render() {
        return (
            <Grid fluid>
                    <Board gameId={this.props.match.params.id} />
            </Grid>
        );
    }
}
export default Game;