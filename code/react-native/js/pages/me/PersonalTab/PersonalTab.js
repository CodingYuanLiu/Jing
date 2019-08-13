import {createAppContainer, createMaterialTopTabNavigator} from "react-navigation";
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
                    backgroundColor: "#fff",
                    height: 60,
                    borderTopWidth: 0.5,
                    borderColor: "#eee",
                    elevation: 2,
                    justifyContent: "flex-end",
                },
                tabStyle: {
                    height: 40,
                },
                labelStyle: {
                    color: "#7a7a7a",
                },
                indicatorStyle: {
                    backgroundColor: "#0084ff",
                },
            }
        }
    )
)
