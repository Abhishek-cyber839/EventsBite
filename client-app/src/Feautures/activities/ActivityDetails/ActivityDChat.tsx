import { Comment,Icon,Divider,Container } from "semantic-ui-react";
import { observer } from 'mobx-react-lite'

const ActivityChat = () => {
    return(
        <Container>
            <Divider />
            <b>Comments</b>
            <Comment.Group>
                <Comment>
                <Comment.Avatar as='a' src={'/assets/user.jpeg'} />
                <Comment.Content>
                    <Comment.Author>Tom Lukic</Comment.Author>
                    <Comment.Text>
                    This will be great for business reports. I will definitely download
                    this.
                    </Comment.Text>
                    <Comment.Actions>
                    <Comment.Action>Reply</Comment.Action>
                    <Comment.Action>Save</Comment.Action>
                    <Comment.Action>Hide</Comment.Action>
                    <Comment.Action>
                        <Icon name='expand' />
                        Full-screen
                    </Comment.Action>
                    </Comment.Actions>
                </Comment.Content>
                </Comment>
            </Comment.Group>
        </Container>
    )
}

export default observer(ActivityChat)