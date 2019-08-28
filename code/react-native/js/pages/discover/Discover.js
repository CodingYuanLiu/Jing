import React from "react"
import { View, Text, StatusBar, StyleSheet, TouchableNativeFeedback } from 'react-native';
import HeaderBar from "../../common/components/HeaderBar";
import {GiftedChat} from "react-native-gifted-chat";
import {connect} from "react-redux";
import {EmojiIcon, ImageIcon} from "../../common/components/Icons";
import {Button} from "react-native-elements";
import CameraRoll from "@react-native-community/cameraroll";

class DiscoverScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: 'My message',
                    createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://facebook.github.io/react/img/logo_og.png',
                    },
                    image: 'https://facebook.github.io/react/img/logo_og.png',
                    // You can also add a video prop:
                    //video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                    // Any additional custom parameters are passed through
                }
            ],
            text: "",
        }
    };
    componentDidMount(){
    }

    render() {
        let {currentUser} = this.props;
        return(
            <View style={styles.container}>
                <HeaderBar
                    title={"测试哟过户"}
                />
                <GiftedChat
                    //alignTop={}
                    //initialText={}
                    messages={this.state.messages}
                    onSend={this.onSend}
                    user={{
                        _id: currentUser.username,
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
                />
            </View>
        )
    };
    renderSend = (props) => {
        let imageIcon, sendButton;
        !props.text || props.text === "" ?
            imageIcon = (
                <ImageIcon
                    onPress={this.showImagePicker}
                    size={26}
                    style={{marginRight: 10, paddingLeft: 2, width: 40}}
                />
            ) : null;
        props.text && props.text !== "" ?
            sendButton = (
                <Button
                    type={"clear"}
                    title={"发送"}
                    onPress={
                        ({createdAt, user, _id}) => {
                            props.onSend({
                                _id,
                                text: props.text,
                                createdAt,
                                user,
                            });
                            this.setState({text: ""});
                        }
                    }
                    buttonStyle={{padding: 0, }}
                    containerStyle={{marginRight: 10, width: 40,justifyContent: "center"}}
                />
            ) : null;
        return (
            <View style={styles.sendButtonContainer}>
                <EmojiIcon
                    onPress={this.showEmojiPicker}
                    size={26}
                    style={{marginRight: 13,}}
                />
                {imageIcon}
                {sendButton}
            </View>
        )
    };
    onSend = (message) => {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
        }))
    };
    showEmojiPicker = () => {

    };
    showImagePicker = () => {
        CameraRoll.getPhotos(
            {
                first: 20,
                assetType: 'Photos',
            }
        )
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    };
}
const mapStateToProps = state => ({
    currentUser: state.currentUser,
});
export default connect(mapStateToProps, null)(DiscoverScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sendButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: "100%",
    },
});
