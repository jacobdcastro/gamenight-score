import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { useMutation } from 'react-query';
import { logIn } from '@lib/api';
import { Button, Input } from '@components/common';
import s from './Login.module.css';

const Login: FC = () => {
  const [state, setState] = useState({ username: '', password: '' });
  const mutation = useMutation(logIn);

  const setValues = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(state);
  };

  return (
    <div className={s.root}>
      <form onSubmit={handleSubmit}>
        <Input
          id='username'
          label='Username'
          value={state.username}
          setValue={setValues}
        />
        <Input
          id='password'
          label='Password'
          value={state.password}
          setValue={setValues}
        />
        <Button type='submit'>Log In</Button>
      </form>
    </div>
  );
};

export default Login;
