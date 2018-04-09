import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Board from "../components/Board";


class Game extends Component {
    componentDidMount(){
        
    }
    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col lg={4} lgOffset={3} md={6} mdOffset={2} sm={10} smOffset={1} xs={12}>
                        <Board gameId={this.props.match.params.id} />
                    </Col>
                    <Col lg={2} md={2} m={10} smOffset={1} xs={12}>
                        
                    </Col>
                </Row>
            </Grid>
        );
    }
}
export default Game;