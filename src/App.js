import React from 'react';
import './styles/main.scss';
import 'rsuite/dist/styles/rsuite-default.css';
import { Switch } from 'react-router';
import SignIn from './Pages/Signin';
import PrivateRoute from './Component/PrivateRoute';
import Home from './Pages/Home/Index';
import PublicRoute from './Component/PublicRoute';
import { ProfileProvider } from './Context/Profile.Context';


const App = () => {
  return (
    <ProfileProvider>
      <Switch>
        <PublicRoute path = "/SignIn">
          <SignIn/>
        </PublicRoute>
        <PrivateRoute path= "/">
          <Home/>
        </PrivateRoute>
      </Switch>
    </ProfileProvider>
    
  );

}

export default App;
