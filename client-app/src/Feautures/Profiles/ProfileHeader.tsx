import { Grid,List, Item, ItemGroup,Header,Card,Button,Image,Feed,Icon } from "semantic-ui-react";
import { Profile } from "../../app/models/ActivityParticipant";
import ProfileContent from "./ProfileContent";
import {observer} from 'mobx-react-lite';
import { store, useStore } from "../../app/api/Stores/store";

interface Props{
    profile:Profile
}
const ProfileHeader = ({profile}:Props) => {
    const user = store.userStore.user;
    const { profileStore } = useStore();
    const toggleFollow = () => {
        profile.following ? profileStore.updateFollowing(profile.userName,false) : profileStore.updateFollowing(profile.userName,true)
    }
    const BackgroundStyle = {
        position: 'absolute',
        top: '5%',
        left: '10%',
        width: '100%',
        height: 'auto',
        border:'none' 
    };
    const whiteText = {
        color:'white'
    }
    const marginStyle = {
        marginBottom:20,
        marginTop:10,
        color:'white'
    }
    return(
        <>
            <Grid  style={{ marginTop:10,marginBottom:10 }}>
                <Grid.Column width={11} >
                    <> 
                    <Image src={'/assets/background.jpeg'} fluid style={{ border:'none',height:'300px' }}/>
                    <ItemGroup style={BackgroundStyle}>
                        <Item>
                            <Item.Image avatar size='small' src={profile.image || '/assets/user.jpeg'}/>
                            <Item.Content verticalAlign='middle' style={whiteText}> 
                                <Header as='h1' className='custom-font' style={marginStyle}> {profile.displayName} </Header>
                                <p style={whiteText}><Icon name='envelope' />{profile.displayName}@gmail.com</p>
                                <p style={whiteText}><Icon name='phone' />Not Available</p>
                                <p style={whiteText}><Icon name='calendar alternate' />20 - 07 - 1961</p>
                                <p style={whiteText}><Icon name='clipboard' />20 Events</p>
                                <List horizontal>
                                    <List.Item>
                                       <p style={whiteText}><Icon name='user' />{profile.followersCount > 1 ? profile.followersCount+
                                       ' Followers' : profile.followersCount + ' Follower'}</p>
                                    </List.Item>
                                    <List.Item>
                                       <p style={whiteText}><Icon name='user' />{profile.followingCount > 1 ? profile.followingCount+ 
                                       ' Followings' : profile.followingCount + ' Following'}</p>
                                    </List.Item>
                                    <List.Item>
                                       <p style={whiteText}><Icon name='user circle' /> 300 Suggestions</p>
                                    </List.Item>
                                </List>
                                {
                                    profile.userName !== user?.userName && 
                                    <Button 
                                    onClick={() => toggleFollow()}
                                    fluid
                                    color='blue'
                                    content= { profile.following ? 'Un Follow' : 'Follow'}
                                    className='custom-font'
                                    style={{backgroundColor:'none',paddingLeft:15,paddingRight:15,width:'50%'}}
                                   />
                                }
                            </Item.Content>
                        </Item>
                    </ItemGroup>
                    </>
                    
                    <ProfileContent profile={profile}/>
                </Grid.Column>
                <Grid.Column width={5}>
                     <Card style={{ width:'auto' }}>
                        <Card.Content>
                        <Card.Header className='custom-font'>People you may know</Card.Header>
                        </Card.Content>
                        <Card.Content>
                        <Feed>
                        <Feed.Event>
                            <Feed.Label image='/assets/user.jpeg' />
                            <Feed.Content>
                            <Feed.Summary content='Mary Jane' className='bold-font'/>
                                <Feed.Summary  ><Icon name='clipboard'/>
                                 Hosted 120 Events so far
                                </Feed.Summary>
                                <List horizontal style={{ marginBottom:5 }}>
                                    <List.Item>
                                       <p ><Icon name='handshake' /> 60 Friends</p>
                                    </List.Item>
                                    <List.Item>
                                       <p ><Icon name='user' /> 178 Following</p>
                                    </List.Item>
                                </List>
                                <div className='ui two buttons'>
                                    <Button basic color='blue' size='tiny' style={{ marginRight:4}} content='Send Request'/>
                                    <Button basic color='blue' content='See Profile'/>
                                </div>
                                
                            </Feed.Content>
                            </Feed.Event>

                            <Feed.Event>
                            <Feed.Label image='/assets/user.jpeg' />
                            <Feed.Content>
                            <Feed.Summary content='Bob Lame' className='bold-font'/>
                                <Feed.Summary ><Icon name='clipboard'/>
                                 Hosted 160 Events so far
                                </Feed.Summary>
                                <List horizontal style={{ marginBottom:5 }}>
                                    <List.Item>
                                       <p ><Icon name='handshake' /> 220 Friends</p>
                                    </List.Item>
                                    <List.Item>
                                       <p ><Icon name='user' /> 20 Following</p>
                                    </List.Item>
                                </List>
                                <div className='ui two buttons'>
                                    <Button basic color='blue' size='tiny' style={{ marginRight:4}} content='Send Request'/>
                                    <Button basic color='blue' content='See Profile'/>
                                </div>
                            </Feed.Content>
                            </Feed.Event>

                            <Feed.Event>
                            <Feed.Label image='/assets/user.jpeg' />
                            <Feed.Content>
                                <Feed.Summary content='Tom Henwick' className='bold-font'/>
                                <Feed.Summary ><Icon name='clipboard'/>
                                 Hosted 100 Events so far
                                </Feed.Summary>
                                <List horizontal style={{ marginBottom:5 }}>
                                    <List.Item>
                                       <p ><Icon name='handshake' /> 50 Friends</p>
                                    </List.Item>
                                    <List.Item>
                                       <p ><Icon name='user' /> 20 Following</p>
                                    </List.Item>
                                </List>
                                <div className='ui two buttons'>
                                    <Button basic color='blue' size='tiny' style={{ marginRight:4}} content='Send Request'/>
                                    <Button basic color='blue' content='See Profile'/>
                                </div>
                            </Feed.Content>
                            </Feed.Event>
                        </Feed>
                        </Card.Content>
                    </Card>
                     
                    <Card>
                        <Card.Content>
                        <Card.Header className='custom-font'>Recent Activity</Card.Header>
                        </Card.Content>
                        <Card.Content>
                        <Feed>
                            <Feed.Event>
                            <Feed.Label image='/assets/user.jpeg' />
                            <Feed.Content>
                                <Feed.Date content='1 day ago' />
                                <Feed.Summary>
                                You added Jenny Hessto your coworker group.
                                </Feed.Summary>
                            </Feed.Content>
                            </Feed.Event>

                            <Feed.Event>
                            <Feed.Label image='/assets/user.jpeg' />
                            <Feed.Content>
                                <Feed.Date content='3 days ago' />
                                <Feed.Summary>
                                You added Molly Maloneas a friend.
                                </Feed.Summary>
                            </Feed.Content>
                            </Feed.Event>

                            <Feed.Event>
                            <Feed.Label image='/assets/user.jpeg' />
                            <Feed.Content>
                                <Feed.Date content='4 days ago' />
                                <Feed.Summary>
                                You added Elliot Baker to your musicians group.
                                </Feed.Summary>
                            </Feed.Content>
                            </Feed.Event>
                        </Feed>
                        </Card.Content>
                        </Card>
                </Grid.Column>
            </Grid>
        </>
    )
}

export default observer(ProfileHeader);

/*
 <Card.Group >
     <Card className='custom-font' style={{ paddingTop:5,paddingBottom:5,paddingLeft:5,paddingRight:6}}>
          <Image src='/assets/user.jpeg' />
                            <Card.Content>
                            <Card.Header className='custom-font'>Helen</Card.Header>
                            <Card.Meta>Joined in 2018</Card.Meta>
                            <Card.Description>Primary Contact</Card.Description>
                            </Card.Content>
                            <div className='ui two buttons'>
                                <Button basic color='black' style={{ marginRight:4}} content='Send Request'/>
                                <Button basic color='black' content='See Profile'/>
                           </div>
     </Card>  
</Card.Group>

*/