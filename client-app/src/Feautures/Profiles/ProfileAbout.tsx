import {useState} from 'react';
import {Button, Grid, Header} from "semantic-ui-react";
import { observer } from 'mobx-react-lite';
import EditProfile from './EditProfile';


const ProfileAbout = () => {
    const [editMode, setEditMode] = useState(false);
    return(
        <Grid>
            <Grid.Column width='16'>
            <Header 
                  as='h5'
                  className='custom-font' 
                  style = {{ margin:10 }} 
                  textAlign='center' 
                  content= 'You can edit your profile here'/>
                  <Button 
                        floated='right'
                        color='grey'
                        style={{ margin:10 }}
                        basic
                        content={editMode ? 'Cancel' : 'Edit Profile'}
                        onClick={() => setEditMode(!editMode)}
                  />
                  <Grid.Column width='16'>
                         {editMode ? <EditProfile setEditMode={setEditMode} /> : <> </> }
                   </Grid.Column>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ProfileAbout);