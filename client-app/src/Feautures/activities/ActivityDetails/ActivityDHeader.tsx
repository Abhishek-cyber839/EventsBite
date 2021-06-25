import { Image,Segment,Button,Header,Item,Label } from "semantic-ui-react";
import {Activity} from '../../../app/models/activity'
import { observer } from 'mobx-react-lite'
import {Link} from 'react-router-dom'
import { format } from "date-fns";
import { useStore } from "../../../app/api/Stores/store";

interface Props {
    activity: Activity
}

const ActivityHeader = ({activity}:Props) => {
    const { activityStore } = useStore();
    const activityImageStyle = {
        filter: 'brightness(30%)'
    };
    
    const activityImageTextStyle = {
        position: 'absolute',
        bottom: '5%',
        left: '5%',
        width: '100%',
        height: 'auto',
        color: 'white'
    };
    
    return(
         <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                {
                    activity.isCancelled &&
                    <Label
                       style={{ position: 'absolute',zIndex:1000,left:80,top:20 }}
                       color='red'
                       ribbon='right'
                       >
                     Cancelled </Label>
                }
                <Image src={'/assets/Activity.png'} fluid style={activityImageStyle}/>
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{color: 'white'}}
                                    className='custom-font'
                                />
                                <p>{format(activity.date!,'dd MMM yyyy h:mm aa')}</p>
                                <p>
                                    Hosted by <strong>Bob</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {

                    activity.isHost ? 
                    (
                      <> 
                        <Button 
                            basic onClick={activityStore.cancelActivity} loading={activityStore.Loading}
                            color= { activity.isCancelled ? 'brown' : 'green'} floated='left' className='custom-font'>
                            { activity.isCancelled ? 'Re-Activate-Event' : 'Cancel Event'}
                        </Button>
                        <Button disabled={activity.isCancelled} as={Link} to={`/manage/${activity.id}`} color='orange' floated='right' className='custom-font'>
                            Manage Event
                       </Button>
                      </>
                    ) : activity.isGoing ? 
                    ( <Button 
                        loading={activityStore.Loading}
                        onClick={activityStore.updateAttendance} className='custom-font'>Cancel attendance</Button> ) 
                    :  <Button disabled={activity.isCancelled} 
                       loading={activityStore.Loading} onClick={activityStore.updateAttendance} color='teal' className='custom-font'>Join Activity</Button>
                }
            </Segment>
        </Segment.Group>

    )
}

export default observer(ActivityHeader)
