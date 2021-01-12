import React, { useState, useEffect } from 'react';
import classes from "./SendMessagePanel.module.sass";
import InputForm from "../../../common/InputForm/InputForm";
import * as PropTypes from 'prop-types';
import defaultAvatar from '../../../assets/defaultAvatar/ava.jpg'
import { v4 as uuidv4 } from "uuid";
import moment from "moment";


const SendMessagePanel = ({ dialogsData, addNewMessage, setIsNewUserMessage }) => {
    const [dialog, setDialog] = useState(null);
    const [interlocutor, setInterlocutor] = useState(null);

    useEffect(() => {
        if (!dialog || dialog.dialogId !== dialogsData.currentDialog) {
            const dialog = dialogsData.dialogs.find(d => d.dialogId === dialogsData.currentDialog);
            const interlocutor = dialog && findInterlocutor(dialog);
            setDialog(dialog);
            setInterlocutor(interlocutor);
        }
    } );

    const findInterlocutor = (dialog) => dialog.members.find(m => m.id !== dialogsData.currentUser.id);

    const onSubmit = (formData) => {
        addNewMessage(
            interlocutor.id,
            uuidv4(),
            dialogsData.currentDialog,
            dialogsData.currentUser.id,
            moment().format(),
            formData[dialogsData.currentDialog]
        );
        setIsNewUserMessage(true);
    };

    return (
        <div className={ classes.send_message_panel_wrap }>
            <div className={ classes.send_message_panel }>
                <img src={ dialogsData.currentUser.avatar } alt="avatar"/>

                <div className={ classes.send_message_form }>
                    <InputForm
                        formType={ 'send_message_panel' }
                        inputName={ dialogsData.currentDialog }
                        onSubmit={ onSubmit }
                        placeholder={ "Type a message..." }
                        currentDialogId={ dialogsData.currentDialog }
                    />
                </div>

                <img src={ interlocutor ? interlocutor.avatar : defaultAvatar } alt="avatar" />
            </div>
        </div>
    )
};

SendMessagePanel.propTypes = {
    currentUser: PropTypes.object,
    interlocutor: PropTypes.object,
    currentDialog: PropTypes.string,
    setIsNewUserMessage: PropTypes.func,
    addNewMessage: PropTypes.func
};

export default SendMessagePanel