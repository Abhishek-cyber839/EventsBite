import { Fragment } from 'react';
import { Segment, Placeholder,Grid } from 'semantic-ui-react';

const ActivityPlaceholder = () => {
    return (
        <Fragment>
            <Grid columns={1} stackable>
            <Grid.Column>
            <Segment raised>
                <Placeholder>
                <Placeholder.Header image>
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                    <Placeholder.Line length='medium' />
                    <Placeholder.Line length='short' />
                </Placeholder.Paragraph>
                </Placeholder>
            </Segment>
            </Grid.Column>

            <Grid.Column>
            <Segment raised>
                <Placeholder>
                <Placeholder.Header image>
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                    <Placeholder.Line length='medium' />
                    <Placeholder.Line length='short' />
                </Placeholder.Paragraph>
                </Placeholder>
            </Segment>
            </Grid.Column>

            <Grid.Column>
            <Segment raised>
                <Placeholder>
                <Placeholder.Header image>
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                    <Placeholder.Line length='medium' />
                    <Placeholder.Line length='short' />
                </Placeholder.Paragraph>
                </Placeholder>
            </Segment>
            </Grid.Column>
        </Grid>
        </Fragment>
    );
};

export default ActivityPlaceholder;
