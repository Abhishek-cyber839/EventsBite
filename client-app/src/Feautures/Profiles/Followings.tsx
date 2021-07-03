import { observer } from "mobx-react-lite"
import { useStore } from "../../app/api/Stores/store"
import { Card,Button,Image,Header } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default observer(function Followings(){
    const { profileStore } = useStore();
    const { followings } = profileStore;
    
    return (
        <div> 
            <Card.Group itemsPerRow={3}>
            { followings.length > 0 ? followings.map(profile => (
                    <Card
                    key={profile.userName}
                    >
                    <>
                            <Image src={profile.image ||  '/assets/user.jpeg'}/>
                            <Card.Content>
                                <Card.Header className='custom-font'>{profile.displayName}</Card.Header>
                                <Card.Meta>
                                    <span className='date'>Joined in 2015</span>
                                </Card.Meta>
                                <Card.Description>
                                    {profile.bio ? profile.bio : profile.displayName+' is a musician living in Nashville.'}
                                </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                <p> {profile.followersCount} Followers </p>
                            </Card.Content>
                            <Button
                                as={Link}
                                to={`/profiles/${profile.userName}`}
                                basic
                                style = {{ marginTop:5 }}
                                color = 'orange'
                                content = 'View profile'/>
                        </>
                    </Card>
                 )) :
            <div>
             <Header 
                  as='h5'
                  className='custom-font' 
                  style = {{ margin:10 }} 
                  textAlign='center' 
                  content={`You do not have any ${profileStore.ActiveTab === 4 ?  'followings':'followers'} to show`}/>
            </div>
        }
        </Card.Group>
     </div>
    )
})

// export default observer(Followings)