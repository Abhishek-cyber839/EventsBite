import { Redirect, Route, RouteComponentProps,RouteProps} from "react-router-dom";
import { useStore } from "../api/Stores/store";

interface Props extends RouteProps{
    component:React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
}

// ...rest to pass rest of the properties inside Props
const PrivateRoute = ({component:Component,...rest}:Props) => {
    const { userStore : {IsLoggedIn}} = useStore();
    return(
        <Route
         {...rest}
         render={(props) => IsLoggedIn ? <Component {...props}/> : <Redirect to='/' /> }
         />
    )
}

export default PrivateRoute;