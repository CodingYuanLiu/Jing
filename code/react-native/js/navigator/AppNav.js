import {
    createSwitchNavigator,
    createStackNavigator
} from 'react-navigation';
import Start from '../pages/start/Start';
import HomeScreen from '../pages/home/Home';
import DetailScreen from '../pages/detail/ActDetail';
import RegisterScreen from "../pages/login/Register";
import SettingScreen from '../pages/setting/Setting';
import SearchScreen from '../pages/search/Search';
import PersonalHome from '../pages/me/PersonalHome';
import {NativeLoginSwitch, JaccountLoginSwitch }from "../pages/login/LoginSwitch"
import TaxiStack from "../pages/publish/TaxiStack/TaxiStack";


const StartNav = createStackNavigator(
    {
        Start: {
            screen: Start,
            navigationOptions: {
                header: null
            }
        }
    }
)


const MainNav = createStackNavigator(
    {
        Home: {
            screen: HomeScreen,
        },
        ActDetail: {
            screen: DetailScreen,
        },
        NativeLogin: {
            screen: NativeLoginSwitch,
        },
        JaccountLogin: {
            screen: JaccountLoginSwitch,
        },
        Register: {
            screen: RegisterScreen,
        },
        Setting: {
            screen: SettingScreen,
        },
        Search: {
            screen: SearchScreen,
        },
        TaxiForm: {
            screen: TaxiStack,
        },
        PersonalHome: {
            screen: PersonalHome,
        },
    },
    {
        defaultNavigationOptions: {
            header: null,
        }
    }
)

export default createSwitchNavigator(
    {
        Start: StartNav,
        Main: MainNav,
    },
    {
        initialRouteName: "Start",
        defaultNavigationOptions: {
            header: null,
        },
        navigationOptions: {
            header: null,
        }
    }
)
