import { Comment,Divider,Container, Loader } from "semantic-ui-react";
import { observer } from 'mobx-react-lite'
import { useStore } from "../../../app/api/Stores/store";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik,Form, Field,FieldProps } from "formik";
import *  as Yup from 'yup'
import { formatDistanceToNow } from "date-fns";

interface Props{
    activityId:string
}

const ActivityChat = ({activityId}:Props) => {
    const { commentStore }  = useStore();
    useEffect(() => {
        if(activityId)
           commentStore.createConnection(activityId)
        return () => commentStore.clearComments();
    },[commentStore,activityId])
    return(
        <Container style={{ marginBottom:20 }}>
            <Divider />
            <b>Comments</b>
            <Comment.Group>
                { commentStore.comments.map(comment  => (
                    <Comment key={comment.id}>
                        <Comment.Avatar src={comment.image|| '/assets/user.jpeg'} />
                        <Comment.Content>
                            <Comment.Author as={Link} to={`/profiles/${comment.userName}`}>{ comment.displayName }</Comment.Author>
                            <Comment.Text style={{ whiteSpace:'pre-wrap' }}>{comment.body}</Comment.Text>
                            <Comment.Metadata>{formatDistanceToNow(comment.createdAt) }</Comment.Metadata>
                        </Comment.Content>
                    </Comment>
                )) }
                <Comment>
                <Comment.Avatar as='a' src={'/assets/user.jpeg'} />
                <Comment.Content>
                    <Comment.Author>Tom Lukic</Comment.Author>
                    <Comment.Text>
                    This will be great for business reports. I will definitely download
                    this.
                    </Comment.Text>
                    <Comment.Metadata>2 days ago</Comment.Metadata>
                </Comment.Content>
                </Comment>
            </Comment.Group>
            <Formik
             onSubmit={(values,{resetForm}) => commentStore.addComment(values).then(() => resetForm())}
             initialValues = {{ body:'' }}
             validationSchema={
                 Yup.object({
                     body:Yup.string().required()
                 })
             }
            >
                {({isSubmitting,isValid,handleSubmit}) => (
                    <Form className='ui form'>
                        <Field name='body'>{ (props:FieldProps) => (
                            <div style={{position:'relative'}}>
                                <Loader active={isSubmitting}/>
                                <textarea 
                                className='custom-font'
                                placeholder='Post your comments here... Shift + Enter for new Line'
                                rows={2}
                                {...props.field}
                                onKeyPress={(e) => {
                                    if(e.key === 'Enter' && e.shiftKey)
                                       return
                                    if(e.key === 'Enter' && !e.shiftKey){
                                       e.preventDefault()
                                       isValid && handleSubmit()
                                    }
                                }}
                                />
                            </div>
                        )} 
                     </Field>
                    </Form>
               )}
            </Formik>
        </Container>
    )
}

export default observer(ActivityChat)