import { createSwitchNavigator } from "react-navigation";
import JaccountLoginWebView from "./JaccountWebView";
import JaccountLoading from "./JaccountLoading";
import NativeLoginScreen from "./NativeLogin";
import MeScreen from "../me/Me";


const JaccountLoginSwitch = createSwitchNavigator({
    JaccountWeb: JaccountLoginWebView,
    JaccountLoading: JaccountLoading,
}, {
    initialRouteName: "JaccountWeb"
})

const NativeLoginSwitch = createSwitchNavigator({
    NativeLogin: NativeLoginScreen,
    Me: MeScreen,
},{
    initialRouteName: "NativeLogin"
    },
);


export {
    JaccountLoginSwitch,
    NativeLoginSwitch,
}
