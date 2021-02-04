const init = {
    dialogs: [],
    userSentNewMessage: false
};



const setDialogs = (state, action) => {
    const dialogAlreadyInstalled = state.dialogs.find(d => d.dialogId === action.dialog.dialogId);
    if (dialogAlreadyInstalled) {
        return state
    } else {
        return {
            ...state,
            dialogs: [
                ...state.dialogs,
                action.dialog
            ]
        }
    }
}

const updateDialog  = (state, action) => {
    if (state.dialogs.length > 0) {
        const copyCurrentDialogs = [...state.dialogs];
        const dialogForUpdate = copyCurrentDialogs.find(d => d.dialogId === action.key);
        dialogForUpdate.messages = action.sortedMessages;
        dialogForUpdate.unreadMessages = action.sumUnreadMessages;
        return {
            ...state,
            dialogs: copyCurrentDialogs
        }
    } else {
        return state
    }
}



const dialogsDataReducer = (state = init, action) => {
    switch (action.type) {
        case 'SET_DIALOGS':
            return setDialogs(state, action);

        case 'UPDATE_DIALOG':
            return updateDialog(state, action);

        case 'CLEAR_DIALOGS':
            return {
                ...state,
                dialogs: []
            };

        case 'TOGGLE_USER_SENT_NEW_MESSAGE':
            return {
                ...state,
                userSentNewMessage: action.value
            };

        default:
            return state
    }
}

export default dialogsDataReducer