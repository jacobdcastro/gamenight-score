import { FC } from 'react';
import s from './Input.module.css';

interface Props {
  id: string;
  label: string;
  value: string;
  setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const Input: FC<Props> = ({ id, label, value, setValue, disabled }) => {
  return (
    <div className={s.root}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type='text'
        value={value}
        onChange={setValue}
        disabled={disabled || false}
      />
    </div>
  );
};

export default Input;
