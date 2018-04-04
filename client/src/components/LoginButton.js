import React from 'react';
import FlatButton from 'material-ui/FlatButton';

const LoginButton = (props) => (
  <FlatButton label="Log In / Register" onClick={props.onClick} />
);

export default LoginButton;
