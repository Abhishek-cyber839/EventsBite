import { Image,Segment,Button,Header,Item } from "semantic-ui-react";
import {Activity} from '../../../app/models/activity'
import { observer } from 'mobx-react-lite'

interface Props {
    activity: Activity
}

const ActivityHeader = ({activity}:Props) => {
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
                                <p>{activity.date}</p>
                                <p>
                                    Hosted by <strong>Bob</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                <Button color='teal' className='custom-font'>Join Activity</Button>
                <Button className='custom-font'>Cancel attendance</Button>
                <Button color='orange' floated='right' className='custom-font'>
                    Manage Event
                </Button>
            </Segment>
        </Segment.Group>

    )
}

export default observer(ActivityHeader)
