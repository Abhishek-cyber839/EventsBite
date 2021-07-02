import {Segment,Header,Container,Button, Divider, Image} from 'semantic-ui-react'
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
                <Image verticalAlign='middle' circular src='/assets/custom.png' />
                { userStore.IsLoggedIn ?  
                (
                  <> 
                     <h4 className='custom-font'>
                      Take a  tour of EventsBite
                     </h4>
                    <Header as='h5' inverted className='custom-font' content='Managing your own events has now become even more simpler'/>
                    <Button as={Link} to={'/activities'} size='large' basic inverted color='black' className='custom-font'>
                      Take Me To Events
                    </Button>
                  </>  
                  ) : ( 
                    <> 
                      <Header as='h3' inverted className='custom-font' content='Take A Tour'/>
                      <Button onClick={() => modalStore.OpenModal(<LoginForm/>)} size='small' basic inverted color='black' className='custom-font'>
                        LOG ME IN
                      </Button>
                      <Button onClick={() => modalStore.OpenModal(<RegisterForm/>)} size='small' basic inverted color='black' className='custom-font'>
                        REGISTER
                      </Button>
                      <Divider horizontal inverted>OR</Divider>
                      <Button onClick={() => userStore.FacebookLogin()}
                              loading={userStore.fbLoading}
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