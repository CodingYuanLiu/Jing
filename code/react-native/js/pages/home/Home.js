import React from "react"
import NavigationUtil from '../../navigator/NavUtil';
import { View } from "react-native"
import {connect} from "react-redux";
import {createAppContainer, createBottomTabNavigator} from "react-navigation";
import ActivityScreen from "../activity/Activity";
import Entypo from "react-native-vector-icons/Entypo";
import NotificationScreen from "../notification/Notification";
import Ionicons from "react-native-vector-icons/Ionicons";
import PublishScreen from "../publish/Publish";
import AntDesign from "react-native-vector-icons/AntDesign";
import DiscoverScreen from "../discover/Discover";
import MeScreen from "../me/Me";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

class HomeScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        console.disableYellowBox = true
    }

    componentDidMount(){
        // Expose outer stack navigation to inner navigation
        NavigationUtil.Navigation = this.props.navigation;
        console.log(this.props);
    };

    render() {
        let BottomTab = this.renderTab(this.props.currentUser.logged);
        return(
            <View style={{flex:1,}}>
                <BottomTab/>
            </View>

        )
    };

    renderTab = (logged) => {

        return createAppContainer(
            createBottomTabNavigator(
            {
                Activity: {
                    screen : ActivityScreen,
                    navigationOptions: {
                        tabBarLabel: "告示墙",
                        tabBarIcon: ({focused, tintColor}) => {
                            return (
                                <Entypo
                                    name={"blackboard"}
                                    size = {26}
                                    color = {tintColor}
                                />
                            )
                        },
                    }
                },
                Notification: {
                    screen : NotificationScreen,
                    navigationOptions: {
                        tabBarLabel: "消息",
                        tabBarIcon: ({focused, tintColor}) => {
                            return (
                                <Ionicons
                                    name={"ios-notifications"}
                                    size = {26}
                                    color = {tintColor}
                                />
                            )
                        },
                    }
                },
                Publish: {
                    screen : PublishScreen,
                    navigationOptions: {
                        tabBarLabel: "发布",
                        tabBarIcon: ({focused, tintColor}) => {
                            return (
                                <AntDesign
                                    name={"pluscircle"}
                                    size = {28}
                                    color = {"#0084ff"}
                                />
                            )
                        },
                    },
                },
                Discover: {
                    screen : DiscoverScreen,
                    navigationOptions: {
                        tabBarLabel: "发现",
                        tabBarIcon: ({focused, tintColor}) => {
                            return (
                                <AntDesign
                                    name={"search1"}
                                    size = {26}
                                    color = {tintColor}
                                />
                            )
                        },
                    }
                },
                Me: {
                    screen : MeScreen,
                    navigationOptions: {
                        tabBarLabel: logged ? "我的" : "未登录",
                        tabBarIcon: ({focused, tintColor}) => {
                            return (
                                <FontAwesome5
                                    name={"user-alt"}
                                    size = {26}
                                    color = {tintColor}
                                />
                            )
                        },
                    }
                }
            },
            {
                tabBarOptions: {
                    inactiveTintColor: "#bfbfbf",
                    activeTintColor: "#0084ff",
                },
            }
        )
        );
    }
}


const mapStateToProps = state => ({
    xmpp: state.xmpp,
    currentUser: state.currentUser,
});


export default connect(mapStateToProps, null)(HomeScreen);
