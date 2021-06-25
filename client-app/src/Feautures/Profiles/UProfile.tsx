import { Profile } from "../../app/models/ActivityParticipant"
import {observer} from 'mobx-react-lite'
import {Card,Image,Icon} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

interface Props{
    profile:Profile
}

const UProfile = ({profile}:Props) => {
    return(
        <Card as={Link} to={`/profiles/${profile.userName}`}>
            <Image wrapped ui={false} src={profile?.image || '/assets/user.jpeg'}/>
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Meta>
                        <span className='date'>Joined in 2015</span>
                </Card.Meta>
                <Card.Description> {profile.displayName} is a musician living in Nashville.</Card.Description>
                <Card.Content extra>
                    <Icon name='user' />
                        22 Friends
              </Card.Content>
            </Card.Content>
        </Card>
    )
}
export default observer(UProfile)