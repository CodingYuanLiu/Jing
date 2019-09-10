import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';
import { NoticeTabConfig, NoticeTopTab } from "./TopTabBar"

export default class NotificationScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        const NoticeTab = createAppContainer(
            createMaterialTopTabNavigator(
                NoticeTopTab, NoticeTabConfig
            )
        );
        return(
            <View style={{flex:1}}>
                <NoticeTab />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

