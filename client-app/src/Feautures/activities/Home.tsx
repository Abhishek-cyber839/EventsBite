import {Segment,Header,Container,Button} from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default function Home(){
    return(
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <h1 className='custom-font'>
                Home Page
                </h1>
                <Header as='h2' inverted className='custom-font' content='Welcome'/>
                <Button as={Link} to={'/activities'} size='large' className='custom-font'>
                    Take Me To Activities
                </Button>
            </Container>
        </Segment>
    )
}