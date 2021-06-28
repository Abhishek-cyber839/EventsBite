import { Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/ActivityParticipant";
import ProfilePhotos from "./ProfilePhotos";
import {observer} from "mobx-react-lite";

interface Props{
    profile:Profile
}
const ProfileContent = ({profile}:Props) => {
    const about = "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface" + 
    "without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available."
    const panes = [
        { menuItem: 'About', render: () => <Tab.Pane className='custom-font'>{about}</Tab.Pane> },
        { menuItem: 'Events', render: () => <Tab.Pane className='custom-font'>Tab 2 Content</Tab.Pane> },
        { menuItem: 'Photos', render: () => <Tab.Pane className='custom-font'><ProfilePhotos profile={profile}/></Tab.Pane> },
        { menuItem: 'Followers', render: () => <Tab.Pane className='custom-font'>Tab 3 Content</Tab.Pane> },
        { menuItem: 'Following', render: () => <Tab.Pane className='custom-font'>Tab 3 Content</Tab.Pane> },
      ]
    return(
        <>
           <h3 className='custom-font'>
               Bio
           </h3>
           <p>{about}</p>
           <Tab panes={panes} />
        </>
    )
}

export default observer(ProfileContent);