import {createStackNavigator} from "react-navigation";
import PublishCommon from "./PublishCommon";
import PublishTaxiSpec from "./PublishSpec/PublishTaxiSpec";
import PublishDetail from "./PublishDetail";


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
}, {
    defaultNavigationOptions: {
        header: null,
    },
    navigationOptions: {
        header: null,
    }
},)
