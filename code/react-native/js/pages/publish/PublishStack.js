import {createStackNavigator} from "react-navigation";
import PublishTaxiSpec from "./PublishSpec/PublishTaxiSpec";
import PublishPage from "./PublishPage";
import PublishTakeoutSpec from "./PublishSpec/PublishTakeoutSpec";
import PublishOrderSpec from "./PublishSpec/PublishOrderSpec";
import Publish from "./Publish";
import PublishDraft from "./PublishDraft";

export default createStackNavigator({
    Publish: {
        screen: Publish
    },
    PublishPage: {
        screen: PublishPage,
    },
    PublishTaxiSpec: {
        screen: PublishTaxiSpec,
    },
    PublishTakeoutSpec: {
        screen: PublishTakeoutSpec,
    },
    PublishOrderSpec: {
        screen: PublishOrderSpec,
    },
    PublishDraft: {
        screen: PublishDraft,
    },
}, {
    defaultNavigationOptions: {
        header: null,
    },
    navigationOptions: {
        header: null,
    }
},)
