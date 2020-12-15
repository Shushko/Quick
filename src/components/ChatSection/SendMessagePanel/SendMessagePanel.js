import React from 'react';
import classes from './SendMessagePanel.module.sass';
import defaultAvatar from '../../../assets/defaultAvatar/ava.jpg'
import { Field, Form } from 'react-final-form'
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const SendMessagePanel = ({ currentUser, interlocutor, currentDialog, setIsNewUserMessage, addNewMessage }) => {
    const onSubmit = (formData) => {
        addNewMessage(
            interlocutor.id,
            uuidv4(),
            currentDialog,
            currentUser.id,
            moment().format(),
            formData.message
        );
        setIsNewUserMessage(true);
    };

    return (
        <div
            className={ currentDialog ? classes.send_message_panel_wrap : classes.send_message_panel_wrap_disable }>
            <div className={ classes.send_message_panel }>
                <img src={ currentUser.avatar } alt="avatar"/>

                <div className={ classes.send_message_form }>
                    <Form onSubmit={ onSubmit }>
                        { ({ handleSubmit, pristine, form }) => (
                            <form onSubmit={ handleSubmit }>
                                <Field component={ "textarea" } name={ "message" }
                                       onKeyDown={ e => {
                                           if (e.key === 'Enter') {
                                               e.preventDefault();
                                               if (!pristine) {
                                                   handleSubmit();
                                                   form.reset()
                                               }
                                           }
                                       } }
                                       placeholder="Type a message..."
                                />

                                <button type="submit" disabled={ pristine }>Send</button>
                            </form>
                        ) }
                    </Form>
                </div>

                <img
                    src={ interlocutor ? interlocutor.avatar : defaultAvatar }
                    alt="avatar"
                />
            </div>
        </div>
    )
}

export default SendMessagePanel
