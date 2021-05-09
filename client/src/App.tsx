import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import UserView from './Views/user';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path='/'>
          <div>hello world</div>
        </Route>

        <Route path='/user'>
          <UserView />
        </Route>
        <Route path='/create-game'></Route>
        <Route path='/join-game'></Route>

        <Route path='/play/:gameId'></Route>
      </Switch>
    </Router>
  );
};

export default App;
