import React from "react"
import {View, Text, StatusBar, StyleSheet, TouchableWithoutFeedback, Keyboard, FlatList, Image, RefreshControl, PermissionsAndroid} from 'react-native';
import HeaderBar from "../../../common/components/HeaderBar";
import {GiftedChat} from "react-native-gifted-chat";
import {connect} from "react-redux";
import {
    AlertCircleIcon,
    ArrowLeftIcon,
    ImageIcon,
} from "../../../common/components/Icons";
import NavigationUtil from "../../../navigator/NavUtil";
import {Button} from "react-native-elements";
import {CHAT_TYPE, WINDOW} from "../../../common/constant/Constant";
import XmppApi from "../../../api/XmppApi";
import {PrivateMessageApi} from "../../../api/PrivateMessageApi";
import ToolTip from "../../../common/components/ToolTip";
import {addPrivateMessage, getPrivateChatHistory, forceFlushPrivateMessage} from "../../../actions/privateChat";
import ImagePicker from "react-native-image-picker";

class ChatPage extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            text: "",

            images: [],
            isHeaderTooltipVisible: false,
            index: 0,
        }
    };
    componentDidMount() {
        this.loadData();
    }

    render() {
        let {currentUser, privateChat} = this.props;
        let receiver = this.props.navigation.getParam("receiver");
        let chatProps = privateChat[receiver.id];
        if (!chatProps) {
            chatProps = {
                messages: [],
                isLoading: false,
            }
        }
        let header = this.renderHeader(receiver);
        return(
            <View style={styles.container}>
                {header}
                <GiftedChat
                    messages={chatProps.messages}
                    onSend={this.onSend}
                    user={{
                        _id: currentUser.id,
                        name: currentUser.nickname,
                        avatar: currentUser.avatar
                    }}
                    isAnimated={true}
                    showUserAvatar={true}
                    showAvatarForEveryMessage={true}
                    renderSend={this.renderSend}
                    text={this.state.text}
                    onInputTextChanged={(text) => {this.setState({text: text})}}
                    minComposerHeight={43}
                    renderMessageImage={this.renderMessageImage}
                    renderCustomView={this.renderCustomView}
                    renderLoading={
                        () =>
                        <RefreshControl
                            refreshing={chatProps.isLoading}
                            onRefresh={this.loadData}
                            title={"加载中..."}
                            titleColor={"#0084ff"}
                            colors={["#0084ff"]}
                            tintColor={"#0084ff"}
                        />
                    }
                    renderAvatarOnTop={true}
                    inverted={false}
                />
            </View>
        )
    };
    renderHeader = (receiver) => {
        let leftIcon = (
            <ArrowLeftIcon
                color={"#9a9a9a"}
                onPress={this.goBack}
            />
        );
        let rightButton = (
            <ToolTip
                isVisible={this.state.isHeaderTooltipVisible}
                onPress={() => {this.setState({isHeaderTooltipVisible: true})}}
                onBackdropPress={() => {this.setState({isHeaderTooltipVisible: false})}}
            >
                <Button
                    type={"clear"}
                    title={"详情"}
                />
            </ToolTip>);
        let type = this.props.navigation.getParam("type");
        if (type === CHAT_TYPE.PRIVATE_CHAT) {
            rightButton = null;
        }
        return (
            <HeaderBar
                title={receiver.nickname}
                titleLayoutStyle={styles.headerTitleContainer}
                titleStyle={styles.headerTitle}
                style={styles.headerContainer}
                leftButton={leftIcon}
                rightButton={rightButton}
            />
        )
    };
    renderSend = (props) => {
        let imageIcon, sendButton;
        let imageBadge = this.state.images.length > 0 ?(
            <View
                style={[styles.imageBadge, {backgroundColor: "#00ccff",}]}>
                <Text
                    style={{color: "#fff",textAlign: "center"}}
                >{this.state.images.length}</Text>
            </View>
        ) : null;

        imageIcon = (
            <View style={{marginRight: 5, position: "relative",}}>
                <ImageIcon
                    onPress={this.launchImage}
                    size={26}
                />
                {imageBadge}
            </View>
        );
        sendButton = (
            this.state.text === "" &&
                this.state.images.length === 0 ?
            null :
                <Button
                    type={"clear"}
                    title={"发送"}
                    onPress={
                        () => {
                            this.onSend(props);
                        }
                    }
                    buttonStyle={{padding: 0, }}
                    containerStyle={{marginRight: 10, width: 40,justifyContent: "center",}}
                />
        );
        return (
            <View style={styles.sendButtonContainer}>
                {imageIcon}
                {sendButton}
            </View>
        )
    };
    renderCustomView = (props) => {
        let {currentMessage} = props;
        console.log(currentMessage);
        if (currentMessage.error !== null && currentMessage.error !== undefined) {
            return (
                <AlertCircleIcon
                    color={"#ee4417"}
                    size={24}
                    style={{position: "absolute", left: -29, top: 10}}
                />
            )
        }
        return (
            <Button
                loading={currentMessage.pending}
                type={"clear"}
                buttonStyle={{margin: 0, padding: 0}}
                containerStyle={{position: "absolute", left: -29, top: 10}}
            />
        )
    };
    renderMessageImage = (props) => {
        let {currentMessage} = props;
        let images;
        if (!currentMessage.image) return null;
        if (Array.isArray(currentMessage.image)) {
            images = currentMessage.image;
        } else {
            images = [currentMessage.image];
        }
        return (
            <View>
                {
                    images.map((item, i) => {
                        if (item === "") return null;
                        else {
                            return (
                                <Image
                                    source={{uri: item}}
                                    key={i.toString()}
                                    style={styles.messageImage}
                                />
                            )
                        }
                    })
                }
            </View>
        )
    };
    onSend = (props) => {
        let message = this.buildMessage(props);
        console.log(message);
        this.sendAsync(props, message)
            .catch(err => {console.log(err)});

        this.clearMessage();
    };
    sendAsync = async (props, message) => {
        let receiver = this.props.navigation.getParam("receiver");
        try {
            this.props.addPrivateMessage(receiver.id, message);
            let type = this.props.navigation.getParam("type");
            let {currentUser} = this.props;

            if( type === CHAT_TYPE.PRIVATE_CHAT) {
                let data = await PrivateMessageApi.addMessage({
                    text: message.text,
                    image: message.image,
                    thatUserId: receiver.id,
                    thatUserName: receiver.nickname,
                    thatUserAvatar: receiver.avatar,
                    thisUserId: currentUser.id,
                    thisUserName: currentUser.nickname,
                    thisUserAvatar: currentUser.avatar,
                    isSelf: true,
                }, this.props.currentUser.jwt);
                message.image = data.message.image;
                let from = XmppApi.getJid(this.props.currentUser, CHAT_TYPE.PRIVATE_CHAT);
                let to = XmppApi.getJid(this.props.navigation.getParam("receiver"), CHAT_TYPE.PRIVATE_CHAT);
                await XmppApi.sendMessage(
                    from, to, CHAT_TYPE.PRIVATE_CHAT, "normal",
                    message,
                );
            } else {
                let from = XmppApi.getJid(this.props.currentUser, CHAT_TYPE.PRIVATE_CHAT);
                let to = XmppApi.getJid(null, CHAT_TYPE.GROUP_CHAT);
                await XmppApi.sendMessage(
                    from, to, CHAT_TYPE.GROUP_CHAT, props.messageIdGenerator(),
                    message
                );
            }
            message.pending = false;
            this.props.forceFlushPrivateMessage(receiver.id, message);
        } catch (err) {
            console.log(err);
            message.pending = false;
            message.error = err;
            this.props.forceFlushPrivateMessage(receiver.id, message);
        }
    };
    buildMessage = (props) => {
        let message = {
            user: props.user,
            image: null,
            text: "",
            createdAt: new Date(),
            _id: props.messageIdGenerator(),
            pending: true,
        };
        if (this.state.text !== "") {
            message.text = this.state.text;
        }
        if (this.state.images.length !== 0 ) {
            message.image = [];
            for (let item of this.state.images) {
                message.image.push(item);
            }
        }
        return message;
    };
    clearMessage = () => {
        this.setState(state => {
            for(let item of state.images) {
                item.checked = 0;
            }
            return {
                images: [],
                text: "",
            }
        })
    };

    goBack = () => {
        NavigationUtil.back(this.props);
    };
    launchImage = () => {

        ImagePicker.launchImageLibrary(options, response => {

            if (response.didCancel) {
                // ....
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                let {uri} = response;
                this.setState(state => {
                    return {
                        ...state,
                        images: [...state.images, uri],
                    }
                })
            }
        })
    };
    getImageSmallDimension = (width, height) => {
        let halfWindowWidth = WINDOW.width / 2;
        let smallHeight, smallWidth;
        smallWidth = halfWindowWidth;
        smallHeight = smallWidth / width * height;
        return {
            smallWidth,
            smallHeight,
        }
    };
    loadData = () => {
        let type = this.props.navigation.getParam("type");
        let receiver = this.props.navigation.getParam("receiver");
        let {currentUser} = this.props;
        if (type === CHAT_TYPE.PRIVATE_CHAT) {
            let {privateChat} = this.props;
            if (!privateChat.hasLoadHistory) {
                let {id} = receiver;
                this.props.getPrivateChatHistory(id, currentUser.jwt);
            } else {
                // do nothing
            }
        } else if(type === CHAT_TYPE.GROUP_CHAT) {

        } else {
            console.log("miss type param");
        }
    };
}
const options = {
    title: "选择",
    cancelButtonTitle: "取消",
    takePhotoButtonTitle: "拍摄",
    chooseFromLibraryButtonTitle: "从相册选择",
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    quality: 0.4,
    noData: true,
};
const mapStateToProps = state => ({
    currentUser: state.currentUser,
    privateChat: state.privateChat,
    chtRoom: state.chatRoom,
});
const mapDispatchToProps = dispatch => ({
    getPrivateChatHistory: (senderId, jwt) => dispatch(getPrivateChatHistory(senderId, jwt)),
    addPrivateMessage: (id, message) => dispatch(addPrivateMessage(id, message)),
    forceFlushPrivateMessage: (id, message) => dispatch(forceFlushPrivateMessage(id, message)),
    getChatRoomHistory: () => dispatch(),
    addChatRoomMessage: () => dispatch(),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    headerContainer: {
        backgroundColor: "#fff",
        elevation: 2,
    },
    headerTitleContainer: {
        alignItems: "flex-start",
    },
    headerTitle: {
        color: "#9a9a9a",
        fontSize: 22,
    },

    sendButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: "100%",
    },

    messageImage: {
        borderRadius: 10,
        marginTop: 12,
        marginRight: 12,
        marginLeft: 12,
        width: WINDOW.width / 2,
        height: WINDOW.height / 3,
    },
    imageBadge: {
        position: "absolute",
        top: -5,
        right: -5,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#fff",
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },


});
