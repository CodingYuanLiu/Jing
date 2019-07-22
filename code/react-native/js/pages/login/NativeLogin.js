import React from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import {Button, Icon, Input, Text} from 'react-native-elements';
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Fontisto from "react-native-vector-icons/Fontisto";
import { SafeAreaView } from 'react-navigation';
import NavigationUtil from '../../navigator/NavUtil';
import Api from "../../api/Api";
import UserDao from "../../api/dao/UserDao"
import {login, setUserInfo} from '../../actions/user';
import {connect} from "react-redux";
import Default from "../../common/constant/Default";
import Theme from "../../common/constant/Theme";

class LoginScreen extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            isLoading: false,
            isError: false,
            btnDisabled: true,
        }
    }

    login = (name, pwd) => {
        this.setState({isLoading: true});
        if (name === "" || pwd === "") {
            this.setState({isLoading: false})
        }
        Api.login(name, pwd)
            .then(jwt => {
                UserDao.saveString("@jwt", jwt)
                    .then(() => {
                        Api.isOnline(jwt)
                            .then(data => {
                                let user = {
                                    nickname: data.nickname,
                                    signature: data.signature === "" ? Default.DEFAULT_SIGNATURE : data.signature,
                                    avatarUri: Default.DEFAULT_AVATAR,
                                };
                                this.setState({
                                    isLoading: false,
                                });

                                this.props.onLogin(jwt);
                                this.props.setUser(user);
                                NavigationUtil.toPage(null,"Home");
                            })
                    })
            }).catch(err => {
                this.setState({
                    isLoading: false,
                });
                if (err.status === 400 ) {
                    ToastAndroid.show(Default.LOGIN_ERROR, ToastAndroid.SHORT)
                } else {
                    ToastAndroid.show(Default.UNKNOWN_ERROR_MESSAGE, ToastAndroid.SHORT)
                }
        })
    };
    render() {
        return (
            <SafeAreaView style={{flex: 1}}>

                <View style={styles.container}>
                    <View style={styles.header}>
                        <Icon
                            type={"AntDesign"}
                            name={"close"}
                            onPress={() => {NavigationUtil.toPage(null, "Home")}}
                            color={"#a3a3a3"}
                            size={32}
                            iconStyle={styles.headerLeft}
                        />
                    </View>

                    <View style={styles.title}>
                        <Text h3>密码登录</Text>
                    </View>

                    <View style={styles.main}>
                        <View style={styles.inputContainer}>
                            <Input
                                leftIcon={
                                    <FontAwesome
                                        name={"user"}
                                        size={24}
                                        color={"#d3d3d3"}
                                    />
                                }
                                placeholder={"输入用户名"}
                                textContentType={"username"}
                                autoCompleteType={"username"}
                                keyboardType={"email-address"}
                                onChangeText={(username) => {
                                    this.setState({username})
                                    if(this.state.password.length >= 8 && username !== "") {
                                        this.setState({btnDisabled: false})
                                    } else {
                                        this.setState({btnDisabled: true})
                                    }
                                }}
                                value={this.state.username}
                            />
                            <Input
                                leftIcon={
                                    <Fontisto
                                        name={"locked"}
                                        size={24}
                                        color={"#d3d3d3"}
                                    />
                                }
                                placeholder={"输入密码"}
                                textContentType={"password"}
                                autoCompleteType={"password"}
                                secureTextEntry={true}
                                onChangeText={(password) => {
                                    this.setState({password})
                                    if(password.length >= 8 && this.state.username !== "") {
                                        this.setState({btnDisabled: false})
                                    } else {
                                        this.setState({btnDisabled: true})
                                    }
                                }}
                                value={this.state.password}
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                title={"登录"} style={styles.button}
                                onPress={() => {
                                    const username = this.state.username;
                                    const password = this.state.password;
                                    this.login(username, password)
                                }}
                                loading={this.state.isLoading}
                                disabled={this.state.btnDisabled}
                                disabledStyle={styles.buttonDisabled}
                                titleStyle={styles.buttonTitle}
                                disabledTitleStyle={styles.buttonTitleDisabled}
                            />
                        </View>
                        <View style={styles.tips}>
                            <Text
                                style={styles.tipsLeft}
                                onPress={() => {NavigationUtil.toPage(this.props, "ActDetail")}}
                            >忘记密码？</Text>
                            <Text
                                style={styles.tipsRight}
                                onPress={() => {NavigationUtil.toPage(this.props, "JaccountLogin")}}
                            >Jaccount登录</Text>
                        </View>
                    </View>
                    <View style={styles.bottom}>
                        <Text>底部</Text>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onLogin: (jwt) => dispatch(login(jwt)),
    setUser: (user) => dispatch(setUserInfo(user)),
});

export default connect(null, mapDispatchToProps)(LoginScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    header: {
        marginTop:16,
        height: 48,
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    headerLeft: {
        marginLeft: 20,
    },
    title: {
        marginTop: 40,
        height: 28,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    main: {
        width: "80%",
        alignSelf: "center",
        flex: 4,
    },
    inputContainer: {
        marginTop: 22
    },
    buttonContainer: {
        width: "93%",
        marginTop: 20,
        marginBottom: 8,
        alignSelf: "center",
    },
    buttonTitle: {
        color: Theme.WHITE,
    },
    button: {
        flex: 1,
    },
    buttonDisabled: {
        backgroundColor: "#bde3ff",
    },
    buttonTitleDisabled: {
        color: Theme.WHITE,
    },
    tips: {
        alignSelf: "center",
        width: "93%",
        height: 20,
        marginTop: 8,
        fontSize: 12,
        flexDirection: "row",
    },
    tipsLeft: {
        color: "#0084ff",
        flex: 1,
    },
    tipsRight: {
        color: "#0084ff",
    },
    bottom: {
        //flex: 1,
    }
})
