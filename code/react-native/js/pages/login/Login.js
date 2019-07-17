import React from "react";
import { View, StyleSheet } from "react-native";
import {Button, Icon, Input, Text} from 'react-native-elements';
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Fontisto from "react-native-vector-icons/Fontisto";
import { SafeAreaView } from 'react-navigation';
import NavigationUtil from '../../navigator/NavUtil';
import Api from "../../api/Api";
import UserDao from "../../api/dao/UserDao"
import {login, setUserInfo} from '../../actions/user';
import {connect} from "react-redux";

class LoginScreen extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            isLoading: false,
        }
    }

    login = (name, pwd) => {
        this.setState({isLoading: true})
        Api.login(name, pwd)
            .then(jwt => {
                UserDao.save("@user", {
                    username: this.state.username,
                    signature: "这里一无所有，知道遇见你",
                    credit: "小白",
                    jwt: jwt,
                })
                    .then(() => {
                        this.setState({
                            isLoading: false,
                        })

                        // dispatch login action

                        this.props.onLogin(jwt)
                        this.props.setUser({
                            username: name,
                            signature: "这里一无所有，直到遇见你",
                            credit: "小白",
                        })
                        NavigationUtil.back(this.props)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }).catch(err => {
                this.setState({
                    isLoading: false,
                })
                console.log(err)
                alert("登录失败，用户名或密码错误")
        })
    }
    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Icon
                            type={"AntDesign"}
                            name={"close"}
                            onPress={() => {NavigationUtil.back(this.props)}}
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
                                        color={"red"}
                                    />
                                }
                                placeholder={"输入用户名"}
                                textContentType={"username"}
                                autoCompleteType={"username"}
                                keyboardType={"email-address"}
                                onChangeText={(username) => {
                                    this.setState({username})
                                }}
                                value={this.state.username}
                            />
                            <Input
                                leftIcon={
                                    <Fontisto
                                        name={"locked"}
                                        size={24}
                                        color={"red"}
                                    />
                                }
                                placeholder={"输入密码"}
                                textContentType={"password"}
                                autoCompleteType={"password"}
                                secureTextEntry={true}
                                onChangeText={(password) => {
                                    this.setState({password})
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
                            />
                        </View>
                        <View style={styles.tips}>
                            <Text
                                style={styles.tipsLeft}
                                onPress={() => {NavigationUtil.toPage(this.props, "Detail")}}
                            >忘记密码？</Text>
                            <Text
                                style={styles.tipsRight}
                                onPress={() => {NavigationUtil.toPage(this.props, "Jaccount")}}
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
})

export default connect(null, mapDispatchToProps)(LoginScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        backgroundColor: "grey",
    },
    header: {
        marginTop:16,
        height: 48,
        width: "100%",
        backgroundColor: "red",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    headerLeft: {
        marginLeft: 20,
    },
    title: {
        backgroundColor: "blue",
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
        backgroundColor: "purple",
    },
    inputContainer: {
        marginTop: 22
    },
    buttonContainer: {
        width: "93%",
        marginTop: 10,
        marginBottom: 8,
        alignSelf: "center",
    },
    button: {
        flex: 1,
    },
    tips: {
        alignSelf: "center",
        width: "93%",
        height: 20,
        fontSize: 12,
        backgroundColor: "orange",
        flexDirection: "row",
    },
    tipsLeft: {
        color: "#064cff",
        backgroundColor: "red",
        flex: 1,
    },
    tipsRight: {
        color: "#064cff",
    },
    bottom: {
        flex: 1,
        backgroundColor: "green"
    }
})
