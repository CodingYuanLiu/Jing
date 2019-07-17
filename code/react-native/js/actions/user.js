import * as actionTypes from "../constant/ActionTypes"

export const login = jwt => ({
    type: actionTypes.LOGIN,
    logged: true,
    jwt
})

export const logout = () => ({
    type: actionTypes.LOGOUT,
    logged: false,
})

export const setUserInfo = user => ({
        type: actionTypes.SET_USER,
        user: {
            username: user.username,
            signature: user.signature,
            credit: user.credit,
        },
    }
)

