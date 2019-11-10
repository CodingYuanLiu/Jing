import React from "react"
import { View, FlatList, RefreshControl, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';
import NoticeHeader from '../components/NoticeHeader';
import {connect} from "react-redux";
import {getPrivateChatList} from "../../../actions/privateChat";
import UserAvatar from "../../../common/components/UserAvatar";
import Util from "../../../common/util";
import NavigationUtil from "../../../navigator/NavUtil";
import {CHAT_TYPE} from "../../../common/constant/Constant";


class PrivateMsgScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        let header = this.renderHeader();
        let { privateChat } = this.props;
        return(
            <View style={styles.container}>
                {header}
                <FlatList
                    data={privateChat.chatList}
                    renderItem={this.renderItem}
                    keyExtractor={item => (item.id)}
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.loadData}
                            refreshing={privateChat.isLoading}
                            title={"加载中..."}
                            titleColor={"#0084ff"}
                            colors={["#0084ff"]}
                            tintColor={"#0084ff"}
                        />
                    }
                />
            </View>
        )
    };
    renderHeader = () => {
        return <NoticeHeader
            title="私信列表"
            onPress={() => {alert("clear")}}
        />
    };

    renderItem = ({item}) => {
        let leftAvatar =
            <UserAvatar
                id={item.user.id}
                source={{uri: item.user.avatar}}
                size={40}
            />;
        let title = this.renderItemTitle(item);
        let snippet = this.renderItemSnippet(item);
        return(
            <TouchableNativeFeedback
                onPress={() => {this.toPrivateChat(item)}}
            >
                <View style={styles.itemContainer}>
                    {leftAvatar}
                    <View style={styles.itemRightContainer}>
                        {title}
                        {snippet}
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    };
    renderItemTitle = (item) => {
        return (
            <View style={styles.itemTitleContainer}>
                <Text
                    style={styles.itemTitle}
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                >{item.user.nickname}</Text>
                <Text
                    style={{fontSize: 14, color: "#cfcfcf"}}
                >{Util.dateTimeToDisplayString(item.snippet.createdAt)}</Text>
            </View>
        )
    };
    renderItemSnippet = (item) => {

        return (
            <View>
                <Text style={{fontSize: 13, color: "#666"}}>
                    {item.snippet.text + (item.snippet.image && item.snippet.image.length > 0 ? " [图片]": "")}
                </Text>
            </View>
        );
    };

    loadData = () => {
        let {currentUser} = this.props;
        this.props.getPrivateChatList(currentUser.jwt);
    };
    toPrivateChat = (item) => {
        NavigationUtil.toPage({receiver: item.user, type: CHAT_TYPE.PRIVATE_CHAT}, "ChatPage")
    };
}

const mapStateToProps = state => ({
    currentUser: state.currentUser,
    privateChat: state.privateChat,
});
const mapDispatchToProps = dispatch => ({
    getPrivateChatList: (jwt) => dispatch(getPrivateChatList(jwt)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PrivateMsgScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 12,
        marginBottom: 5,
    },
    itemRightContainer: {
        flex: 1,
        marginLeft: 15,
        borderBottomWidth: 0.5,
        borderColor: "#eee",
        paddingBottom: 12,
    },
    itemTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6.
    },
    itemTitle: {
        fontSize: 15,
        color: "#4a4a4a",
        fontWeight: "800",
        flex: 1,
    },
});
