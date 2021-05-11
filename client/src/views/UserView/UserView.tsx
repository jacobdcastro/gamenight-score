import { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Login, Signup } from '../../components/user';
import s from './UserView.module.css';

const UserView: FC = () => {
  const match = useRouteMatch();
  return (
    <div className={s.root}>
      <h1>This is the user view</h1>
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
