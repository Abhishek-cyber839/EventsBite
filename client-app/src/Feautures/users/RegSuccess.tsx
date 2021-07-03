import { Header, Segment,Icon, Button } from "semantic-ui-react";
import Agent from "../../app/api/agent";
import UseQuery from "../../app/common/hooks";

const RegSuccess = () => {
    const email = UseQuery().get('email') as string
    const resendEmail = () => Agent.Account.resendVerificationEmail(email)
                        .then(() => console.log("Email is verified by the user....."))
                        .catch((error) => console.log(error))
    return (
        <>
          <Segment textAlign='center' placeholder>
              <Header icon as='h3' className='custom-font'><Icon name='check'/>You're now successfully regsitered with EventsBITE.</Header>
              <p className='custom-font'>Please check also your junk mail for verification email.</p>
              {
                  email && 
                  <>
                    <p>Didn't Received verification email.</p>
                    <Button basic color='grey' content='Resend Email' className='custom-font' onClick={resendEmail}/> 
                  </>
              }
          </Segment>
        </>
    )
}

export default RegSuccess;