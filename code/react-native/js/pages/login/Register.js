import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import {Input, Button, Overlay} from "react-native-elements"
import Dao from "../../api/Dao";
import {setUserData} from "../../actions/currentUser";
import {connect} from "react-redux";
import Api from "../../api/Api"
import NavigationUtil from "../../navigator/NavUtil";
import XmppApi from "../../api/XmppApi";
import Util from "../../common/util";


const errors = {
    passwordNotMatch: "两次密码不一致哦～",
    incomplete: "缺少字段哦～",
    duplicateUsername: "用户名已经被占用啦～",
    networkError: "亲，网络故障啦～",
};

class RegisterScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            phone: "",
            nickname: "",
            error: false,
            errorMessage: "",
            success:false,
        }
    }

    register = () => {
        const jwt = this.props.navigation.getParam("jwt");

        let data = {
            username: this.state.username,
            password: this.state.password,
            phone: this.state.phone,
            nickname: this.state.nickname,
        };
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({error : true, errorMessage: errors.passwordNotMatch})
        } else if (this.state.username === "" ||
            this.state.password.length < 8 ||
            this.state.phone === "" ||
            this.state.nickname === "") {
            this.setState({error: true, errorMessage: errors.incomplete})
        } else {
            Api.register(data, jwt)
                .then( () => {
                    Api.getSelfDetail(jwt)
                        .then(data => {
                            let password = Util.cryptoOnpenFire(data.username, data.password);
                            XmppApi.register(
                                data.username,
                                password,
                            )
                                .then(() => {
                                    this.props.setUser(data);
                                    this.setState({success: true});
                                    XmppApi.login(data.username, password);
                                })
                                .catch(err => {
                                    // this is not very sure
                                    console.log(err)
                                })
                        })
                        .catch(err => {
                            // this should happen very rare
                            console.log(err);
                        });
                    Dao.saveString("@jwt", jwt)
                        .catch(err => {
                            // this should happen very rare
                            Console.log(err);
                        });
                })
                .catch(err => {
                    if (err.status === 400){
                        this.setState({error: true, errorMessage: errors.duplicateUsername})
                    } else {
                        this.setState({error: true, errorMessage: errors.networkError})
                    }
                })
        }
    };

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.titleStyle}>
                    <Text style={styles.text}>请填写亲的信息哦～</Text>
                </View>
                <View style={styles.formStyle}>
                    <Input
                        placeholder={"输入用户名"}
                        onChangeText={(text) => {this.setState({username: text})}}
                        value={this.state.username}
                        textContentType={"username"}
                        autoCompleteType={"username"}
                        keyboardType={"email-address"}
                    />
                    <Input
                        placeholder={"输入昵称"}
                        onChangeText={(text) => {this.setState({nickname: text})}}
                        value={this.state.nickname}
                    />
                    <Input
                        placeholder={"输入密码"}
                        onChangeText={(text) => {this.setState({password: text})}}
                        value={this.state.password}
                        textContentType={"password"}
                        autoCompleteType={"password"}
                        secureTextEntry={true}
                    />
                    <Input
                        placeholder={"确认密码"}
                        onChangeText={(text) => {this.setState({confirmPassword: text})}}
                        value={this.state.confirmPassword}
                        textContentType={"password"}
                        autoCompleteType={"password"}
                        secureTextEntry={true}
                    />
                    <Input
                        placeholder={"输入手机号"}
                        onChangeText={(text) => {this.setState({phone: text})}}
                        value={this.state.phone}
                        keyboardType={"phone-pad"}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title={"确定"}
                        onPress={() => {this.register()}}
                    />
                </View>
                <Overlay
                    isVisible={this.state.error}
                >
                    <View>
                        <Text>{this.state.errorMessage}</Text>
                        <Button
                            title={"确定"}
                            onPress={() => {this.setState({error: false}) ;NavigationUtil.toPage(null, "Home")}}
                        />
                    </View>
                </Overlay>
                <Overlay
                    isVisible={this.state.success}
                >
                    <View>
                        <Text>注册成功</Text>
                        <Button
                            title={"确定"}
                            onPress={() => {this.setState({success: false});NavigationUtil.toPage(null, "Home")}}
                        />
                    </View>
                </Overlay>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setUserData: user => dispatch(setUserData(user)),
});

export default connect(null, mapDispatchToProps)(RegisterScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    formStyle: {
    }
});
