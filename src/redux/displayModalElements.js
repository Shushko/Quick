const TOGGLE_MENU_IS_VISIBLE = 'TOGGLE_MENU_IS_VISIBLE';
const TOGGLE_FIND_USER_MENU_VISIBILITY = 'TOGGLE_FIND_USER_MENU_VISIBILITY';
const TOGGLE_PHOTO_EDITOR_VISIBILITY = 'TOGGLE_PHOTO_EDITOR_VISIBILITY';
const HIDE_ALL_MODAL_WINDOWS = 'HIDE_ALL_MODAL_WINDOWS';

const init = {
    activeTitle: '',
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
                darkBackgroundIsVisible: action.darkBackgroundIsVisible,
                activeTitle: action.activeTitle,
                findUserMenuIsVisible: false,
                photoEditorIsVisible: false
            };

        case 'TOGGLE_FIND_USER_MENU_VISIBILITY':
            return {
                ...state,
                menuIsVisible: action.menuIsVisible,
                findUserMenuIsVisible: action.findUserMenuIsVisible,
                darkBackgroundIsVisible: action.darkBackgroundIsVisible,
                activeTitle: action.activeTitle
            };

        case 'TOGGLE_PHOTO_EDITOR_VISIBILITY':
            return {
                ...state,
                menuIsVisible: action.menuIsVisible,
                photoEditorIsVisible: action.photoEditorIsVisible,
                darkBackgroundIsVisible: action.darkBackgroundIsVisible,
                activeTitle: action.activeTitle
            };

        case 'HIDE_ALL_MODAL_WINDOWS':
            return {
                ...state,
                menuIsVisible: false,
                findUserMenuIsVisible: false,
                photoEditorIsVisible: false,
                darkBackgroundIsVisible: false,
                activeTitle: ''
            };

        default:
            return state

    }
};

export const toggleMenuVisibility = (menuIsVisible, darkBackgroundIsVisible, activeTitle) => ({
    type: TOGGLE_MENU_IS_VISIBLE,
    menuIsVisible,
    darkBackgroundIsVisible,
    activeTitle
});

export const toggleFindUserMenuVisibility = (menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible, activeTitle) => ({
    type: TOGGLE_FIND_USER_MENU_VISIBILITY,
    menuIsVisible,
    findUserMenuIsVisible,
    darkBackgroundIsVisible,
    activeTitle
});

export const togglePhotoEditorVisibility = (menuIsVisible, photoEditorIsVisible, darkBackgroundIsVisible, activeTitle) => ({
    type: TOGGLE_PHOTO_EDITOR_VISIBILITY,
    menuIsVisible,
    photoEditorIsVisible,
    darkBackgroundIsVisible,
    activeTitle
});

export const hideAllModalWindows = () => ({
    type: HIDE_ALL_MODAL_WINDOWS
});

export default displayModalElements