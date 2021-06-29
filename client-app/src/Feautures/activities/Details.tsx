import { useEffect } from "react";
import { useStore } from "../../app/api/Stores/store";
import { useParams } from "react-router-dom";
import { LoadingComponent } from "../../app/layouts/LoadingComponent";
import { observer } from "mobx-react-lite";
import ActivityHeader from "./ActivityDetails/ActivityDHeader";
import ActivityDescription from "./ActivityDetails/ActivityDescription";
import ActivityChat from "./ActivityDetails/ActivityDChat";
import ActivitySideBar from "./ActivityDetails/ActivityDSidebar";
import { Grid } from "semantic-ui-react";

const Details = () => {
    const { activityStore } = useStore();
    const { LoadActivity,InitialLoading,currentActivity,clearCurrentActivity }  = activityStore
    let { id } = useParams<{id:string}>();

    useEffect(() => {
        if(id) LoadActivity(id)
        return () => clearCurrentActivity();
    },[id,LoadActivity,clearCurrentActivity])

    if(InitialLoading || !currentActivity) return (<LoadingComponent content='Loading Details....'/>)

    return (
        <Grid>
            <Grid.Column width='10'>
               <ActivityHeader activity={activityStore.currentActivity!}/>
               <ActivityDescription/>
               <ActivityChat activityId={activityStore.currentActivity!.id}/>
            </Grid.Column>
            <Grid.Column width='6'>
               <ActivitySideBar activity={activityStore.currentActivity!}/>
            </Grid.Column>
        </Grid>
    )
}

export default observer(Details)

/* 
<Card fluid>
    <Image src='/assets/web-logos_26.jpg' wrapped ui={false} />
    <Card.Content>
    <Card.Header>{activityStore.currentActivity?.title}</Card.Header>
    <Card.Meta>{activityStore.currentActivity?.date}</Card.Meta>
    <Card.Description>{activityStore.currentActivity?.description}</Card.Description>
    <Container style={{ marginTop: 10}}>
        <Card.Meta>Category: {activityStore.currentActivity?.category}</Card.Meta>
        <Card.Meta>Where: {activityStore.currentActivity?.city}</Card.Meta> 
        <Card.Meta>Veneue: {activityStore.currentActivity?.venue}</Card.Meta>
        <Button as={Link} to={'/activities/'} basic color='blue' style={{ marginTop: 12}}>Cancel</Button>
    </Container>
    </Card.Content>
</Card> */