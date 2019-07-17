import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import {Button, Image} from "react-native-elements"
import Api from '../../api/Api';
import {login, setUserInfo} from '../../actions/user';
import {connect} from 'react-redux';
import UserDao from '../../api/dao/UserDao';
import NavigationUtil from '../../navigator/NavUtil';

class JaccountLoadingScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
        }
    }

    componentDidMount() {
        const code = this.props.navigation.getParam("code")
        const redirectUri = this.props.navigation.getParam("redirectUri")

        Api.loginWithJaccount(code, redirectUri)
            .then(data => {
                UserDao.save("@user", {jwt:data.jwt_token})
                    .then(() => {
                        console.log(data)
                        if (data.status == 12) {
                            NavigationUtil.toPage({jwt:data.jwt_token}, "Register")
                        } else if (data.status == 0) {
                            NavigationUtil.toPage(null, "Home")
                        } else {
                            console.log("Err: In JaccountLoading, saveItem")
                        }
                    })
                    .catch(err => {
                        console.log("Err: In jaccount web view, save item", err)
                        this.setState({error: true})
                    })
            })
            .catch(err => {
                console.log("Err: In jaccount web view, request",err)
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
        let isLoading = this.state.loading;
        let isError = this.state.error;
        console.log(this.state)
        return(
            <View style={styles.container}>
                {renderLoading}
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
