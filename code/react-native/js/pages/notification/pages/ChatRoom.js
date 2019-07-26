import React from 'react'
import {NativeModules, View, StyleSheet} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import XmppApi from "../../../api/XmppApi";
const xml = require('@xmpp/xml');
import {connect} from "react-redux";
import {addMessage} from "../../../actions/xmpp";
import {PRESENCE_CHAT_ROOM} from "../../../common/constant/ActionTypes";

class ChatRoom extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
        }
    }

    componentDidMount(){
        this.id = this.props.navigation.getParam("recipient");
        const presence = xml('presence', {to: `${this.id}/${this.props.user.username}`},
            xml('x', {xmlns: 'http://jabber.org/protocol/muc'}));
        let xmpp = this.props.xmpp;
        let room = xmpp[this.id];
        if (!room.init) {
            XmppApi.sendMessage(presence);
            this.props.presenceChatRoom(this.id);
        }
    }

    render() {
        let xmpp = this.props.xmpp;
        let room = xmpp[this.id];
        if (!room) {
            room = {
                id: "",
                messages: [],
            }
        }
        return (
            <GiftedChat
                messages={room.messages}
                onSend={this.onSend}
                user={this.getUser()}
                renderUsernameOnMessage={true}
                showUserAvatar={true}
            />

        )
    }
    onSend = (messages) => {
        const message = xml('message', {
                type: 'groupchat',
                to: this.id,
                avatar: this.props.user.avatar,
                nickname: "我是小可爱",
            },
            xml('body', {}, messages[0].text),
            xml('delay', {
                stamp: new Date(),
            }),
        );
        XmppApi.sendMessage(message);
    };

    getUser = () => {
        return {
            _id: this.props.user.username,
            avatar: this.props.user.avatar,
            name: this.props.user.nickname,
        }
    }
}

const mapStateToProps = state => ({
    xmpp: state.xmpp,
    user: state.user,
});
const mapDispatchToProps = dispatch => ({
    addMessage: (room, message) => dispatch(addMessage(room, message)),
    presenceChatRoom: (room) => dispatch({type: PRESENCE_CHAT_ROOM, room: room})
});
export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputView: {
        backgroundColor: 'green',
        width: window.width,
        height: 100,
    },
    btnStyle: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#3e83d7',
        borderRadius: 8,
        backgroundColor: '#3e83d7'
    }
});
