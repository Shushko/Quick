import moment from "moment";
import { getCurrentUser, getDialog, getMember, getMessage } from "../../api/api";

const SET_DIALOGS = 'SET_DIALOGS'
const UPDATE_DIALOG = 'UPDATE_DIALOG'
const SET_CURRENT_USER = 'SET_CURRENT_USER'
const CHANGE_CURRENT_DIALOG = 'CHANGE_CURRENT_DIALOG'
const CHANGE_INPUT = 'CHANGE_INPUT'
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

export const onChangeInput = (value) => ({
    type: CHANGE_INPUT,
    value
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
    return (dispatch) => {
        getMessage(dialogId, messageId).set({
            id: messageId,
            time: time,
            message: inputValue,
            isDelivered: false,
            isRead: false,
            userId: userId
        })
            .then(() => dispatch(onChangeInput('')))
            .catch(error => console.log(error))
    }
}

const calculateUnreadMessages = (dialog, userId) => {
    const dialogArr = Object.values(dialog)
    let sumUnreadMessages = 0
    dialogArr.forEach(i => {
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
    const oldDialog = Object.values(userDialogs.find(i => i.id === data.id).content)
    const updMessage = updDialog.find(i => !oldDialog.find(n => i.id === n.id))
    if (updMessage && !updMessage.isDelivered && updMessage.userId !== userId) {
        changeMessageStatus(data.id, updMessage, true, updMessage.isRead)()
    }
    const sortedMessages = sortMessages(data.content)
    const sumUnreadMessages = calculateUnreadMessages(data.content, userId)
    return { sortedMessages, sumUnreadMessages }
}

export const setDialogs = () => {
    return (dispatch) => {
        const userId = localStorage.getItem('userId')
        let userDialogs = null

        getCurrentUser(userId)
            .then(item => {
                const currentDialogs = Object.values(item.val().currentDialogs)
                const dialogsPromises = []
                for (let i = 0; i < currentDialogs.length; i++) {
                    const dialog = getDialog(currentDialogs[i]).once("value").then(item => item.val())

                    getDialog(currentDialogs[i]).on("value", (dataSnapshot) => {
                        if (userDialogs) {
                            const { sortedMessages, sumUnreadMessages } = setUpdatedDialog(dataSnapshot.val(), userDialogs, userId)
                            dispatch(updateDialog(dataSnapshot.val().id, sortedMessages, sumUnreadMessages))
                        }
                    })
                    dialogsPromises.push(dialog)
                }

                Promise.all(dialogsPromises)
                    .then(dialogs => {
                        userDialogs = dialogs
                        for (let i = 0; i < dialogs.length; i++) {
                            const dialogMembers = Object.values(dialogs[i].members)
                            const membersPromise = []
                            for (let n = 0; n < dialogMembers.length; n++) {
                                const member = getMember(dialogMembers[n])
                                membersPromise.push(member)
                            }

                            Promise.all(membersPromise)
                                .then(members => {
                                    dispatch(setDialogsAction({
                                        dialogId: dialogs[i].id,
                                        dialog: sortMessages(dialogs[i].content),
                                        members: members,
                                        unreadMessages: calculateUnreadMessages(dialogs[i].content, userId)
                                    }))
                                })
                                .catch(error => console.log(error))
                        }
                    })
                    .catch(error => console.log(error))

                return item.val()
            })
            .then(user => dispatch(setCurrentUser(user)))
            .catch(error => console.log(error))
    }
}

