import { Menu,Container,Button,Image,Dropdown} from "semantic-ui-react";
import { NavLink,Link } from "react-router-dom";
import { useStore } from '../../app/api/Stores/store'
import { observer } from "mobx-react-lite";

const NavBar = () => {
    const { userStore } = useStore();
    const { user ,LogOut } = userStore;
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
               <Menu.Item position='right'>
                   <Image src={user?.image || '/assets/user.jpeg'} avatar spaced='right'/>
                   <Dropdown 
                      pointing='top left'
                      text={user?.displayName}
                   >
                       <Dropdown.Menu>
                        <Dropdown.Item as={Link} to={`/profile/${user?.userName}`} text='Profile' icon='user'/>
                        <Dropdown.Item onClick={LogOut} text='Log Out' icon='power'/>
                       </Dropdown.Menu>
                   </Dropdown>
               </Menu.Item>
            </Container>
        </Menu>
    )
} 

export default observer(NavBar)