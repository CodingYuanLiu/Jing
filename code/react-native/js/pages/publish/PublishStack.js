import {createStackNavigator} from "react-navigation";
import PublishCommon from "./PublishCommon";
import PublishTaxiSpec from "./PublishSpec/PublishTaxiSpec";
import PublishDetail from "./PublishDetail";
import PublishPage from "./PublishPage";

export default createStackNavigator({
    PublishCommon: {
        screen: PublishCommon,
    },
    PublishTaxiSpec: {
        screen: PublishTaxiSpec,
    },
    PublishDetail: {
        screen: PublishDetail,
    },
    PublishPage: {
        screen: PublishPage,
    },
}, {
    defaultNavigationOptions: {
        header: null,
    },
    navigationOptions: {
        header: null,
    }
},)
