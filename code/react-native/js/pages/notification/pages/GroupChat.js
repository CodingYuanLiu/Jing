import React from "react"
import { View, Text, FlatList, RefreshControl } from 'react-native';
import {Badge, ListItem } from "react-native-elements";
import XmppApi from "../../../api/XmppApi";
import {connect} from "react-redux";
import {addChatRoom, onSendMessage} from "../../../actions/xmpp";
import {ON_LOADING_CHAT_ROOM} from "../../../common/constant/ActionTypes";
import {CHAT_ROOM_LOADED} from "../../../common/constant/ActionTypes";
import NavigationUtil from "../../../navigator/NavUtil";

class GroupChatScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let user = this.props.user;

    }

    renderRoom = (room) => {
        let leftAvatar;
        console.log(room);
        let title = room.name;
        let subtitle = room.messages? room.messages[0].text : "";
        let rightTitle = room.messages? room.messages[0].createAt : "";
        return (
            <ListItem
                leftAvatar={{source: {uri: "https://pic1.zhimg.com/v2-fda399250493e674f2152c581490d6eb_1200x500.jpg"}}}
                title={title}
                titleProps={{ellipsizeMode: "tail", numberOfLines: 1}}
                titleStyle={styles.roomTitle}
                subtitle={subtitle}
                subtitleProps={{ellipsizeMode: "tail", numberOfLines:1}}
                subtitleStyle={styles.roomSubtitle}
                rightTitle={
                    <Text
                    numberOfLines={1}
                    style={styles.roomTimeStamp}
                    >{rightTitle}</Text>
                }
                rightSubtitle={
                    <Badge
                    value={room.messages? room.messages.length: 0}
                    />
                }
                onPress={() => {NavigationUtil.toPage({recipient: room.id}, "ChatRoom")}}
            />
        )
    };
    render() {
        let xmpp = this.props.xmpp;
        if (!xmpp.roomList) {
            xmpp = {
                roomList: [],
                isLoading: false,
            }
        }
        return(
            <View style={{flex: 1,}}>
                <FlatList
                    data={xmpp.roomList}
                    renderItem={({item}) => this.renderRoom(item)}
                    keyExtractor={item => {return item.id.toString()}}

                    refreshControl={
                        <RefreshControl
                            title={"加载中..."}
                            titleColor={"#0084ff"}
                            colors={["#0084ff"]}
                            refreshing={xmpp.isLoading}
                            onRefresh={this.getChatList}
                            tintColor={"#0084ff"}
                        />
                    }
                />
            </View>
        )
    };
}
const mapStateToProps = state => ({
    xmpp: state.xmpp,
    user: state.user,
});
const mapDispatchToProps = dispatch => ({
    onLoadingChatRoom: () => dispatch({type: ON_LOADING_CHAT_ROOM}),
    chatRoomLoaded: () => dispatch({type: CHAT_ROOM_LOADED}),
    onSendMessage: (room, message) => dispatch(onSendMessage(room, message)),
    addChatRoom: (room, roomName) => dispatch(addChatRoom(room, roomName))
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupChatScreen);
