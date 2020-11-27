import firebase from "firebase";

export const getUser = (userId) => firebase.database().ref(`/users/${ userId }`).once("value")

export const setUser = (userId, userPhoneNumber) => firebase.database().ref(`/users/${ userId }`)
    .set({
        id: userId,
        name: '',
        phoneNumber: userPhoneNumber,
        avatar: 'https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png'
    })

export const searchByPhoneNumber = (value) => firebase.database().ref(`/users`)
    .orderByChild('phoneNumber')
    .startAt(value)
    .endAt(value + "\uf8ff")
    .once('value')

export const getDialog = (key) => firebase.database().ref(`/dialogs/${ key }`).once("value")

export const getRefDialog = (key) => firebase.database().ref(`/dialogs/${ key }`)

export const getMember = (key) => firebase.database().ref(`/users/${ key }`).once("value").then(item => item.val())

export const addMessage = (dialogId, messageId, time, inputValue, userId, isSet) => {
    const refTemp = firebase.database().ref(`dialogs/${ dialogId }/content/${ messageId }`)
    const messTemp = {
        id: messageId,
        time: time,
        message: inputValue,
        isDelivered: false,
        isRead: false,
        userId: userId
    }

    isSet ? refTemp.set(messTemp).catch(error => console.log(error)) : refTemp.update(messTemp).catch(error => console.log(error))
}

export const updateMessage = (dialogId, messageId, delivered, read) => firebase.database().ref(`dialogs/${ dialogId }/content/${ messageId }`)
    .update({
        isDelivered: delivered,
        isRead: read
    })
    .catch(error => console.log(error))

export const getRefCurrentDialogs = (userId) => firebase.database().ref(`/users/${ userId }/currentDialogs`)

export const createCurrentDialogs = (userId, dialogId, isSet) => {
    const refTemp = firebase.database().ref(`/users/${ userId }/currentDialogs`)
    const objTemp = { [dialogId]: dialogId }
    isSet ? refTemp.set(objTemp).catch(error => console.log(error)) : refTemp.update(objTemp).catch(error => console.log(error))
}

export const createDialog = (key, currentUserId, interlocutorId) => firebase.database().ref(`/dialogs/${ key }`).set({
    id: key,
    members: { [currentUserId]: currentUserId, [interlocutorId]: interlocutorId }
})

