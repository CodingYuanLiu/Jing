import React from "react"
import { View, Text, StyleSheet, TouchableWithoutFeedback, TextInput } from 'react-native';
import HeaderBar from "../../common/components/HeaderBar";
import {CameraIcon, CaretRightIcon, ChevronIcon, CloseIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import {Avatar, Button, CheckBox, ListItem} from "react-native-elements";
import ImagePicker from "react-native-image-picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import {connect} from "react-redux";
import {updateUserAvatar, updateUserInfo} from "../../actions/currentUser";
import Api from "../../api/Api";
import Util from "../../common/util";


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
            genderText: "保密",
            birthday: "",
            dormitory: "",
            major: "",
            birthdayPickerVisible: false,
            genderPickerVisible: false,
        }
    }
    componentDidMount() {
        this.loadData();
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
        let nickname = this.renderNormalInput("昵称", "昵称是您交往使用的称呼",
            this.state.nickname, this.handleNicknameChange);
        let signature = this.renderLongInput("个性签名", "简单介绍自己，兴趣，爱好",
            this.state.signature, this.handleSignatureChange);
        let gender = this.renderOnPressInput("性别", "填写您的性别",
            this.state.genderText, this.showGenderPicker);
        let birthday = this.renderOnPressInput("生日", "填写您的生日",
            this.state.birthday, this.showBirthdayPicker);
        let genderPicker = this.renderGenderPicker(this.state.gender);
        let birthdayPicker = this.renderBirthdayPicker(this.state.birthday);
        let dormitory = null;
        let major = null;
        return (
            <View style={styles.basicInformationContainer}>
                {title}
                {nickname}
                {signature}
                {gender}
                {genderPicker}
                {birthday}
                {birthdayPicker}
                {dormitory}
                {major}
            </View>
        );
    };
    renderNormalInput = (label, placeholder, value, onChangeText) => {
        return (
            <View style={styles.normalInputContainer}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                />
            </View>
        );
    };
    renderLongInput = (label, placeholder, value, onChangeText) => {
        return (
            <View style={styles.longInputContainer}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    style={styles.longInput}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                />
            </View>
        );
    };
    renderOnPressInput = (label, placeholder, value, onPress) => {
        let rightIcon = (
            <ChevronIcon
                color={"#7a7a7a"}
                size={20}
            />
        );
        return (
            <TouchableWithoutFeedback
                onPress={onPress}
            >
                <View style={styles.normalInputContainer}>
                    <Text style={styles.label}>{label}</Text>
                    <Text
                        style={styles.input}
                    >
                        {value === "" ? placeholder : value}
                    </Text>
                    {rightIcon}
                </View>
            </TouchableWithoutFeedback>
        );
    };

    renderGenderPicker = (gender) => {
        let title = this.renderInformationTitle("选择性别");
        let handleCheckGender = this.handleCheckGender;
        let secretCheckBox = (
            <CheckBox
                title={"保密"}
                checked={gender === 2}
                onPress={() => {handleCheckGender(2)}}
            />
        );
        let maleCheckBox = (
            <CheckBox
                title={"男"}
                checked={gender === 1}
                onPress={() => {handleCheckGender(1)}}
            />
        );
        let femaleCheckBox = (
            <CheckBox
                title={"女"}
                checked={gender === 0}
                onPress={() => {handleCheckGender(0)}}
            />
        );

        return (
            <Modal
                isVisible={this.state.genderPickerVisible}
                backdropOpacity={0.5}
                useNativeDriver={true}
                onBackdropPress={this.hideGenderPicker}
            >
               <View style={styles.genderModalContainer}>
                   {title}
                   {secretCheckBox}
                   {maleCheckBox}
                   {femaleCheckBox}
               </View>
            </Modal>
        )
    };

    renderBirthdayPicker = (birthday) => {
          return (
            <DateTimePicker
                isVisible={this.state.birthdayPickerVisible}
                onConfirm={this.handleCheckBirthday}
                onCancel={this.hideBirthdayPicker}
                datePickerModeAndroid={"spinner"}
                date={birthday === "" ? new Date() : new Date(birthday)}
                minimumDate={new Date("1900-01-01")}
            />
          )
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
        this.setState({genderPickerVisible: true});
    };
    hideGenderPicker = () => {
        this.setState({genderPickerVisible: false});
    };
    handleCheckGender = (gender) => {
        this.setState({
            gender: gender,
            genderText: gender === 2 ? "保密" : gender === 1 ? "男" : "女"
        });
        this.hideGenderPicker();
    };

    showBirthdayPicker = () => {
        this.setState({birthdayPickerVisible: true});
    };
    handleCheckBirthday = (date) => {
        let birthday;
        let year = date.getUTCFullYear();
        let month = date.getUTCMonth() + 1;
        let day = date.getUTCDate();
        birthday = `${year}年${month}月${day}日`;
        this.setState({
            birthday: birthday,
        });
        this.hideBirthdayPicker();
    };
    hideBirthdayPicker = () => {
        this.setState({birthdayPickerVisible: false});
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
    loadData = () => {
        let currentUser = this.props.currentUser;
        this.setState({
            avatar: {
                data: null,
                uri: currentUser.avatar,
            },
            nickname: currentUser.nickname,
            signature: currentUser.signature,
            gender: currentUser.gender,
            genderText: currentUser.gender === 2 ? "保密" : currentUser.gender === 1 ? "男" : "女",
            birthday: currentUser.birthday,
            dormitory: currentUser.dormitory,
            major: currentUser.major,
            phone: currentUser.phone,
        });
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
    headerRightButton: {
        marginRight: 20,
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
        color: "#2a2a2a",
    },


    basicInformationContainer: {
        marginLeft: 20,
        marginRight: 16,
    },
    normalInputContainer: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderColor: "#eee",
        alignItems: "center",
        height: 50,
    },
    longInputContainer: {
        borderBottomWidth: 0.5,
        borderColor: "#eee",
        marginTop: 20,
        height: 80,
    },
    label: {
        fontSize: 16,
        color: "#7a7a7a",
        width: 80,
    },
    input: {
        color: "#3a3a3a",
        fontSize: 16,
        flex: 1,
    },
    longInput: {
        color: "#3a3a3a",
        fontSize: 16,
        backgroundColor: "transparent",
        width: "100%",
    },

    genderModalContainer: {
        backgroundColor: "#fff",
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 16,
    },
});
