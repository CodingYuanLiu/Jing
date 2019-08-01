import {createAppContainer, createMaterialTopTabNavigator} from "react-navigation";
import PersonalTrack from "./PersonalTrack";
import PersonalPublish from "./PersonalPublish";
import PersonalFeedback from "./Feedback";
import PersonalJoin from "./PersonalJoin";
import React from "react";
import {View} from "react-native";

export default class PersonalTab extends React.Component{
    constructor(props){
        super(props);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Tab/>
            </View>
        )
    }

}
const Tab = createAppContainer(
    createMaterialTopTabNavigator(
        {
            PersonalTrack: {
                screen: PersonalTrack,
                navigationOptions: {
                    title: "动态",
                },
            },
            PersonalPublish: {
                screen: PersonalPublish,
                navigationOptions: {
                    title: "发布",
                },
            },
            PersonalJoin: {
                screen: PersonalJoin,
                navigationOptions: {
                    title: "参与",
                },
            },
            PersonalFeedback: {
                screen: PersonalFeedback,
                navigationOptions: {
                    title: "评价",
                },
            },
        },{
            tabBarOptions: {
                style: {
                    backgroundColor: "#0084ff",
                    height: 60,
                    borderTop: 0,
                    elevation: 2,
                },
                tabStyle: {
                    height: 40,
                },
                labelStyle: {
                    color: "#7a7a7a",
                },
                indicatorStyle: {
                    backgroundColor: "#fff",
                },
            }
        }
    )
)
