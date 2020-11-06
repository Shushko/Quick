import firebase from "firebase";

export const getUser = (userId) => firebase.database().ref(`/users/${ userId }`)

export const searchByPhoneNumber = () => firebase.database().ref(`/users`).orderByChild('phoneNumber')

export const getDialog = (key) => firebase.database().ref(`/dialogs/${ key }`)

export const getMember = (key) => firebase.database().ref(`/users/${ key }`).once("value").then(item => item.val())

export const getMessage = (dialogId, messageId) => firebase.database().ref(`dialogs/${ dialogId }/content/${ messageId }`)

export const addNewDialog = (userId) => firebase.database().ref(`/users/${ userId }/currentDialogs`)

export const createUserCurrentDialogs = (userId, dialogId) =>
    firebase.database().ref(`/users/${ userId }/currentDialogs/${ dialogId }`).set(dialogId)

export const createDialog = (key, currentUserId, interlocutorId, time) => firebase.database().ref(`/dialogs/${ key }`).set({
    content: {
        test_c027dd8a7509424b8f064848fa911f2b: {
            id: "test_c027dd8a7509424b8f064848fa911f2b",
            isDelivered: true,
            isRead: true,
            message: '',
            time: time,
            userId: ''
        }
},
    id: key,
    members: { [currentUserId]: currentUserId, [interlocutorId]: interlocutorId }
})

