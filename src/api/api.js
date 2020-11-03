import firebase from "firebase";

export const getUser = (userId) => firebase.database().ref(`/users/${ userId }`)

export const getDialog = (key) => firebase.database().ref(`/dialogs/${ key }`)

export const getMember = (key) => firebase.database().ref(`/users/${ key }`).once("value").then(item => item.val())

export const getMessage = (dialogId, messageId) => firebase.database().ref(`dialogs/${ dialogId }/content/${ messageId }`)

