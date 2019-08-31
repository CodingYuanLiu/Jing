import React from "react";
import {View, StyleSheet, ToastAndroid, TextInput} from "react-native";
import {Button, Image, Text} from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import NavigationUtil from '../../navigator/NavUtil';
import Api from "../../api/Api";
import Dao from "../../api/Dao"
import {setUserData} from '../../actions/currentUser';
import {connect} from "react-redux";
import Default from "../../common/constant/Constant";
import Theme from "../../common/constant/Theme";
import XmppApi from "../../api/XmppApi";
import Util from "../../common/util";
import LocalApi from "../../api/LocalApi";
import SplashScreen from "react-native-splash-screen";
import {CloseIcon, EyeIcon, EyeOffIcon} from "../../common/components/Icons";
import HeaderBar from "../../common/components/HeaderBar";

class LoginScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            isLoading: false,
            btnDisabled: true,
            passwordVisible: true,
        }
    }

    componentDidMount() {
        SplashScreen.hide();
    }

    render() {
        let header = this.renderHeader();
        let logo = this.renderLogo();
        let usernameInput = this.renderUsernameInput();
        let passwordInput = this.renderPasswordInput();
        let button = this.renderButton();
        let action = this.renderAction();
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    {header}
                    {logo}
                    {usernameInput}
                    {passwordInput}
                    {button}
                    {action}
                </View>
            </SafeAreaView>
        )
    };

    renderHeader = () => {
        return (
            <HeaderBar
                leftButton={
                    <CloseIcon
                        onPress={() => {
                            if (Util.SKIP_LOGIN) {
                                NavigationUtil.back(this.props);
                            } else {
                                this.props.navigation.navigate("Home", null);
                            }
                        }}
                        color={"#7a7a7a"}
                    />
                }
                style={{backgroundColor: "#fff"}}
            />
        )
    };
    renderLogo = () => {
        return (
            <View
                style={styles.LogoContainer}
            >
                <Image
                    style={{width: 80, height: 80, borderRadius: 4,}}
                    source={require("../../static/images/logo-white.png")}
                />
                <Text style={{fontSize: 22, fontWeight: "bold", color: "#0084ff", marginBottom: 20}}>
                    密码登录
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
        return (
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder={"用户名"}
                    onChangeText={this.handleUsername}
                    value={this.state.username}
                    autoCompleteType={"username"}
                    textContentType={"username"}
                    keyboardType={"email-address"}
                    style={{flex: 1, fontSize: 18, }}
                />
                {clearIcon}
            </View>
        )
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
                style={{marginRight: 15,}}
            /> : null;
        return (
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder={"密码"}
                    onChangeText={this.handlePassword}
                    value={this.state.password}
                    textContentType={"password"}
                    autoCompleteType={"password"}
                    secureTextEntry={this.state.passwordVisible}
                    style={{flex: 1,fontSize: 18,}}
                />
                {clearIcon}
                {rightIcon}
            </View>
        )
    };
    renderButton = () => {
        return (
            <Button
                title={"登录"}
                onPress={() => {
                    const username = this.state.username;
                    const password = this.state.password;
                    this.login(username, password)
                }}
                loading={this.state.isLoading}
                disabled={this.state.btnDisabled}

                disabledTitleStyle={{color: "#fff"}}
                disabledStyle={{backgroundColor: "#bde3ff"}}
                titleStyle={styles.buttonTitle}
                containerStyle={styles.buttonContainer}
            />
        )
    };
    renderAction = () => {
        return (
            <View style={styles.actionContainer}>
                <Text
                    style={{color: "#0084ff"}}
                    onPress={this.toForgetPassword}
                >忘记密码？</Text>
                <Text
                    style={{color: "#0084ff"}}
                    onPress={this.toJaccountLogin}
                >Jaccount登录</Text>
            </View>
        )
    };
    handleUsername = (username) => {
        this.setState({username});
        if(this.state.password.length >= 8 && username !== "") {
            this.setState({btnDisabled: false})
        } else {
            this.setState({btnDisabled: true})
        }
    };
    handlePassword = (password) => {
        this.setState({password});
        if(password.length >= 8 && this.state.username !== "") {
            this.setState({btnDisabled: false})
        } else {
            this.setState({btnDisabled: true})
        }
    };
    toForgetPassword = () => {
        this.props.navigation.navigate("", null);
    };
    toJaccountLogin = () => {
        this.props.navigation.navigate("JaccountWeb", null );
    };
    login = (name, pwd) => {
        this.setState({isLoading: true});
        if (name === "" || pwd === "") {
            this.setState({isLoading: false})
        }
        Api.login(name, pwd)
            .then(jwt => {
                Dao.saveString("@jwt", jwt)
                    .then(() => {
                        Api.getSelfDetail(jwt)
                            .then(data => {
                                let password = Util.cryptoOnpenFire(data.username, data.password);
                                XmppApi.login(data.username, password)
                                    .then(() => {
                                        this.props.setUserData(data);
                                        NavigationUtil.toPage(null,"Home");
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            })
                    })
            }).catch(err => {
            if (err.status === 400 ) {
                ToastAndroid.show(Default.LOGIN_ERROR, ToastAndroid.SHORT)
            } else {
                ToastAndroid.show(Default.UNKNOWN_ERROR_MESSAGE, ToastAndroid.SHORT)
            }
        })
            .finally(() => {
                this.setState({
                    isLoading: false,
                });
            })
    };
}

const mapDispatchToProps = dispatch => ({
    setUserData: (user) => dispatch(setUserData(user)),
});

export default connect(null, mapDispatchToProps)(LoginScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },

    LogoContainer: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center",
    },

    inputContainer: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 10,
        borderBottomWidth: 0.5,
        borderColor: "#eee",
        flexDirection: "row",
        alignItems: "center",
    },

    actionContainer: {
        width: "93%",
        height: 20,
        marginTop: 8,
        marginLeft: 15,
        marginRight: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    buttonContainer: {
        marginTop: 20,
        marginBottom: 8,
        marginLeft: 15,
        marginRight: 15,
    },

});
