import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import {Button} from "react-native-elements"
import Api from '../../api/Api';
import {setUserData} from '../../actions/currentUser';
import {connect} from 'react-redux';
import Dao from '../../api/Dao';
import XmppApi from "../../api/XmppApi";
import Model from "../../api/Model";
import {LOGIN_STATUS} from "../../common/constant/Constant";
import store from "../../store";
import {onGetCurrentUserFollower} from "../../actions/currentUserFollower";
import {onGetCurrentUserFollowing} from "../../actions/currentUserFollowing";
import {onGetCurrentUserManageAct} from "../../actions/currentUserManage";
import {onGetCurrentUserJoinAct} from "../../actions/currentUserJoin";
import {onLoadSettings} from "../../actions/setting";


class JaccountLoadingScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
        }
    }

    componentDidMount() {
        let  code = this.props.navigation.getParam("code");
        let redirectUri = this.props.navigation.getParam("redirectUri");
        this.login(code, redirectUri)
            .catch(err => {
                console.log(err);
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
    };

    login = async (code, redirectUri) => {
        let loginRes = await Api.loginWithJaccount(code, redirectUri);
        await Dao.saveString("@jwt", loginRes.jwt);

        if (loginRes.status === LOGIN_STATUS.NEW_USER_IN_APP) {
            this.props.navigation.navigate("Register", {jwt:loginRes.jwt, hasLoginOnWechat: false});
            return ;
        }

        else if (loginRes.status === LOGIN_STATUS.LOGGED) {
            let data = await Api.getSelfDetail(loginRes.jwt);
            console.log(data);
            if (data.username === "" || data.username === null || data.username === undefined) {
                this.props.navigation.navigate("Register", {jwt:loginRes.jwt, hasLoginOnWechat: true});
                console.log("no username, register");
                return ;
            }
            console.log("go to this line");
            store.dispatch(onGetCurrentUserFollower(data.jwt));
            store.dispatch(onGetCurrentUserFollowing(data.jwt));
            store.dispatch(onGetCurrentUserManageAct(data.jwt));
            store.dispatch(onGetCurrentUserJoinAct(data.jwt));
            store.dispatch(setUserData(data));
            store.dispatch(onLoadSettings());
            await XmppApi.login(data);
            await XmppApi.onStanza(store, data);
            this.props.navigation.navigate("Home", {jwt:data.jwt});
        } else {
            console.log(loginRes.status);
        }
    };
}

const mapDispatchToProps = dispatch => ({
    setUserData: user => dispatch(setUserData(user)),
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
});
