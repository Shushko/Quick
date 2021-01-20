const TOGGLE_NOTIFICATION_VISIBILITY = 'TOGGLE_NOTIFICATION_VISIBILITY';

const init = {
    notificationIsVisible: false,
    notificationContent: ''
};

const notification = (state = init, action) => {
    switch (action.type) {

        case 'TOGGLE_NOTIFICATION_VISIBILITY':
            return {
                ...state,
                notificationIsVisible: action.isVisible,
                notificationContent: action.notificationContent
            };

        default:
            return state
    }
}

export const toggleNotificationVisibility = (isVisible, notificationContent) => ({
    type: TOGGLE_NOTIFICATION_VISIBILITY,
    isVisible,
    notificationContent
});

export default notification