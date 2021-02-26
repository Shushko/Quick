const init = {
    dialogs: []
};

const getCopyDialog = (state, dialogId) => ({ ...state.dialogs.find(dialog => dialog.dialogId === dialogId) });

const getResultState = (state, dialogId, updatedDialog) => {
    const copyDialogs = [...state.dialogs.filter(dialog => dialog.dialogId !== dialogId), updatedDialog];
    return { ...state, dialogs: copyDialogs }
};

const addNewMessage = (state, dialogId, newMessage) => {
    const copyDialog = getCopyDialog(state, dialogId);
    if (!newMessage) {
        copyDialog.chatIsOpened = true
    } else {
        copyDialog.messages = Array.isArray(newMessage) ? [...newMessage, ...copyDialog.messages] : [...copyDialog.messages, newMessage];
        copyDialog.chatIsOpened = Array.isArray(newMessage);
    }
    return getResultState(state, dialogId, copyDialog);
};

const changeTotalCountUnreadMessages = (state, dialogId, totalSum) => {
    const copyDialog = getCopyDialog(state, dialogId);
    const updatedDialog = { ...copyDialog, unreadMessages: totalSum };
    return getResultState(state, dialogId, updatedDialog);
};

const updateDialog = (state, dialogId, newContent) => {
    const copyDialog = getCopyDialog(state, dialogId);
    const updatedDialog = { ...copyDialog, messages: newContent };
    return getResultState(state, dialogId, updatedDialog);
};


const dialogsDataReducer = (state = init, action) => {
    switch (action.type) {
        case 'CLEAR_DIALOGS':
            return {
                ...state,
                dialogs: []
            };

        case 'ADD_NEW_DIALOG':
            return {
                ...state,
                dialogs: [...state.dialogs, action.dialog]
            };

        case 'UPDATE_DIALOG':
            return updateDialog(state, action.dialogId, action.newContent);

        case 'CHANGE_TOTAL_COUNT_UNREAD_MESSAGES':
            return changeTotalCountUnreadMessages(state, action.dialogId, action.totalSum);

        case 'ADD_NEW_MESSAGE_TO_DIALOG':
            return addNewMessage(state, action.dialogId, action.newMessage);

        default:
            return state
    }
}

export default dialogsDataReducer