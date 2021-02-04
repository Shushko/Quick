import React, { useState, useEffect } from 'react';
import classes from "./SendMessagePanel.module.sass";
import InputForm from "../../../common/InputForm/InputForm";
import * as PropTypes from 'prop-types';
import defaultAvatar from '../../../assets/defaultAvatar/ava.jpg'
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const SendMessagePanel = ({ isMobileVersion, currentDialogId, currentUser, dialogsData, addNewMessage, toggleUserSentNewMessage }) => {
    const [dialog, setDialog] = useState(null);
    const [interlocutor, setInterlocutor] = useState(null);

    useEffect(() => {
        if (!dialog || dialog.dialogId !== currentDialogId) {
            const dialog = dialogsData.dialogs.find(d => d.dialogId === currentDialogId);
            const interlocutor = dialog && findInterlocutor(dialog);
            setDialog(dialog);
            setInterlocutor(interlocutor);
        }
    } );

    const findInterlocutor = (dialog) => dialog.members.find(m => m.id !== currentUser.id);

    const onSubmit = (formData) => {
        addNewMessage(
            interlocutor.id,
            uuidv4(),
            currentDialogId,
            currentUser.id,
            moment().format(),
            formData[currentDialogId]
        );
        toggleUserSentNewMessage(true);
    };

    return (
        <div className={ classes.send_message_panel_wrap }>
            <div className={ classes.send_message_panel }>
                { !isMobileVersion &&
                <img src={ currentUser.avatar } className={ classes.send_message_panel_avatar } alt="avatar"/> }

                <InputForm
                    formType={ 'send_message_panel' }
                    inputName={ currentDialogId }
                    onSubmit={ onSubmit }
                    placeholder={ "Type a message..." }
                    currentDialogId={ currentDialogId }
                    isMobileVersion={ isMobileVersion }
                />

                { !isMobileVersion &&
                <img src={ interlocutor ? interlocutor.avatar : defaultAvatar } className={ classes.send_message_panel_avatar } alt="avatar" /> }
            </div>
        </div>
    )
};

SendMessagePanel.propTypes = {
    isMobileVersion: PropTypes.bool,
    currentUser: PropTypes.object,
    dialogsData: PropTypes.object,
    currentDialogId: PropTypes.string,
    toggleUserSentNewMessage: PropTypes.func,
    addNewMessage: PropTypes.func
};

export default SendMessagePanel