import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import {Button, Image} from "react-native-elements"
import Api from '../../api/Api';
import {login, setUserInfo} from '../../actions/user';
import {connect} from 'react-redux';
import UserDao from '../../api/dao/UserDao';
import NavigationUtil from '../../navigator/NavUtil';
import Default from "../../common/constant/Default";

class JaccountLoadingScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
        }
    }

    componentDidMount() {
        const code = this.props.navigation.getParam("code")
        const redirectUri = this.props.navigation.getParam("redirectUri")

        Api.loginWithJaccount(code, redirectUri)
            .then(data => {
                UserDao.saveString("@jwt", data.jwt_token)
                    .then((saveStatus) => {

                        // status = 12, first login with our app, redirect to register page
                        if (data.status == 12) {
                            NavigationUtil.toPage({jwt:data.jwt_token}, "Register")
                        // status = 0, login success, redirect to home page
                        } else if (data.status == 0) {
                            // get user information, is there anyway that
                            // don't get user status in this page, but in userinfo page
                            Api.isOnline(data.jwt_token)
                                .then(state => {
                                    let user = {
                                        nickname: state.nickname,
                                        signature: state.signature === "" ? Default.DEFAULT_SIGNATURE : state.signature,
                                        avatarUri: Default.DEFAULT_AVATAR,
                                    }
                                    this.props.onLogin(data.jwt_token)
                                    this.props.setUser(user)
                                    NavigationUtil.toPage(null, "Home")
                                })
                        } else {
                            throw new Error("In jaccount loading, status is not 0 or 12")
                        }
                    })
            })
            .catch(err => {
                console.log("In jaccount loading, ", err)
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
            </View>
        let isError = this.state.error;
        return(
            <View style={styles.container}>
                {isError ? renderError : renderLoading}
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onLogin: (jwt) => dispatch(login(jwt)),
    setUser: user => dispatch(setUserInfo(user))
})

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
