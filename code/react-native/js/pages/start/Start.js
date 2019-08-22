import React from "react";
import {View, Text, StyleSheet} from "react-native";
import NavigationUtil from '../../navigator/NavUtil';
import {connect} from "react-redux";
import Dao from "../../api/Dao";
import Api from "../../api/Api";
import Util from "../../common/util";
import XmppApi from "../../api/XmppApi";
import {addChatRoom, onSendMessage} from "../../actions/xmpp";
import {CHAT_ROOM_LOADED} from "../../common/constant/ActionTypes";
import { setUserData } from "../../actions/currentUser";
import { onGetCurrentUserFollowing } from "../../actions/currentUserFollowing";
import { onGetCurrentUserFollower } from "../../actions/currentUserFollower";
import {onGetCurrentUserManageAct} from "../../actions/currentUserManage";
import {onGetCurrentUserJoinAct} from "../../actions/currentUserJoin";
import {onLoadSettings} from "../../actions/setting";

// fix xmpp.js cannot find base64 module error
var base64 = require('base-64');
global.btoa = base64.encode;
global.atob = base64.decode;

class StartPage extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.getStatus();
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>欢迎使用即应</Text>
            </View>
        )
    }
    getStatus = () => {
        Dao.get("@jwt")
            .then(jwt => {
                Api.getSelfDetail(jwt)
                    .then(data => {
                        // what if user exit when he /she is register?
                        if (data.username === "") {
                            NavigationUtil.toPage(null, "Register");
                        } else {
                            // login success
                            let password = Util.cryptoOnpenFire(data.username, data.password);
                            this.props.onGetCurrentUserFollower(jwt);
                            this.props.onGetCurrentUserFollowing(jwt);
                            this.props.onGetCurrentUserManageAct(jwt);
                            this.props.onGetCurrentUserJoinAct(jwt);

                            XmppApi.login(data.username, password)
                                .then(async () => {
                                    this.props.setUserData(data);
                                    await XmppApi.onStanza(this.onStanza);

                                    // after that, make self presence to group chat list
                                    await XmppApi.getChatList();

                                    await this.props.navigation.navigate("Home", null);
                                })
                                .catch(err => {
                                    console.log(err);
                                    // this should not happen
                                    this.props.navigation.navigate("Home", null);
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.props.navigation.navigate("Home", null);
                    })
            })
            .catch(err => {
                console.log(err);
                this.props.navigation.navigate("Home", null);
            });
        this.props.onLoadSettings();
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
}

const mapStateToProps = state => ({
    xmpp: state.xmpp,
    currentUser: state.currentUser,
});

const mapDispatchToProps = dispatch => ({
    onSendMessage: (roomId, message) => dispatch(onSendMessage(roomId, message)),
    addChatRoom: (room, roomName) => dispatch(addChatRoom(room, roomName)),
    chatRoomLoaded: () => dispatch({type: CHAT_ROOM_LOADED}),
    setUserData: (user) => dispatch(setUserData(user)),
    onGetCurrentUserFollower: (jwt) => dispatch(onGetCurrentUserFollower(jwt)),
    onGetCurrentUserFollowing: (jwt) => dispatch(onGetCurrentUserFollowing(jwt)),
    onGetCurrentUserManageAct: (jwt) => dispatch(onGetCurrentUserManageAct(jwt)),
    onGetCurrentUserJoinAct: (jwt) => dispatch(onGetCurrentUserJoinAct(jwt)),
    onLoadSettings: () => dispatch(onLoadSettings()),
});
export default connect(mapStateToProps, mapDispatchToProps)(StartPage);


styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "#0084ff",
        fontSize: 40,
    }
});
