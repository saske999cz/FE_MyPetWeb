import { addDays, format } from "date-fns"

const initState = {
    avatar: localStorage.getItem('avatar') == null 
        ? '' 
        : JSON.parse(localStorage.getItem('avatar')),
}

const rootReducer = (state = initState, action) => {
    switch (action.type) {
        case 'avatar/addAvatar':
            localStorage.setItem('avatar', JSON.stringify(action.payload));

            return {
                ...state,
                avatar: action.payload,
            }
        case 'avatar/removeAvatar':
            localStorage.setItem('avatar', JSON.stringify(''));

            return {
                ...state,
                avatar: action.payload,
            }
        default:
            return state;
    }
}

export default rootReducer;