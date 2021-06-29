import { Card,CardGroup,Button,Container,Grid,Image,Icon,Item,Label } from "semantic-ui-react";
import { useStore } from "../../app/api/Stores/store";
import { observer } from "mobx-react-lite";
import { LoadingComponent } from '../../app/layouts/LoadingComponent';
import { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ActivityFilter } from "./ActivityFilter"; 
import { format } from "date-fns";
import ActivityListParticipants from "./ActivityListParticipants";

const Dashboard = () => {
    const { activityStore } = useStore();
    const { LoadActivities,GroupedActivities } = activityStore;

    useEffect(() => {
       LoadActivities()
    },[LoadActivities])

    if(activityStore.InitialLoading) return <LoadingComponent content='Loading Activities'/>

    return(
        <Grid>
            <Grid.Column width='10' style={{ marginTop: 50}}>
                { GroupedActivities.map(([group,activities]) => (
                    <Fragment>
                          <h5 className='custom-font'>{ group }</h5>
                          <CardGroup>
                          { activities.map((activity:any) => (
                            <Card key={activity.id}>
                                <Card.Content>
                                {
                                    activity.isCancelled &&
                                    <Label
                                    style={{ textAlign:'center',position: 'absolute'}}
                                    attached='top left'
                                    color='red'
                                    >
                                    Event Cancelled </Label>
                                }    
                                <Image
                                    circular
                                    floated='right'
                                    size='tiny'
                                    src={activity.host?.Image || '/assets/user.jpeg'}
                                    />
                                    <Card.Header className='custom-font'>{activity.title}</Card.Header>
                                    <Card.Meta>{format(activity.date!,'dd MMM yyyy h:mm aa')}</Card.Meta>
                                    <Card.Description>
                                    Posted By:  <strong>
                                        <Link to={`/profiles/${activity.host?.userName}`}>{activity.host?.displayName}</Link>
                                     </strong>
                                    { 
                                    activity.isHost && !activity.isCancelled &&
                                      <Item.Description>
                                           <Label
                                                style={{ position: 'absolute' }}
                                                color='orange'
                                                ribbon='right'
                                            >
                                                You're hosting this event
                                            </Label>
                                      </Item.Description>
                                      
                                    }
                                      { 
                                    !activity.isHost && activity.isGoing &&
                                      <Item.Description>
                                           <Label
                                                
                                                style={{ textAlign:'center',position: 'absolute'}}
                                                attached='top left'
                                                color='green'
                                            >
                                                You're also attending this event
                                            </Label>
                                      </Item.Description>
                                      
                                    }
                                    </Card.Description>
                                    <ActivityListParticipants user={activity.host.userName} participants={activity.participants!}/>
                                    <Card.Content extra><Icon name='user' />{ activity.participants.length } Attending</Card.Content>
                                    <Card.Content extra><Icon name='tag' />{75 - activity.participants.length } still seats available now</Card.Content>
                                    {/* <Card.Description>
                                            {activity.description}
                                    </Card.Description> */}
                                </Card.Content>
                                <Card.Content extra>
                                    {
                                        activity.isHost ? 
                                        (
                                            <> 
                                              <div className='ui two buttons'>
                                                <Button as={Link} to={`/activities/${activity.id}`} basic color='green' style={{ marginRight:5 }}>
                                                  Format
                                                </Button>
                                                <Button onClick={() => activityStore.deleteActivity(activity.id)} basic color='red'>
                                                  Remove
                                                </Button>
                                            </div>
                                            </> 
                                        ) : 
                                        <> </>
                                        
                                    }
                                <Container style={{ marginTop: 10}}>
                                    <Card.Meta>Category: {activity.category}</Card.Meta>
                                    <Card.Meta>Where: {activity.city}</Card.Meta>
                                    <Card.Meta>Veneue: {activity.venue}</Card.Meta>
                                    { !activity.isHost && 
                                      <Button as={Link} to={`/activities/${activity.id}`}
                                      basic color={ activity.isHost ? 'blue' : 'brown'} style={{ marginTop: 12}}>
                                        { activity.isGoing ?  'Manage Booking'  : 'Book Now' } 
                                       </Button>
                                    }
                                </Container>
                                </Card.Content>
                            </Card>
                        ))
                        }           
                    </CardGroup>
                    </Fragment>
                ))}
            </Grid.Column>
            <Grid.Column width='6' style={{ marginTop: 50}}>
                <ActivityFilter />
            </Grid.Column>
        </Grid>
    )
}
export default observer(Dashboard);
