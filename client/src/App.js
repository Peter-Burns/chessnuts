import React, { Component, Fragment } from "react";
import "./App.css";
import AppBar from 'material-ui/AppBar';
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Logo from "./components/Logo";
import Login from "./pages/Login";
import Game from './pages/Game';
import JoinGame from './pages/JoinGame';
import MyGames from './pages/MyGames';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { withUser, update } from './services/withUser';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import StartGame from "./pages/StartGame";


class App extends Component {

  state = {
    open: false
  };

  componentDidMount() {
    // this is going to double check that the user is still actually logged in
    // if the app is reloaded. it's possible that we still have a user in sessionStorage
    // but the user's session cookie expired.
    axios.get('/api/users/')
      .then(res => {
        // if we get here, the user's session is still good. we'll update the user
        // to make sure we're using the most recent values just in case
        update(res.data);
      })
      .catch(err => {
        // if we get a 401 response, that means the user is no longer logged in
        if (err.response.status === 401) {
          update(null);
        }
      });
  }
  handleToggle = () => this.setState({ open: !this.state.open });
  render() {
    const { user } = this.props;
    return (
      <Router>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Fragment>
            <Navbar
              logoClick={this.handleToggle}
              user={user} />
            <Switch>
              <Route path="/game/:id" component={Game} />
              <PrivateRoute exact path="/mygames" component={MyGames} />
              <PrivateRoute exact path="/joingame" component={JoinGame} />
              <PrivateRoute exact path="/startgame" component={StartGame} />
              <Route exact path="/login" component={Login} />
            </Switch>
            <Drawer open={this.state.open} containerStyle={{ background: '#fff3e6' }} docked={true} onRequestChange={(open) => this.setState({ open })}>
              <AppBar title="Chess Nuts"
                style={{ background: '#663300' }}
                titleStyle={{ color: '#ffb366' }}
                iconElementLeft={<Logo onClick={this.handleToggle} />}
                showMenuIconButton={true} />
              <MenuItem>Menu Item</MenuItem>
              <MenuItem>Menu Item 2</MenuItem>
            </Drawer>
          </Fragment>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default withUser(App);
