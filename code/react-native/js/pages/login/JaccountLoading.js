import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import {Button, Image} from "react-native-elements"
import Api from '../../api/Api';
import {login, setUser} from '../../actions/user';
import {connect} from 'react-redux';
import Dao from '../../api/Dao';
import NavigationUtil from '../../navigator/NavUtil';
import Default from "../../common/constant/Constant";
import XmppApi from "../../api/XmppApi";
import Util from "../../common/util";

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
                Dao.saveString("@jwt", data.jwt_token)
                    .then(() => {

                        // status = 12, first login with our app, redirect to register page
                        if (data.status === 12) {
                            NavigationUtil.toPage({jwt:data.jwt_token}, "Register")
                        }
                        // status = 0, login success, redirect to home page
                        else if (data.status === 0) {
                            // get user information, is there anyway that
                            // don't get user status in this page, but in userinfo page
                            Api.getSelfDetail(data.jwt_token)
                                .then(user => {
                                    let password = Util.cryptoOnpenFire(user.username, user.password);
                                    XmppApi.login(user.username, password)
                                        .then(() => {
                                            console.log("Login ok");
                                            this.props.setUser({
                                                avatar: user.avatar_url,
                                                birthday: user.birthday,
                                                dormitory: user.dormitory,
                                                gender: user.gender,
                                                id: user.id,
                                                jaccount: user.jaccount,
                                                jwt: user.jwt_token,
                                                major: user.major,
                                                nickname: user.nickname,
                                                password: user.password,
                                                phone: user.phone,
                                                signature: user.signature,
                                                username: user.username,
                                            });
                                            NavigationUtil.toPage(null,"Home");
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });
                                })
                        } else {
                            throw new Error("In jaccount loading, status is not 0 or 12")
                        }
                    })
            })
            .catch(err => {
                console.log("In jaccount loading, ", err);
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
                onPress={() => {NavigationUtil.toPage(null, "Home")}}
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

const mapDispatchToProps = dispatch => ({
    setUser: user => dispatch(setUser(user))
});

export default connect(null, mapDispatchToProps)(JaccountLoadingScreen)

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
})
