import React from "react";
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
import Register from "../login/Register";
export default class BottomTab extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        let Tab = this.renderTab(this.props.logged);
        return <Tab/>;
    }

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
                        screen : Register,
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
