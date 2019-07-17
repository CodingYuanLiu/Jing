import React from "react"
import { View, Text, StyleSheet, FlatList } from 'react-native';
import InfoCard from "./components/InfoCard"
import { Divider, ListItem, Badge} from "react-native-elements";
import DataSegment from "./components/DataSegment";
import NavigationUtil from '../../navigator/NavUtil';
import SignOutInfoCard from './components/SignOutInfoCard';
import { connect } from "react-redux"
import { Button } from 'react-native-elements';
import UserDao from '../../api/dao/UserDao';
import Api from "../../api/Api"
import {login, logout, setUserInfo} from '../../actions/user';

class MeScreen extends React.PureComponent{
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        UserDao.get("@user")
            .then(data => {
                let user = JSON.parse(data)
                Api.isOnline(user.jwt)
                    .then(res => {
                        this.props.onLogin(user.jwt)
                        this.props.setUser({
                            username: user.username,
                            signature: user.signature,
                            credit: user.credit,
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
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
        console.log(this.props.user)
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
            <SignOutInfoCard/>
        return(
            <View style={styles.container}>
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
    top: {
        width: "92%",
        height: 180,
        marginTop: 16,
        alignSelf: "center",
        alignItems: "center",
        backgroundColor: "#62aaff",
        borderRadius: 4,
    },
    dataSegment: {
        width:"100%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: "green",
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
    },
    main: {
        marginTop: 45,
    },
    button: {
        height: 20,
        width:"92%"
    }
})
