import { Card,CardGroup,Button,Container,Grid } from "semantic-ui-react";
import { Details } from './Details';
import AForm from './AForm';
import { useStore } from "../../app/api/Stores/store";
import { observer } from "mobx-react-lite";

export default observer(function Dashboard(){
    const { activityStore } = useStore();
    return(
        <Grid>
            <Grid.Column width='10'>
                    <CardGroup style={{ marginTop: 50}}>
                        { activityStore.activities.map((activity:any) => (
                            <Card>
                                <Card.Content>
                                    <Card.Header>{activity.title}</Card.Header>
                                    <Card.Meta>{activity.date}</Card.Meta>
                                    <Card.Description>
                                            {activity.description}
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className='ui two buttons'>
                                        <Button onClick={() => activityStore.editActivity(activity.id)} basic color='green'>
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
                                    <Button onClick={() => activityStore.handleView(activity.id)} basic color='blue' style={{ marginTop: 12}}>
                                        More Info
                                    </Button>
                                </Container>
                                </Card.Content>
                            </Card>
                        ))
                        }           
                    </CardGroup>
            </Grid.Column>
            <Grid.Column width='6' style={{ marginTop: 50}}>
                {activityStore.currentActivity && <Details/>}
                {activityStore.openForm && <AForm />}
            </Grid.Column>
        </Grid>
    )
})
