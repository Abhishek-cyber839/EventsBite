import { observer } from 'mobx-react-lite'
import { Segment,List,Label,Image} from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const ActivitySideBar = () => {
    return(
        <>
        <Segment
            textAlign='center'
            style={{ border: 'none',marginTop:'10px' }}
            attached='top'
            secondary
            inverted
        >
            16 People Going
        </Segment>
        <Segment attached inverted>
        <b style={{ marginTop:'50px' }}>See who's attending this event</b>
            <List relaxed divided animated verticalAlign='middle'>
                <List.Item>
                    <Label
                        style={{ position: 'absolute' }}
                        color='orange'
                        ribbon='right'
                    >
                        Host
                    </Label>
                    <Image avatar src={'/assets/user.jpeg'} />
                    <List.Content>
                        <List.Header className='custom-font'><Link to={`#`}>Hopkins</Link></List.Header>
                        Host
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src={'/assets/user.jpeg'} />
                    <List.Content>
                        <List.Header className='custom-font'><Link to={`#`}>Steve</Link></List.Header>
                        Top User
                    </List.Content>
                </List.Item>

                <List.Item>
                    <Image avatar src={'/assets/user.jpeg'} />
                    <List.Content>
                        <List.Header className='custom-font'><Link to={`#`}>Sally</Link></List.Header>
                        Top Contributor
                    </List.Content>
                </List.Item>
            </List>
        </Segment>
    </>


    )
}

export default observer(ActivitySideBar)