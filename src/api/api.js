import firebase from "firebase";
import axios from 'axios';

const getUrl = (endPoint, params = '') => {
    const URL = 'https://mymessenger-50d8e.firebaseio.com';
    const SECRET_CODE = 'rHbFJhNmq7pgFtEaBz1yR6DwOyGOTVIjNRAr8hjM';
    return `${ URL }/${ endPoint }/${ params }.json?auth=${ SECRET_CODE }`
};

export const getUser = (userId) => axios.get(getUrl('users', userId)).then(response => response.data);

export const addDialogToCurrentDialogs = (userId, currentDialogId, interlocutorHasCurrentDialogs) => {
    const url = getUrl('users', `${ userId }/currentDialogs`);
    const objTemp = { [currentDialogId]: currentDialogId };
    return interlocutorHasCurrentDialogs ?
        axios.patch(url, objTemp).catch(e => console.log(e)) :
        axios.put(url, objTemp).catch(e => console.log(e))
};

export const createDialog = async (key, currentUserId, interlocutorId) => {
    return await axios.put(getUrl('dialogs', key), {
        id: key,
        members: { [currentUserId]: currentUserId, [interlocutorId]: interlocutorId },
        communicationProcess: { isTyping: false }
    })
        .catch(e => console.log(e))
};

export const addMessage = (currentDialogId, message, isFirstMessage) => {
    const url = getUrl('dialogs', `${ currentDialogId }/content`);
    return isFirstMessage ?
        axios.put(url, message).catch(e => console.log(e)) :
        axios.patch(url, message).catch(e => console.log(e))
};

export const updateUserName = (newUserName, userId) => {
    return axios.patch(getUrl('users', userId), {
        name: newUserName
    })
};

export const updateUserAvatar = async (file, userID) => {
    const result = await firebase.storage().ref(`/Avatars/${ userID }`).put(file);
    if (result.state === 'success') {
        const userAvatarUrl = await firebase.storage().ref(`/Avatars/${ userID }`).getDownloadURL();
        const result = await axios.patch(getUrl('users', userID), {
            avatar: userAvatarUrl
        });
        if (result.statusText === 'OK') {
            return userAvatarUrl
        }
    }
};

export const updateMessageStatus = (dialogId, messageKey, isDelivered, isRead) => {
    axios.patch(getUrl('dialogs', `${ dialogId }/content/${ messageKey }`), {
        isDelivered: isDelivered,
        isRead: isRead
    })
        .catch(e => console.log(e));
};

export const setUserIsTyping = (dialogId, isTyping, userId, userName) => {
    axios.patch(getUrl('dialogs', `${ dialogId }/communicationProcess`), {
        isTyping: isTyping,
        userId: userId,
        userName: userName
    })
};

export const setUser = (userId, userPhoneNumber) => {
    firebase.database().ref(`/users/${ userId }`)
        .set({
            id: userId,
            name: '',
            phoneNumber: userPhoneNumber,
            avatar: 'https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png'
        })
};

export const searchByPhoneNumber = (value) => firebase.database().ref(`/users`)
    .orderByChild('phoneNumber')
    .startAt(value)
    .endAt(value + "\uf8ff")
    .once('value')

export const getRefCurrentDialogs = (userId) => firebase.database().ref(`/users/${ userId }/currentDialogs`);

export const getRefDialogContent = (key) => firebase.database().ref(`/dialogs/${ key }/content`);

export const getRefDialogCommunicationProcess = (key) => firebase.database().ref(`/dialogs/${ key }/communicationProcess`);

export const getSomeMessages = (dialogId, endTime, limit) => {
    return firebase.database().ref(`/dialogs/${ dialogId }/content`)
        .orderByChild('time')
        .startAt(0)
        .endAt(endTime - 1)
        .limitToLast(limit)
        .once('value')
};

export const getUnwatchedMessages = (dialogId) => {
    return firebase.database().ref(`/dialogs/${ dialogId }/content`)
        .orderByChild('isRead')
        .startAt(false)
        .endAt(false)
        .once('value')
};


export const getDialogMembersId = async (dialogId) => {
    const result = await axios.get(getUrl('dialogs', `${ dialogId }/members`));
    return Object.values(result.data)
}



