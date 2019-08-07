import {createStackNavigator} from "react-navigation";
import PublishActOriginDest from "./PublishSpec/PublishActOriginDest";
import PublishPage from "./PublishPage";
import PublishActStore from "./PublishSpec/PublishActStore";
import Publish from "./Publish";


export default createStackNavigator({
    Publish: {
        screen: Publish
    },
    PublishPage: {
        screen: PublishPage,
    },
    PublishActStore: {
        screen: PublishActStore,
    },
    PublishActOriginDest: {
        screen: PublishActOriginDest,
    },
}, {
    defaultNavigationOptions: {
        header: null,
    },
    navigationOptions: {
        header: null,
    }
},)
