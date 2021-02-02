const init = {
    appIsInitialized: false,
    currentDialog: null,
    currentUser: null,
    dialogs: []
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

        case 'APP_IS_INITIALIZED':
            return {
                ...state,
                appIsInitialized: action.value
            };

        case 'SET_DIALOGS':
            return setDialogs(state, action);

        case 'UPDATE_DIALOG':
            return updateDialog(state, action);

        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.currentUser
            };

        case 'SET_USER_NAME':
            return {
                ...state,
                currentUser: { ...state.currentUser, name: action.userName }
            };

        case 'SET_USER_AVATAR':
            return {
                ...state,
                currentUser: { ...state.currentUser, avatar: action.userAvatarUrl }
            };

        case 'CHANGE_CURRENT_DIALOG':
            return {
                ...state,
                currentDialog: action.currentDialog
            };

        case 'CLEAR_DIALOGS':
            return {
                ...state,
                dialogs: []
            };

        default:
            return state
    }
}

export default dialogsDataReducer