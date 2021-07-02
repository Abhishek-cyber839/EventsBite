import {Segment,Header,Container,Button, Divider} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../app/api/Stores/store'
import LoginForm from '../users/LoginForm'
import RegisterForm from '../users/RegisterForm'

const Home = () => {
    const { userStore ,modalStore } = useStore();
    return(
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <h3 className='custom-font'>
                Take a  tour of EventsBite
                </h3>
                { userStore.IsLoggedIn ?  
                (
                  <> 
                    <Header as='h2' inverted className='custom-font' content='See for more details'/>
                    <Button as={Link} to={'/activities'} size='large' basic inverted color='black' className='custom-font'>
                      Take Me To Activities
                    </Button>
                  </>  
                  ) : ( 
                    <> 
                      <Button onClick={() => modalStore.OpenModal(<LoginForm/>)} size='small' basic inverted color='black' className='custom-font'>
                        LOG ME IN
                      </Button>
                      <Button onClick={() => modalStore.OpenModal(<RegisterForm/>)} size='small' basic inverted color='black' className='custom-font'>
                        REGISTER
                      </Button>
                      <Divider horizontal inverted>OR</Divider>
                      <Button onClick={() => userStore.FacebookLogin()}
                              basic 
                              inverted 
                              size='large'
                              color='facebook' 
                              className='custom-font'>
                        FACEBOOK LOGIN
                      </Button>
                    </>
                )
                }
            </Container>
        </Segment>
    )
}


export default observer(Home)