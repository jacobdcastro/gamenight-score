import { FC, useMemo } from 'react';
import { Route, Switch, useRouteMatch, Link } from 'react-router-dom';
import cn from 'classnames';
import { Login, Signup } from '@components/user';
import s from './UserView.module.css';

const UserView: FC = () => {
  const match = useRouteMatch();
  const loginPath = useMemo(() => `${match.path}/login`, [match?.path]);
  const signupPath = useMemo(() => `${match.path}/signup`, [match?.path]);

  return (
    <div className={s.root}>
      <div className={s.content}>
        <h1>This is the user view</h1>
        <Switch>
          <Route exact path={match.path}>
            <Link className={cn(s.link, s.loginBtn)} to={loginPath}>
              Log In
            </Link>
            <Link className={cn(s.link, s.signupBtn)} to={signupPath}>
              Sign Up
            </Link>
          </Route>
          <Route path={loginPath}>
            <Login />
          </Route>
          <Route path={signupPath}>
            <Signup />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default UserView;
