import * as actionTypes from "../common/constant/ActionTypes"

export const login = jwt => ({
    type: actionTypes.LOGIN,
    logged: true,
    jwt
});

export const logout = () => ({
    type: actionTypes.LOGOUT,
    logged: false,
});

export const setUserInfo = user => ({
        type: actionTypes.SET_USER,
        user: user
    }
);

