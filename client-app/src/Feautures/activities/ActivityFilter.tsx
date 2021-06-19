//  import '../../app/layouts/index.css'
 import { Menu,Header } from "semantic-ui-react";
 import Calendar from "react-calendar";

 export const ActivityFilter = () => {
     return(
         <>
         <Menu vertical size='large' style={{ width:'100%',marginTop:25 }}>
             <Header className='custom-font' icon='filter' attached content='Filter'/>
             <Menu.Item className='custom-font' content="I'm going"/>
             <Menu.Item className='custom-font' content="I'm going"/>
             <Menu.Item className='custom-font' content="I'm going"/>
             <Menu.Item className='custom-font' content="I'm going"/>
             <Menu.Item className='custom-font' content="I'm going"/>
         </Menu>
         <Calendar/>
         </>
     )
 }
