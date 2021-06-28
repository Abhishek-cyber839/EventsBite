import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import {Icon,Header} from 'semantic-ui-react';

interface Props{
    setFiles: (file:any) => void
}

const PhotoUploadWidget = ({setFiles}:Props) => {
    const dropzoneStyle = {
        border:'dashed 3px #eee',
        borderColor:'#eee',
        borderRadius:'5px',
        paddingTop:'30px',
        textAlign:'center' as 'center',
        height:200
    }

    const dropzoneActive = {
        borderColor:'green',
    }

    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles.map((file:any) => Object.assign(file,{
            preview:URL.createObjectURL(file)
        })))
        console.log(acceptedFiles);
      }, [setFiles])
      const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    
      return (
        <div {...getRootProps()} style={ isDragActive ? {...dropzoneActive,...dropzoneStyle} : dropzoneStyle }>
          <input {...getInputProps()} />
          <Icon name='upload' size='huge'/>
          <Header className='custom-font' content='Drop your file here'/>
        </div>
      )
}

export default PhotoUploadWidget;