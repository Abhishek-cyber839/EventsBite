import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';


interface Props{
    imagePreview:string,
    setCropper:(cropper:Cropper) => void
}

const PhotoCropperWidget = ({imagePreview,setCropper}:Props) => {
    
    return (
        <Cropper 
         src={imagePreview}
         style={{ height:200,width:'100%' }}
         initialAspectRatio={2}
         viewMode={1}
         aspectRatio={2}
         preview='.img-preview'
         guides={false}
         autoCropArea={1}
         background={false}
         onInitialized={cropper => setCropper(cropper)}
        />
    )
}

export default PhotoCropperWidget;