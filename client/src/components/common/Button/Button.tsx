import { FC } from 'react';
import s from './Button.module.css';

interface Props {
  type: 'button' | 'reset' | 'submit';
  onClick?: () => void;
}

const Button: FC<Props> = ({ type, onClick, children }) => {
  return (
    <button className={s.root} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;
