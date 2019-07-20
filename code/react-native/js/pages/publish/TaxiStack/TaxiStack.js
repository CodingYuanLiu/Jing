import {createStackNavigator} from "react-navigation";
import TaxiTitle from "./TaxiTitle";
import TaxiDest from "./TaxiSrcDest";
import TaxiDetail from "./TaxiDetail";


export default createStackNavigator({
    TaxiTitle: {
        screen: TaxiTitle,
    },
    TaxiDest: {
        screen: TaxiDest,
    },
    TaxiDetail: {
        screen: TaxiDetail,
    },
}, {
    defaultNavigationOptions: {
        header: null,
    },
    navigationOptions: {
        header: null,
    }
},)
