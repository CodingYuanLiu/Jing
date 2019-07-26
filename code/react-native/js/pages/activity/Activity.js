import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import {ActTabConfig, ActTopTab} from "./TopTabBar"
import {createAppContainer, createMaterialTopTabNavigator} from "react-navigation"
import NavigationBar from "../../common/components/NavigationBar"
import FakeSearchBar from "../../common/components/FakeSearchBar"
import NavigationUtil from '../../navigator/NavUtil';
import Octicons from "react-native-vector-icons/Octicons";
import Feather from "react-native-vector-icons/Feather";


export default class HomeScreen extends React.Component{
    constructor(props) {
        super(props);

    }
    render() {
        const TabNavigator = createAppContainer(
                createMaterialTopTabNavigator(
                    ActTopTab,ActTabConfig
                ));

        const leftIcon = <Octicons name={"search"} color={"#7ecaff"} size={20}/>
        const ActSearch =
            <FakeSearchBar
                leftIcon={leftIcon}
                title={"搜索，即刻响应"}
                press={() => {this.toSearch()}}
            />;
        const RightIcon =
            <Feather
                name={"plus"}
                size={28}
                color={"#fff"}
            />;
        return(
            <View style={{flex:1,}}>
                <NavigationBar
                titleView={ActSearch}
                statusBar={{backgroundColor: "#0084ff", barStyle: "light-content"}}
                style={{backgroundColor:"#0084ff"}}
                rightButton={RightIcon}
                rightBtnStyle={styles.rightBtnStyle}
                />
                <TabNavigator/>
            </View>
        )
    };
    toSearch = () => {
        NavigationUtil.toPage(this.props, "Search")
    };

}

const styles= StyleSheet.create(
    {
        rightBtnStyle: {
            marginLeft: 6,
            marginRight: 6,
        }
    }
)
