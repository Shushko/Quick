import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import SendMessagePanel from "./SendMessagePanel";

const SendMessagePanelContainer = ({ dialogsData, addNewMessage, setIsNewUserMessage }) => {
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

    return (
        <SendMessagePanel
            currentUser={ dialogsData.currentUser }
            interlocutor={ interlocutor }
            currentDialog={ dialogsData.currentDialog }
            setIsNewUserMessage={ setIsNewUserMessage }
            addNewMessage={ addNewMessage }
        />
    )
};

SendMessagePanelContainer.propTypes = {
    dialogsData: PropTypes.object,
    addNewMessage: PropTypes.func,
    setIsNewUserMessage: PropTypes.func
};

export default SendMessagePanelContainer