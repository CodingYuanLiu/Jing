import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import { Button } from "react-native-elements"
import Api from '../../api/Api';
import {login, setUserInfo} from '../../actions/user';
import {connect} from 'react-redux';
import UserDao from '../../api/dao/UserDao';
import NavigationUtil from '../../navigator/NavUtil';

class JaccountLoadingScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const code = this.props.navigation.getParam("code")
        const redirectUri = this.props.navigation.getParam("redirectUri")
        console.log(code, redirectUri)
        Api.loginWithJaccount(code, redirectUri)
            .then(data => {
                console.log(data)
                if (data.status === 12) {

                } else if (data.status === 0) {
                    NavigationUtil.backNStep(this.props, 2)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {

        return(
            <View style={styles.container}>
                <Button
                    loading
                    type={"clear"}
                    disabled
                    containerStyle={styles.button}
                />
                <Text style={styles.text}>正在登录</Text>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onLogin: (jwt) => dispatch(login(jwt)),
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
