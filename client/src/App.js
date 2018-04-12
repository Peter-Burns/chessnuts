import React, { Component, Fragment } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Game from './pages/Game';
import JoinGame from './pages/JoinGame';
import MyGames from './pages/MyGames';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { withUser, update } from './services/withUser';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import axios from 'axios';
import StartGame from "./pages/StartGame";
import Drawer from 'material-ui/Drawer';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Badge from 'material-ui/Badge';
import LoginButton from './components/LoginButton';
import Leaderboard from "./pages/Leaderboard";

class App extends Component {
  state = {
    open: false,
    yourTurnGames: 0
  }
  componentDidMount() {
    // this is going to double check that the user is still actually logged in
    // if the app is reloaded. it's possible that we still have a user in sessionStorage
    // but the user's session cookie expired.
    axios.get('/api/users/')
      .then(res => {
        // if we get here, the user's session is still good. we'll update the user
        // to make sure we're using the most recent values just in case
        update(res.data);
        axios.get('/api/games/yourturngames')
          .then(res=> this.setState({yourTurnGames:res.data.length}))
          .catch(err=>console.log(err));
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

    const logout = () => {
      axios.delete('/api/users')
        .then(() => {
          update(null);
          this.setState({ open: false });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const openNav = () => {
      this.setState({ open: true });
    }

    return (
      <Router>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Fragment>
            <Navbar user={user} openNav={openNav} />
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route exact path="/leaderboard" component={Leaderboard} />
              <Route path="/game/:id" component={Game} />
              <PrivateRoute exact path="/mygames" component={MyGames} />
              <PrivateRoute exact path="/joingame" component={JoinGame} />
              <PrivateRoute exact path="/startgame" component={StartGame} />
              <Route exact path="/login" component={Login} />
            </Switch>
            <Drawer
              containerStyle={{ background: '#fff3e6' }}
              docked={false}
              width={200}
              openSecondary={true}
              onRequestChange={(open) => this.setState({ open })}
              open={this.state.open} >
              {user ? <List>
                <ListItem
                  style={{ color: '#663300' }}
                  autoGenerateNestedIndicator={false}
                  primaryText={<span style={{ fontWeight: '600' }}>{user.username}</span>}
                  leftAvatar={<Avatar
                    color={'#663300'}
                    backgroundColor={'#ffb366'}
                  >{user.username.slice(0, 1)}</Avatar>}
                  initiallyOpen={true}
                  nestedItems={[<Link style={{ textDecoration: 'none' }} to={'/mygames'}><ListItem style={{ color: '#663300' }}>{this.state.yourTurnGames ? <Badge
                    badgeContent={this.state.yourTurnGames}
                    primary={true}
                  >My Games</Badge> : 'My Games'}</ListItem></Link>,
                  <Link style={{ textDecoration: 'none' }} to={'startgame'}><ListItem style={{ color: '#663300' }}>Start or join game</ListItem></Link>,
                  <ListItem innerDivStyle={{ marginLeft: '0px' }} onClick={logout} style={{ color: '#663300' }}>Logout</ListItem>]}>
                </ ListItem>

              </List> : <List><Link to="/login"><ListItem><LoginButton style={{width:'100%'}} color='#663300'/></ListItem></Link></List>}

            </Drawer>
          </Fragment>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default withUser(App);
