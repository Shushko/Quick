import React from "react";
import classes from "./AuthUserForm.module.sass";
import { Field, Form } from 'react-final-form';

const AuthUserForm = (props) => {

    let hasError = false

    const onSubmit = (formData) => {
        props.numberFormIsVisible ? props.authorizeUser(formData.value) : props.checkVerificationCode(formData.value)
    }

    const required = value => value && value.trim() !== '' ? undefined : 'Required field'
    const mustBeFormat = value => value && value.trim()[0] !== '+' && props.numberFormIsVisible ? 'Must be format: +380XXXXXXXXX' : undefined
    const numberRegExp = new RegExp("/^[0-9]/g");
    const mustBeNumber = value => {
        const val = value.trim()
        if (isNaN(val)) {
            if (val[0] === '+' && props.numberFormIsVisible) {
                return val.length > 1 && !numberRegExp.test(val.slice(1)) ? 'Must be a number' : undefined
            } else {
                return 'Must be a number'
            }
        } else {
            return undefined
        }
    }

    const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined)

    const Textarea = ({ input, meta, isInvalidNumber, numberFormIsVisible, ...props }) => {
        meta.error ? hasError = true : hasError = false

        return (
            <div className={ classes.textarea_wrap }>
                <textarea { ...input } { ...props } autoFocus={ true } />
                <div className={ classes.error_message }>
                    { isInvalidNumber && !meta.modified && !meta.touched && <span>Invalid number</span> }
                    { meta.error && meta.error !== 'Required field' && <span>{ meta.error }</span> }
                    { meta.error === 'Required field' && meta.touched && !meta.active && <span>{ meta.error }</span> }
                </div>
            </div>
        )
    }

    return (
        <div>
            <span className={ classes.form_text }>
                { props.numberFormIsVisible ? 'Please, enter your full phone number.' : 'Please, enter your verification code.' }
            </span>
            <Form onSubmit={ onSubmit }>
                { ({ handleSubmit, pristine, form }) => (
                    <form onSubmit={ handleSubmit } className={ classes.form_container }>
                        <Field component={ Textarea } name={ "value" }
                               validate={ composeValidators(required, mustBeNumber, mustBeFormat) }
                               isInvalidNumber={ props.isInvalidNumber }
                               numberFormIsVisible={ props.numberFormIsVisible }
                               onKeyDown={ e => {
                                   if (e.key === 'Enter') {
                                       e.preventDefault()
                                       if (!pristine) {
                                           handleSubmit()
                                           if (!hasError) { form.reset() }
                                       }
                                   }
                               } }
                               placeholder={ props.numberFormIsVisible ? "Phone number (+380XXXXXXXXX)" : "Code" }
                        />

                        <button
                            type="submit"
                            disabled={ pristine }
                            className={ classes.button_send }
                        >
                            Send
                        </button>
                    </form>
                ) }
            </Form>
        </div>
    )
}

export default AuthUserForm