import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { UserView } from './views/UserView';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <h1>umm hi</h1>
        </Route>
        <Route path='/user'>
          <UserView />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
