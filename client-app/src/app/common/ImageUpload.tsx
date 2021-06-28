import { useEffect, useState } from "react";
import { Step,Container,Grid, Button } from "semantic-ui-react";
import PhotoUploadWidget from "./PhotoUploadWidget";
import { Cropper } from 'react-cropper';
import PhotoCropperWidget from "./PhotoCropperWidget";

interface Props{
    uploadPhoto:(file:Blob) => void,
    uploading:boolean
}

const ImageUpload = ({uploadPhoto,uploading}:Props) => {
    const [files,setFiles] = useState<any>([]);
    const [cropper,setCropper] = useState<Cropper>();
    const onCrop = () => {
        if(cropper){
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!))
        }
    }

    useEffect(() => {
        // this will clean the file object from memory.
        return () => {
            files.forEach((file:any) => URL.revokeObjectURL(file.priview));
        }
    },[files]);
    return(
        <Container style={{ marginTop:20 }}>
          <Step.Group ordered style={{ border:'none'}} >
            <Step >
            <Step.Content content='Choose your photo' />
            </Step>
            <Step  >
            <Step.Content content='Resize however you want'/>
            </Step>
            <Step >
            <Step.Content content='Upload new photo'/>
            </Step>
        </Step.Group>
        <Grid style={{ marginLeft:15 }}>
            <Grid.Column width={4}>
                <PhotoUploadWidget setFiles={setFiles}/>
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                {
                    files && files.length > 0 && <PhotoCropperWidget setCropper={setCropper} imagePreview={ files[0].preview }/>
                }
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
               { files && files.length > 0 && 
                    <> 
                        <div className='img-preview' style={{ minHeight:200,overflow:'hidden', marginLeft:20 }}/>
                        <Button.Group widths={2} style={{ marginLeft:20 }}>
                            <Button loading={uploading} onClick={onCrop} positive icon='check'/>
                            <Button disabled={uploading} onClick={() => setFiles([])} icon='close'/>
                        </Button.Group>
                    </>
               }
            </Grid.Column>
        </Grid>
        </Container>
    )
}

export default ImageUpload;