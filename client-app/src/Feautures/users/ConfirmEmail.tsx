import { useEffect, useState } from "react";
import { Header, Segment,Icon, Button } from "semantic-ui-react";
import Agent from "../../app/api/agent";
import { useStore } from "../../app/api/Stores/store";
import UseQuery from "../../app/common/hooks";
import LoginForm from "./LoginForm";

const ConfirmEmail = () => {
    const { modalStore } = useStore();
    const email = UseQuery().get('email') as string
    const token = UseQuery().get('token') as string
    const Status = {
        Verifying:'Verifying',
        Failed:'Failed',
        Success:"Success"
    }
    const [status,setstatus] = useState(Status.Verifying);


    const resendEmail = () => Agent.Account.resendVerificationEmail(email)
                        .then(() => console.log("Email is verified by the user....."))
                        .catch((error) => console.log(error));

    const Body = () => {
        switch(status){
            case Status.Failed:
                 return (
                  <> 
                    <p className='custom-font'>Unable to verify your email please try again or check your email if you've entered it correctly.</p> 
                    <Button basic color='grey' content='Resend Email' className='custom-font' onClick={resendEmail}/> 
                  </>
                  )
            case Status.Verifying:
                 return <p className='custom-font'>Please wait while we verify your email.......</p>
            case Status.Success:
                 return(
                      <>
                        <p className='custom-font'>Your email is verified and you can now successfully login..</p> 
                        <Button basic color='grey' content='LogIn' className='custom-font' onClick={() => modalStore.OpenModal(<LoginForm/>)}/> 
                      </>                 
                     )
        }
    }

    useEffect(() => {
        Agent.Account.verifyEmail(token,email).then(() => setstatus(Status.Success)).catch(() => setstatus(Status.Failed))
    },[Status.Failed,Status.Success,email,token]);


    return (
        <>
          <Segment textAlign='center' placeholder>
              <Header icon as='h3' className='custom-font'><Icon name='envelope'/>Email Verification.</Header>
              <Segment.Inline>{Body}</Segment.Inline>
          </Segment>
        </>
    )
}

export default ConfirmEmail;