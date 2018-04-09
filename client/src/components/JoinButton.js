import React from 'react';
import FlatButton from 'material-ui/FlatButton';

const JoinButton = (props) => (
  <FlatButton hoverColor="#994d00" backgroundColor='#663300' style={{ color:'#fff3e6'}}label="Join" onClick={props.onClick} />
);

export default JoinButton;
