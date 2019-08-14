import React from "react"
import { View, Text, StyleSheet, TouchableWithoutFeedback, TextInput } from 'react-native';
import HeaderBar from "../../../common/components/HeaderBar";
import { CameraIcon, ChevronIcon, CloseIcon } from "../../../common/components/Icons";
import NavigationUtil from "../../../navigator/NavUtil";
import { Avatar, Button, CheckBox } from "react-native-elements";
import ImagePicker from "react-native-image-picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { updateUserAvatar, updateUserInfo } from "../../../actions/currentUser";
import Api from "../../../api/Api";
import Util from "../../../common/util";


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
            goBackModalVisible: false,
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
        let goBackModal = this.renderGoBackModal();
        return(
            <View style={styles.container}>
                {header}
                {avatar}
                {basicInformation}
                {goBackModal}
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
                    onPress={this.goBack}
                    />
                }
                title={"编辑个人资料"}
                titleLayoutStyle={styles.headerTitle}
                rightButton={
                    <Button
                    title={"保存"}
                    titleStyle={styles.headerButtonTitle}
                    type={"clear"}
                    onPress={this.handleSave}
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
            this.getGenderText(this.state.gender), this.showGenderPicker);
        let birthday = this.renderOnPressInput("生日", "填写您的生日",
            this.getBirthdayText(this.state.birthday), this.showBirthdayPicker);
        let genderPicker = this.renderGenderPicker(this.state.gender);
        let birthdayPicker = this.renderBirthdayPicker(this.state.birthday);
        let dormitory = this.renderOnPressInput("宿舍", "填写您的宿舍",
            this.state.dormitory, this.toDormitoryPage);
        let major = this.renderOnPressInput("专业", "填写您的专业",
            this.state.major, this.toMajorPage);
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
                maximumDate={new Date()}
            />
          )
    };
    renderGoBackModal = () => {
        let content = (
            <Text style={styles.goBackModalText}>
                确认返回吗?　当前修改尚未保存，继续返回将取消所有更改
            </Text>
        );
        let savingStatus = (
              <Button
                type={"clear"}
                loading
                title={"正在保存..."}
              />
        );
        let footer = (
            <View style={styles.goBackModalFooterContainer}>
                <Button
                    type={"clear"}
                    title={"直接返回"}
                    containerStyle={styles.goBackModalFooterButton}
                    onPress={this.directGoBack}
                />
                <Button
                    type={"clear"}
                    title={"保存并返回"}
                    containerStyle={styles.goBackModalFooterButton}
                    onPress={this.saveAndBack}
                />
            </View>
        );
        return (
            <Modal
                isVisible={this.state.goBackModalVisible}
                onBackdropPress={this.hideGoBackModal}
                useNativeDriver={true}
                style={{ height: 200, width: "92%",}}
                hideModalContentWhileAnimating
            >
                <View style={styles.goBackModalContainer}>
                    {content}
                    {this.state.isSaving ? savingStatus : null}
                    {footer}
                </View>
            </Modal>
        )
    };
    showAvatarPicker = () => {
        ImagePicker.showImagePicker(imagePickerOptions, (response) => {
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
                });
                this.setAvatarModified(true);
            }
        });
    };
    getGenderText = (gender) => {
        return gender === 2 ? "保密" : gender === 1 ? "男" : "女";
    };
    getBirthdayText = (birthday) => {
        try {
            if (birthday === "") return "";
            let date = new Date(birthday);
            let year = date.getUTCFullYear();
            let month = date.getUTCMonth() + 1;
            let day = date.getUTCDate();
            return `${year}年${month}月${day}日`;
        } catch (e) {
            return "";
        }
    };
    handleNicknameChange = (text) => {
        this.setInfoModified(true);
        this.setState({nickname: text});
    };
    handleSignatureChange = (text) => {
        this.setInfoModified(true);
        this.setState({signature: text});
    };
    showGenderPicker = () => {
        this.setState({genderPickerVisible: true});
    };
    hideGenderPicker = () => {
        this.setState({genderPickerVisible: false});
    };
    handleCheckGender = (gender) => {
        this.setInfoModified(true);
        this.setState({
            gender: gender
        });
        this.hideGenderPicker();
    };
    showBirthdayPicker = () => {
        this.setState({birthdayPickerVisible: true});
    };
    handleCheckBirthday = (date) => {
        this.setInfoModified(true);
        this.setState({
            birthday: Util.dateTimeToString(date),
        });
        this.hideBirthdayPicker();
    };
    hideBirthdayPicker = () => {
        this.setState({birthdayPickerVisible: false});
    };
    toDormitoryPage = () => {
        NavigationUtil.toPage({
            handleDormitoryChange: this.handleDormitoryChange,
        }, "DormitoryPage")
    };
    toMajorPage = () => {
        NavigationUtil.toPage({
            handleMajorChange: this.handleMajorChange
        }, "MajorPage")
    };
    handleDormitoryChange = (text) => {
        this.setInfoModified();
        this.setState({dormitory: text});
    };
    handleMajorChange = (text) => {
        this.setInfoModified();
        this.setState({major: text});
    };
    setInfoModified = (flag) => {
        this.setState({infoModified: flag});
    };
    setAvatarModified = (flag) => {
        this.setState({avatarModified: flag});
    };
    setSaved = (flag) => {
        this.setState({saved: flag});
    };
    showGoBackModal = () => {
        this.setState({goBackModalVisible: true});
    };
    hideGoBackModal = () => {
        this.setState({goBackModalVisible: false});
    };

    handleSave = () => {
        this.saveAsync()
            .then(res => {
                this.setSaved(true);
                this.setAvatarModified(false);
                this.setInfoModified(false);
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
                this.props.updateUserAvatar(avatarUri);
                this.setState({isSaving: false});
                return "modify avatar and info ok";
            } else {
                // only modified avatar
                let avatarUri = await Api.updateAvatar(avatarData, jwt);
                this.props.updateUserAvatar(avatarUri);
                this.setState({isSaving: false});
                return avatarUri;
            }
        } else {
            if (this.state.infoModified) {
                // only modified info
                await Api.updateInfo(data, this.props.currentUser.jwt);
                this.props.updateUserInfo(data);
                this.setState({isSaving: false});
                return "info ok";
            } else {
                // nothing modified
                this.setState({isSaving: false});
                return "nothing modified";
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
            birthday: currentUser.birthday,
            dormitory: currentUser.dormitory,
            major: currentUser.major,
            phone: currentUser.phone,
        });
    };
    goBack = () => {
        let state = this.state;
        if (state.avatarModified && !state.saved || state.infoModified && !state.saved){
            this.showGoBackModal();
        } else {
            NavigationUtil.back(this.props);
        }
    };
    saveAndBack = () => {
        this.saveAsync()
            .then(() => {
                this.setSaved(true);
                this.setAvatarModified(false);
                this.setInfoModified(false);
                this.hideGoBackModal();
                NavigationUtil.back(this.props);
            })
            .catch(err => {
                console.log(err)
            })
    };
    directGoBack = () => {
        this.hideBirthdayPicker();
        setTimeout(NavigationUtil.back(this.props), 500);
    }
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
    goBackModalContainer: {
        backgroundColor: "#fff",
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 16,
        height: 200,
         width: "100%",
    },
    goBackModalText: {
        color: "#3a3a3a",
        fontSize: 16,
        marginTop: 16,
        marginBottom: 16,
    },
    goBackModalFooterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    goBackModalFooterButton: {
        marginRight: 16,
        marginLeft: 12,
    },
});
