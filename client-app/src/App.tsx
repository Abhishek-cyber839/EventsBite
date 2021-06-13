import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import {Header} from 'semantic-ui-react';
import { List } from 'semantic-ui-react';

function App() {
  const [activities,setactivities] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:5001/api/activities').then((resp) => {
      console.log("data : ", resp);
      setactivities(resp.data)
    }).catch(() => {

    })
  },[])

  return (
    <div>
      <Header as='h2' icon='users' content='sample' />
        <List>
          { activities.map((activity:any) => (
            <List.Item key={activity.id}>{activity.title}</List.Item>
            ))
          }
        </List>
    </div>
  );
}

export default App;
