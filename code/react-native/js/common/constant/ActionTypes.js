// actions for current user
export const SET_USER_TOKEN = 'SET_USER_TOKEN';
export const SET_USER_LOGGED = 'SET_USER_LOGGED';
export const SET_USER_DATA = 'SET_USER_DATA';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const UPDATE_USER_AVATAR = 'UPDATE_USER_AVATAR';
export const ON_LOG_OUT = 'ON_LOG_OUT';
export const LOG_OUT_OK = 'LOG_OUT_OK';
export const LOG_OUT_FAIL = 'LOG_OUT_FAIL';

// follow action for current users
export const FOLLOW_OK = 'FOLLOW_OK';
export const FOLLOW_FAIL = 'FOLLOW_FAIL';
export const UNFOLLOW_OK = 'UNFOLLOW_OK';
export const UNFOLLOW_FAIL = 'UNFOLLOW_FAIL';
export const ON_GET_USER_FOLLOWINGS = 'ON_GET_USER_FOLLOWING';
export const ON_GET_USER_FOLLOWERS = 'ON_GET_USER_FOLLOWERS';
export const GET_USER_FOLLOWINGS_OK = 'GET_USER_FOLLOWINGS_OK';
export const GET_USER_FOLLOWINGS_FAIL = 'GET_USER_FOLLOWERS_FAIL';
export const GET_USER_FOLLOWERS_OK = 'GET_USER_FOLLOWERS_OK';
export const GET_USER_FOLLOWERS_FAIL = 'GET_USER_FOLLOWERS_OK';
export const ON_GET_USER_MANAGE_ACT = 'ON_GET_USER_MANAGE_ACT';
export const GET_USER_MANAGE_ACT_OK = 'GET_USER_MANAGE_ACT_OK';
export const GET_USER_MANAGE_ACT_FAIL = 'GET_USER_MANAGE_ACT_FAIL';

export const ON_DELETE_USER_MANAGE_ACT = 'DELETE_USER_MANAGE_ACT';
export const DELETE_USER_MANAGE_ACT_OK = 'DELETE_USER_MANAGE_ACT_OK';
export const DELETE_USER_MANAGE_ACT_FAIL = 'DELETE_USER_ACT_FAIL';

export const ON_GET_USER_JOIN_ACT = 'ON_GET_USER_JOIN_ACT';
export const GET_USER_JOIN_ACT_OK = 'GET_USER_JOIN_ACT_OK';
export const GET_USER_JOIN_ACT_FAIL = 'GET_USER_JOIN_ACT_FAIL';
export const ON_QUIT_USER_JOIN_ACT = 'ON_QUIT_USER_JOIN_ACT';

export const ON_GET_USER_FEEDBACK = 'ON_GET_USER_FEEDBACK';
export const GET_USER_FEEDBACK_OK = 'GET_USER_FEEDBACK_OK';
export const GET_USER_FEEDBACK_FAIL = 'GET_USER_FEEDBACK_FAIL';
export const ON_DELETE_FEEDBACK = 'ON_DELETE_FEEDBACK';
export const DELETE_FEEDBACK_OK = 'DELETE_FEEDBACK_OK';
export const DELETE_FEEDBACK_FAIL = 'DELETE_FEEDBACK_FAIL';

// actions for other user,
export const LOADING_OTHER_USER_DATA = 'LOADING_OTHER_USER_DATA';
export const LOAD_OTHER_USER_OK = 'LOAD_OTHER_USER_OK';
export const LOAD_OTHER_USER_FAIL = 'LOAD_OTHER_USER_FAIL';

// actions for act detail
export const ON_LOADING_ACT_DETAIL = 'ON_LOADING_ACT_DETAIL';
export const LOAD_ACT_DETAIL_FAIL = 'LOAD_ACT_DETAIL_FAIL';
export const LOAD_ACT_DETAIL_OK = 'LOAD_ACT_DETAIL_OK';
export const RESET_ACT_DETAIL = 'RESET_ACT_DETAIL';
export const ADD_PARTICIPANT = 'ADD_PARTICIPANT';
export const ADD_COMMENT_OK = 'ADD_COMMENT_OK';
export const ADD_COMMENT_FAIL = 'ADD_COMMENT_FAIL';
export const SET_DETAIL_IS_FRIENDS = 'SET_DETAIL_IS_FRIENDS';
export const SET_DETAIL_IS_NOT_FRIENDS = 'SET_DETAIL_IS_NOT_FRIENDS';

// actions for publish activity
export const SAVE_TAXI_ACT = 'SAVE_TAXI_ACT';
export const SAVE_ORDER_ACT = 'SAVE_ORDER_ACT';
export const SAVE_TAKEOUT_ACT = 'SAVE_TAKEOUT_ACT';
export const SAVE_OTHER_ACT = 'SAVE_OTHER_ACT';

export const ON_LOADING_RECOMMEND = 'ON_LOADING_RECOMMEND';
export const LOADING_RECOMMEND_OK = 'LOADING_RECOMMEND_OK';
export const LOADING_RECOMMEND_FAIL = 'LOADING_RECOMMEND_FAIL';

export const ON_LOADING_MY_MANAGE = 'ON_LOADING_MY_MANAGE';
export const LOADING_MY_MANAGE_OK = 'LOADING_MY_MANAGE_OK';
export const LOADING_MY_MANAGE_FAIL = 'LOADING_MY_MANAGE_FAIL';

export const ON_LOADING_MY_JOIN = 'ON_LOADING_MY_JOIN';
export const LOADING_MY_JOIN_OK = 'LOADING_MY_JOIN_OK';
export const LOADING_MY_JOIN_FAIL = 'LOADING_MY_JOIN_FAIL';

export const ON_LOADING_TYPE = 'ON_LOADING_TYPE';
export const LOADING_TYPE_OK = 'LOADING_TYPE_OK';
export const LOADING_TYPE_FAIL = 'LOADING_TYPE_FAIL';
export const ON_DELETE_TYPE_ACT = 'ON_DELETE_TYPE_ACT';
export const DELETE_TYPE_ACT_OK = 'DELETE_TYPE_ACT_OK';
export const DELETE_TYPE_ACT_FAIL = 'DELETE_TYPE_ACT_FAIL';

export const LOAD_PUBLISH_OK = 'LOAD_PUBLISH_OK';
export const LOAD_PUBLISH_FAIL = 'LOAD_PUBLISH_fAIL';

// actions for xmpp
export const ADD_XMPP_MESSAGE = 'ADD_XMPP_MESSAGE';
export const INIT_XMPP_CHATROOMLIST = 'INIT_XMPP_CHATROOMLIST';

export const GET_PERSONAL_INFORMATION = 'GET_PERSONAL_INFORMATION';
export const GET_PERSONAL_MANAGE_ACT = 'GET_PERSONAL_MANAGE_ACT';
export const GET_PERSONAL_FEEDBACK = 'GET_PERSONAL_FEEDBACK';
export const ENABLE_NEST_SCROLL = 'ENABLE_NEST_SCROLL';
export const DISABLE_NEST_SCROLL = 'DISABLE_NEST_SCROLL';

export const TOGGLE_WATERMARK_SETTING = 'TOGGLE_WATERMARK_SETTING';
export const TOGGLE_SAVE_DATA_SETTING = 'TOGGLE_SAVE_DATA_SETTING';
export const TOGGLE_FIND_BY_PHONE_SETTING = 'TOGGLE_FIND_BY_PHONE_SETTING';
export const SET_LOCATION_CITY = 'SET_LOCATION_CITY';
/*
 * private message
 */
export const ON_SEND_GROUP_CHAT_MESSAGE = 'ON_SEND_MESSAGE';
export const ON_GET_GROUP_CHAT_LIST = 'ON_GET_GROUP_CHAT_LIST';
export const GET_GROUP_CHAT_LIST_OK = 'GET_GROUP_CHAT_LIST_OK';
export const ON_GET_GROUP_CHAT_HISTORY = 'ON_GET_GROUP_CHAT_HISTORY';
export const GET_GROUP_CHAT_HISTORY_OK = 'GET_GROUP_CHAT_HISTORY_OK';
export const FLUSH_GROUP_CHAT_MESSAGE = 'FLUSH_GROUP_CHAT_MESSAGE';
export const TOGGLE_HAS_PRESENCE = 'TOGGLE_HAS_PRESENCE';

export const ON_SEND_PRIVATE_MESSAGE = 'ON_SEND_PRIVATE_MESSAGE';
export const ADD_PRIVATE_MESSAGE_LIST = 'ADD_PRIVATE_MESSAGE_LIST';
export const ON_GET_PRIVATE_MESSAGE_HISTORY = 'ON_GET_PRIVATE_MESSAGE_HISTORY';
export const GET_PRIVATE_MESSAGE_HISTORY_OK = 'GET_PRIVATE_MESSAGE_HISTORY_OK';
export const GET_PRIVATE_MESSAGE_HISTORY_FAIL = 'GET_PRIVATE_MESSAGE_HISTORY_FAIL';
export const ON_GET_PRIVATE_MESSAGE_LIST = 'ON_GET_PRIVATE_MESSAGE_LIST';
export const GET_PRIVATE_MESSAGE_LIST_OK = 'GET_PRIVATE_MESSAGE_LIST_OK';
export const GET_PRIVATE_MESSAGE_LIST_FAIL = 'GET_PRIVATE_MESSAGE_LIST_FAIL';
export const FLUSH_PRIVATE_MESSAGE = 'FLUSH_PRIVATE_MESSAGE';
