import React, { FC } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Login, Signup } from '@components/user';

const UserView: FC = () => {
  const match = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route path={`${match.path}/login`}>
          <Login />
        </Route>
        <Route path={`${match.path}/signup`}>
          <Signup />
        </Route>
      </Switch>
    </div>
  );
};

export default UserView;
