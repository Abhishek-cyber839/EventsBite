import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router";
import { useStore } from "../../app/api/Stores/store";
import { useEffect } from "react";
import { LoadingComponent } from "../../app/layouts/LoadingComponent";

const Profile = () => {
    const { username } = useParams<{username:string}>();
    const { profileStore } = useStore();
    const { LoadProfile , profile, LoadingProfile,setActiveTab } = profileStore;
    useEffect(() => {
        LoadProfile(username)
        return () => setActiveTab(0)
    },[LoadProfile,username,setActiveTab])
    if(LoadingProfile)
       return <LoadingComponent content='Loading Profile.....'/>
    return(
        <Grid>
            <Grid.Column width={16}>
                { profile &&  <ProfileHeader profile={profile}/>}        
            </Grid.Column>
        </Grid>
    )
}

export default observer(Profile);