import {createAppContainer, createMaterialTopTabNavigator} from "react-navigation";
import PersonalTrack from "./PersonalTrack";
import PersonalPublish from "./PersonalPublish";
import PersonalFeedback from "./Feedback";
import PersonalJoin from "./PersonalJoin";

export default createAppContainer(
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
                    height: 40,
                    borderTop: 0
                },
                tabStyle: {
                    height: 40,
                },
                indicatorStyle: {
                    color: "#fff",
                }
            }
        }
    )
)
