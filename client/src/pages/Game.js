import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Board from "../components/Board";


class Game extends Component {
    
    render() {
        return (
            <Grid fluid>
                <Row center="xs">
                    <Col className="center" xs={6} xsOffset={3}>
                        <Board />
                    </Col>
                </Row>
            </Grid>
        );
    }
}
export default Game;