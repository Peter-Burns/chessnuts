import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import { update } from '../services/withUser';

class Login extends Component {
    state = {
        username: null,
        password: null,
    }
    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    registerUser = (event) => {
        event.preventDefault();
        const { username, password } = this.state;
        const { history } = this.props;
        axios.post('api/users', {
            username,
            password
        })
            .then(user => {
                update(user.data);
                history.push('/mygames');
            })
            .catch(err => console.log(err));
    }
    handleLogin = (event) => {
        event.preventDefault();
        const { username, password } = this.state;
        const { history } = this.props;
        axios.post('/api/users/login', {
            username,
            password
        })
            .then(user => {
                update(user.data);
                history.push('/mygames');
            })
            .catch(err => console.log(err));
    }
    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col xs={3} xsOffset={3}>
                        <form onSubmit={this.handleLogin}>
                            <div>
                                <TextField
                                    name="username"
                                    hintText="Username"
                                    floatingLabelText="Username"
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <div>
                                <TextField
                                    name="password"
                                    hintText="Password"
                                    floatingLabelText="Password"
                                    type="password"
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <div>
                                <RaisedButton label="Login" primary type="submit">
                                </RaisedButton>
                                <RaisedButton onClick={this.registerUser} style={{ marginLeft: '20px' }} label="Register" secondary type="submit">
                                </RaisedButton>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
export default Login;