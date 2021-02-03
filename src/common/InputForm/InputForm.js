import React, { useRef } from 'react';
import { Field, Form } from "react-final-form";
import classes from "./InputForm.module.sass";
import { composeValidators } from "../Validators";
import send from '../../assets/send.png'

const InputForm = (props) => {
    const moveCaretToEnd = (e) => {
        const temp_value = e.target.value;
        e.target.value = '';
        e.target.value = temp_value
    };

    const hasError = useRef(false);
    const prevCurrentDialogId = useRef(props.currentDialogId);
    const editNameFormRef = useRef(null);
    const sendMessageTextareaRef = useRef();
    const sendMessageTextareaIsActive = useRef(false);

    const Textarea = ({ input, meta, isInvalidNumber, numberFormIsVisible, ...rest }) => {

        if (props.formType === 'send_message_panel') {
            return (
                <div className={ classes.send_message_panel }>
                    <textarea { ...input } { ...rest }
                              className={ classes.send_message_panel_textarea }
                              ref={ sendMessageTextareaRef }
                              onFocus={ () => sendMessageTextareaIsActive.current = true }
                              onBlur={ () => sendMessageTextareaIsActive.current = false }
                              autoFocus={ sendMessageTextareaIsActive.current }
                    />
                    { props.isMobileVersion ?
                        <div className={ classes.send_message_panel_button_mob }>
                            <label htmlFor="sendButtonMob">
                                <img src={ send } className={ classes.send_message_panel_button_mob_image } alt="Send"/>
                            </label>
                            <button type="submit" id="sendButtonMob"/>
                        </div>
                         :
                        <button type="submit" className={ classes.send_message_panel_button }>Send</button>}
                </div>
            )
        }

        if (props.formType === 'find_user') {
            return (
                <div className={ classes.find_user }>
                <textarea { ...input } { ...rest } onChange={ (e) => {
                    input.onChange(e);
                    props.onSubmit(e.currentTarget.value)
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

        if (props.formType === 'auth_user') {
            hasError.current = !!meta.error;

            return (
                <div className={ classes.auth_user }>
                    <textarea { ...input } { ...rest } className={ classes.auth_user_textarea } autoFocus={ true } />
                    <button type="submit" className={ classes.auth_user_button }>Send</button>
                    <div className={ classes.error_message }>
                        { props.isInvalidNumber && !meta.modified && !meta.touched && <span>Invalid number</span> }
                        { meta.error && meta.error !== 'Required field' && <span>{ meta.error }</span> }
                        { meta.error === 'Required field' && meta.touched && !meta.active && <span>{ meta.error }</span> }
                    </div>
                </div>
            )
        }

        if (props.formType === 'edit_user_name') {
            hasError.current = !!meta.error;

            return (
                <div className={ classes.edit_user_name } ref={ editNameFormRef }>
                    <textarea { ...input } { ...rest }
                              className={ classes.edit_user_name_textarea }
                              onBlur={ () => setTimeout(props.hideInput, 0) }
                              autoFocus={ true }
                    />
                    { props.isMobileVersion && <button type="submit" className={ classes.edit_user_name_button }>Save</button> }

                    <div className={ classes.edit_user_name_error }>
                        { meta.error && <span>{ meta.error }</span> }
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
                (!hasError.current || props.formType === 'send_message_panel') && form.reset()
            }
        }
    };

    const setCurrentInputValue = (form) => {
        if (prevCurrentDialogId.current !== props.currentDialogId) {
            prevCurrentDialogId.current = props.currentDialogId;
            const currentInputValue = form.getState().values[props.currentDialogId];
            form.change(props.currentDialogId, currentInputValue)
        }
    };

    const onClickSubmit = (event, handleSubmit, pristine, form) => {
        event.preventDefault();
        if (!pristine) {
            handleSubmit();
            !hasError.current && form.reset();
            if (props.formType === 'send_message_panel') {
                sendMessageTextareaIsActive.current = true;
                sendMessageTextareaRef.current.focus();
            }
        }
    };

    return (
        <Form onSubmit={ props.onSubmit } initialValues={{ edit_user_name: props.currentUserName }}>
            { ({ handleSubmit, pristine, form }) => {
                setCurrentInputValue(form);

                return (
                    <form onSubmit={ event => onClickSubmit(event, handleSubmit, pristine, form) }>
                        <Field component={ Textarea }
                               name={ props.inputName }
                               validate={ props.validators && composeValidators(...props.validators) }
                               isInvalidNumber={ props.isInvalidNumber }
                               numberFormIsVisible={ props.numberFormIsVisible }
                               onKeyDown={ event => onPressEnter(event, form, pristine, handleSubmit) }
                               placeholder={ props.placeholder }
                        />
                    </form>
                )
            } }
        </Form>
    )
};

export default InputForm