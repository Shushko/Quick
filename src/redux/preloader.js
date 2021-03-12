const TOGGLE_PRELOADER = 'TOGGLE_PRELOADER';
const TOGGLE_PHOTO_EDITOR_PRELOADER = 'TOGGLE_PHOTO_EDITOR_PRELOADER';
const TOGGLE_CHAT_PRELOADER = 'TOGGLE_CHAT_PRELOADER';

const init = {
    preloaderIsVisible: false,
    photoEditorPreloaderIsVisible: false,
    chatPreloaderIsVisible: true
};

const preloader = (state = init, action) => {
    switch (action.type) {

        case 'TOGGLE_PRELOADER':
            return {
                ...state,
                preloaderIsVisible: action.value
            };

        case 'TOGGLE_CHAT_PRELOADER':
            return {
                ...state,
                chatPreloaderIsVisible: action.value
            };

        case 'TOGGLE_PHOTO_EDITOR_PRELOADER':
            return {
                ...state,
                photoEditorPreloaderIsVisible: action.value
            };

        default:
            return state

    }
};

export const togglePreloader = (value) => ({
    type: TOGGLE_PRELOADER,
    value
});

export const toggleChatPreloader = (value) => ({
    type: TOGGLE_CHAT_PRELOADER,
    value
});

export const togglePhotoEditorPreloader = (value) => ({
    type: TOGGLE_PHOTO_EDITOR_PRELOADER,
    value
});

export default preloader