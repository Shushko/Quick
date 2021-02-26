import React, { useState, useEffect } from 'react';
import classes from "./SendMessagePanel.module.sass";
import InputForm from "../../../common/InputForm/InputForm";
import * as PropTypes from 'prop-types';
import defaultAvatar from '../../../assets/defaultAvatar/ava.jpg'
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const SendMessagePanel = ({ isMobileVersion, currentDialogId, currentUser, dialogsData, addNewMessage }) => {
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
        const isFirstMessage = !dialogsData.dialogs.find(d => d.dialogId === currentDialogId).messages.length;
        const time = moment().valueOf();
        const message = {
            [time]:{
                id: uuidv4(),
                time: time,
                message: formData[currentDialogId],
                isDelivered: false,
                isRead: false,
                userId: currentUser.id
            }
        };
        addNewMessage(interlocutor.id, currentDialogId, isFirstMessage, message);
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
    addNewMessage: PropTypes.func
};

export default SendMessagePanel