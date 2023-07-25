import React from 'react';
import './styles/main.scss';
// import 'rsuite/dist/styles/rsuit-default.css';
import { Switch} from 'react-router';
import SignIn from './Pages/Signin';
import PrivateRoute from './Component/PrivateRoute';
import Home from './Pages/Home';
import PublicRoute from './Component/PublicRoute';

const App = ()=> {
  return(
    <Switch>
      <PublicRoute path = "/SignIn">
        <SignIn/>
      </PublicRoute>
      <PrivateRoute path= "/">
        <Home/>
      </PrivateRoute>
    </Switch>
    
  )

}

export default App;
