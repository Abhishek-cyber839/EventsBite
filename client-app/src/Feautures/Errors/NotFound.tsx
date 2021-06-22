import { Segment,Header,Button,Container } from "semantic-ui-react";
import { Link } from "react-router-dom";
const NotFound = () => {
    return (
        <Segment textAlign='center' vertical> 
           <Container>
           <Header className='custom-font'>Oops couldn't find results for your search.</Header>
            <Button as={Link} to={'/activities'} size='large' color='black' className='custom-font'>
                    Back To Activities
            </Button>
           </Container>
        </Segment>
    )
}

export default NotFound;