import React from "react"
import { View, TextInput, StyleSheet, Text } from 'react-native';
import {Button, Image, ListItem} from "react-native-elements"
import Dao from "../../api/Dao";
import {setUserData} from "../../actions/currentUser";
import {connect} from "react-redux";
import Api from "../../api/Api"
import XmppApi from "../../api/XmppApi";
import {CheckIconReversed, CircleIcon, CloseIcon, EyeIcon, EyeOffIcon} from "../../common/components/Icons";
import store from "../../store";
import {onGetCurrentUserFollower} from "../../actions/currentUserFollower";
import {onGetCurrentUserFollowing} from "../../actions/currentUserFollowing";
import {onGetCurrentUserManageAct} from "../../actions/currentUserManage";
import {onGetCurrentUserJoinAct} from "../../actions/currentUserJoin";
import {onLoadSettings} from "../../actions/setting";
import SplashScreen from "react-native-splash-screen";
import Util from "../../common/util";


class RegisterScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            username: "",
            password: "",

            usernameExists: false,

            usernamePatternValid: false,
            usernameStartValid: false,

            passwordVisible: false,
            passwordLengthValid: false,
            passwordPatternValid: false,
            loading: false,
            phone: "-1",
            nickname: "昵称",
        }
    }

    componentDidMount(): void {
        SplashScreen.hide();
    }

    render() {
        let logo = this.renderLogo();
        let usernameInput = this.renderUsernameInput();
        let passwordInput = this.renderPasswordInput();
        let button = this.renderButton();
        return(
            <View style={styles.container}>
                {logo}
                <View style={styles.formContainer}>
                    {usernameInput}
                    {passwordInput}
                    {button}
                </View>
            </View>
        );
    };
    renderLogo = () => {
        return (
            <View
                style={styles.headerContainer}
            >
                <Image
                    style={styles.headerLogo}
                    source={require("../../static/images/logo-white.png")}
                />
                <Text style={{fontSize: 22, color: "#0084ff", marginLeft: 20}}>
                    注册
                </Text>
            </View>
        )
    };
    renderUsernameInput = () => {
        let clearIcon = this.state.username !== "" ?
            <CloseIcon
                color={"#bfbfbf"}
                size={18}
                onPress={() => {this.setState({username: ""})}}
            /> : null;

        let usernameStartValidIcon = this.renderTipsLeftIcon(this.state.usernameStartValid);
        let usernamePatternValidIcon = this.renderTipsLeftIcon(this.state.usernamePatternValid);

        let errorPrompt = this.state.usernameExists ?
            <ListItem
                leftIcon={<CircleIcon size={10} color={"#ee5223"}/>}
                title={"用户名已存在"}
                titleStyle={{fontSize: 14, color: "#ee5223"}}
                containerStyle={{padding: 10, margin: 0}}
            /> : null;
        return (
            <View style={styles.itemContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder={"用户名"}
                        onChangeText={(text) => {
                            let res = this.verifyContent(text, this.state.password);
                            this.setState({
                                username: text,
                                ...res,
                            });
                        }}
                        value={this.state.username}
                        autoCompleteType={"username"}
                        textContentType={"username"}
                        keyboardType={"email-address"}
                        style={{flex: 1, fontSize: 20,}}
                    />
                    {clearIcon}
                </View>
                {errorPrompt}
                <ListItem
                    leftIcon={usernamePatternValidIcon}
                    title={"用户名由6-20位字母、下划线或数字组成"}
                    titleStyle={{fontSize: 14, color: "#9f9f9f"}}
                    containerStyle={{padding: 10}}
                />
                <ListItem
                    leftIcon={usernameStartValidIcon}
                    title={"由字母或下划线开始"}
                    titleStyle={{fontSize: 14, color: "#9f9f9f"}}
                    containerStyle={{padding: 10}}
                />
            </View>
        );
    };
    renderPasswordInput = () => {
        let rightIcon = !this.state.passwordVisible ?
            <EyeIcon
                color={"#bfbfbf"}
                size={18}
                onPress={() => {
                    this.setState(
                        {passwordVisible: true}
                    )
                }}
            />
            :
            <EyeOffIcon
                color={"#bfbfbf"}
                size={18}
                onPress={() => {
                    this.setState(
                        {passwordVisible: false}
                    )
                }}
            />;

        let clearIcon = this.state.password !== "" ?
            <CloseIcon
                color={"#bfbfbf"}
                size={18}
                onPress={() => {this.setState({password: ""})}}
            /> : null;

        let passwordLengthValidIcon = this.renderTipsLeftIcon(this.state.passwordLengthValid);
        let passwordPatternIcon = this.renderTipsLeftIcon(this.state.passwordPatternValid);
        return (
            <View style={styles.itemContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder={"密码"}
                        onChangeText={(text) => {
                            let res = this.verifyContent(this.state.username, text);
                            this.setState({
                                password: text,
                                ...res,
                            });
                        }}
                        value={this.state.password}
                        textContentType={"password"}
                        autoCompleteType={"password"}
                        secureTextEntry={!this.state.passwordVisible}
                        style={{flex: 1,fontSize: 20,}}
                    />
                    {clearIcon}
                    {rightIcon}
                </View>
                <ListItem
                    leftIcon={passwordLengthValidIcon}
                    title={"密码有8-16位数字、字母或符号组成"}
                    titleStyle={{fontSize: 14, color: "#9f9f9f"}}
                    containerStyle={{padding: 10}}
                />
                <ListItem
                    leftIcon={passwordPatternIcon}
                    title={"至少含有2种及以上的字符"}
                    titleStyle={{fontSize: 14, color: "#9f9f9f"}}
                    containerStyle={{padding: 10}}
                />
            </View>
        );
    };
    renderTipsLeftIcon = (flag) => {
        return (
            flag ?
                <CheckIconReversed
                    color={"#29a5ff"}
                    size={14}
                />
                :
                <CircleIcon
                    color={"#afafaf"}
                    size={10}
                />
        )
    };
    renderButton = () => {
        return (
            <Button
                title={"注册并登录"}
                loading={this.state.loading}
                disabled={
                    !this.state.passwordPatternValid || !this.state.passwordLengthValid
                    || !this.state.usernamePatternValid || !this.state.usernameStartValid
                }
                disabledStyle={{backgroundColor: "#cef5ff"}}
                disabledTitleStyle={{color: "#fff"}}
                onPress={this.register}
                containerStyle={{marginTop: 28}}
            />
        )
    };
    register = () => {
        this.setState({loading: true});
        let jwt = this.props.navigation.getParam("jwt") ?
            this.props.navigation.getParam("jwt"): Util.TOKEN;
        let hasLoginOnWechat = this.props.navigation.getParam("hasLoginOnWechat")?
            this.props.navigation.getParam("hasLoginOnWechat") : Util.HAS_ACCOUNT_FLAG;
        let data = this.buildRegisterData();
        console.log(data, jwt, hasLoginOnWechat);
        this.registerAsync(data, jwt, hasLoginOnWechat)
            .then(() => {
                this.setState({loading: false});
                this.props.navigation.navigate("Home", null);
            })
            .catch(err => {
                console.log(err);
            });
    };
    registerAsync = async (data, jwt, hasLoginOnWechat) => {
        try {
            let res = await Api.register(data, jwt);
            console.log(res);
            let userInfo = await Api.getSelfDetail(jwt);
            if ( !hasLoginOnWechat ) {
                await OpenFireApi.register({
                    username: `user${userInfo.id}`,
                    password: "lqynb0413",
                    name: userInfo.nickname,
                    email: "",
                    properties: [
                        {
                            key: "background",
                            value: "",
                        },
                        {
                            key: "watermarkSetting",
                            value: true,
                        },
                        {
                            key: "saveDataSetting",
                            value: false,
                        },
                    ]
                });
            }
            else {
                this.props.onGetCurrentUserFollower(jwt);
                this.props.onGetCurrentUserFollowing(jwt);
                this.props.onGetCurrentUserManageAct(jwt);
                this.props.onGetCurrentUserJoinAct(jwt);
            }
            await Dao.saveString("@jwt", jwt);
            this.props.setUserData({
                ...userInfo,
            });

            this.props.setUserData(userInfo);
            this.props.onLoadSettings();
            await XmppApi.login(userInfo);
            await XmppApi.onStanza(store, userInfo);

        } catch (err) {
            console.log(err);
        }
    };
    buildRegisterData = () => {
        return  {
            username: this.state.username,
            password: this.state.password,
            phone: this.state.phone,
            nickname: this.state.nickname,
        };
    };
    verifyContent = (username, password) => {
        let usernameRegex = /^[a-zA-Z_-][a-zA-Z0-9_-]{5,20}$/;
        let usernameStartRegex = /^[a-zA-Z_-]/;
        let passwordRegex = /^.*((?=.*\d)(?=.*[A-Za-z]))|((?=.*[A-Za-z])(?=.*[!@#$%^&*? ]))|((?=.*\d)(?=.*[!@#$%^&*? ])).*$/;

        let usernameStartValid, usernamePatternValid,
            passwordLengthValid, passwordPatternValid;

        usernameStartValid = usernameStartRegex.test(username);

        usernamePatternValid = usernameRegex.test(username);

        passwordLengthValid = password.length >= 8 && password.length <= 16;

        passwordPatternValid = passwordRegex.test(password);
        return{
            usernamePatternValid,
            usernameStartValid,
            passwordLengthValid,
            passwordPatternValid,
        };
    };
}

const mapStateToProps = state => ({
    currentUser: state.currentUser,
});

const mapDispatchToProps = dispatch => ({
    setUserData: user => dispatch(setUserData(user)),
    onLoadSettings: () => dispatch(onLoadSettings()),
    onGetCurrentUserFollower: (jwt) => dispatch(onGetCurrentUserFollower(jwt)),
    onGetCurrentUserFollowing: (jwt) => dispatch(onGetCurrentUserFollowing(jwt)),
    onGetCurrentUserManageAct: (jwt) => dispatch(onGetCurrentUserManageAct(jwt)),
    onGetCurrentUserJoinAct: (jwt) => dispatch(onGetCurrentUserJoinAct(jwt)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        marginTop: 30,
        width: "100%",
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    headerLogo: {
        width: 80,
        height: 80,
    },

    formContainer: {
        padding: 15,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderColor: "#eee",
    },
});
