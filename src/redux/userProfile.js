import { setUser, updateUserAvatar, updateUserName } from "../api/api";
import { togglePhotoEditorPreloader } from "./preloader";
import { toggleNotificationVisibility } from "./notification";
import { toggleAppIsInit } from "./appState";
import { clearDialogs } from "./dialogs/dialogsActions";

const SET_AUTHORIZED_USER = 'SET_AUTHORIZED_USER';
const SET_CURRENT_USER = 'SET_CURRENT_USER';
const SET_USER_NAME = 'SET_USER_NAME';
const SET_USER_AVATAR = 'SET_USER_AVATAR';

const init = {
    userIsAuthorized: JSON.parse(localStorage.getItem('userIsAuthorized')),
    currentUser: null
};

const userProfile = (state = init, action) => {
    switch (action.type) {

        case 'SET_AUTHORIZED_USER':
            return {
                ...state,
                userIsAuthorized: action.value
            };

        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.currentUser
            };

        case 'SET_USER_NAME':
            return {
                ...state,
                currentUser: { ...state.currentUser, name: action.userName }
            };

        case 'SET_USER_AVATAR':
            return {
                ...state,
                currentUser: { ...state.currentUser, avatar: action.userAvatarUrl }
            };

        default:
            return state
    }
};

export const setUserIsAuthorized = (value) => ({
    type: SET_AUTHORIZED_USER,
    value
});

export const setCurrentUser = (currentUser) => ({
    type: SET_CURRENT_USER,
    currentUser
});

export const setUserName = (userName) => ({
    type: SET_USER_NAME,
    userName
});

export const setUserAvatar = (userAvatarUrl) => ({
    type: SET_USER_AVATAR,
    userAvatarUrl
});

export const setAuthorizedUser = (isNewUser, userId, userPhoneNumber) => async (dispatch) => {
    if (isNewUser) {
        const result = await setUser(userId, userPhoneNumber);
        if (result.statusText !== 'OK') { return }
    }
    localStorage.setItem('userId', userId);
    localStorage.setItem('userIsAuthorized', 'true');
    dispatch(setUserIsAuthorized(true));
};

export const changeUserAvatar = (file, userID) => async (dispatch) => {
    const userAvatarUrl = await updateUserAvatar(file, userID);
    if (userAvatarUrl) {
        dispatch(setUserAvatar(userAvatarUrl));
        dispatch(togglePhotoEditorPreloader(false));
        dispatch(toggleNotificationVisibility(true, 'Photo uploaded successfully'));
        setTimeout(() => dispatch(toggleNotificationVisibility(false, '')), 3000)
    }
};

export const changeUserName = (newUserName, userId) => async (dispatch) => {
    try {
        const result = await updateUserName(newUserName, userId);
        result.statusText === 'OK' && dispatch(setUserName(newUserName));
    } catch (e) {
        console.log(e);
    }
};

export const logOutUser = () => {
    return (dispatch) => {
        dispatch(clearDialogs());
        dispatch(setCurrentUser(null));
        dispatch(setUserIsAuthorized(false));
        dispatch(toggleAppIsInit(false));
        localStorage.removeItem('userIsAuthorized');
        localStorage.removeItem('userId');
    }
};

export default userProfile