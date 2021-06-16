import {Dimmer,Loader} from 'semantic-ui-react';

interface Prop{
    inverted?:boolean, /** For darker background */
    content:string
}

export const LoadingComponent = ({inverted=true,content}:Prop) => {
    return (
        <Dimmer active={true} inverted={inverted}>
            <Loader>{content}</Loader>
        </Dimmer>
    )
};