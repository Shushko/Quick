import React from "react";
import classes from "./AuthUserForm.module.sass";
import { Field, Form } from 'react-final-form';
import { composeValidators, mustBeNumber, mustBePhoneNumber, required } from "../../../common/Validators";
import { CODE_FORM_TEXT, NUMBER_PHONE_FORM_TEXT } from "../../../common/Messages";

const AuthUserForm = (props) => {

    let hasError = false;

    const onSubmit = (formData) => { props.numberFormIsVisible ? props.authorizeUser(formData.value) : props.checkVerificationCode(formData.value) };

    const Textarea = ({ input, meta, isInvalidNumber, numberFormIsVisible, ...props }) => {
        hasError = !!meta.error;

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
    };

    return (
        <div>
            <span className={ classes.form_text }>
                { props.numberFormIsVisible ? NUMBER_PHONE_FORM_TEXT : CODE_FORM_TEXT }
            </span>
            <Form onSubmit={ onSubmit }>
                { ({ handleSubmit, pristine, form }) => (
                    <form onSubmit={ handleSubmit } className={ classes.form_container }>
                        <Field component={ Textarea } name={ "value" }
                               validate={
                                   props.numberFormIsVisible ?
                                   composeValidators(required, mustBePhoneNumber) :
                                   composeValidators(required, mustBeNumber)
                               }
                               isInvalidNumber={ props.isInvalidNumber }
                               numberFormIsVisible={ props.numberFormIsVisible }
                               onKeyDown={ e => {
                                   if (e.key === 'Enter') {
                                       e.preventDefault();
                                       if (!pristine) {
                                           handleSubmit();
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
};

export default AuthUserForm