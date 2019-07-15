import React from "react"
import BottomTabComponent from "./BottomTabBar"
import NavigationUtil from '../../navigator/NavUtil';
import { View } from "react-native"


export default class HomeScreen extends React.Component<Props>{
    constructor(props) {
        super(props);
    }

    render() {
        // Expose outer stack navigation to inner navigation
        NavigationUtil.Navigation = this.props.navigation;

        // render main part of app
        return(
            <View style={{flex:1,}}>
                <BottomTabComponent />
            </View>

        )
    }
}

