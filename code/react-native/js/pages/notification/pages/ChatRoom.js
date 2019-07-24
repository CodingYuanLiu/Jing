import React from 'react'
import {NativeModules, View, StyleSheet} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import XmppUtil from "../../../navigator/XmppUtil";
import {Button, Input} from "react-native-elements";
const xml = require('@xmpp/xml');
import {connect} from "react-redux";
import {addMessage} from "../../../actions/xmpp";

class ChatRoom extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
        }
    }

    componentDidMount(){
        let recipient = this.props.navigation.getParam("recipient")
        this.setState({recipient: recipient});
        this.setState({username: this.props.navigation.getParam("username")});
        this.setState({avatar: this.props.navigation.getParam("avatar")});
        const presence = xml('presence', {to:recipient + '/son'},
            xml('x', {xmlns: 'http://jabber.org/protocol/muc'}));
        XmppUtil.sendMessage(presence);
    }

    render() {
        let messages = [];
        for ( let room of this.props.chatRoomList) {
            if (room.roomId === this.state.recipient){
                messages = room.messages;
            }
        }
        return (
            <GiftedChat
                messages={messages}
                onSend={this.onSend}
                user={this.getUser()}
                renderUsernameOnMessage={true}
                showUserAvatar={true}
            />

        )
    }
    onSend = (messages) => {
        console.log(messages);
        const message = xml('message', {
                type: 'groupchat',
                to: this.state.recipient,
                avatar: this.state.avatar,
            },
            xml('body', {}, messages[0].text),
            xml('delay', {
                stamp: new Date(),
            }),
        );
        XmppUtil.sendMessage(message);
    };
    login = () => {
        XmppUtil.login("aa", "aa");
    };
    getUser = () => {
        return {
            _id: this.state.username,
            name: this.state.username,
            avatar: this.state.avatar,
        }
    }
}

const mapStateToProps = state => ({
    chatRoomList: state.xmpp.chatRoomList,
});
const mapDispatchToProps = dispatch => ({
    addMessage: (room, message) => dispatch(addMessage(room, message))
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
