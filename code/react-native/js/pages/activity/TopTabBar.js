import React from "react";
import RecommendAct from "./pages/RecommendAct";
import FollowAct from './pages/FollowAct';
import NewAct from "./pages/NewAct";


const ActTopTab = {
    NewAct: {
        screen: NewAct,
        navigationOptions: {
            title: "最新"
        }
    },
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
};
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
            color: "#fff",
        }
    }
};



export {
    ActTopTab,
    ActTabConfig,
}
