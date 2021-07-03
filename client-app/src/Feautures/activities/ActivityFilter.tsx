//  import '../../app/layouts/index.css'
 import { Menu,Header } from "semantic-ui-react";
 import Calendar from "react-calendar";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/api/Stores/store";

const ActivityFilter = () => {
    const { activityStore:{predicate,setPredicate} } = useStore();
     return(
         <>
         <Menu vertical size='large' style={{ width:'100%',marginTop:25 }}>
             <Header className='custom-font' icon='search' attached content='Lookup'/>
             <Menu.Item 
              className='custom-font' 
              content="Events I'm Attending"
              active={predicate.has('isGoing')}
              onClick={() => setPredicate('isGoing','true')}
              />
             <Menu.Item 
              className='custom-font' 
              content="Events I'm Hosting"
              active={predicate.has('isHosting')}
              onClick={() => setPredicate('isHosting','true')}
              />
             <Menu.Item 
              className='custom-font'
              content="All Events"
              active={predicate.has('all')}
              onClick={() => setPredicate('all','true')}
              />
         </Menu>
         <Header className='custom-font' as='h5' textAlign='center' style={{ margin:30 }} content='Simply Filter By Date'/>
         <Calendar
          className='custom-font'
          onChange={(date) => setPredicate('startDate',date as Date)}
          value={predicate.get('startDate') || new Date()}

         />
         </>
     )
 }

 export default observer(ActivityFilter)