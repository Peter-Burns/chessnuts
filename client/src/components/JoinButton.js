import React from 'react';
import FlatButton from 'material-ui/FlatButton';

const JoinButton = (props) => (
  <FlatButton label="Join" onClick={props.onClick} />
);

export default JoinButton;
