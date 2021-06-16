import React, { Fragment, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { NavBar } from './NavBar';
import  Dashboard  from '../../Feautures/activities/Dashboard';
import { LoadingComponent } from './LoadingComponent';
import { useStore } from '../api/Stores/store';
import { observer } from 'mobx-react-lite';

function App () {
  const { activityStore } = useStore();

  useEffect(() => {
    activityStore.LoadActivities()
    // eslint-disable-next-line
  },[])

  if(activityStore.Loading) return <LoadingComponent content='Loading Activities'/>
  return (
    <Fragment>
      <NavBar/>
      <Container style={{ marginTop:'4rem'}} >
        <Dashboard />
      </Container>
    </Fragment>
  );
}

export default observer(App);
