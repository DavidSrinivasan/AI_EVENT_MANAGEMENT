import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/event/:id" component={EventDetailsPage} />
        <Route path="/profile" component={UserProfilePage} />
      </Switch>
    </Router>
  );
}

export default App;