import { ChangeEvent, useState,useEffect } from "react"
import { Segment,Form,Button,Container,Header } from "semantic-ui-react"
import { useStore } from "../../app/api/Stores/store";
import { observer } from 'mobx-react-lite';
import { Link,useHistory,useParams } from "react-router-dom";
import { LoadingComponent } from "../../app/layouts/LoadingComponent";
import { v4 as uuid } from 'uuid';

const AForm = () => {
    const { activityStore } = useStore();
    const { LoadActivity,InitialLoading, createActivity,updateActivity}  = activityStore
    let { id } = useParams<{id:string}>();
    let history = useHistory()

    const [activity,setActivity] = useState({
        id:'',
        title:'',
        date:'',
        description:'',
        category:'',
        city:'',
        venue:''
    });

    useEffect(() => {
        if(id) LoadActivity(id).then((activity) => setActivity(activity!))
    },[id,LoadActivity])


    const handleSubmit = () => {
        if(activity.id.length === 0){
            let newActivity = {
                ...activity,id:uuid()
            }
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
        }
        else{
            console.log("Updating activity.....")
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
        }
    }

    const handleChange = (event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setActivity({...activity,[name]:value})
    }

    if(InitialLoading) return (<LoadingComponent content='Editing or Creating Activity....'/>)

    return (
        <Container>
            <Header className='custom-font' as='h2'>Manage Your Events</Header>
            <Segment clearing>
                <Form onSubmit={handleSubmit}>
                    <Form.Input placeholder='Title' className='custom-font' value={activity.title} name='title' onChange={handleChange}/>
                    <Form.TextArea placeholder='Description' className='custom-font'value={activity.description} name='description' onChange={handleChange}/>
                    <Form.Input placeholder='Category' className='custom-font'value={activity.category} name='category' onChange={ handleChange}/>
                    <Form.Input placeholder='Date' className='custom-font'type='date' value={activity.date} name='date' onChange={handleChange}/>
                    <Form.Input placeholder='City' className='custom-font'value={activity.city} name='city' onChange={handleChange}/>
                    <Form.Input placeholder='Venue' className='custom-font'value={activity.venue} name='venue' onChange={handleChange}/>
                    <Button className='custom-font' loading={activityStore.Loading} floated='right' positive type='submit'>Submit</Button>
                    <Button as={Link} className='custom-font' to={'/activities/'} floated='right' type='button'>Cancel</Button>
                </Form>
            </Segment>
        </Container>
    )
}

export default observer(AForm)