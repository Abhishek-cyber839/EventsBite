import { useField } from "formik"
import {Form,Label} from 'semantic-ui-react'
import Datepicker,{ReactDatePickerProps} from 'react-datepicker'

/**
 * By wrapping ReactDatePickerProps within partials we're making these props optional so that we won't get any error for props
 *  that are compulsary.
 */
const CDateInput = (props:Partial<ReactDatePickerProps>) => {
    const [field,meta,helpers] = useField(props.name!);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <Datepicker
             {...field}
             {...props}
             selected={(field.value && new Date(field.value)) || null}
             onChange={value => helpers.setValue(value)}
            />
            {meta.touched && meta.error ? <Label pointing>{meta.error}</Label> : null }
        </Form.Field>
    )
}

export default CDateInput