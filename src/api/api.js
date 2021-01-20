import firebase from "firebase";
import axios from 'axios'

const getUrl = (endPoint, params = '') => {
    const URL = 'https://mymessenger-50d8e.firebaseio.com';
    const SECRET_CODE = 'rHbFJhNmq7pgFtEaBz1yR6DwOyGOTVIjNRAr8hjM';
    return `${ URL }/${ endPoint }/${ params }.json?auth=${ SECRET_CODE }`
};

export const getDialog = (dialogId) => axios.get(getUrl('dialogs', dialogId)).then(response => response.data);

export const getUser = (userId) => axios.get(getUrl('users', userId)).then(response => response.data);

export const createCurrentDialogs = (userId, dialogId, userHasCurrentDialogs) => {
    const url = getUrl('users', `${ userId }/currentDialogs`);
    const objTemp = { [dialogId]: dialogId };
    userHasCurrentDialogs ?
        axios.patch(url, objTemp).catch(e => console.log(e)) :
        axios.put(url, objTemp).catch(e => console.log(e))
};

export const createDialog = async (key, currentUserId, interlocutorId) => {
    return await axios.put(getUrl('dialogs', key), {
        id: key,
        members: { [currentUserId]: currentUserId, [interlocutorId]: interlocutorId }
    })
        .catch(e => console.log(e))
};

export const addMessage = (dialogId, messageId, time, inputValue, userId, dialogHasContent) => {
    const url = getUrl('dialogs', `${ dialogId }/content`);
    const messTemp = {
        [messageId]:{
            id: messageId,
            time: time,
            message: inputValue,
            isDelivered: false,
            isRead: false,
            userId: userId
        }
    };
    dialogHasContent ?
        axios.patch(url, messTemp).catch(e => console.log(e)) :
        axios.put(url, messTemp).catch(e => console.log(e))
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

export const updateMessage = (dialogId, messageId, delivered, read) => {
    axios.patch(getUrl('dialogs', `${ dialogId }/content/${ messageId }`), {
        isDelivered: delivered,
        isRead: read
    })
        .catch(e => console.log(e));
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

export const getRefDialog = (key) => firebase.database().ref(`/dialogs/${ key }`);





