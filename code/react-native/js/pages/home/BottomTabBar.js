import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import { StatusBar } from "react-native";
import NotificationScreen from '../notification/Notification';
import PublishScreen from '../publish/Publish';
import DiscoverScreen from '../discover/Discover';
import MeScreen from '../me/Me';
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome5  from "react-native-vector-icons/FontAwesome5"
import AntDesign from "react-native-vector-icons/AntDesign"
import Ionicons from "react-native-vector-icons/Ionicons"
import ActivityScreen from '../activity/Activity';
import NavigationUtil from '../../navigator/NavUtil';


const BottomTab = createBottomTabNavigator(
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
                tabBarLabel: "我的",
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

export default createAppContainer(BottomTab)



