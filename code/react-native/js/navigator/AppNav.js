import {
    createSwitchNavigator,
    createStackNavigator
} from 'react-navigation';
import HomeScreen from '../pages/home/Home';
import DetailScreen from '../pages/detail/ActDetail';
import RegisterScreen from "../pages/login/Register";
import SearchScreen from '../pages/search/Search';
import PersonalHome from '../pages/me/PersonalHome';
import PublishStack from "../pages/publish/PublishStack";
import CommentModal from "../pages/detail/CommentModal";
import ChatRoom from "../pages/notification/pages/ChatRoom";
import ModifyInformation from "../pages/me/ModifyInformation/ModifyInformation";
import DormitoryPage from "../pages/me/ModifyInformation/DormitoryPage";
import MajorPage from "../pages/me/ModifyInformation/MajorPage";
import Settings from "../pages/me/Settings";
import Following from "../pages/me/Following";
import Follower from "../pages/me/Follower";
import RecentScan from "../pages/me/RecentScan";
import MyAct from "../pages/me/MyAct";
import PublishDraft from "../pages/publish/PublishDraft";
import Feedback from "../pages/me/Feedback/Feedback";
import FeedbackPage from "../pages/me/Feedback/FeedbackPage";
import PersonalInformation from "../pages/me/PersonalInformation";
import PrivateChat from "../pages/notification/pages/PrivateChat";
import NativeLogin from "../pages/login/NativeLogin";
import JaccountLoading from "../pages/login/JaccountLoading";
import JaccountWebView from "../pages/login/JaccountWebView";

export const MainNav = createStackNavigator(
    {
        Home: {
            screen: HomeScreen,
        },
        ActDetail: {
            screen: DetailScreen,
        },
        NativeLogin: {
            screen: NativeLogin,
        },
        JaccountLoading: {
            screen: JaccountLoading,
        },
        JaccountWeb: {
            screen: JaccountWebView,
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
        PublishStack: {
            screen: PublishStack,
        },
        ModifyInformation: {
            screen: ModifyInformation,
        },
        DormitoryPage: {
            screen: DormitoryPage,
        },
        MajorPage: {
            screen: MajorPage,
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
        RecentScan: {
            screen: RecentScan,
        },
        PublishDraft: {
            screen: PublishDraft,
        },
        MyAct: {
            screen: MyAct,
        },
        Feedback: {
            screen: Feedback,
        },
        FeedbackPage: {
            screen: FeedbackPage,
        },
        PersonalInformation: {
            screen: PersonalInformation,
        },
        PrivateChat: {
            screen: PrivateChat,
        }
    },
    {
        defaultNavigationOptions: {
            header: null,
        }
    }
);
const LoginNav = createStackNavigator(
    {
        NativeLogin: {
            screen: NativeLogin,
        },
        JaccountWeb: {
            screen: JaccountWebView,
        },
        JaccountLoading: {
            screen: JaccountLoading,
        },
        Register: {
            screen: RegisterScreen,
        },
    },
    {
        defaultNavigationOptions: {
            header: null
        }
    }
);
export const SwitchNav =  createSwitchNavigator(
    {
        LoginSwitch: LoginNav,
        Main: MainNav,
    },
    {
        initialRouteName: "LoginSwitch",
        defaultNavigationOptions: {
            header: null,
        },
        navigationOptions: {
            header: null,

        }
    }
);
