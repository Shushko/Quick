const APP_IS_INITIALIZED = 'APP_IS_INITIALIZED';
const TOGGLE_APP_VERSION = 'TOGGLE_APP_VERSION';
const CHANGE_SCREEN_WIDTH = 'CHANGE_SCREEN_WIDTH';

const init = {
    appIsInitialized: false,
    isMobileVersion: false,
    screenWidth: null,
};

const appState = (state = init, action) => {
    switch (action.type) {
        case 'APP_IS_INITIALIZED':
            return {
                ...state,
                appIsInitialized: action.appIsInitialized
            };

        case 'TOGGLE_APP_VERSION':
            return {
                ...state,
                isMobileVersion: action.isMobileVersion
            };

        case 'CHANGE_SCREEN_WIDTH':
            return {
                ...state,
                screenWidth: action.screenWidth
            };

        default:
            return state

    }
};

export const toggleAppIsInit = (appIsInitialized) => ({
    type: APP_IS_INITIALIZED,
    appIsInitialized
})

export const toggleAppVersion = (isMobileVersion) => ({
    type: TOGGLE_APP_VERSION,
    isMobileVersion
})

export const changeScreenWidth = (screenWidth) => ({
    type: CHANGE_SCREEN_WIDTH,
    screenWidth
});

export default appState