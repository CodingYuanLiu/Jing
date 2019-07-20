import React from "react"
import { View, Text, StyleSheet, FlatList } from 'react-native';
import InfoCard from "./components/InfoCard"
import { Divider, ListItem, Badge} from "react-native-elements";
import DataSegment from "./components/DataSegment";
import NavigationUtil from '../../navigator/NavUtil';
import LoginMenu from './components/LoginMenu';
import { connect } from "react-redux"
import { Button } from 'react-native-elements';
import UserDao from '../../api/dao/UserDao';
import Api from "../../api/Api"
import {login, logout, setUserInfo} from '../../actions/user';
import Default from "../../common/constant/Default";
import LinearGradient from "react-native-linear-gradient";


class MeScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        UserDao.get("@jwt")
            .then(jwt => {
                Api.isOnline(jwt)
                    .then(data => {
                        this.props.onLogin(jwt)
                        let user = {
                            nickname: data.nickname,
                            signature: data.signature === "" ? Default.DEFAULT_SIGNATURE : data.signature,
                            avatarUri: Default.DEFAULT_AVATAR,
                        }
                        console.log(data)
                        this.props.setUser(user)
                        UserDao.saveJson("@user", user)
                            .then(data => {
                                // ...
                            })
                            .catch(err => {
                                console.log("Err, in Me", err)
                            })
                    })
                    .catch(err => {
                        console.log("Err, in Me isOnline judge",err)
                    })
            })
            .catch(err => {
                console.log( "Err, in Me, get jwt", err)
            })
    }

    componentWillUnmount() {}

    renderItem = ({item}) => {
        return <ListItem
            title={item.title}
            badge= {<Badge status={"primary"}
                           containerStyle={{position:"absolute", right: 40}} />}
            onPress={()=>{NavigationUtil.toPage(this.props, item.key)}}
        />
    }

    logout = () => {
        this.props.onLogout()
        UserDao.remove("@user")
            .catch(err => {
                //...
        })
    }

    render() {
        const user = this.props.user.user;
        const {logged} = this.props.user;
        const dataList = [
            {data:7, label: "关注"},
            {data:8, label: "粉丝"},
            {data:15, label: "活动"},
            {data:20, label: "点赞"},
        ]
        const itemList = [
            {title: "我发布的", key: "MyAct", data: 0},
            {title: "我参与的", key: "FinishAct", data: 0},
            {title: "我的群聊", key: "GroupChat", data: 0},
        ]

        const topCard = logged ?
            <InfoCard
                user={user}
                style={{borderTopLeftRadius: 6, borderTopRightRadius: 6,}}
                onPress={() => {NavigationUtil.toPage(this.props, "PersonalHome")}}
            /> :
            <LoginMenu/>
        return(
            <View style={styles.container}>
                <LinearGradient
                    start={{x:0, y:0}}
                    end={{x:0, y:1}}
                    colors={["#0084ff", "#0073ff"]}
                    style={styles.cover}
                />
                <View style={styles.top}>
                    {topCard}
                    <Divider style={{height: 1, backgroundColor: "#d3d3d3", width:"92%"}}/>
                    <View style={styles.dataSegment}>
                        <DataSegment {...dataList[0]}/>
                        <DataSegment {...dataList[1]}/>
                        <DataSegment {...dataList[2]}/>
                        <DataSegment {...dataList[3]}/>
                    </View>
                </View>
                <View style={styles.main}>
                    <FlatList
                    data={itemList}
                    renderItem={this.renderItem}
                    />
                </View>
                {logged ? <Button
                    style={styles.button}
                    title={"退出登录"}
                    onPress={() => {this.logout()}}
                /> : null}
            </View>
        )
    }
}
const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    onLogin: (jwt) => dispatch(login(jwt)),
    setUser: (user) => dispatch(setUserInfo(user)),
    onLogout: () => dispatch(logout()),
})
export default connect(mapStateToProps, mapDispatchToProps)(MeScreen)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ebebeb",
    },
    cover: {
        position: "absolute",
        top: 0,
        backgroundColor: "#67bbff",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        width: "100%",
        height: 162,
    },
    top: {
        width: "92%",
        height: 180,
        marginTop: 16,
        alignSelf: "center",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "#fff",
    },
    dataSegment: {
        width:"100%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
    },
    main: {
        marginTop: 15,
    },
    button: {
        height: 20,
        width:"92%"
    }
})
