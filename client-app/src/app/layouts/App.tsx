import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import { NavBar } from './NavBar';
import  Dashboard  from '../../Feautures/activities/Dashboard';
import { observer } from 'mobx-react-lite';
import { Route,useLocation } from 'react-router-dom'
import Home from '../../Feautures/activities/Home';
import AForm from '../../Feautures/activities/AForm';
import Details  from '../../Feautures/activities/Details';
import '../../../src/App.css'

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
                <Route exact path="/activities" component={Dashboard}/>
                <Route path="/activities/:id" component={Details}/>
                <Route key={location.key} path={["/createActivity","/manage/:id"]} component={AForm}/>
              </Container>
           </>
         )}
      />
    </>
  );
}

export default observer(App);