import { FC, useMemo } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { Login, Signup } from '@components/user';
import s from './UserView.module.css';

const UserView: FC = () => {
  return (
    <div className={s.root}>
      <div className={s.content}>
        <h1>This is the user view</h1>

        <Link href='/user/login'>
          <a className={cn(s.link, s.loginBtn)}>Log In</a>
        </Link>
        <Link href='/user/signup'>
          <a className={cn(s.link, s.signupBtn)}>Sign Up</a>
        </Link>
      </div>
    </div>
  );
};

export default UserView;
