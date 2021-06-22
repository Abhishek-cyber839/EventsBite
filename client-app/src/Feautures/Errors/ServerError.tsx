import { useStore } from "../../app/api/Stores/store";
import { Header,Container,Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

const ServerError = () => {
    const { commonStore } = useStore();
    return (
        <Container textAlign='center'>
            <Header as='h1' className='custom-font'>Server Error</Header>
            <Header as='h5' className='custom-font'>{commonStore.error?.message}</Header>
            {
                commonStore.error?.details &&
                <Segment>
                    <Header as='h4' className='custom-font'>Stack Trace</Header>
                    <code style={{ marginTop:'10px' }} className='custom-font'>{commonStore.error.details}</code>
                </Segment>
            }
        </Container>
    )
}

export default observer(ServerError);