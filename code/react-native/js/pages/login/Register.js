import React from "react"
import { View, TextInput, StyleSheet, Text } from 'react-native';
import {Button, Image, ListItem} from "react-native-elements"
import Dao from "../../api/Dao";
import {setUserData} from "../../actions/currentUser";
import {connect} from "react-redux";
import Api from "../../api/Api"
import XmppApi, {OpenFireApi} from "../../api/XmppApi";
import Util from "../../common/util";
import {CheckIconReversed, CircleIcon, CloseIcon, EyeIcon, EyeOffIcon} from "../../common/components/Icons";
import HeaderBar from "../../common/components/HeaderBar";
import store from "../../store";
import {onGetCurrentUserFollower} from "../../actions/currentUserFollower";
import {onGetCurrentUserFollowing} from "../../actions/currentUserFollowing";
import {onGetCurrentUserManageAct} from "../../actions/currentUserManage";
import {onGetCurrentUserJoinAct} from "../../actions/currentUserJoin";
import {onLoadSettings} from "../../actions/setting";


class RegisterScreen extends React.PureComponent{
    constructor(props) {
        super(props);
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
        }
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
        )
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
        return (
            <View style={styles.itemContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder={"用户名"}
                        onChangeText={(text) => {
                            this.setState({username: text});
                            this.verifyContent();
                            this.usernameExists(text)
                                .then((res) => {
                                    console.log(res);
                                })
                        }}
                        value={this.state.username}
                        autoCompleteType={"username"}
                        textContentType={"username"}
                        keyboardType={"email-address"}
                        style={{flex: 1, fontSize: 20,}}
                    />
                    {clearIcon}
                </View>
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
        let rightIcon = this.state.passwordVisible ?
            <EyeIcon
                color={"#bfbfbf"}
                size={18}
                onPress={() => {
                    this.setState(
                        {passwordVisible: false}
                    )
                }}
            />
            :
            <EyeOffIcon
                color={"#bfbfbf"}
                size={18}
                onPress={() => {
                    this.setState(
                        {passwordVisible: true}
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
                            this.setState({password: text});
                            this.verifyContent();
                        }}
                        value={this.state.password}
                        textContentType={"password"}
                        autoCompleteType={"password"}
                        secureTextEntry={this.state.passwordVisible}
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
        let disabled = !this.verifyContent();
        return (
            <Button
                title={"注册并登录"}
                loading={this.state.loading}
                disabled={disabled}
                disabledStyle={{backgroundColor: "#cef5ff"}}
                disabledTitleStyle={{color: "#fff"}}
                onPress={() => {
                    this.register();
                    this.props.navigation.navigate("Home", null);
                }}
                containerStyle={{marginTop: 28}}
            />
        )
    };
    register = () => {
        this.setState({loading: true});
        let jwt = this.props.navigation.getParam("jwt");
        let hasLoginOnWechat = this.props.navigation.getParam("hasLoginOnWechat");
        let data = this.buildRegisterData();

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
            await Api.register(data, jwt);
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
            if (hasLoginOnWechat) {
                store.dispatch(onGetCurrentUserFollower(data.jwt));
                store.dispatch(onGetCurrentUserFollowing(data.jwt));
                store.dispatch(onGetCurrentUserManageAct(data.jwt));
                store.dispatch(onGetCurrentUserJoinAct(data.jwt));
            }
            await Dao.saveString("@jwt", jwt);
            this.props.setUserData({
                ...userInfo,
                nickname: "昵称",
                jwt: jwt,
            });
            this.setState({success: true});
            store.dispatch(setUserData(data));
            store.dispatch(onLoadSettings());
            await XmppApi.login(data);
            await XmppApi.onStanza(store, data);

        } catch (e) {
            console.log(e);
        }
    };
    usernameExists = async (username) => {
        let data = this.buildRegisterData();
        let jwt = this.props.navigation.getParam("jwt");
        try {
            let res = await Api.register(data, jwt);
            this.setState({usernameExists: false});
            return res;
        } catch (err ) {
            this.setState({usernameExists: true})
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
    verifyContent = () => {
        let usernameRegex = /^[a-zA-Z_-][a-zA-Z0-9_-]{5,20}$/;
        let usernameStartRegex = /^[a-zA-Z_-]/;
        let passwordRegex = /^.*((?=.*\d)(?=.*[A-Za-z]))|((?=.*[A-Za-z])(?=.*[!@#$%^&*? ]))|((?=.*\d)(?=.*[!@#$%^&*? ])).*$/;

        let flag = true;
        let usernameStartValid, usernamePatternValid,
            passwordLengthValid, passwordPatternValid;

        if(usernameStartRegex.test(this.state.username)) {
            usernameStartValid = true;
        } else {
            usernameStartValid = false;
            flag = false;
        }

        if(usernameRegex.test(this.state.username)) {
            usernamePatternValid = true;
        } else {
            usernamePatternValid = false;
            flag = false;
        }

        if (this.state.password.length >= 8 && this.state.password.length <= 16) {
            passwordLengthValid = true;
        } else {
            passwordLengthValid = false;
            flag = false;
        }

        if (passwordRegex.test(this.state.password)) {
            passwordPatternValid = true;
        } else {
            passwordPatternValid = false;
            flag = false;
        }
        this.setState({
            usernamePatternValid,
            usernameStartValid,
            passwordLengthValid,
            passwordPatternValid,
        });
        return flag;
    };
}

const mapDispatchToProps = dispatch => ({
    setUserData: user => dispatch(setUserData(user)),
});

export default connect(null, mapDispatchToProps)(RegisterScreen)

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
