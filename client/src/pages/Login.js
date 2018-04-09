import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import { update } from '../services/withUser';
import { Tabs, Tab } from 'material-ui/Tabs';

class Login extends Component {
    state = {
        username: null,
        password: null,
        newUsername: null,
        newPassword: null,
        confirmPassword: null,
        loginError: null,
        registerError: null
    }
    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    registerUser = (event) => {
        event.preventDefault();
        const { newUsername, newPassword, confirmPassword } = this.state;
        if(!(newUsername&&newPassword&&confirmPassword)) return this.setState({registerError:"All fields required"});
        const { history } = this.props;
        if(newPassword !== confirmPassword) return this.setState({registerError:"Username and Password don't match"});
        axios.post('api/users', {
            username:newUsername,
            password:newPassword
        })
            .then(user => {
                update(user.data);
                history.push('/mygames');
            })
            .catch(err => this.setState({registerError:"Error creating your account, account name may be taken"}));
    }
    handleLogin = (event) => {
        event.preventDefault();
        const { username, password } = this.state;
        if(!(username&&password))return this.setState({loginError:"All fields required"});
        const { history } = this.props;
        axios.post('/api/users/login', {
            username,
            password
        })
            .then(user => {
                update(user.data);
                history.push('/mygames');
            })
            .catch(err => this.setState({loginError:"Error logging you in, username and password may not match"}));
    }
    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col lg={4} lgOffset={4} md={6} mdOffset={3} xs={12}>
                        <Tabs
                            tabItemContainerStyle={{ background: "#663300" }}
                            inkBarStyle={{ background: "#ffb366" }}>
                            <Tab label="Login">
                                <form onSubmit={this.handleLogin}>
                                {<p>{this.state.loginError}</p>}
                                    <div>
                                        <TextField
                                            fullWidth
                                            name="username"
                                            hintText="Username"
                                            floatingLabelText="Username"
                                            floatingLabelStyle={{ color: '#663300' }}
                                            underlineFocusStyle={{ borderColor: '#ffb366' }}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <TextField
                                            fullWidth
                                            name="password"
                                            hintText="Password"
                                            floatingLabelText="Password"
                                            floatingLabelStyle={{ color: '#663300' }}
                                            underlineFocusStyle={{ borderColor: '#ffb366' }}
                                            type="password"
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <RaisedButton label="Login" backgroundColor='#ffb366' labelColor='#663300' type="submit">
                                        </RaisedButton>
                                    </div>
                                </form>
                            </Tab>
                            <Tab label="Register">
                                <form onSubmit={this.registerUser}>
                                {<p>{this.state.registerError}</p>}
                                    <div>
                                        <TextField
                                            fullWidth
                                            name="newUsername"
                                            hintText="Username"
                                            floatingLabelText="Username"
                                            floatingLabelStyle={{ color: '#663300' }}
                                            underlineFocusStyle={{ borderColor: '#ffb366' }}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <TextField
                                            fullWidth
                                            name="newPassword"
                                            hintText="Password"
                                            floatingLabelText="Password"
                                            floatingLabelStyle={{ color: '#663300' }}
                                            underlineFocusStyle={{ borderColor: '#ffb366' }}
                                            type="password"
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <TextField
                                            fullWidth
                                            name="confirmPassword"
                                            hintText="Confirm Password"
                                            floatingLabelText="Confirm Password"
                                            floatingLabelStyle={{ color: '#663300' }}
                                            underlineFocusStyle={{ borderColor: '#ffb366' }}
                                            type="password"
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <RaisedButton label="Register" backgroundColor='#ffb366' labelColor='#663300' type="submit">
                                        </RaisedButton>
                                    </div>
                                </form>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
export default Login;