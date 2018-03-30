import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Board from "./components/Board";
import Login from "./pages/Login";
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import { subscribeToTimer } from './api';

class App extends Component {
  
  constructor(props) {
    super(props);
    subscribeToTimer(100, (err, timestamp) => this.setState({timestamp}));
  }
  state = {
    timestamp: 'no timestamp yet'
  };

  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <AppBar title="Chessnuts" />
        </MuiThemeProvider>
        <Navbar />
        <Board />
        This is the timer value: {this.state.timestamp}
        <Login />
      </div>
    );
  }
}

export default App;
