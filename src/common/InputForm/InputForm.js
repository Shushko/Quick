import React, { useRef } from 'react';
import { Field, Form } from "react-final-form";
import classes from "./InputForm.module.sass";
import { composeValidators } from "../Validators";

const InputForm = ({ formType, inputName, onSubmit, isInvalidNumber, numberFormIsVisible, validators,  placeholder }) => {
    const moveCaretToEnd = (e) => {
        const temp_value = e.target.value;
        e.target.value = '';
        e.target.value = temp_value
    };

    const hasError = useRef(false);

    const Textarea = ({ input, meta, isInvalidNumber, numberFormIsVisible, ...rest }) => {
        if (formType === 'send_message_panel') {
            return (
                <div className={ classes.send_message_panel }>
                    <textarea { ...input } { ...rest } className={ classes.send_message_panel_textarea } />
                    <button type="submit" className={ classes.send_message_panel_button }>Send</button>
                </div>
            )
        }

        if (formType === 'find_user') {
            return (
                <div className={ classes.find_user }>
                <textarea { ...input } { ...rest } onChange={ (e) => {
                    input.onChange(e);
                    onSubmit(e.currentTarget.value)
                } }
                          className={ classes.find_user_textarea }
                          autoFocus={ true }
                          onFocus={ moveCaretToEnd }/>
                    <div className={ classes.error_message }>
                        { meta.error && <span>{ meta.error }</span> }
                    </div>
                </div>
            )
        }

        if (formType === 'auth_user') {
            hasError.current = !!meta.error;

            return (
                <div className={ classes.auth_user }>
                    <textarea { ...input } { ...rest } className={ classes.auth_user_textarea } autoFocus={ true } />
                    <button type="submit" className={ classes.auth_user_button }>Send</button>
                    <div className={ classes.error_message }>
                        { isInvalidNumber && !meta.modified && !meta.touched && <span>Invalid number</span> }
                        { meta.error && meta.error !== 'Required field' && <span>{ meta.error }</span> }
                        { meta.error === 'Required field' && meta.touched && !meta.active && <span>{ meta.error }</span> }
                    </div>
                </div>
            )
        }
    };

    const onPressEnter = (event, form, pristine, handleSubmit) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!pristine) {
                handleSubmit();
                (!hasError.current || formType === 'send_message_panel') && form.reset()
            }
        }
    };

    return (
        <Form onSubmit={ onSubmit }>
            { ({ handleSubmit, pristine, form }) => (
                <form onSubmit={ handleSubmit }>
                    <Field component={ Textarea }
                           name={ inputName }
                           validate={ validators && composeValidators(...validators) }
                           isInvalidNumber={ isInvalidNumber }
                           numberFormIsVisible={ numberFormIsVisible }
                           onKeyDown={ event => onPressEnter(event, form, pristine, handleSubmit) }
                           placeholder={ placeholder }
                    />
                </form>
            ) }
        </Form>
    )
};

export default InputForm