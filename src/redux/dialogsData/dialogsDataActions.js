import moment from "moment";
import {
    getUser,
    getDialog,
    getRefCurrentDialogs,
    getRefDialog,
    createCurrentDialogs,
    createDialog,
    updateMessage,
    addMessage,
    updateUserName, updateUserAvatar
} from "../../api/api";
import { setUserIsAuthorized } from "../authUser";
import { togglePhotoEditorPreloader } from "../preloader";
import { toggleNotificationVisibility } from "../notification";

const APP_IS_INITIALIZED = 'APP_IS_INITIALIZED'
const SET_DIALOGS = 'SET_DIALOGS'
const UPDATE_DIALOG = 'UPDATE_DIALOG'
const SET_CURRENT_USER = 'SET_CURRENT_USER'
const SET_USER_NAME = 'SET_USER_NAME'
const SET_USER_AVATAR = 'SET_USER_AVATAR'
const CHANGE_CURRENT_DIALOG = 'CHANGE_CURRENT_DIALOG'
const CLEAR_DIALOGS = 'CLEAR_DIALOGS'


export const toggleAppIsInit = (value) => ({
    type: APP_IS_INITIALIZED,
    value
})

export const setDialogsAction = (dialog) => ({
    type: SET_DIALOGS,
    dialog
})

export const updateDialog = (key, sortedMessages, sumUnreadMessages) => ({
    type: UPDATE_DIALOG,
    key,
    sortedMessages,
    sumUnreadMessages
})

export const onChangeCurrentDialog = (value) => ({
    type: CHANGE_CURRENT_DIALOG,
    currentDialog: value
})

export const setCurrentUser = (currentUser) => ({
    type: SET_CURRENT_USER,
    currentUser
})

export const setUserName = (userName) => ({
    type: SET_USER_NAME,
    userName
})

export const setUserAvatar = (userAvatarUrl) => ({
    type: SET_USER_AVATAR,
    userAvatarUrl
})

export const clearDialogs = () => ({
    type: CLEAR_DIALOGS
})


export const changeUserAvatar = (file, userID) => async (dispatch) => {
    const userAvatarUrl = await updateUserAvatar(file, userID);
    if (userAvatarUrl) {
        dispatch(setUserAvatar(userAvatarUrl));
        dispatch(togglePhotoEditorPreloader(false))
        dispatch(toggleNotificationVisibility(true, 'Photo uploaded successfully'))
        setTimeout(() => dispatch(toggleNotificationVisibility(false, '')), 3000)
    }
};

export const changeUserName = (newUserName, userId) => async (dispatch) => {
    try {
        const result = await updateUserName(newUserName, userId);
        result.statusText === 'OK' && dispatch(setUserName(newUserName));
    } catch (e) {
        console.log(e);
    }
};

export const changeMessageStatus = (dialogId, message, delivered, read) => () => updateMessage(dialogId, message.id, delivered, read)

export const addNewMessage = (interlocutorId,  messageId, dialogId, userId, time, inputValue) => async () => {
    const interlocutor = await getUser(interlocutorId);
    const userHasCurrentDialogs = interlocutor.hasOwnProperty('currentDialogs');
    createCurrentDialogs(interlocutorId, dialogId, userHasCurrentDialogs);

    const dialog = await getDialog(dialogId);
    const dialogHasContent = dialog.hasOwnProperty('content');
    addMessage(dialogId, messageId, time, inputValue, userId, dialogHasContent)
};

export const calculateUnreadMessages = (dialog, userId) => {
    let sumUnreadMessages = 0
    dialog.forEach(i => {
        if (!i.isRead && i.userId !== userId) {
            sumUnreadMessages++
        }
    })
    return sumUnreadMessages
}

export const sortMessages = (dialog) => {
    const dialogArr = Object.values(dialog)
    dialogArr.sort((a, b) => {
        if (moment(a.time).valueOf() > moment(b.time).valueOf()) return 1
        if (moment(a.time).valueOf() < moment(b.time).valueOf()) return -1
        return 0
    })
    return dialogArr
}


export const getUpdatedDialog = (data, userDialogs, userId) => {
    const updDialog = Object.values(data.content)
    const oldDialog = userDialogs.find(i => i.dialogId === data.id).messages
    const updMessage = updDialog.find(i => !oldDialog.find(n => i.id === n.id))
    if (updMessage && !updMessage.isDelivered && updMessage.userId !== userId) {
        changeMessageStatus(data.id, updMessage, true, updMessage.isRead)()
    }
    const sortedMessages = sortMessages(data.content)
    const sumUnreadMessages = calculateUnreadMessages(updDialog, userId)
    return { sortedMessages, sumUnreadMessages }
}


const getMembers = async (dialog) => {
        const dialogMembers = Object.values(dialog.members)
        const members = []
        for (let n = 0; n < dialogMembers.length; n++) {
            const member = await getUser(dialogMembers[n])
            members.push(member)
        }
    return members
}


const checkForDialog = (getState, dialogId) => !!getState().dialogsDataReducer.dialogs.find(d => d.dialogId === dialogId)


const setDialogObserver = (dispatch, getState, dialogKey, userId) => {
    const hasDialog = checkForDialog(getState, dialogKey)
    if (!hasDialog) {
        getRefDialog(dialogKey).on('value', (dataSnapshot) => {
            const appIsInitialized = getState().dialogsDataReducer.appIsInitialized
            const data = dataSnapshot.val()
            const userDialogs = getState().dialogsDataReducer.dialogs
            const dialogHasContent = data.hasOwnProperty('content')
            const userHasDialog = checkForDialog(getState, dialogKey)
            if (appIsInitialized && dialogHasContent && userHasDialog) {
                const { sortedMessages, sumUnreadMessages } = getUpdatedDialog(data, userDialogs, userId)
                dispatch(updateDialog(data.id, sortedMessages, sumUnreadMessages))
            }
        })
    }
}


const setCurrentDialogsObserver = (dispatch, getState, userId, routeHistory) => {
    let appIsInit = false
    getRefCurrentDialogs(userId).on('value', async (dataSnapshot) => {
        if (appIsInit) {
            const currentDialogsKeys = []
            getState().dialogsDataReducer.dialogs.forEach(i => currentDialogsKeys.push(i.dialogId))
            const dialogsKeys = Object.values(dataSnapshot.val())
            const newDialogKey = dialogsKeys.find(i => i !== currentDialogsKeys.find(n => n === i))
            if (newDialogKey) {
                setDialogObserver(dispatch, getState, newDialogKey, userId)
                const newDialog = await getDialog(newDialogKey)
                const members = await getMembers(newDialog)
                const messages = newDialog.hasOwnProperty('content') ? sortMessages(newDialog.content) : []
                dispatch(setDialogsAction({
                    dialogId: newDialog.id,
                    messages: messages,
                    members: members,
                    unreadMessages: calculateUnreadMessages(messages, userId)
                }))
                if (!messages.length) {
                    dispatch(onChangeCurrentDialog(newDialog.id))
                    routeHistory.push(`/${ newDialog.id }`)
                }
            }
        }
        appIsInit = true
    })
}


export const createNewDialog = (dialogId, currentUserId, interlocutorId) => {
    return async (dispatch, getState) => {
        const result = await createDialog(dialogId, currentUserId, interlocutorId);
        const resultIsSuccessful = result.statusText === 'OK';
        const currentUserHasDialogs = getState().dialogsDataReducer.dialogs.length;
        resultIsSuccessful && createCurrentDialogs(currentUserId, dialogId, !!currentUserHasDialogs)
    }
};


export const setDialogs = (routeHistory) => async (dispatch, getState) => {
    const userId = localStorage.getItem('userId')
    setCurrentDialogsObserver(dispatch, getState, userId, routeHistory)

    const user = await getUser(userId)
    dispatch(setCurrentUser(user))
    if (user.hasOwnProperty('currentDialogs')) {
        const currentDialogs = Object.values(user.currentDialogs)
        const dialogs = []
        for (let i = 0; i < currentDialogs.length; i++) {
            const dialog = await getDialog(currentDialogs[i])
            dialogs.push(dialog)
        }

        for (let i = 0; i < dialogs.length; i++) {
            const members = await getMembers(dialogs[i])
            const messages = dialogs[i].hasOwnProperty('content') ? sortMessages(dialogs[i].content) : []
            setDialogObserver(dispatch, getState, dialogs[i].id, userId)
            dispatch(setDialogsAction({
                dialogId: dialogs[i].id,
                messages: messages,
                members: members,
                unreadMessages: calculateUnreadMessages(messages, userId)
            }))
        }
        dispatch(toggleAppIsInit(true))
    } else { dispatch(toggleAppIsInit(true)) }
}

export const logOutUser = () => {
    return (dispatch) => {
        dispatch(clearDialogs())
        dispatch(setCurrentUser(null))
        dispatch(onChangeCurrentDialog(null))
        dispatch(setUserIsAuthorized(false))
        dispatch(toggleAppIsInit(false))
        localStorage.removeItem('userIsAuthorized');
        localStorage.removeItem('userId');
    }
}

