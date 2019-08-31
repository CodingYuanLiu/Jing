import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import {Button, Image} from "react-native-elements"
import Api from '../../api/Api';
import {setUserData} from '../../actions/currentUser';
import {connect} from 'react-redux';
import Dao from '../../api/Dao';
import NavigationUtil from '../../navigator/NavUtil';
import XmppApi from "../../api/XmppApi";
import Util from "../../common/util";
import Model from "../../api/Model";

class JaccountLoadingScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
        }
    }

    componentDidMount() {
        const code = this.props.navigation.getParam("code");
        const redirectUri = this.props.navigation.getParam("redirectUri");

        Api.loginWithJaccount(code, redirectUri)
            .then(data => {
                Dao.saveString("@jwt", data.jwt)
                    .then(() => {

                        // status = 12, first login with our app, redirect to register page
                        if (data.status === 12) {
                            if (this.props.setting.hasSkippedLogin) {
                                NavigationUtil.toPage({jwt:data.jwt}, "Register")
                            } else {
                                this.props.navigation.navigate("Register", {jwt:data.jwt});
                            }
                        }
                        // status = 0, login success, redirect to home page
                        else if (data.status === 0) {
                            Api.getSelfDetail(data.jwt)
                                .then(user => {
                                    // xmpp password, crypt with username and password
                                    let password = Util.cryptoOnpenFire(user.username, user.password);
                                    XmppApi.login(user.username, password)
                                        .then(() => {
                                            this.props.setUserData(Model.transferUserInfo(data));

                                            // login ok, redirect to home page
                                            NavigationUtil.toPage({jwt:data.jwt},"Home");
                                        })
                                        .catch(err => {

                                            // login fail, should display error message
                                            console.log(err);
                                        });
                                })
                        } else {
                            // this should not happen
                            console.log(new Error("login status is not 0 or 12"));
                        }
                    })
                    .catch(err => {
                        err.message = "save jwt fail";
                        console.log(err);
                    })
            })
            .catch(err => {
                err.message = "jaccount login fail";
                this.setState({error:true})
            })
    }

    render() {
        const renderLoading =
            <View style={styles.container}>
                <Button
                    loading
                    type={"clear"}
                    disabled
                    containerStyle={styles.button}
                />
                <Text style={styles.text}>正在登录</Text>
            </View>;
        const renderError =
            <View style={styles.container}>
                <Text style={styles.text}>似乎出了点问题</Text>
                <Button
                title={"返回App"}
                onPress={() => {
                    this.props.navigation.navigate("Home", null);
                }}
                />
            </View>;
        let isError = this.state.error;
        return(
            <View style={styles.container}>
                {isError ? renderError : renderLoading}
            </View>
        )
    }
}

const mapStateToProps = state => ({
    setting: state.setting,
});
const mapDispatchToProps = dispatch => ({
    setUserData: user => dispatch(setUserData(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(JaccountLoadingScreen)

const styles= StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button:{
        width:"100%",
        height: 50,
    },
    text: {
        marginTop: 32,
        color: "#0084ff",
        fontSize: 22
    },
});
