export default {
    UNKNOWN_ERROR: -1,

    // Async storage action fail, start from 1
    STORAGE_DEL_FAIL: 1,
    STORAGE_GET_FAIL: 2,
    STORAGE_SET_FAIL: 3,


    // Not online, start from 100
    NEED_LOGIN: 100,

    // Api action fail
    TOKEN_INVALID: 101,


    // Common failure, start from 400
    MISMATCH_PASSWORD: 400,
    DUPLICATE_USERNAME: 401,
    INVALID_PHONE: 402,



    PERMISSION_DENIED: 403,
    NETWORK_ERROR: 404,
}
