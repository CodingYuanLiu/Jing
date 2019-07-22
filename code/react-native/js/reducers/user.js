import {
    LOGIN,
    LOGOUT,
    SET_USER
} from "../common/constant/ActionTypes"

const initialState = {
    logged: false,
    user: {
        id: "",
        username: "",
        nickname: "",
        signature: "",
        avatarUri: "",
    },
    jwt: "",
}

const user = (state=initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return Object.assign({}, state, {logged: true, jwt: action.jwt});
        case LOGOUT:
            return initialState;
        case SET_USER:
            return Object.assign({}, state, {user:action.user});
        default:
            return state;
    }

};

export default user
