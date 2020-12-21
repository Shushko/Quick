const TOGGLE_PRELOADER = 'TOGGLE_PRELOADER';

const init = {
    preloaderIsVisible: true
}

const preloader = (state = init, action) => {
    switch (action.type) {

        case 'TOGGLE_PRELOADER':
            return {
                ...state,
                preloaderIsVisible: action.value
            };

        default:
            return state

    }
}

export const togglePreloader = (value) => ({
    type: TOGGLE_PRELOADER,
    value
})

export default preloader