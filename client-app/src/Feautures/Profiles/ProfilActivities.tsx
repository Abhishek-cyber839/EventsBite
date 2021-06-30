import { format } from "date-fns"
import { observer } from "mobx-react-lite"
import { SyntheticEvent, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardGroup, Image, Tab, TabProps } from "semantic-ui-react"
import { useStore } from "../../app/api/Stores/store"
import { UserActivity } from "../../app/models/ActivityParticipant"

const ProfilActivities = () => {
    const{ profileStore : {LoadProfileActivities,profile,userActivities} } = useStore()
    const panes = [
        {menuItem: 'Past Events',panes:{ key:'past'}},  
        {menuItem: 'Future Events',panes:{ key:'future'}},
        {menuItem: 'Hosting',panes:{ key:'hosting'}}
      ]

    useEffect(() => {
        LoadProfileActivities(profile!.userName)
    },[LoadProfileActivities,profile])

    const tabChange = (event:SyntheticEvent,data:TabProps) => {
        LoadProfileActivities(profile!.userName,panes[data.activeIndex as number].panes.key)
    }

    return(
        <>
         <Tab
             menu={{ secondary: true, pointing: true }}
             panes={panes}
             onTabChange={(e,data) => tabChange(e,data)}
             >
            <CardGroup itemsPerRow={4}>
                {
                    userActivities.map((activity:UserActivity) => (
                        <Card
                         key={activity.id}
                         as={Link}
                         to={`/activities/${activity.id}`}
                        >
                        <Image src={'assets/Activity.png'} wrapped ui={false} />
                        <Card.Content>
                        <Card.Header>{activity.title}</Card.Header>
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
         </Tab>
        </>
    )
}

export default observer(ProfilActivities)