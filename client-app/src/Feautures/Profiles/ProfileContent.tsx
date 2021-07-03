import { Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/ActivityParticipant";
import ProfilePhotos from "./ProfilePhotos"; 
import {observer} from "mobx-react-lite";
import Followings from "./Followings";
import { useStore } from "../../app/api/Stores/store";
import ProfilActivities from "./ProfilActivities";
import ProfileAbout from "./ProfileAbout";

interface Props{
    profile:Profile,
}
const ProfileContent = ({profile}:Props) => {
    const { profileStore,userStore:{ user }  } = useStore()
    const about = "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface" + 
    "without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available."
    let panes = [
        { menuItem: 'Edit', render: () => user?.userName === profile.userName ?  <ProfileAbout/> : <> </> },
        { menuItem: 'Events', render: () => <ProfilActivities/> },
        { menuItem: 'Photos', render: () => <Tab.Pane className='custom-font'><ProfilePhotos profile={profile}/></Tab.Pane> },
        { menuItem: 'Followers', render: () => <Tab.Pane loading={profileStore.LoadingFollowings} className='custom-font'><Followings /></Tab.Pane> },
        { menuItem: 'Following', render: () => <Tab.Pane loading={profileStore.LoadingFollowings} className='custom-font'><Followings /></Tab.Pane> },
      ]

    // if(user!.userName !== profile.userName)
    //     panes.splice(0,1)

    return(
        <div style={{ margin:10 }}>
           <h3 className='custom-font'>
               Bio
           </h3>
           <p>{profile.bio ? profile.bio : about}</p>
           <Tab panes={panes} onTabChange={(e,data) => profileStore.setActiveTab(data.activeIndex)}/>
        </div>
    )
}

export default observer(ProfileContent);