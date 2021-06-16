import React from "react";
import { Menu,Container,Button } from "semantic-ui-react";
import { useStore } from "../api/Stores/store";

export const NavBar = () => {
    const { activityStore } = useStore();
    return(
        <Menu inverted fixed='top' style={{ marginDown:20}}> 
           <Container>
               <Menu.Item header>
                   <img src="/assets/web-logos_26.jpg" alt="" style={{ marginRight:10 }}/>
                   Activities
               </Menu.Item>
               <Menu.Item name="Try Now"/>
               <Menu.Item>
                   <Button onClick={() => activityStore.OpenForm()} positive content="Create Activity"/>
               </Menu.Item>
            </Container>
        </Menu>
    )
} 