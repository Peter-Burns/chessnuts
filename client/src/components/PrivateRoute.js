import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { withUser } from '../services/withUser';

const PrivateRoute = ({ component: Component, user, ...rest }) => (
    <Route {...rest} render={(props) => (
        user === null
            ? <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />
            : <Component {...{ ...props, user }} />
    )} />
);

export default withUser(PrivateRoute);
