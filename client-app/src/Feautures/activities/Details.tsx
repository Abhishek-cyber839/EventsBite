import React from "react";
import { Card,Button,Image,Container} from "semantic-ui-react";
import { useStore } from "../../app/api/Stores/store";

export const Details = () => {
    const { activityStore } = useStore();
    return (
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
                <Button onClick={() => activityStore.handleCancel()} basic color='blue' style={{ marginTop: 12}}>Cancel</Button>
            </Container>
            </Card.Content>
        </Card>
    )
}