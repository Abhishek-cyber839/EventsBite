import { useField } from "formik"
import {Form,Label,Select} from 'semantic-ui-react'

interface Props{
    placeholder:string,
    name:string,
    label?:string,
    options:any
}

const CSelectInput = (props:Props) => {
    // helpers allows us to manually set a value and the touched status of our input.
    const [field,meta,helpers] = useField(props.name);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <Select 
            clearable
            placeholder={props.placeholder}
            options={props.options}
            value={field.value || null}
            onChange={(event,data) => helpers.setValue(data.value)}
            onBlur={() => helpers.setTouched(true)}
            />
            {meta.touched && meta.error ? <Label pointing>{meta.error}</Label> : null }
        </Form.Field>
    )
}

export default CSelectInput