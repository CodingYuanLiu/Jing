import React from "react"
import {View, Text, FlatList, RefreshControl, TouchableNativeFeedback, StyleSheet} from 'react-native';
import {connect} from "react-redux";
import Util from "../../../common/util";
import {Avatar} from "react-native-elements";
import NavigationUtil from "../../../navigator/NavUtil";
import {CHAT_TYPE, DEFAULT_GROUP_CHAT_AVATAR, DEFAULT_IMAGE} from "../../../common/constant/Constant";
import {onGetCurrentUserManageAct} from "../../../actions/currentUserManage";
import {onGetCurrentUserJoinAct} from "../../../actions/currentUserJoin";

class GroupChatScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        let {currentUserManage, currentUserJoin} = this.props;
        let props;
        if (!currentUserJoin || !currentUserManage) {
            props = {
                data: [],
                isLoading: false,
            }
        } else {
            props = {
                data: [...currentUserManage.items, ...currentUserJoin.items],
                isLoading: currentUserManage.isLoading && currentUserJoin.isLoading,
            }
        }
        return(
            <View style={{flex: 1,}}>
                <FlatList
                    data={props.data}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            title={"加载中..."}
                            titleColor={"#0084ff"}
                            colors={["#0084ff"]}
                            refreshing={props.isLoading}
                            onRefresh={this.loadData}
                            tintColor={"#0084ff"}
                        />
                    }
                />
            </View>
        )
    };

    renderItem = ({item}) => {
        let leftAvatar =
            <Avatar
                source={{uri: DEFAULT_GROUP_CHAT_AVATAR}}
                size={40}
                rounded
            />;
        let title = this.renderItemTitle(item);
        //let snippet = this.renderItemSnippet(item);
        return(
            <TouchableNativeFeedback
                onPress={() => {this.toChatPage(item)}}
            >
                <View style={styles.itemContainer}>
                    {leftAvatar}
                    <View style={styles.itemRightContainer}>
                        {title}
                        {/*{snippet}*/}
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
                >{item.title}</Text>
                {/*<Text*/}
                {/*    style={{fontSize: 14, color: "#cfcfcf"}}*/}
                {/*>{Util.dateTimeToDisplayString(item.snippet? item.snippet.createdAt : "")}</Text>*/}
            </View>
        )
    };
    // renderItemSnippet = (item) => {
    //     return (
    //         <View>
    //             <Text style={{fontSize: 13, color: "#666"}}>
    //                 {item.snippet? item.snippet.text + (item.snippet.image && item.snippet.image.length > 0 ? " [图片]": "") : ""}
    //             </Text>
    //         </View>
    //     );
    // };

    loadData = () => {
        let {currentUser} = this.props;
        this.props.onGetCurrentUserManageAct(currentUser.jwt);
        this.props.onGetCurrentUserJoinAct(currentUser.jwt);
    };
    toChatPage = (item) => {
        NavigationUtil.toPage({receiver: {
                id: item.id,
                nickname: item.title,
                avatar: DEFAULT_GROUP_CHAT_AVATAR,
            }, type: CHAT_TYPE.GROUP_CHAT}, "ChatPage")
    }
}
const mapStateToProps = state => ({
    currentUser: state.currentUser,
    groupChat: state.groupChat,
    currentUserManage: state.currentUserManage,
    currentUserJoin: state.currentUserJoin,
});
const mapDispatchToProps = dispatch => ({
    onGetCurrentUserManageAct: (jwt) => dispatch(onGetCurrentUserManageAct(jwt)),
    onGetCurrentUserJoinAct: (jwt) => dispatch(onGetCurrentUserJoinAct(jwt)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupChatScreen);

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
