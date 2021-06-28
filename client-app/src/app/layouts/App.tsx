import React, { Fragment, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import  NavBar  from './NavBar';
import  Dashboard  from '../../Feautures/activities/Dashboard';
import { observer } from 'mobx-react-lite';
import { Route,useLocation,Switch } from 'react-router-dom'
import Home from '../../Feautures/activities/Home';
import AForm from '../../Feautures/activities/AForm';
import Details  from '../../Feautures/activities/Details';
import '../../../src/App.css'
import NotFound from '../../Feautures/Errors/NotFound';
import ServerError from '../../Feautures/Errors/ServerError';
import LoginForm from '../../Feautures/users/LoginForm';
import { useStore } from '../api/Stores/store';
import { LoadingComponent } from './LoadingComponent';
import ModalContainer from '../common/ModalContainer';
import Profile from '../../Feautures/Profiles/Profile';

const App = () => {
  const location  = useLocation();
  const { commonStore, userStore } = useStore();
  useEffect(() => {
    if(commonStore.token) userStore.getUserWithMatchingToken().finally(() => commonStore.setAppLoaded())
    else commonStore.setAppLoaded()
  },[commonStore, userStore])

  if(!commonStore.appLoaded) return <LoadingComponent content='Loading your app...'/>
  return (
    <>
      <ModalContainer />
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
                  <Route path="/login" component={LoginForm}/>
                  <Route path="/profiles/:username" component={Profile}/>
                </Switch>
              </Container>
           </>
         )}
      />
    </>
  );
}

export default observer(App);