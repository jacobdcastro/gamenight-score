import React, { FC } from 'react';
import s from './Layout.module.css';

const Layout: FC = ({ children }) => {
  return (
    <div className={s.root}>
      <h1 className={s.root}>testing 123</h1>
      {children}
    </div>
  );
};

export default Layout;
