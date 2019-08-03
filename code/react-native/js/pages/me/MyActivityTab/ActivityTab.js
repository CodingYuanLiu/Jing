import {createAppContainer, createMaterialTopTabNavigator} from "react-navigation";
import MyJoin from "./MyJoin";
import MyManage from "./MyManage";

export default createAppContainer(
    createMaterialTopTabNavigator(
        {
            MyJoin: {
                screen: MyJoin,
                navigationOptions: {
                    title: "我参与的",
                },
            },
            MyManage: {
                screen: MyManage,
                navigationOptions: {
                    title: "我发布的",
                },
            },
        },
        {
            tabBarOptions: {
                style: {
                    backgroundColor: "#fff",
                    height: 40,
                    borderTop: 0,
                },
                tabStyle: {
                    height: 40,
                    alignItems: "center",
                },
                indicatorStyle: {
                    backgroundColor: "#5a5a5a",
                },
                labelStyle: {
                    color: "#5a5a5a",
                },
            }
        }
    )
)
