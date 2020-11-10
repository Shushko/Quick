import moment from "moment";
import { getUser, getDialog, getMember, getMessage, getRefCurrentDialogs } from "../../api/api";

const SET_DIALOGS = 'SET_DIALOGS'
const UPDATE_DIALOG = 'UPDATE_DIALOG'
const SET_CURRENT_USER = 'SET_CURRENT_USER'
const CHANGE_CURRENT_DIALOG = 'CHANGE_CURRENT_DIALOG'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const CLEAR_DIALOGS = 'CLEAR_DIALOGS'


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

export const toggleIsFetching = (value) => ({
    type: TOGGLE_IS_FETCHING,
    value
})

export const clearDialogs = () => ({
    type: CLEAR_DIALOGS
})


export const changeMessageStatus = (dialogId, message, delivered, read) => {
    return () => {
        getMessage(dialogId, message.id).set({
            id: message.id,
            time: message.time,
            message: message.message,
            isDelivered: delivered,
            isRead: read,
            userId: message.userId
        })
            .catch(error => console.log(error))
    }
}

export const addNewMessage = (messageId, dialogId, userId, time, inputValue) => {
    return () => {
        getMessage(dialogId, messageId).set({
            id: messageId,
            time: time,
            message: inputValue,
            isDelivered: false,
            isRead: false,
            userId: userId
        })
            .catch(error => console.log(error))
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
    const dialogArr = Object.values(dialog).filter(i => i.id !== 'test_c027dd8a7509424b8f064848fa911f2b')
    dialogArr.sort((a, b) => {
        if (moment(a.time).valueOf() > moment(b.time).valueOf()) return 1
        if (moment(a.time).valueOf() < moment(b.time).valueOf()) return -1
        return 0
    })
    return dialogArr
}


const setUpdatedDialog = (data, userDialogs, userId) => {
    const updDialog = Object.values(data.content).filter(i => i.id !== 'test_c027dd8a7509424b8f064848fa911f2b')
    const oldDialog = userDialogs.find(i => i.dialogId === data.id).dialog
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


const setDialogObserver = (dispatch, getState, dialogKey, userId) => {
    getDialog(dialogKey).on('value', (dataSnapshot) => {
        const userDialogs = getState().dialogsDataReducer.dialogs
        if (userDialogs.length) {
            const { sortedMessages, sumUnreadMessages } = setUpdatedDialog(dataSnapshot.val(), userDialogs, userId)
            dispatch(updateDialog(dataSnapshot.val().id, sortedMessages, sumUnreadMessages))
        }
    })
}


const setCurrentDialogsObserver = (dispatch, getState, userId) => {
    getRefCurrentDialogs(userId).on('value', (dataSnapshot) => {
        const currentDialogsKeys = []
        getState().dialogsDataReducer.dialogs.forEach(i => currentDialogsKeys.push(i.dialogId))
        const userIsConfigured = !!getState().currentUser.currentUser
        const newDialogsKeys = Object.values(dataSnapshot.val()).filter(i => i !== 'test_82f89263fe5c4ed0ad1990b38f086a77')
        const newDialogKey = newDialogsKeys.find(i => i !== currentDialogsKeys.find(n => n === i))
        if (newDialogKey && userIsConfigured) {
            setDialogObserver(dispatch, getState, newDialogKey, userId)
            getDialog(newDialogKey)
                .once('value')
                .then(newDialog => {
                    getMembers(newDialog.val())
                        .then(members => {
                            const sortedMessages = sortMessages(newDialog.val().content)
                            dispatch(setDialogsAction({
                                dialogId: newDialog.val().id,
                                dialog: sortedMessages,
                                members: members,
                                unreadMessages: calculateUnreadMessages(sortedMessages, userId)
                            }))
                        })
                })
        }
    })
}


export const setDialogs = () => {
    return (dispatch, getState) => {
        const userId = localStorage.getItem('userId')
        setCurrentDialogsObserver(dispatch, getState, userId)

        getUser(userId).once('value')
            .then(item => {
                const currentDialogs = Object.values(item.val().currentDialogs)
                const dialogsPromises = []
                for (let i = 0; i < currentDialogs.length; i++) {
                    setDialogObserver(dispatch, getState, currentDialogs[i], userId)
                    if (currentDialogs[i] !== 'test_82f89263fe5c4ed0ad1990b38f086a77') {
                        const dialog = getDialog(currentDialogs[i]).once("value").then(item => item.val())
                        dialogsPromises.push(dialog)
                    }
                }

                Promise.all(dialogsPromises)
                    .then(dialogs => {
                        for (let i = 0; i < dialogs.length; i++) {
                             getMembers(dialogs[i])
                                .then(members => {
                                    const sortedMessages = sortMessages(dialogs[i].content)
                                    dispatch(setDialogsAction({
                                        dialogId: dialogs[i].id,
                                        dialog: sortedMessages,
                                        members: members,
                                        unreadMessages: calculateUnreadMessages(sortedMessages, userId)
                                    }))
                                })
                        }
                    })
                    .catch(error => console.log(error))

                return item.val()
            })
            .then(user => dispatch(setCurrentUser(user)))
            .catch(error => console.log(error))
    }
}

