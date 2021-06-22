import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import { NavBar } from './NavBar';
import  Dashboard  from '../../Feautures/activities/Dashboard';
import { observer } from 'mobx-react-lite';
import { Route,useLocation,Switch } from 'react-router-dom'
import Home from '../../Feautures/activities/Home';
import AForm from '../../Feautures/activities/AForm';
import Details  from '../../Feautures/activities/Details';
import '../../../src/App.css'
import NotFound from '../../Feautures/Errors/NotFound';
import ServerError from '../../Feautures/Errors/ServerError';

const App = () => {
  const location  = useLocation();
  return (
    <>
      <Route exact path="/" component={Home}/>
      <Route 
         path={'/(.+)'}
         render={() => (
           <> 
              <NavBar/>
              <Container style={{ marginTop:'4rem'}} >
                <Switch>
                  <Route exact path="/activities" component={Dashboard}/>
                  <Route path="/activities/:id" component={Details}/>
                  <Route key={location.key} path={["/createActivity","/manage/:id"]} component={AForm}/>
                  <Route path="/not-found-error"component={NotFound}/>
                  <Route path="/server-error" component={ServerError}/>
                </Switch>
              </Container>
           </>
         )}
      />
    </>
  );
}

export default observer(App);