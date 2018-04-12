import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withUser } from '../services/withUser';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import { Tabs, Tab } from 'material-ui/Tabs';

class Leaderboard extends Component {
    state = {
        users: []
    };
    componentDidMount() {
        axios.get('/api/users/topten')
            .then(res => this.setState({ users: res.data }))
            .catch(err => console.log(err));
    }
    render() {
        const { user } = this.props;
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <Tabs tabItemContainerStyle={{ background: "#663300" }}
                            inkBarStyle={{ background: "#ffb366" }}>
                            <Tab label='Leaderboard'>
                                <Table
                                    selectable={false}
                                    showCheckboxes={false}>
                                    <TableHeader
                                        displaySelectAll={false}
                                        adjustForCheckbox={false}>
                                        <TableRow>
                                            <TableHeaderColumn>ID</TableHeaderColumn>
                                            <TableHeaderColumn>Name</TableHeaderColumn>
                                            <TableHeaderColumn>Rating</TableHeaderColumn>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody displayRowCheckbox={false}>
                                        {this.state.users.map(ratingUser => (
                                            <TableRow style={user ? user.id === ratingUser._id ? {fontWeight:'600'} : '' : '' }>
                                                <TableRowColumn>{ratingUser._id}</TableRowColumn>
                                        <TableRowColumn>{ratingUser.username}</TableRowColumn>
                                        <TableRowColumn>{ratingUser.rating}</TableRowColumn>
                                            </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Grid >
        );
    }
}
export default withUser(Leaderboard);