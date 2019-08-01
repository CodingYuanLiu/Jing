import React from "react"
import NavigationUtil from '../../navigator/NavUtil';
import { View } from "react-native"
import {connect} from "react-redux";
import {createAppContainer, createBottomTabNavigator} from "react-navigation";
import ActivityScreen from "../activity/Activity";
import Entypo from "react-native-vector-icons/Entypo";
import NotificationScreen from "../notification/Notification";
import Ionicons from "react-native-vector-icons/Ionicons";
import PublishScreen from "../publish/Publish";
import AntDesign from "react-native-vector-icons/AntDesign";
import DiscoverScreen from "../discover/Discover";
import MeScreen from "../me/Me";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import BottomTab from "./BottomTab";

class HomeScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        console.disableYellowBox = true
    }

    componentDidMount(){
        // Expose outer stack navigation to inner navigation
        NavigationUtil.Navigation = this.props.navigation;
        console.log(this.props);
    };

    render() {
        return(
            <View style={{flex:1,}}>
                <BottomTab
                logged={this.props.currentUser.logged}
                />
            </View>

        )
    };
}


const mapStateToProps = state => ({
    currentUser: state.currentUser,
});


export default connect(mapStateToProps, null)(HomeScreen);
