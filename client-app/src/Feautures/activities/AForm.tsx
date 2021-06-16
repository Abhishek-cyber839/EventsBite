import { ChangeEvent, useState } from "react"
import { Segment,Form,Button } from "semantic-ui-react"
import { useStore } from "../../app/api/Stores/store";
import { observer } from 'mobx-react-lite';

export default observer(function AForm(){
    const { activityStore } = useStore();

    // let Editing:boolean = activityStore.currentActivity ? true : false

    const InitialActivity = activityStore.currentActivity ?? {
        id:'',
        title:'',
        date:'',
        description:'',
        category:'',
        city:'',
        venue:''
    }

    const [newActivity,setnewActivity] = useState(InitialActivity);

    const handleSubmit = async () => {
        newActivity.id ? activityStore.updateActivity(newActivity) : activityStore.createActivity(newActivity) 
        // activityStore.submitting = true
        // if(activityStore.editing){ 
        //     await activityStore.updateActivity(newActivity)
        //     activityStore.editing = false;
        //     activityStore.submitting = false
        //     activityStore.CloseForm()
        //  }
        // else { 
        //     await activityStore.createActivity(newActivity) 
        //     activityStore.submitting = false
        //     activityStore.CloseForm()
        // }
    }
    const handleChange = (event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setnewActivity({...newActivity,[name]:value})
    }

    return (
        <Segment>
            <Form onSubmit={() => handleSubmit()} >
                <Form.Input placeholder='Title' value={newActivity.title} name='title' onChange={handleChange}/>
                <Form.TextArea placeholder='Description' value={newActivity.description} name='description' onChange={handleChange}/>
                <Form.Input placeholder='Category' value={newActivity.category} name='category' onChange={ handleChange}/>
                <Form.Input placeholder='Date' type='date' value={newActivity.date} name='date' onChange={handleChange}/>
                <Form.Input placeholder='City' value={newActivity.city} name='city' onChange={handleChange}/>
                <Form.Input placeholder='Venue' value={newActivity.venue} name='venue' onChange={handleChange}/>
                <Button loading={activityStore.submitting} floated='right' positive type='submit'>Submit</Button>
                <Button onClick={() => activityStore.CloseForm()} floated='right' type='button'>Cancel</Button>
            </Form>
    </Segment>
    )
})