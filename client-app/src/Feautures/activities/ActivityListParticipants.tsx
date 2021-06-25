import { observer } from "mobx-react-lite";
import { List,Image,Popup } from "semantic-ui-react";
import { Profile } from "../../app/models/ActivityParticipant";
import {Link} from 'react-router-dom'
// import UProfile from "../Profiles/UProfile";

interface Props{
    participants:Profile[]
}
const ActivityPartcipants = ({participants}:Props) => {
    return(
        <List horizontal>
            {
            participants.map(participant => (
                <Popup
                  content={`${participant.userName} has been a member since July 2021`}
                  header={participant.userName}
                  key={participant.userName}
                  size='tiny'
                  hoverable
                  trigger={
                    <List.Item key={participant.userName} as={Link} to={`/profiles/${participant.userName}`}>
                      <Image size='mini' circular src={participant.image ||  '/assets/user.jpeg'}/>
                    </List.Item>
                  }
                >
                    {/* <Popup.Content>
                        <UProfile profile={participant}/>
                    </Popup.Content> */}
                </Popup>
              ))
            }
        </List>
    )
}
export default observer(ActivityPartcipants);