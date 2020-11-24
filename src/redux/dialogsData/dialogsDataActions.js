import moment from "moment";
import { getUser, getDialog, getMember, getMessage, getRefCurrentDialogs, createDialog } from "../../api/api";

const APP_IS_INITIALIZED = 'APP_IS_INITIALIZED'
const SET_DIALOGS = 'SET_DIALOGS'
const UPDATE_DIALOG = 'UPDATE_DIALOG'
const SET_CURRENT_USER = 'SET_CURRENT_USER'
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

export const clearDialogs = () => ({
    type: CLEAR_DIALOGS
})



export const changeMessageStatus = (dialogId, message, delivered, read) => {
    return () => {
        getMessage(dialogId, message.id).update({
            isDelivered: delivered,
            isRead: read
        })
            .catch(error => console.log(error))
    }
}

export const addNewMessage = (interlocutorId,  messageId, dialogId, userId, time, inputValue) => {
    return () => {
        getUser(interlocutorId)
            .then(user => {
                if (!user.val().hasOwnProperty('currentDialogs')) {
                    getRefCurrentDialogs(interlocutorId)
                        .set({ [dialogId]: dialogId })
                        .catch(error => console.log(error))
                } else {
                    getRefCurrentDialogs(interlocutorId)
                        .update({ [dialogId]: dialogId })
                        .catch(error => console.log(error))
                }
            })

        getDialog(dialogId).once("value")
            .then(dialog => {
                if (!dialog.val().hasOwnProperty('content')) {
                    getMessage(dialogId, messageId).set({
                        id: messageId,
                        time: time,
                        message: inputValue,
                        isDelivered: false,
                        isRead: false,
                        userId: userId
                    })
                        .catch(error => console.log(error))
                } else {
                    getMessage(dialogId, messageId).update({
                        id: messageId,
                        time: time,
                        message: inputValue,
                        isDelivered: false,
                        isRead: false,
                        userId: userId
                    })
                        .catch(error => console.log(error))
                }
            })
    }
}

const calculateUnreadMessages = (dialog, userId) => {
    let sumUnreadMessages = 0
    dialog.forEach(i => {
        if (!i.isRead && i.userId !== userId) {
            sumUnreadMessages++
        }
    })
    return sumUnreadMessages
}

const sortMessages = (dialog) => {
    const dialogArr = Object.values(dialog)
    dialogArr.sort((a, b) => {
        if (moment(a.time).valueOf() > moment(b.time).valueOf()) return 1
        if (moment(a.time).valueOf() < moment(b.time).valueOf()) return -1
        return 0
    })
    return dialogArr
}


const setUpdatedDialog = (data, userDialogs, userId) => {
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


const getMembers = (dialog) => {
        const dialogMembers = Object.values(dialog.members)
        const membersPromise = []
        for (let n = 0; n < dialogMembers.length; n++) {
            const member = getMember(dialogMembers[n])
            membersPromise.push(member)
        }

        return Promise.all(membersPromise)
}


const checkForDialog = (getState, dialogId) => !!getState().dialogsDataReducer.dialogs.find(d => d.dialogId === dialogId)


const setDialogObserver = (dispatch, getState, dialogKey, userId) => {
    const hasDialog = checkForDialog(getState, dialogKey)
    if (!hasDialog) {
        getDialog(dialogKey).on('value', (dataSnapshot) => {
            const appIsInitialized = getState().dialogsDataReducer.appIsInitialized
            const data = dataSnapshot.val()
            const userDialogs = getState().dialogsDataReducer.dialogs
            const dialogHasContent = data.hasOwnProperty('content')
            const userHasDialog = checkForDialog(getState, dialogKey)
            if (appIsInitialized && dialogHasContent && userHasDialog) {
                const { sortedMessages, sumUnreadMessages } = setUpdatedDialog(data, userDialogs, userId)
                dispatch(updateDialog(data.id, sortedMessages, sumUnreadMessages))
            }
        })
    }
}


const setCurrentDialogsObserver = (dispatch, getState, userId, routeHistory) => {
    let appIsInit = false
    getRefCurrentDialogs(userId).on('value', (dataSnapshot) => {
        if (appIsInit) {
            const currentDialogsKeys = []
            getState().dialogsDataReducer.dialogs.forEach(i => currentDialogsKeys.push(i.dialogId))
            const newDialogsKeys = Object.values(dataSnapshot.val())
            const newDialogKey = newDialogsKeys.find(i => i !== currentDialogsKeys.find(n => n === i))
            if (newDialogKey) {
                setDialogObserver(dispatch, getState, newDialogKey, userId)
                getDialog(newDialogKey).once('value')
                    .then(newDialog => {
                        getMembers(newDialog.val())
                            .then(members => {
                                const messages = newDialog.val().hasOwnProperty('content') ? sortMessages(newDialog.val().content) : []
                                dispatch(setDialogsAction({
                                    dialogId: newDialog.val().id,
                                    messages: messages,
                                    members: members,
                                    unreadMessages: calculateUnreadMessages(messages, userId)
                                }))
                                if (!messages.length) {
                                    dispatch(onChangeCurrentDialog(newDialog.val().id))
                                    routeHistory.push(`/${ newDialog.val().id }`)
                                }
                            })
                    })
            }
        }
        appIsInit = true
    })
}


export const createNewDialog = (dialogId, currentUserId, interlocutorId) => {
    return (dispatch, getState) => {
        createDialog(dialogId, currentUserId, interlocutorId)
            .then(() => {
                if (!getState().dialogsDataReducer.dialogs.length) {
                    getRefCurrentDialogs(currentUserId)
                        .set({ [dialogId]: dialogId })
                        .catch(error => console.log(error))
                } else {
                    getRefCurrentDialogs(currentUserId)
                        .update({ [dialogId]: dialogId })
                        .catch(error => console.log(error))
                }
            })
    }
}


export const setDialogs = (routeHistory) => {
    return (dispatch, getState) => {
        const userId = localStorage.getItem('userId')
        setCurrentDialogsObserver(dispatch, getState, userId, routeHistory)

        getUser(userId)
            .then(item => {
                dispatch(setCurrentUser(item.val()))
                if (item.val().hasOwnProperty('currentDialogs')) {
                    const currentDialogs = Object.values(item.val().currentDialogs)
                    const dialogsPromises = []
                    for (let i = 0; i < currentDialogs.length; i++) {
                        const dialog = getDialog(currentDialogs[i]).once("value").then(item => item.val())
                        dialogsPromises.push(dialog)
                    }

                    Promise.all(dialogsPromises)
                        .then(async (dialogs) => {
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
                        })
                        .catch(error => console.log(error))
                } else { dispatch(toggleAppIsInit(true)) }
            })
            .catch(error => console.log(error))
    }
}

export const logOutUser = () => {
    return (dispatch) => {
        dispatch(clearDialogs())
        dispatch(setCurrentUser(null))
        dispatch(onChangeCurrentDialog(null))
    }
}

