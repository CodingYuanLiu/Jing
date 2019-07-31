import React from "react"
import { View, Text, StyleSheet, TouchableWithoutFeedback, TextInput } from 'react-native';
import HeaderBar from "../../common/components/HeaderBar";
import {CameraIcon, CloseIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import {Avatar, Button, ListItem} from "react-native-elements";
import ImagePicker from "react-native-image-picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import {connect} from "react-redux";
import {updateUserAvatar, updateUserInfo} from "../../actions/currentUser";
import Api from "../../api/Api";


class ModifyInformation extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            isSaving: false,
            avatarModified: false,
            infoModified: false,
            saved: false,
            avatar: {},
            nickname: "",
            signature: "",
            gender: 2,
            birthday: "",
            dormitory: "",
            major: "",
        }
    }
    componentDidMount() {
        console.log(this.props);
        let currentUser = this.props.currentUser;
        this.setState({
            avatar: {
                data: null,
                uri: currentUser.avatar,
            },
            nickname: currentUser.nickname,
            signature: currentUser.signature,
            gender: currentUser.gender,
            birthday: currentUser.birthday,
            dormitory: currentUser.dormitory,
            major: currentUser.major,
            phone: currentUser.phone,
        })
    }

    render() {
        let header = this.renderHeader();
        let avatar = this.renderAvatar();
        let basicInformation = this.renderBasicInformation();
        return(
            <View style={styles.container}>
                {header}
                {avatar}
                {basicInformation}
            </View>
        )
    }
    renderHeader = () => {
        return (
            <HeaderBar
                leftButton={
                    <CloseIcon
                    color={"#fff"}
                    style={styles.headerIcon}
                    onPress={() => {NavigationUtil.back(this.props)}}
                    />
                }
                title={"编辑个人资料"}
                titleLayoutStyle={styles.headerTitle}
                rightButton={
                    <Button
                    title={"保存"}
                    titleStyle={styles.headerButtonTitle}
                    type={"clear"}
                    onPress={this.handleSavePress}
                    />
                }
                rightBtnStyle={styles.headerRightButton}
                style={{elevation: 10,}}
            />
        )
    };
    renderAvatar = () => {
        let avatarIcon = (
            <CameraIcon
            color={"#fff"}
            style={styles.avatarIcon}
            />
        );
        let avatar = this.state.avatar;
        return (
            <TouchableWithoutFeedback
            onPress={this.showAvatarPicker}
            >
                <View style={styles.avatarIconContainer}>
                    <Avatar
                        rounded
                        source={{uri: avatar.data ? `data:${avatar.type};base64,${avatar.data}` : avatar.uri}}
                        size={80}
                    />
                    {avatarIcon}
                </View>
            </TouchableWithoutFeedback>
        )
    };
    renderInformationTitle = (title) => {
        return (
            <View style={styles.infoTitleContainer}>
                <Text style={styles.infoTitle}>{title}</Text>
            </View>
        )
    };
    renderBasicInformation = () => {
        let title = this.renderInformationTitle("基本资料");
        let nickname = this.renderNormalInput("昵称", "昵称将会作为您和别人交往的可见称呼"
            , this.state.nickname, this.handleNicknameChange);
        let signature = this.renderLongInput("个性签名", "简单介绍自己的兴趣"
            , this.state.signature, this.handleSignatureChange);
        let gender = this.renderOnPressInput("性别", this.showGenderPicker
            , this.state.gender);
        let birthday = this.renderOnPressInput("生日", this.showBirthdayPicker
            , this.state.birthday);
        let dormitory = null;
        let major = null;
        return (
            <View style={styles.basicInformationContainer}>
                {title}
                {nickname}
                {signature}
                {gender}
                {birthday}
                {dormitory}
                {major}
            </View>
        );
    };
    renderNormalInput = (label, placeholder, onChangeText) => {

        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                />
            </View>
        );
    };
    renderLongInput = (label, placeholder, value, onChangeText) => {
        return (
            <View style={styles.longInputContainer}>
                <Text>{label}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                />
            </View>
        );
    };
    renderOnPressInput = (label, onPress) => {
        return (
            <View>
                <TouchableWithoutFeedback>
                    <Text>{label}</Text>
                    <TextInput
                        style={styles.input}
                        onPress={onPress}
                    />
                </TouchableWithoutFeedback>
            </View>
        );
    };
    showAvatarPicker = () => {
        ImagePicker.showImagePicker(imagePickerOptions, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                // ... do nothing
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                let data = response.data;
                let type = response.type;

                this.setState({
                    avatar: {
                        ...this.state.avatar,
                        data: data,
                        type: type,
                    },
                    avatarModified: true,
                });
            }
        });
    };
    handleNicknameChange = (text) => {
        this.setState({nickname: text});
    };
    handleSignatureChange = (text) => {
        this.setState({signature: text});
    };
    showGenderPicker = () => {

    };
    showBirthdayPicker = () => {

    };
    handleSavePress = () => {
        this.saveAsync()
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    };
    saveAsync = async () => {
        this.setState({isSaving: true});
        let data = {
            id: this.props.currentUser.id,
            nickname: this.state.nickname,
            signature: this.state.signature,
            gender: this.state.gender,
            birthday: this.state.birthday,
            dormitory: this.state.dormitory,
            major: this.state.major,
            phone: this.state.phone,
        };
        let jwt = this.props.currentUser.jwt;
        let avatarData = this.state.avatar.data;
        console.log(data, avatarData);
        if (this.state.avatarModified) {
            if (this.state.infoModified) {
                // modified both avatar and user info
                await Api.updateInfo(data, jwt);
                this.props.updateUserInfo(data);
                let avatarUri = await Api.updateAvatar(avatarData, jwt);
                this.props.updateUserAvatar(avatarUri.url);
                this.setState({isSaving: false, saved: true});
            } else {
                // only modified avatar
                let avatarUri = await Api.updateAvatar(avatarData, jwt);
                this.props.updateUserAvatar(avatarUri.url);
                this.setState({isSaving: false, saved: true});
                return avatarUri;
            }
        } else {
            if (this.state.infoModified) {
                // only modified info
                await Api.updateInfo(data, this.props.currentUser.jwt);
                this.props.updateUserInfo(data);
            } else {
                // nothing modified
                this.setState({isSaving: false, saved: true});
            }
        }
    };
    quit = () => {
        if (!this.saved){
            this.setState({showQuitDialog: true});
        } else {
            NavigationUtil.back(this.props);
        }
    };
    startModify = () => {
        this.setState({saved: false});
    };
}

const imagePickerOptions = {
    title: "选择",
    cancelButtonTitle: "取消",
    takePhotoButtonTitle: "拍摄",
    chooseFromLibraryButtonTitle: "从相册选择",
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    quality: 0.4,
};

const mapStateToProps = state => ({
    currentUser: state.currentUser,
});
const mapDispatchToProps = dispatch => ({
    updateUserInfo: (data) => dispatch(updateUserInfo(data)),
    updateUserAvatar: (avatar) => dispatch(updateUserAvatar(avatar)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModifyInformation);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerButtonTitle: {
        fontSize: 14,
        color: "#fff",
    },
    headerTitle: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    headerIcon: {
        marginLeft: 20,
    },
    avatarIconContainer: {
        marginTop: 20,
        position: "relative",
        justifyContent: "center",
        marginLeft: 20,
    },
    avatarIcon: {
        position: "absolute",
        left: 28,   //28 for 40 (radius of avatar) - 12 (radius of icon),
        top: 28,
    },
    infoTitleContainer: {
        marginTop: 20,
        marginBottom: 20
    },
    infoTitle: {
        fontWeight: "bold",
        fontSize: 20,
    },
    headerRightButton: {
        marginRight: 20,
    },
    basicInformationContainer: {
        marginLeft: 20,
    },
    input: {
        borderBottomWidth: 0.5,
        borderColor: "#cfcfcf",
    },
    inputContainer: {
        flexDirection: "row",
    },
    longInputContainer: {

    },

});
