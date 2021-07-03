import { Formik ,Form,ErrorMessage} from "formik";
import CTextInput from "../../app/common/form/CTextInput";
import { Button,Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/api/Stores/store";
import * as Yup from 'yup'
import ValidationErrors from '../Errors/ValidationErrors'

const RegisterForm = () => {
    const { userStore } = useStore();
    const validations = {
        displayName: Yup.string().required(),
        userName: Yup.string().required(),
        email: Yup.string().required().email(),
        password: Yup.string().required(),
    }
    return(
            <Formik
            initialValues={{ email:'',password:'',displayName:'',userName:'',error:null}}
            onSubmit={(values,{setErrors}) => userStore.Register(values).catch(error => setErrors({error}))}
            validationSchema={Yup.object(validations)}
            >
                {({handleSubmit, isSubmitting,errors,isValid,dirty}) => (
                    <Form className='ui form error' onSubmit={handleSubmit}>
                        <Header content='Sign Up To View Latest Events' textAlign='center' as='h5' className='custom-font'/>
                        <CTextInput name='email' placeholder='Email'/>
                        <CTextInput name='displayName' placeholder='Display Name'/>
                        <CTextInput name='userName' placeholder='User Name'/>
                        <CTextInput name='password' placeholder='Password' type='password'/>
                        <ErrorMessage
                          name='error'
                          render={() => <ValidationErrors errors={errors.error}/>}
                        />
                        <Button disabled={!isValid || !dirty || isSubmitting} loading={isSubmitting}
                         basic color='grey' content='REGISTER' type='submit' fluid/>
                    </Form>
                )}
            </Formik>
    )
}

export default observer(RegisterForm);