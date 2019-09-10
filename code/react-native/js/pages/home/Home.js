import React from "react"
import NavigationUtil from '../../navigator/NavUtil';
import { View } from "react-native"
import {connect} from "react-redux";
import BottomTab from "./BottomTab";
import SplashScreen from "react-native-splash-screen";

class HomeScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
    }

    componentDidMount(){
        NavigationUtil.Navigation = this.props.navigation;
        SplashScreen.hide();
    };

    render() {
        let logged = this.props.currentUser.logged;
        let HomeNav;
        if (logged) {
            HomeNav =
                <BottomTab
                    logged={true}
                />
        } else {
            HomeNav =
                <BottomTab
                    logged={false}
                />
        }
        return(
            <View style={{flex:1,}}>
                {HomeNav}
            </View>
        )
    };
}

const mapStateToProps = state => ({
    currentUser: state.currentUser,
});

export default connect(mapStateToProps, null)(HomeScreen);
