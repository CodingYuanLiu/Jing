import React from "react";
import RecommendAct from "./pages/RecommendAct";
import MyAct from './pages/MyAct';
import FollowAct from './pages/FollowAct';


const ActTopTab = {
        RecommendAct: {
            screen: RecommendAct,
            navigationOptions: {
                title: "推荐",
            }
        },
        FollowAct: {
            screen: FollowAct,
            navigationOptions: {
                title: "关注",
            }
        },
        MyAct: {
            screen: MyAct,
            navigationOptions: {
                title: "我的"
            }
        },
    }
const ActTabConfig = {
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
                color: "white"
            }
        }
    }



export {
    ActTopTab,
    ActTabConfig,
}
