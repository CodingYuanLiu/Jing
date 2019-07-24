import React from "react"
import { View, Text } from 'react-native';
import NavigationUtil from "../../../navigator/NavUtil";
import {Button, Input} from "react-native-elements";
import XmppUtil from "../../../navigator/XmppUtil";
import {connect} from "react-redux";
import {addMessage, initChatRoomList} from "../../../actions/xmpp";
const xml = require('@xmpp/xml');

const recipient = "diving_fish@202.120.40.8";


class GroupChatScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            username :"",
            password: "",
        }
    }

    componentDidMount() {
    }

    render() {
        return(
            <View style={{flex: 1,}}>
                <Input
                    value={this.state.username}
                    onChangeText={(text) => {this.setState({username: text})}}
                />
                <Input
                    value={this.state.password}
                    onChangeText={(text) => {this.setState({password: text})}}
                />
                <Button
                    title={"注册"}
                    onPress={this.register}
                />
                <Button
                    title={"登录"}
                    onPress={this.login}
                />
                <Button
                    title={"获取群聊列表"}
                    onPress={this.getChatList}
                />
                <Button
                    title={"退出"}
                    onPress={this.logout}
                />
                <Button
                    title={"发送测试消息"}
                    onPress={this.sendMessage}
                />
                {
                    this.props.chatRoomList.map((room, i) => {
                        return (
                        <Button
                            key={i}
                            title={room.roomId}
                            onPress={() => {this.toChatRoom(room)}}
                        />);
                    })
                }
            </View>
        )
    }
    register = () => {
        let username = this.state.username;
        let password = this.state.password;
        XmppUtil.register(username, password);
    };
    login = () => {

        let username = this.state.username;
        let password = this.state.password;
        XmppUtil.login(username, password);
        XmppUtil.onStanza(
            async standaz => {
                console.log(standaz);
                if (standaz.is('iq') && standaz.attrs.id === 'chatlist') {
                    const type = standaz.attrs.type;
                    if (type === "error")
                        console.log("error");
                    else {
                        let list = new Array();
                        for(let room of standaz.children[0].children) {
                            console.log(room.attrs);
                            list.push(room.attrs.jid);
                        }
                        console.log(list);
                        this.props.initChatRoomList(list);
                        console.log(this.props.chatRoomList);
                    }
                }
                if (standaz.is("message")) {
                    if (standaz.children && standaz.children.length > 0){
                        let jid = standaz.attrs.from;
                        let nickname = jid.substring(jid.indexOf("/") + 1);
                        let msg = new Object();
                        msg.user = {
                            _id: jid,
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
                            this.props.addMessage("test@conference.202.120.40.8", msg);
                        } else {
                            console.warn("is message, but no body");
                        }
                    }
                    console.log(this.props.chatRoomList);
                }
            }
        )
    };
    logout = () => {
        XmppUtil.logout();
    };
    toChatRoom = (room) => {
          NavigationUtil.toPage({
                avatar: "https://assets.pub.bitrabbit.com/uploads/user/avatar/638/1515610232-vkCOFYmeKd.jpg",
                username: this.state.username,
                recipient: room.roomId,
          }, "ChatRoom");
    };
    sendMessage = () => {
        const message = xml('message', {
                type: 'chat', to: recipient
            },
            xml('subject', {}, '测试'),
            xml('body', {}, '测试内容'),
        );
        XmppUtil.sendMessage(message);
    };
    getChatList = () => {
        XmppUtil.getChatList()
    }
}
const mapStateToProps = state => ({
    chatRoomList: state.xmpp.chatRoomList,
});
const mapDispatchToProps = dispatch => ({
    initChatRoomList: list => dispatch(initChatRoomList(list)),
    addMessage: (room, message) => dispatch(addMessage(room, message))
});
export default connect(mapStateToProps, mapDispatchToProps)(GroupChatScreen);
