import {
    LOGIN,
    LOGOUT,
    SET_USER
} from "../constant/ActionTypes"

const initialState = {
    logged: false,
    user: {
        username: "",
        signature: "",
        credit: "",
    },
    jwt: "",
}

const user = (state=initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return Object.assign({}, state, {logged: true})
        case LOGOUT:
            return initialState
        case SET_USER:
            return Object.assign({}, state, {user:action.user})
        default:
            return state
    }

}

export default user
