import {
    getUser,
    getRefCurrentDialogs,
    getRefDialog,
    addDialogToCurrentDialogs,
    createDialog,
    updateMessageStatus,
    addMessage,
    getSomeMessages, getDialogMembersId, getUnwatchedMessages
} from "../../api/api";
import { setCurrentUser } from "../userProfile";
import { toggleAppIsInit } from "../appState";

const CLEAR_DIALOGS = 'CLEAR_DIALOGS';
const ADD_NEW_DIALOG = 'ADD_NEW_DIALOG';
const ADD_NEW_MESSAGE_TO_DIALOG = 'ADD_NEW_MESSAGE_TO_DIALOG';
const CHANGE_TOTAL_COUNT_UNREAD_MESSAGES = 'CHANGE_TOTAL_COUNT_UNREAD_MESSAGES';
const UPDATE_DIALOG = 'UPDATE_DIALOG';

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



const getUserDialog = (getState, dialogId) => getState().dialogsReducer.dialogs.find(i => i.dialogId === dialogId);

export const changeMessageStatus = (dialogId, message, isDelivered, isRead) => () => updateMessageStatus(dialogId, message.time, isDelivered, isRead);

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
    const resultUploadMessages = await getSomeMessages(dialogId, lastMessageTime, 20);
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

const setDialogObserver = async (currentUserId, dialogId, getState, dispatch) => {
    const result = await getUnwatchedMessages(dialogId);
    const unwatchedMessages = result.val();
    if (unwatchedMessages) {
        for (let messageKey in unwatchedMessages) {
            let message = unwatchedMessages[messageKey];
            !message.isDelivered && updateMessageStatus(dialogId, message.time, true, false);
        }
    }

    getRefDialog(dialogId).on('value', async (snapshot) => {
        const appIsInitialized = getState().appState.appIsInitialized;
        if (appIsInitialized && !!snapshot.val()) {
            if (snapshot.val().hasOwnProperty('content')) {
                const updatedContent = Object.values(snapshot.val().content);
                const dialogMessages = getUserDialog(getState, dialogId).messages;
                const dialogLength = dialogMessages.length;
                const newContent = updatedContent.slice(-dialogLength);
                dispatch(updateDialog(dialogId, newContent));
                const newLastMessage = newContent[newContent.length - 1];
                const currentLastMessage = dialogMessages[dialogMessages.length - 1];
                const isNewMessage = !currentLastMessage || newLastMessage.id !== currentLastMessage.id;
                isNewMessage && currentUserId !== newLastMessage.userId &&
                updateMessageStatus(dialogId, newLastMessage.time, true, false);
                setTotalCountUnreadMessages(updatedContent, currentUserId, dialogId, dispatch);
            }
        }
    })
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
            const arrayWithLastMessage = await getLastMessageFromDialog(newDialogId);
            const dialogMembers = await getMembersFromDialog(newDialogId);
            dispatch(addNewDialog({
                dialogId: newDialogId,
                messages: arrayWithLastMessage,
                members: dialogMembers,
                unreadMessages: null,
                chatIsOpened: false
            }));
            await setDialogObserver(currentUserId, newDialogId, getState, dispatch);
            !arrayWithLastMessage.length && routeHistory.push(`/${ newDialogId }`)
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
            await setDialogObserver(currentUser.id, dialogId, getState, dispatch);
            const lastMessage = await getLastMessageFromDialog(dialogId);
            const dialogMembers = await getMembersFromDialog(dialogId);
            const result = await getUnwatchedMessages(dialogId);
            const totalCountUnreadMessages = result.val() ?
                Object.values(result.val()).filter(message => message.userId !== currentUserId).length : 0;

            dispatch(addNewDialog({
                dialogId: dialogId,
                messages: lastMessage,
                members: dialogMembers,
                unreadMessages: totalCountUnreadMessages,
                chatIsOpened: false
            }))
        }
    }
    dispatch(toggleAppIsInit(true));
};

