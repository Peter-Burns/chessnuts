import React from 'react';

const Logo = (props) => (
  <img onClick={props.onClick} height="80%" alt="Chessnuts logo" src='/img/logo.svg'/>
);

export default Logo;
