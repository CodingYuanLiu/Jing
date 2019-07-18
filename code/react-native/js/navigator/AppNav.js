import {
    createSwitchNavigator,
    createStackNavigator
} from 'react-navigation';
import Start from '../pages/start/Start';
import HomeScreen from '../pages/home/Home';
import DetailScreen from '../pages/detail/Detail';
import LoginScreen from '../pages/login/Login';
import RegisterScreen from "../pages/login/Register";
import SettingScreen from '../pages/setting/Setting';
import SearchScreen from '../pages/search/Search';
import JaccountWebView from '../pages/login/JaccountWebView';
import PublishScreen from '../pages/publish/Publish';
import FillTable from '../pages/publish/FillTable';
import PersonalHome from '../pages/me/PersonalHome';
import JaccountLoading from '../pages/login/JaccountLoading';


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
        Publish: {
            screen: PublishScreen
        },
        ActDetail: {
            screen: DetailScreen,
        },
        Login: {
            screen: LoginScreen,
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
        Jaccount: {
            screen: JaccountWebView,
        },
        JaccountLoading: {
            screen: JaccountLoading
        },
        FillTable: {
            screen: FillTable,
        },
        PersonalHome: {
            screen: PersonalHome
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
