import { useState,useEffect } from "react"
import { Segment,Button,Container,Header} from "semantic-ui-react"
import { useStore } from "../../app/api/Stores/store";
import { observer } from 'mobx-react-lite';
import { Link,useHistory,useParams } from "react-router-dom";
import { LoadingComponent } from "../../app/layouts/LoadingComponent";
import { v4 as uuid } from 'uuid';
import { Formik,Form } from "formik";
import * as Yup from 'yup'
import CTextInput from "../../app/common/form/CTextInput";
import CTextArea from "../../app/common/form/CTextArea";
import CSelectInput from "../../app/common/form/CSelectInput";
import CDateInput from "../../app/common/form/CDateInput";
import { CatergoryOptions } from "../../app/common/form/CategoryOptions";
import { Activity } from "../../app/models/activity";

const AForm = () => {
    const { activityStore } = useStore();
    const { LoadActivity,InitialLoading, createActivity,updateActivity}  = activityStore
    let { id } = useParams<{id:string}>();
    let history = useHistory()

    // add <Activity> to remove error from setActivity inside useEffect so that it'll know what type of object.
    // Install date-fns so that we can format dates to string as we are passing Date object to browser which it won't display unless it is
    // a string.
    const [activity,setActivity] = useState<Activity>({
        id:'',
        title:'',
        date:null,
        description:'',
        category:'',
        city:'',
        venue:''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('Title must not be empty'),
        date:Yup.string().required('date must not be empty').nullable(),
        description:Yup.string().required('description must not be empty'),
        category:Yup.string().required('category must not be empty'),
        city:Yup.string().required('city must not be empty'),
        venue:Yup.string().required('venue must not be empty')
    })

    useEffect(() => {
        if(id) LoadActivity(id).then((activity) => setActivity(activity!))
    },[id,LoadActivity])


    const handleSubmit = (activity:Activity) => {
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

    // const handleChange = (event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const {name, value} = event.target;
    //     setActivity({...activity,[name]:value})
    // }

    if(InitialLoading) return (<LoadingComponent content='Editing or Creating Activity....'/>)

    return (
        <Container>
            <Header className='custom-font' as='h2'>Manage Your Events</Header>
            <Segment clearing>
                <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={activity} 
                onSubmit={(values) =>handleSubmit(values)}>
                    {({handleSubmit, isValid,isSubmitting,dirty}) => (
                        <Form className='ui form custom-font' onSubmit={handleSubmit}>
                            <Header size='small' className='custom-font'>ACTIVITY DETAILS</Header>
                            <CTextInput name='title' placeholder='Title'/>
                            <CTextArea rows={3} placeholder='Description' name='description'/>
                            <CSelectInput options={CatergoryOptions} placeholder='Select your Category'  name='category'/>
                            <CDateInput 
                                placeholderText='Date'
                                showTimeSelect
                                timeCaption='time'
                                dateFormat='MMMM d, yyyy h:mm aa'
                                name='date'
                            />
                            <Header size='small' className='custom-font'>LOCATION DETAILS</Header>
                            <CTextInput placeholder='City' name='city'/>
                            <CTextInput placeholder='Venue' name='venue'/>
                            <Button disabled={isSubmitting || !dirty || !isValid}
                            className='custom-font' loading={activityStore.Loading} floated='right' positive type='submit'>Submit</Button>
                            <Button as={Link} className='custom-font' to={'/activities/'} floated='right' type='button'>Cancel</Button>
                    </Form>
                    )}
                </Formik>
            </Segment>
        </Container>
    )
}

export default observer(AForm)