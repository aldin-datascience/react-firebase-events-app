import React from 'react';
import { AuthProvider } from './auth/Auth';
import {Login} from './auth/Login';
import { Events } from './components/Events';
import { Create } from './components/Create';
import { CreateAdmin } from './components/CreateAdmin'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';


function App() {
    return (
      <Router>
          <Switch>
            <AuthProvider>
                <Route exact path="/" component={Login}/>
                <Route
                    exact path="/events" component={Events}
                />
                <Route exact path="/admin" component={CreateAdmin}/>
                <Route exact path="/events/create" component={Create}/>
            </AuthProvider>
          </Switch>
      </Router>
    );
}

export default App;
