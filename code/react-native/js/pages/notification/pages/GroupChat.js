import React from "react"
import { View, Text, FlatList, RefreshControl } from 'react-native';
import {Badge, ListItem } from "react-native-elements";
import {connect} from "react-redux";
import {addChatRoom, onSendMessage} from "../../../actions/xmpp";
import NavigationUtil from "../../../navigator/NavUtil";

class GroupChatScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let user = this.props.user;
    }

    render() {
        let chatRoom = this.props.chatRoom;
        if (!chatRoom.roomList) {
            chatRoom = {
                roomList: [],
                isLoading: false,
            }
        }
        return(
            <View style={{flex: 1,}}>
                <FlatList
                    data={chatRoom.roomList}
                    renderItem={this.renderRoom}
                    keyExtractor={item => {return item.id.toString()}}

                    refreshControl={
                        <RefreshControl
                            title={"加载中..."}
                            titleColor={"#0084ff"}
                            colors={["#0084ff"]}
                            refreshing={chatRoom.isLoading}
                            onRefresh={this.getChatList}
                            tintColor={"#0084ff"}
                        />
                    }
                />
            </View>
        )
    };

    renderRoom = ({item: room}) => {
        let leftAvatar;

        let title = room.name;
        let subtitle = room.messages? room.messages[0].text : "";
        let rightTitle = room.messages? room.messages[0].createAt : "";
        return (
            <ListItem
                leftAvatar={{source: {uri: "https://pic1.zhimg.com/v2-fda399250493e674f2152c581490d6eb_1200x500.jpg"}}}
                title={title}
                titleProps={{ellipsizeMode: "tail", numberOfLines: 1}}

                subtitle={subtitle}
                subtitleProps={{ellipsizeMode: "tail", numberOfLines:1}}

                rightTitle={
                    <Text
                        numberOfLines={1}
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

    getChatList = () => {

    };
}
const mapStateToProps = state => ({
    chatRoom: state.chatRoom,
    currentUser: state.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onSendMessage: (room, message) => dispatch(onSendMessage(room, message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupChatScreen);
