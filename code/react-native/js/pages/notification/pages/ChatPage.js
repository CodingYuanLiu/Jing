import React from "react"
import {View, Text, StatusBar, StyleSheet, TouchableWithoutFeedback, Keyboard, FlatList, Image, RefreshControl, PermissionsAndroid} from 'react-native';
import HeaderBar from "../../../common/components/HeaderBar";
import {GiftedChat} from "react-native-gifted-chat";
import {connect} from "react-redux";
import {
    AlertCircleIcon,
    ArrowLeftIcon,
    EmojiIcon,
    ImageIcon,
} from "../../../common/components/Icons";
import NavigationUtil from "../../../navigator/NavUtil";
import {Button} from "react-native-elements";
import CameraRoll from "@react-native-community/cameraroll";
import {WINDOW} from "../../../common/constant/Constant";
import XmppApi, {OpenFireApi, PrivateMessageApi} from "../../../api/XmppApi";
import base64 from "react-native-base64";

const RNFS = require("react-native-fs");


class ChatPage extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            text: "",
            isFooterVisible: false,
            keyboardHeight: null,
            footerComponent: 0,
            images: [],
            sendImages: [],
        }
    };
    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                if (!this.state.keyboardHeight) {
                    this.setState({keyboardHeight: e.endCoordinates.height,})
                }
                this.setState({
                    isFooterVisible: false,
                });
            }
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            (e) => {
                console.log(e);
            }
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    render() {
        let {currentUser} = this.props;
        let receiver = this.props.navigation.getParam("receiver");

        let header = this.renderHeader(receiver);
        let footer = this.renderFooter();
        return(
            <View style={styles.container}>
                {header}
                <GiftedChat
                    messages={this.state.messages}
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

                    textInputProps={{
                        onEndEditing: (e) => {console.log(e)},
                        onFocus: (e) => {
                            this.setState({isFooterVisible: false})
                        },
                    }}
                    renderMessageImage={this.renderMessageImage}
                    renderCustomView={this.renderCustomView}
                    renderLoading={
                        () =>
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this.loadData}
                            title={"加载中..."}
                            titleColor={"#0084ff"}
                            colors={["#0084ff"]}
                            tintColor={"#0084ff"}
                        />
                    }
                />
                {footer}
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
        return (
            <HeaderBar
                title={receiver.nickname}
                titleLayoutStyle={styles.headerTitleContainer}
                titleStyle={styles.headerTitle}
                style={styles.headerContainer}
                leftButton={leftIcon}
            />
        )
    };
    renderSend = (props) => {
        this.chatProps = props;
        let emojiIcon, imageIcon, sendButton;
        let imageBadge = this.state.sendImages.length > 0 ?(
            <View
                style={[styles.imageBadge, {backgroundColor: "#00ccff",}]}>
                <Text
                    style={{color: "#fff",textAlign: "center"}}
                >{this.state.sendImages.length}</Text>
            </View>
        ) : null;
        emojiIcon = (
            <EmojiIcon
                onPress={this.showEmojiPicker}
                size={26}
                style={{marginRight: 5,}}
            />
        );
        imageIcon = (
            <View style={{marginRight: 5, position: "relative",}}>
                <ImageIcon
                    onPress={this.showImagePicker}
                    size={26}
                />
                {imageBadge}
            </View>
        );
        sendButton = (
            this.state.text === "" &&
                this.state.sendImages.length === 0 ?
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
                {emojiIcon}
                {imageIcon}
                {sendButton}
            </View>
        )
    };
    renderCustomView = (props) => {
        let {currentMessage} = props;
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
                loading={currentMessage.isLoading}
                type={"clear"}
                buttonStyle={{margin: 0, padding: 0}}
                containerStyle={{position: "absolute", left: -29, top: 10}}
            />
        )
    };
    renderMessageImage = (props) => {
        let {currentMessage} = props;
        let images;
        if (Array.isArray(currentMessage.image)) {
            images = currentMessage.image;
        } else {
            images = [currentMessage.image];
        }
        return (
            <View>
                {
                    images.map((item, i) => {
                        return (
                            <Image
                                source={{uri: item}}
                                key={i.toString()}
                                style={styles.messageImage}
                            />
                        )
                    })
                }
            </View>
        )
    };
    renderFooter = () => {
          if (!this.state.isFooterVisible) return null;
          else {
              let component = null;
              if (this.state.footerComponent === 1) {
                  component = this.renderEmojiPicker();
              } else if (this.state.footerComponent === 2) {
                  component = this.renderImagePicker();
              }
              return  (
                  <View style={[styles.footerContainer, {height: this.state.keyboardHeight? this.state.keyboardHeight: 268} ]}>
                      {component}
                  </View>
              )
          }
    };
    renderEmojiPicker = () => {
        return (
            <Text>
                表情包
            </Text>
        )
    };
    renderImagePicker = () => {
        let sendButton = (
            this.state.sendImages.length === 0 ?
                <Button
                    title={`发送`}
                    disabled
                    disabledStyle={styles.ImagePickerFooterSendButtonDisabled}
                />
                :
                <Button
                    title={`发送(${this.state.sendImages.length})`}
                    buttonStyle={styles.ImagePickerFooterSendButton}
                    onPress={() => {this.onSend(this.chatProps)}}
            />
        );
        let footer = (
            <View style={styles.ImagePickerFooterContainer}>
                <Button
                    type={"clear"}
                    title={"相册"}
                    buttonStyle={{padding: 0}}
                    containerStyle={{marginRight: 15}}
                    onPress={this.toAlbumPage}
                />
                <Button
                    type={"clear"}
                    title={"原图"}
                    buttonStyle={{padding: 0}}
                    containerStyle={{marginRight: 15}}
                    onPress={() => {this.setState({})}}
                />
                <View
                    style={{flex: 1,}}
                />
                {sendButton}
            </View>
        );
        return (
            <View style={{flex: 1,}}>
                <FlatList
                    data={this.state.images}
                    keyExtractor={item => item.node.image.filename}
                    horizontal={true}
                    renderItem={this.renderImagePreviewItem}
                />
                {footer}
            </View>
            )
    };
    renderImagePreviewItem = ({item}) => {
        let checkIcon = (
            item.checked && item.checked !== 0 ?
                <TouchableWithoutFeedback
                    onPress={() => {this.unSelectItem(item)}}
                >
                    <View
                    style={[styles.imagePreviewCheckIconContainer, {backgroundColor: "#00ccff",}]}>
                        <Text
                            style={{color: "#fff",textAlign: "center"}}
                        >{item.checked}</Text>
                    </View>
                </TouchableWithoutFeedback>
                :
                <TouchableWithoutFeedback
                    onPress={() => {this.selectItem(item)}}
                >
                    <View
                        style={[styles.imagePreviewCheckIconContainer, {backgroundColor: "rgba(50,50,50,0.7)"}]}
                    />
                </TouchableWithoutFeedback>
        );
        return (
            <View style={styles.imagePreviewItemContainer}>
                <Image
                    source={{uri: item.node.image.uri}}
                    style={{height: this.getImageDimension(item).height, width: this.getImageDimension(item).width, borderRadius: 2}}
                />
                {checkIcon}
            </View>
        )
    };
    renderImageViewer = () => {
        return null;
    };
    showEmojiPicker = () => {
        Keyboard.dismiss();
        this.setState({
            isFooterVisible: true,
            footerComponent: 1,
        });
    };
    showImagePicker = () => {
        Keyboard.dismiss();
        if (this.state.images.length <= 0) {
            this.getPhotosPreview();
        } else {
            this.setState({
                isFooterVisible: true,
                footerComponent: 2,
            })
        }
    };

    getPhotosPreview = () => {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
            .then((granted) => {
                if (granted) {
                    CameraRoll.getPhotos(
                        this.state.pageInfo ? {
                            first: 5,
                            after: this.state.pageInfo.end_cursor,
                            assetType: 'Photos',
                        } : {
                            first: 5,
                            assetType: 'Photos',
                        }
                    )
                        .then(res => {
                            if (this.state.images.length <= 0) {
                                this.setState({
                                    isFooterVisible: true,
                                    footerComponent: 2,
                                })
                            }
                            this.setState({
                                images: [...this.state.images, ...res.edges,],
                                pageInfo: res.page_info,
                            });
                            console.log(res);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            })
            .catch(err => {

            })
    };
    onSend = (props) => {
        this.buildMessage(props)
            .then(message => {
                this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, message),
                }));
                console.log(message);
                this.sendAsync(props, message)
                    .catch(err => {console.log(err)});
                this.clearMessage();
            })
            .catch(err => {console.log(err)});

    };
    sendAsync = async (props, message) => {
        try {
            let receiver = this.props.navigation.getParam("receiver");
            let {currentUser} = this.props;
            let data = await PrivateMessageApi.addMessage({
                text: message.text,
                thatUserId: receiver.id,
                thatUserName: receiver.nickname,
                thatUserAvatar: receiver.avatar,
                thisUserId: currentUser.id,
                thisUserName: currentUser.nickname,
                thisUserAvatar: currentUser.avatar,
            }, this.props.currentUser.jwt);

            let from = XmppApi.getJid(this.props.currentUser);
            let to = XmppApi.getJid(this.props.navigation.getParam("receiver"));
            await XmppApi.sendMessage(
                from, to, "chat", props.messageIdGenerator(),
                message.text, message.image
            );
            message.isLoading = false;
            this.setState(state => {
                return {
                    ...state,
                    messages: [...state.messages]
                }
            });
        } catch (err) {
            console.log(err);
            message.error = err;
            this.setState(state => {
                return {
                    ...state,
                    messages: [...state.messages]
                }
            });
        }
    };
    buildMessage = async (props) => {
        let message = {
            user: props.user,
            createdAt: new Date(),
            _id: props.messageIdGenerator(),
            isLoading: true,
            error: new Error(""),
        };
        if (this.state.text !== "") {
            message.text = this.state.text;
        }
        if (this.state.sendImages.length !== 0 ) {
            message.image = [];
            for (let item of this.state.sendImages) {
                let imgData = await RNFS.readFile(item.node.image.uri, "base64");
                console.log(imgData);
                message.image.push(imgData);
                console.log(imgData);
            }
        }
        console.log(message);
        return message;
    };
    clearMessage = () => {
        this.setState(state => {
            for(let item of state.sendImages) {
                item.checked = 0;
            }
            return {
                images: [...state.images],
                sendImages: [],
                text: "",
            }
        })
    };
    getImageDimension = (item) => {
        let height, width, keyboardHeight;
        keyboardHeight = this.state.keyboardHeight ? this.state.keyboardHeight : 268;
        height = keyboardHeight - 45 - 3 - 3;// padding 3, 3, footer 45
        width = height / item.node.image.height * item.node.image.width;
        return {
            height,
            width,
        }
    };
    selectItem = (item) => {
        this.setState(state => {
            item.checked = state.sendImages.length + 1;
            state.sendImages.push(item);
            return {
                state,
                sendImages: state.sendImages,
                images: [...state.images],
            }
        })

    };
    unSelectItem = (item) => {
        item.checked = 0;
        this.setState(state => {
            let tmpImages = [], index = 1;
            for (let img of state.sendImages ) {
                if (img.node.image.filename !== item.node.image.filename) {
                    img.checked = index;
                    tmpImages.push(img);
                    index++;
                } else {
                    img.checked = 0;
                }
            }

            return {
                ...state,
                sendImages: tmpImages,
                images: [...state.images],
            }
        });
    };
    goBack = () => {
        NavigationUtil.back(this.props);
    };
    toAlbumPage = () => {

    };
}
const mapStateToProps = state => ({
    currentUser: state.currentUser,
});
export default connect(mapStateToProps, null)(ChatPage);

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
        width: WINDOW.width / 3,
        height: WINDOW.height / 4,
        borderRadius: 10,
        marginTop: 12,
        marginRight: 12,
        marginLeft: 12,
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

    footerContainer: {
        width: WINDOW.width,
        justifyContent: "center",
        alignItems: "center",
    },

    ImagePickerFooterContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 45,
        width: "100%",
        paddingLeft: 15,
        paddingRight: 15,
        borderTopWidth: 0.5,
        borderTopColor: "#eee",
    },
    ImagePickerFooterSendButton: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20,
        backgroundColor: "#00a0ff"
    },
    ImagePickerFooterSendButtonDisabled: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20,
        backgroundColor: "#96e0ff"
    },
    imagePreviewItemContainer: {
        padding: 3,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    imagePreviewCheckIconContainer: {
        position: "absolute",
        top: 5,
        right: 5,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#fff",
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});
