const init = {
    currentDialog: null,
    isFetching: true,
    currentUser: null,
    dialogs: []
}

const dialogsDataReducer = (state = init, action) => {
    switch (action.type) {
        case 'SET_DIALOGS':
            return {
                ...state,
                dialogs: [
                    ...state.dialogs,
                    action.dialog
                ]
            }

        case 'UPDATE_DIALOG':
            if (state.dialogs.length > 0) {
                const copyCurrentDialogs = [...state.dialogs]
                const dialogForUpdate = copyCurrentDialogs.find(d => d.dialogId === action.key)
                dialogForUpdate.dialog = action.sortedMessages
                dialogForUpdate.unreadMessages = action.sumUnreadMessages
                return {
                    ...state,
                    dialogs: copyCurrentDialogs
                }
            } else {
                return state
            }

        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.currentUser
            }

        case 'CHANGE_CURRENT_DIALOG':
            return {
                ...state,
                currentDialog: action.currentDialog
            }

        case 'TOGGLE_IS_FETCHING':
            return {
                ...state,
                isFetching: action.value
            }

        case 'CLEAR_DIALOGS':
            return {
                ...state,
                dialogs: []
            }

        default:
            return state
    }
}

export default dialogsDataReducer