import { observer } from 'mobx-react-lite'
import { Segment,List,Label,Image} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Activity } from '../../../app/models/activity';

interface Props{
    activity:Activity
}

const ActivitySideBar = ({activity:{participants,host} }:Props) => {
    if(!participants) return null
    return(
        <>
        <Segment
            textAlign='center'
            style={{ border: 'none',marginTop:'10px' }}
            attached='top'
            secondary
            inverted
        >
        { participants!.length === 1 ? 'Only One Person' : `${participants!.length} People` } Going 
        </Segment>
        <Segment attached inverted>
        <b style={{ marginTop:'50px' }}>See who's attending this event</b>
            <List relaxed divided animated verticalAlign='middle'>
                { 
                participants!.map( participant => (
                    <List.Item key={participant.userName}>
                        {
                           host?.userName === participant.userName &&
                           <Label
                           style={{ position: 'absolute' }}
                           color='orange'
                           ribbon='right'
                           >
                              Host
                          </Label>
                        }
                        <Image avatar src={participant.image || '/assets/user.jpeg'} />
                        <List.Content>
                            <List.Header className='custom-font'><Link to={`/profiles/${participant.userName}`}>{participant.displayName}</Link></List.Header>
                             { host?.userName !== participant.userName ? 'Participant ' : 'Host ' }
                             { participant.following && <Label color='blue'>Following</Label>}
                           </List.Content>
                    </List.Item>
                )) 
                }
            </List>
        </Segment>
    </>


    )
}

export default observer(ActivitySideBar)