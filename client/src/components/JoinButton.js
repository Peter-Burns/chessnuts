import React from 'react';
import FlatButton from 'material-ui/FlatButton';

const JoinButton = (props) => (
  <FlatButton style={{background:"rgb(0, 151, 167)"}}label="Join" onClick={props.onClick} />
);

export default JoinButton;
