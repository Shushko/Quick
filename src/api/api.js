import firebase from "firebase";

export const getUser = (userId) => firebase.database().ref(`/users/${ userId }`)

export const searchByPhoneNumber = (value) => firebase.database().ref(`/users`)
    .orderByChild('phoneNumber')
    .startAt(value)
    .endAt(value + "\uf8ff")
    .once('value')

export const getDialog = (key) => firebase.database().ref(`/dialogs/${ key }`)

export const getMember = (key) => firebase.database().ref(`/users/${ key }`).once("value").then(item => item.val())

export const getMessage = (dialogId, messageId) => firebase.database().ref(`dialogs/${ dialogId }/content/${ messageId }`)

export const getRefCurrentDialogs = (userId) => firebase.database().ref(`/users/${ userId }/currentDialogs`)

export const createDialog = (key, currentUserId, interlocutorId) => firebase.database().ref(`/dialogs/${ key }`).set({
    id: key,
    members: { [currentUserId]: currentUserId, [interlocutorId]: interlocutorId }
})

