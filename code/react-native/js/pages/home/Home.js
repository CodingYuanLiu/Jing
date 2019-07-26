import React from "react"
import NavigationUtil from '../../navigator/NavUtil';
import { View } from "react-native"
import Dao from "../../api/dao/Dao";
import Api from "../../api/Api";
import Util from "../../common/util";
import XmppApi from "../../api/XmppApi";
import * as actionTypes from "../../common/constant/ActionTypes";
import {setUser} from "../../actions/user";
import {addChatRoom, onSendMessage} from "../../actions/xmpp";
import {CHAT_ROOM_LOADED} from "../../common/constant/ActionTypes";
import {connect} from "react-redux";
import {xml} from "@xmpp/client";
import {createAppContainer, createBottomTabNavigator} from "react-navigation";
import ActivityScreen from "../activity/Activity";
import Entypo from "react-native-vector-icons/Entypo";
import NotificationScreen from "../notification/Notification";
import Ionicons from "react-native-vector-icons/Ionicons";
import PublishScreen from "../publish/Publish";
import AntDesign from "react-native-vector-icons/AntDesign";
import DiscoverScreen from "../discover/Discover";
import MeScreen from "../me/Me";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// fix xmpp.js cannot find base64 module error
var base64 = require('base-64');
global.btoa = base64.encode;
global.atob = base64.decode;

class HomeScreen extends React.Component<Props>{
    constructor(props) {
        super(props);
        console.disableYellowBox = true
    }

    componentDidMount(){
        // Expose outer stack navigation to inner navigation
        NavigationUtil.Navigation = this.props.navigation;
        this.getStatus();
        console.log(this.props);
    };

    render() {

        let BottomTab = this.renderTab(this.props.user.logged);
        return(
            <View style={{flex:1,}}>
                <BottomTab/>
            </View>

        )
    };
    getStatus = () => {
        Dao.get("@jwt")
            .then(jwt => {
                console.log(jwt);
                Api.getSelfDetail(jwt)
                    .then(data => {
                        // what if user exit when he /she is register?
                        if (data.username === "") {
                            NavigationUtil.toPage(null, "Register");
                        } else {
                            let password = Util.cryptoOnpenFire(data.username, data.password);
                            console.log(password);
                            XmppApi.login(data.username, password)
                                .then(() => {
                                    console.log("Login ok");
                                    this.dispatchSetUser(data);
                                    console.log(this.props.user);

                                    // after login, set listener, on stanza
                                    XmppApi.onStanza(this.onStanza);

                                    // after that, make self presence to group chat list
                                    XmppApi.getChatList();
                                })
                                .catch(err => {
                                    console.log(err);
                                    // this should not happen
                                })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.props.dispatch({
                            type: actionTypes.LOGIN_FAIL,
                            err,
                        })
                    })
            })
            .catch(err => {
                console.log(err);
                this.props.dispatch({
                    type: actionTypes.GET_STATUS_FAIL,
                    err,
                })
            })
    };
    dispatchSetUser = (data) => {
        this.props.setUser({
            avatar: data.avatar_url,
            birthday: data.birthday,
            dormitory: data.dormitory,
            gender: data.gender,
            id: data.id,
            jaccount: data.jaccount,
            jwt: data.jwt_token,
            major: data.major,
            nickname: data.nickname,
            password: data.password,
            phone: data.phone,
            signature: data.signature,
            username: data.username,
        });
    };
    onStanza = async standaz => {
        console.log(standaz);

        // id=chatlist, this is fetch chat list from server
        if (standaz.is('iq') && standaz.attrs.id === 'chatlist') {
            const type = standaz.attrs.type;
            if (type === "error")
            // unknown error
                console.log("error");
            else {
                for(let room of standaz.children[0].children) {
                    console.log(room.attrs.jid);
                    this.props.addChatRoom(room.attrs.jid, room.attrs.name);
                    // receive a chat and
                }
                this.props.chatRoomLoaded();
                console.log(this.props.xmpp.roomList);
            }
        }

        // message from group chat
        if (standaz.is("message")) {
            if (standaz.children && standaz.children.length > 0){
                let jid = standaz.attrs.from;
                let roomId=jid.substring(0, jid.indexOf("/"));
                let username = jid.substring(jid.indexOf("/") + 1);
                let nickname = standaz.attrs.nickname ?
                    standaz.attrs.nickname : username;
                let msg = {};
                msg.user = {
                    _id: username,
                    name: nickname,
                };
                msg.user.avatar = standaz.attrs.avatar ?
                    standaz.attrs.avatar : "http://m.imeitou.com/uploads/allimg/171123/3-1G123203S6-50.jpg";
                for (let child of standaz.children) {
                    if (child.name === "body") {
                        msg.text = child.children[0];
                    }
                    if (child.name === "delay"){
                        msg.createAt=child.attrs.stamp;
                    }
                    if (child.name === "stanza-id") {
                        msg._id = child.attrs.id;
                    }
                }
                if (!msg.createAt) {
                    msg.createAt = new Date();
                }
                if (msg.text) {
                    this.props.onSendMessage(roomId, msg);
                } else {
                    // message has no body
                    console.warn("is message, but no body");
                }
            }
            console.log(this.props.xmpp);
        }
    };
    renderTab = (logged) => {

        return createAppContainer(
            createBottomTabNavigator(
            {
                Activity: {
                    screen : ActivityScreen,
                    navigationOptions: {
                        tabBarLabel: "告示墙",
                        tabBarIcon: ({focused, tintColor}) => {
                            return (
                                <Entypo
                                    name={"blackboard"}
                                    size = {26}
                                    color = {tintColor}
                                />
                            )
                        },
                    }
                },
                Notification: {
                    screen : NotificationScreen,
                    navigationOptions: {
                        tabBarLabel: "消息",
                        tabBarIcon: ({focused, tintColor}) => {
                            return (
                                <Ionicons
                                    name={"ios-notifications"}
                                    size = {26}
                                    color = {tintColor}
                                />
                            )
                        },
                    }
                },
                Publish: {
                    screen : PublishScreen,
                    navigationOptions: {
                        tabBarLabel: "发布",
                        tabBarIcon: ({focused, tintColor}) => {
                            return (
                                <AntDesign
                                    name={"pluscircle"}
                                    size = {28}
                                    color = {"#0084ff"}
                                />
                            )
                        },
                    },
                },
                Discover: {
                    screen : DiscoverScreen,
                    navigationOptions: {
                        tabBarLabel: "发现",
                        tabBarIcon: ({focused, tintColor}) => {
                            return (
                                <AntDesign
                                    name={"search1"}
                                    size = {26}
                                    color = {tintColor}
                                />
                            )
                        },
                    }
                },
                Me: {
                    screen : MeScreen,
                    navigationOptions: {
                        tabBarLabel: logged ? "我的" : "未登录",
                        tabBarIcon: ({focused, tintColor}) => {
                            return (
                                <FontAwesome5
                                    name={"user-alt"}
                                    size = {26}
                                    color = {tintColor}
                                />
                            )
                        },
                    }
                }
            },
            {
                tabBarOptions: {
                    inactiveTintColor: "#bfbfbf",
                    activeTintColor: "#0084ff",
                },
            }
        )
        );
    }
}


const mapStateToProps = state => ({
    xmpp: state.xmpp,
    user: state.user,
});

const mapDispatchToProps = dispatch => ({
    onSendMessage: (roomId, message) => dispatch(onSendMessage(roomId, message)),
    addChatRoom: (room, roomName) => dispatch(addChatRoom(room, roomName)),
    chatRoomLoaded: () => dispatch({type: CHAT_ROOM_LOADED}),
    setUser: (user) => dispatch(setUser(user)),
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
