import React from 'react';
import classes from './SendMessagePanel.module.sass';
import InputForm from "../../../common/InputForm/InputForm";
import defaultAvatar from '../../../assets/defaultAvatar/ava.jpg';
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
            formData[currentDialog]
        );
        setIsNewUserMessage(true);
    };

    return (
        <div className={ classes.send_message_panel_wrap }>
            <div className={ classes.send_message_panel }>
                <img src={ currentUser.avatar } alt="avatar"/>

                <div className={ classes.send_message_form }>
                    <InputForm
                        formType={ 'send_message_panel' }
                        inputName={ currentDialog }
                        onSubmit={ onSubmit }
                        placeholder={ "Type a message..." }
                        currentDialogId={ currentDialog }
                    />
                </div>

                <img src={ interlocutor ? interlocutor.avatar : defaultAvatar } alt="avatar" />
            </div>
        </div>
    )
}

export default SendMessagePanel
