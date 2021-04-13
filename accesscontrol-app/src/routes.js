import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Context } from './contexts/AuthContext';

import Login from './pages/login';
import Main from './pages/main';

function CustomRoute({ isPrivate, ...rest }) {
    const { authenticated } = useContext(Context);

    if(isPrivate && !authenticated) {
        return <Redirect to="/login" />
    }

    return <Route { ...rest } />
}

export default function Routes() {
    return (
        <Switch>
            <CustomRoute path="/login" component={Login} />
            <CustomRoute isPrivate path="/" component={Main} />
        </Switch>
    );
}