import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "semantic-ui-react";
import CTextArea from "../../app/common/form/CTextArea";
import CTextInput from "../../app/common/form/CTextInput";
import * as Yup from 'yup';
import { useStore } from "../../app/api/Stores/store";


interface Props {
      setEditMode: (editMode: boolean) => void;
}

const EditProfile = ({setEditMode}:Props) => {
    const {profileStore: {profile, updateProfile}} = useStore();

    return (
        <Formik
         initialValues={{displayName: profile?.displayName, bio:profile?.bio}}
         onSubmit={values => { updateProfile(values).then(() => {setEditMode(false);}) }}
         validationSchema={Yup.object({displayName: Yup.string().required()})}
        >
            {({isSubmitting, isValid, dirty}) => (
                  <Form className='ui form'>
                        <CTextInput placeholder='Display Name'name='displayName'/>
                        <CTextArea rows={3} placeholder='Add your bio' name='bio'/> 
                        <Button
                          positive
                          type='submit'
                          loading={isSubmitting}
                          content='Update profile'
                          floated='right'
                          disabled={!isValid || !dirty}
                        />
                    </Form>
            )}
        </Formik>
    )
}

export default observer(EditProfile);