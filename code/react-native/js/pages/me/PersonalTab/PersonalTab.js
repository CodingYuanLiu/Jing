import {createAppContainer, createMaterialTopTabNavigator} from "react-navigation";
import PersonalManage from "./PersonalManage";
import PersonalFeedback from "./PersonalFeedback";
import React from "react";
import {View} from "react-native";
import Util from "../../../common/util";


const window = Util.getVerticalWindowDimension();
export default class PersonalTab extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        console.log(window);
    };

    render() {
        console.log(window.height);
        return (
            // why 24 ?
            <View style={{flex: 1, height: window.height - 24 - 50,}}>
                <Tab/>
            </View>
        )
    }

}
const Tab = createAppContainer(
    createMaterialTopTabNavigator(
        {
            PersonalManage: {
                screen: PersonalManage,
                navigationOptions: {
                    title: "发布",
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
                    borderTopWidth: 0.5,
                    borderColor: "#eee",
                    elevation: 0,
                    justifyContent: "flex-end",
                },
                tabStyle: {
                },
                labelStyle: {
                    color: "#7a7a7a",
                },
                indicatorStyle: {
                    backgroundColor: "#0084ff",
                    width: 60,
                    marginLeft: (window.width / 2 - 60) /2,
                },
            }
        }
    )
);
