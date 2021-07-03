import { Formik ,Form,ErrorMessage} from "formik";
import CTextInput from "../../app/common/form/CTextInput";
import { Button ,Label,Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/api/Stores/store";

const LoginForm = () => {
    const { userStore } = useStore();
    return(
            <Formik
            initialValues={{ email:'',password:'',error:null}}
            onSubmit={(values,{setErrors}) => userStore.LogIn(values).catch(error => setErrors({error:error.response.data})) }
            >
                {({handleSubmit, isSubmitting,errors}) => (
                    <Form className='ui form' onSubmit={handleSubmit}>
                        <Header content='LogIn To View Latest Events' textAlign='center' as='h5' className='custom-font'/>
                        <CTextInput name='email' placeholder='Email'/>
                        <CTextInput name='password' placeholder='Password' type='password'/>
                        <ErrorMessage
                          name='error'
                          render={() => <Label style={{ marginBottom:10 }} pointing >{errors.error}</Label>}
                        />
                        <Button loading={isSubmitting} basic color='grey' content='LOG IN' type='submit' fluid/>
                    </Form>
                )}
            </Formik>
    )
}

export default observer(LoginForm);