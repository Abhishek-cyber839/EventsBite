import { Button, Card,Image } from "semantic-ui-react";
import { Photo, Profile } from "../../app/models/ActivityParticipant";
import {observer} from "mobx-react-lite";
import { useStore } from "../../app/api/Stores/store";
import { SyntheticEvent, useState } from "react";
import ImageUpload from "../../app/common/ImageUpload";

interface Props{
    profile:Profile
}
const ProfilePhotos = ({profile}:Props) => {
    const { profileStore } = useStore();
    const { IsCurrentUser ,uploadPhoto,Uploading,Loading,setMain,deletePhoto } = profileStore;
    const [addPhotoMode,setaddPhotoMode] = useState(false);
    const handlePhotoUpload = (file:Blob) => {
        uploadPhoto(file).then(() => setaddPhotoMode(false))
    }
    const [target,setTarget] = useState("")
    const handleSetMainPhoto = (photo:Photo,e:SyntheticEvent<HTMLButtonElement>) => {
        setTarget(e.currentTarget.name)
        setMain(photo)
    }

    const handledeletePhoto = (photo:Photo,e:SyntheticEvent<HTMLButtonElement>) => {
        setTarget(e.currentTarget.name)
        deletePhoto(photo)
    }
    return(
        <> 
           <Card.Group itemsPerRow={5}>
            { profile.photos?.map(photo => (
                <Card
                key={photo.id}
                >
                {
                    IsCurrentUser && 
                    <>
                        <Image src={photo.url ||  '/assets/user.jpeg'}/>
                        <Button.Group fluid widths={2}>
                                <Button
                                color = 'orange'
                                loading={Loading && target === photo.id+'set-main'} basic name={photo.id+'set-main'} disabled={photo.isMainPhoto} 
                                onClick={e => handleSetMainPhoto(photo,e)} icon='check'/>
                                <Button
                                basic color='red' loading={Loading && target === photo.id} disabled={photo.isMainPhoto} name={photo.id}
                                onClick={e => handledeletePhoto(photo,e)} icon='trash'/>
                        </Button.Group>
                     </>
                    
                }
                </Card>
            ))}
        </Card.Group>
        {
             addPhotoMode &&
             <ImageUpload uploadPhoto={handlePhotoUpload} uploading={Uploading}/>
         }
         {
             IsCurrentUser && 
             <Button
              basic color='blue' onClick={() => setaddPhotoMode(!addPhotoMode)}
              fluid style={{ marginTop:10 }}>{addPhotoMode ? 'Cancel' : 'Upload New Photo' }</Button>

         }
        </>
    )
}

export default observer(ProfilePhotos);