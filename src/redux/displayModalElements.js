const TOGGLE_MENU_IS_VISIBLE = 'TOGGLE_MENU_IS_VISIBLE';
const TOGGLE_FIND_USER_MENU_VISIBILITY = 'TOGGLE_FIND_USER_MENU_VISIBILITY';
const TOGGLE_PHOTO_EDITOR_VISIBILITY = 'TOGGLE_PHOTO_EDITOR_VISIBILITY';
const HIDE_ALL_MODAL_WINDOWS = 'HIDE_ALL_MODAL_WINDOWS';

const init = {
    menuIsVisible: false,
    findUserMenuIsVisible: false,
    photoEditorIsVisible: false,
    darkBackgroundIsVisible: false
};

const displayModalElements = (state = init, action) => {
    switch (action.type) {

        case 'TOGGLE_MENU_IS_VISIBLE':
            return {
                ...state,
                menuIsVisible: action.menuIsVisible,
                darkBackgroundIsVisible: action.darkBackgroundIsVisible
            };

        case 'TOGGLE_FIND_USER_MENU_VISIBILITY':
            return {
                ...state,
                menuIsVisible: action.menuIsVisible,
                findUserMenuIsVisible: action.findUserMenuIsVisible,
                darkBackgroundIsVisible: action.darkBackgroundIsVisible
            };

        case 'TOGGLE_PHOTO_EDITOR_VISIBILITY':
            return {
                ...state,
                menuIsVisible: action.menuIsVisible,
                photoEditorIsVisible: action.photoEditorIsVisible,
                darkBackgroundIsVisible: action.darkBackgroundIsVisible
            };

        case 'HIDE_ALL_MODAL_WINDOWS':
            return {
                ...state,
                menuIsVisible: false,
                findUserMenuIsVisible: false,
                photoEditorIsVisible: false,
                darkBackgroundIsVisible: false
            };

        default:
            return state

    }
};

export const toggleMenuVisibility = (menuIsVisible) => ({
    type: TOGGLE_MENU_IS_VISIBLE,
    menuIsVisible,
    darkBackgroundIsVisible: menuIsVisible
});

export const toggleFindUserMenuVisibility = (menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible) => ({
    type: TOGGLE_FIND_USER_MENU_VISIBILITY,
    menuIsVisible,
    findUserMenuIsVisible,
    darkBackgroundIsVisible
});

export const togglePhotoEditorVisibility = (menuIsVisible, photoEditorIsVisible, darkBackgroundIsVisible) => ({
    type: TOGGLE_PHOTO_EDITOR_VISIBILITY,
    menuIsVisible,
    photoEditorIsVisible,
    darkBackgroundIsVisible
});

export const hideAllModalWindows = () => ({
    type: HIDE_ALL_MODAL_WINDOWS
});

export default displayModalElements