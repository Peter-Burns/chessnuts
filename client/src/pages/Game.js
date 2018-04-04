import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Board from "../components/Board";


class Game extends Component {
    render() {
        return (
            <Grid fluid>
                <Row center="xs">
                    <Col lg={4} md={6} sm={9} xs={12}>
                        <Board gameId={this.props.match.params.id}/>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
export default Game;