import React from 'react';
import FlatButton from 'material-ui/FlatButton';

const JoinButton = (props) => (
  <FlatButton backgroundColor={'#0097a7'} hoverColor={'#ff4081'} label="Join" onClick={props.onClick} />
);

export default JoinButton;
