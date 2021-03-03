import {
    getUser,
    getRefCurrentDialogs,
    getRefDialogContent,
    addDialogToCurrentDialogs,
    createDialog,
    updateMessageStatus,
    addMessage,
    getSomeMessages, getDialogMembersId, getUnwatchedMessages, setUserIsTyping, getRefDialogCommunicationProcess, getDateOfDialogCreation
} from "../../api/api";
import { setCurrentUser } from "../userProfile";
import { toggleAppIsInit } from "../appState";

const CLEAR_DIALOGS = 'CLEAR_DIALOGS';
const ADD_NEW_DIALOG = 'ADD_NEW_DIALOG';
const ADD_NEW_MESSAGE_TO_DIALOG = 'ADD_NEW_MESSAGE_TO_DIALOG';
const CHANGE_TOTAL_COUNT_UNREAD_MESSAGES = 'CHANGE_TOTAL_COUNT_UNREAD_MESSAGES';
const UPDATE_DIALOG = 'UPDATE_DIALOG';
const SET_COMMUNICATION_PROCESS = 'SET_COMMUNICATION_PROCESS';

export const clearDialogs = () => ({
    type: CLEAR_DIALOGS
});

const addNewDialog = (dialog) => ({
    type: ADD_NEW_DIALOG,
    dialog
});

const addNewMessageToDialog = (dialogId, newMessage) => ({
    type: ADD_NEW_MESSAGE_TO_DIALOG,
    dialogId,
    newMessage
});

const changeTotalCountUnreadMessages = (dialogId, totalSum) => ({
    type: CHANGE_TOTAL_COUNT_UNREAD_MESSAGES,
    dialogId,
    totalSum
});

const updateDialog = (dialogId, newContent) => ({
    type: UPDATE_DIALOG,
    dialogId,
    newContent
});

const setCommunicationProcess = (typingUser) => ({
    type: SET_COMMUNICATION_PROCESS,
    typingUser
});



const getUserDialog = (getState, dialogId) => getState().dialogsReducer.dialogs.find(i => i.dialogId === dialogId);

export const changeMessageStatus = (dialogId, message, isDelivered, isRead) => () => updateMessageStatus(dialogId, message.time, isDelivered, isRead);

export const toggleUserIsTyping = (dialogId, isTyping, userId, userName) => () => setUserIsTyping(dialogId, isTyping, userId, userName);

export const addNewMessage = (interlocutorId, currentDialogId, isFirstMessage, message) => async () => {
    if (isFirstMessage) {
        const interlocutor = await getUser(interlocutorId);
        const interlocutorHasCurrentDialogs = interlocutor.hasOwnProperty('currentDialogs');
        addDialogToCurrentDialogs(interlocutorId, currentDialogId, interlocutorHasCurrentDialogs);
    }
    addMessage(currentDialogId, message, isFirstMessage);
};

export const createNewDialog = (dialogId, currentUserId, interlocutorId) => {
    return async (dispatch, getState) => {
        const createDialogResult = await createDialog(dialogId, currentUserId, interlocutorId);
        if (createDialogResult.statusText === 'OK') {
            const currentUserHasDialogs = !!getState().dialogsReducer.dialogs.length;
            addDialogToCurrentDialogs(currentUserId, dialogId, currentUserHasDialogs);
        }
    }
};

export const uploadChatMessages = (dialogId, lastMessageTime) => async (dispatch) => {
    const UPLOAD_MESSAGES_LIMIT = 100;
    const resultUploadMessages = await getSomeMessages(dialogId, lastMessageTime, UPLOAD_MESSAGES_LIMIT);
    if (resultUploadMessages.val()) {
        const uploadedMessages = Object.values(resultUploadMessages.val());
        dispatch(addNewMessageToDialog(dialogId, uploadedMessages));
    }
};

const getLastMessageFromDialog = async (dialogId) => {
    const result = await getSomeMessages(dialogId, Date.now(), 1);
    return result.val() ? Object.values(result.val()) : [];
};

const getMembersFromDialog = async (dialogId) => {
    const dialogMembersId = await getDialogMembersId(dialogId);
    let dialogMembers = [];
    for (let memberId of dialogMembersId) {
        const dialogMember = await getUser(memberId);
        dialogMembers = [...dialogMembers, dialogMember]
    }
    return dialogMembers
};

const setTotalCountUnreadMessages = (updatedContent, currentUserId, dialogId, dispatch) => {
    const reversedMessages = [...updatedContent].reverse();
    let totalSum = 0;
    for (let index = 0; index < reversedMessages.length; index++) {
        const isUserMessage = reversedMessages[index].userId === currentUserId;
        const messageIsRead = reversedMessages[index].isRead;
        if (!messageIsRead && !isUserMessage) { totalSum += 1 }
        if (isUserMessage || (!isUserMessage && messageIsRead)) { break }
    }
    dispatch(changeTotalCountUnreadMessages(dialogId, totalSum));
};

const setDialogObserver = async (currentUserId, dialogId, getState, dispatch, isNewDialog) => {
    if (!isNewDialog) {
        const result = await getUnwatchedMessages(dialogId);
        const unwatchedMessages = result.val();
        if (unwatchedMessages) {
            for (let messageKey in unwatchedMessages) {
                let message = unwatchedMessages[messageKey];
                if (!message.isDelivered && message.userId !== currentUserId) {
                    updateMessageStatus(dialogId, message.time, true, false);
                }
            }
        }
    }

    getRefDialogCommunicationProcess(dialogId).on('value', (snapshot) => {
        const appIsInitialized = getState().appState.appIsInitialized;
        if (appIsInitialized) {
            snapshot.val().isTyping && snapshot.val().userId !== currentUserId ?
                dispatch(setCommunicationProcess({ ...snapshot.val(), dialogId: dialogId })) :
                dispatch(setCommunicationProcess(null))
        }
    });

    getRefDialogContent(dialogId).on('value', async (snapshot) => {
        const appIsInitialized = getState().appState.appIsInitialized;
        if (appIsInitialized && !!snapshot.val()) {
            const updatedContent = Object.values(snapshot.val());
            const dialogMessages = getUserDialog(getState, dialogId).messages;
            const dialogLength = dialogMessages.length;
            const newContent = updatedContent.slice(-dialogLength - 1);
            dispatch(updateDialog(dialogId, newContent));
            const newLastMessage = newContent[newContent.length - 1];
            const currentLastMessage = dialogMessages[dialogMessages.length - 1];
            const isNewMessage = !currentLastMessage || newLastMessage.id !== currentLastMessage.id;
            isNewMessage && currentUserId !== newLastMessage.userId &&
            updateMessageStatus(dialogId, newLastMessage.time, true, false);
            setTotalCountUnreadMessages(updatedContent, currentUserId, dialogId, dispatch);
        }
    })
};

const setDialogToState = async (dialogId, currentUserId, appIsInitialized, routeHistory, dispatch) => {
    const arrayWithLastMessage = await getLastMessageFromDialog(dialogId);
    const dialogMembers = await getMembersFromDialog(dialogId);
    const dateOfDialogCreation = await getDateOfDialogCreation(dialogId);
    const result = await getUnwatchedMessages(dialogId);
    const totalCountUnreadMessages = result.val() ?
        Object.values(result.val()).filter(message => message.userId !== currentUserId).length : 0;

    dispatch(addNewDialog({
        dialogId: dialogId,
        messages: arrayWithLastMessage,
        members: dialogMembers,
        unreadMessages: totalCountUnreadMessages,
        dateOfCreation: dateOfDialogCreation,
        chatIsOpened: false
    }));
    appIsInitialized && !arrayWithLastMessage.length && routeHistory.push(`/${ dialogId }`)
};

const setCurrentDialogsObserver = (currentUserId, dispatch, getState, routeHistory) => {
    getRefCurrentDialogs(currentUserId).on('value', async (snapshot) => {
        const appIsInitialized = getState().appState.appIsInitialized;
        if (appIsInitialized && !!snapshot.val()) {
            const newUserDialogsKeys = Object.keys(snapshot.val());
            const userDialogsId = getState().dialogsReducer.dialogs.map(dialog => dialog.dialogId);
            const newDialogId = userDialogsId.length ?
                newUserDialogsKeys.find(key => key !== userDialogsId.find(id => id === key)) :
                newUserDialogsKeys[0];
            await setDialogToState(newDialogId, currentUserId, appIsInitialized, routeHistory, dispatch);
            await setDialogObserver(currentUserId, newDialogId, getState, dispatch, true);
        }
    })
};

export const setUserDialogs = (routeHistory) => async (dispatch, getState) => {
    const currentUserId = localStorage.getItem('userId');
    const currentUser = await getUser(currentUserId);
    dispatch(setCurrentUser(currentUser));
    setCurrentDialogsObserver(currentUserId, dispatch, getState, routeHistory);

    if (currentUser.hasOwnProperty('currentDialogs')) {
        for (let dialogId in currentUser.currentDialogs) {
          await setDialogObserver(currentUser.id, dialogId, getState, dispatch, false);
          await setDialogToState(dialogId, currentUser.id, false, routeHistory, dispatch);
        }
    }
    dispatch(toggleAppIsInit(true));
};

