import {
    createSwitchNavigator,
    createStackNavigator
} from 'react-navigation';
import Start from '../pages/start/Start';
import HomeScreen from '../pages/home/Home';
import DetailScreen from '../pages/detail/ActDetail';
import RegisterScreen from "../pages/login/Register";
import SearchScreen from '../pages/search/Search';
import PersonalHome from '../pages/me/PersonalHome';
import {NativeLoginSwitch, JaccountLoginSwitch }from "../pages/login/LoginSwitch"
import PublishPage from "../pages/publish/PublishPage";
import CommentModal from "../pages/detail/CommentModal";
import ChatRoom from "../pages/notification/pages/ChatRoom";
import Information from "../pages/me/ModifyInformation";
import Settings from "../pages/me/Settings";
import Following from "../pages/me/Following";
import Follower from "../pages/me/Follower";

const StartNav = createStackNavigator(
    {
        Start: {
            screen: Start,
            navigationOptions: {
                header: null
            }
        }
    }
);


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
            screen: Settings,
        },
        Search: {
            screen: SearchScreen,
        },
        PublishPage: {
            screen: PublishPage,
        },
        Information: {
            screen: Information,
        },
        PersonalHome: {
            screen: PersonalHome,
        },
        ActComment: {
            screen: CommentModal,
        },
        ChatRoom: {
            screen: ChatRoom,
        },
        Following: {
            screen: Following,
        },
        Follower: {
            screen: Follower,
        },
    },
    {
        defaultNavigationOptions: {
            header: null,
        }
    }
);

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
