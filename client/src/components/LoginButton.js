import React from 'react';
import FlatButton from 'material-ui/FlatButton';

const LoginButton = (props) => (
  <FlatButton style={{ backgroundColor: props.backgroundColor, color: props.color, fontFamily: "'Montserrat', sans-serif" }} label="Log In / Register" onClick={props.onClick} />
);

export default LoginButton;
