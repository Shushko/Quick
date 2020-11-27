import React, { useState, useEffect } from 'react';
import SendMessagePanel from "./SendMessagePanel";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const SendMessagePanelContainer = ({ dialogsData, addNewMessage }) => {
    const [dialog, setDialog] = useState(null);
    const [interlocutor, setInterlocutor] = useState(null);
    useEffect(() => {
        if (!dialog || dialog.dialogId !== dialogsData.currentDialog) {
            const dialog = dialogsData.dialogs.find(d => d.dialogId === dialogsData.currentDialog);
            const interlocutor = dialog && findInterlocutor(dialog);
            setDialog(dialog);
            setInterlocutor(interlocutor);
        }
    });

    const findInterlocutor = (dialog) => dialog.members.find(m => m.id !== dialogsData.currentUser.id);

    const onSubmit = (formData) => addNewMessage(
        interlocutor.id,
        uuidv4(),
        dialogsData.currentDialog,
        dialogsData.currentUser.id,
        moment().format(),
        formData.message
    )

    return (
        <SendMessagePanel
            currentUser={ dialogsData.currentUser }
            interlocutor={ interlocutor }
            currentDialog={ dialogsData.currentDialog }
            onSubmit={ onSubmit }
        />
    )
}

export default SendMessagePanelContainer