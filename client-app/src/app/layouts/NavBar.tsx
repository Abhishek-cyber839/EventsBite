import { Menu,Container,Button} from "semantic-ui-react";
import { NavLink } from "react-router-dom";

export const NavBar = () => {
    return(
        <Menu inverted fixed='top' style={{ marginDown:20}}> 
           <Container className='custom-font'>
               <Menu.Item header as={NavLink} exact to='/'>
                   <img src="/assets/Logo.png" alt="" style={{ marginRight:10 }}/>
                   Home
               </Menu.Item>
               <Menu.Item name="Activities" as={NavLink} to='/activities'/>
               <Menu.Item >
                   <Button as={NavLink} to='/createActivity' className='custom-font' positive content="Create Activity"/>
               </Menu.Item>
            </Container>
        </Menu>
    )
} 