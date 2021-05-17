import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserView } from './views/UserView';
import setAuthToken from './lib/setAuthToken';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
