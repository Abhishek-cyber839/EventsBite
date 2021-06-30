import { format } from "date-fns"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Button, Card, CardGroup, Header, Image} from "semantic-ui-react"
import { useStore } from "../../app/api/Stores/store"
import { UserActivity } from "../../app/models/ActivityParticipant"

const ProfilActivities = () => {
    const{ profileStore : {LoadProfileActivities,profile,userActivities,predicate,setPredicate} } = useStore()

    useEffect(() => {
        LoadProfileActivities(profile!.userName)
    },[LoadProfileActivities,profile,predicate])

    return(
        <>
           <div style={{ marginTop:25 }}> 
           <div >
                <Button onClick={() => setPredicate('past')}
                   basic color='grey' style={{ marginRight:5 }} content='Past Events'/>                                  
                <Button onClick={() => setPredicate('future')}
                   basic color='grey' style={{ marginRight:5 }} content='Upcoming Events'/> 
                <Button onClick={() => setPredicate('hosting')}
                   basic color='grey' style={{ marginRight:5 }} content='Hosting Events'/>                                 
            </div>
           </div> 
           <Header 
                  as='h5'
                  className='custom-font' 
                  style = {{ margin:10 }} 
                  textAlign='center' 
                  content= { userActivities.length > 0 ? 'View an event for more details' : 'No events to show'}/>
          <CardGroup itemsPerRow={4}>
             {
              userActivities.map((activity:UserActivity) => (
                <Card
                key={activity.id}
                as={Link}
                to={`/activities/${activity.id}`}
                >
                <Image src={'/assets/background.jpeg'} wrapped ui={false} />
                <Card.Content>
                <Card.Header className='custom-font'>{activity.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>{format(new Date(activity.date),'do LLL')}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.category}
                </Card.Description>
                </Card.Content>
            </Card>
            )) 
        }
        </CardGroup>
        </>
    )
}

export default observer(ProfilActivities)
