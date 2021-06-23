import { Card,CardGroup,Button,Container,Grid,Image,Icon } from "semantic-ui-react";
import { useStore } from "../../app/api/Stores/store";
import { observer } from "mobx-react-lite";
import { LoadingComponent } from '../../app/layouts/LoadingComponent';
import { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ActivityFilter } from "./ActivityFilter"; 
import { format } from "date-fns";

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
                                <Image
                                    floated='right'
                                    size='mini'
                                    src={'/assets/user.jpeg'}
                                    />
                                    <Card.Header className='custom-font'>{activity.title}</Card.Header>
                                    <Card.Meta>{format(activity.date!,'dd MMM yyyy h:mm aa')}</Card.Meta>
                                    <Card.Description>
                                    Posted By: <strong>Steve Bob</strong>
                                    </Card.Description>
                                    <Card.Content extra><Icon name='user' />25 Attending</Card.Content>
                                    <Card.Content extra><Icon name='tag' />75 available now</Card.Content>
                                    {/* <Card.Description>
                                            {activity.description}
                                    </Card.Description> */}
                                </Card.Content>
                                <Card.Content extra>
                                    <div className='ui two buttons'>
                                        <Button as={Link} to={`/manage/${activity.id}`} basic color='green'>
                                        Edit
                                        </Button>
                                        <Button onClick={() => activityStore.deleteActivity(activity.id)} basic color='red'>
                                        Delete
                                        </Button>
                                    </div>
                                <Container style={{ marginTop: 10}}>
                                    <Card.Meta>Category: {activity.category}</Card.Meta>
                                    <Card.Meta>Where: {activity.city}</Card.Meta>
                                    <Card.Meta>Veneue: {activity.venue}</Card.Meta>
                                    <Button as={Link} to={`/activities/${activity.id}`}
                                              basic color='blue' style={{ marginTop: 12}}>
                                        More Info
                                    </Button>
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
