import React, { Component, Fragment } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Game from './pages/Game';
import JoinGame from './pages/JoinGame';
import MyGames from './pages/MyGames';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { subscribeToTimer } from './api';
import { withUser, update } from './services/withUser';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';


class App extends Component {

  constructor(props) {
    super(props);
    subscribeToTimer(100, (err, timestamp) => this.setState({ timestamp }));
  }
  state = {
    timestamp: 'no timestamp yet',
    theme: darkBaseTheme
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

  render() {
    const { user } = this.props;
    return (
      <Router>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <Fragment>
            <Navbar
              user={user} />
            <p style={{ color: this.state.theme.palette.textColor }}>This is the timer value: {this.state.timestamp}</p>
            <Switch>
              <Route path="/game/:id" component={Game} />
              <Route exact path="/mygames" component={MyGames}/>
              <Route exact path="/joingame" component={JoinGame}/>
              <Route exact path="/startgame" />
              <Route exact path="/login" component={Login} />
            </Switch>
          </Fragment>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default withUser(App);
