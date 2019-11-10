import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import {ActTabConfig, ActTopTab} from "./TopTabBar"
import {createAppContainer, createMaterialTopTabNavigator} from "react-navigation"
import NavigationBar from "../../common/components/NavigationBar"
import NavigationUtil from '../../navigator/NavUtil';
import {PlusIcon} from "../../common/components/Icons";
import {Image} from "react-native-elements";
import {connect} from "react-redux";

class HomeScreen extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        const TabNavigator = createAppContainer(
                createMaterialTopTabNavigator(
                    ActTopTab,ActTabConfig
                ));

        let title = this.renderTitle();
        const RightIcon =
            <PlusIcon
                color={"#fff"}
                size={28}
                style={styles.rightBtnStyle}
                onPress={this.toPublishPage}
            />;
        return(
            <View style={{flex:1,}}>
                <NavigationBar
                    titleView={title}
                    titleLayoutStyle={{flex:1, flexDirection: "row"}}
                    statusBar={{backgroundColor: "#0084ff", barStyle: "light-content"}}
                    style={{backgroundColor:"#0084ff"}}
                    rightButton={RightIcon}
                    rightBtnStyle={styles.rightBtnStyle}
                />
                <TabNavigator/>
            </View>
        )
    };

    renderTitle = () => {
        return (
            <View
                style={styles.titleContainer}
            >
                <Text
                    style={styles.titleText}
                >您的位置</Text>
                <Text
                    style={{marginLeft: 5, marginRight: 8, color: "#eee", fontWeight:"bold", fontSize: 15}}
                >{this.props.setting.city}</Text>
                <Image
                    style={styles.logo}
                    source={require("../../static/images/logo-white.png")}
                />
                <Text
                    style={styles.titleText}
                >
                    一呼即应
                </Text>
            </View>
        )
    };

    toSearch = () => {
        NavigationUtil.toPage(this.props, "Search")
    };
    toPublishPage = () => {
        NavigationUtil.toPage({from: "home"}, "Publish");
    };
}

const mapStateToProps = state => ({
    setting: state.setting,
});
export default connect(mapStateToProps, null) (HomeScreen);
const styles= StyleSheet.create({
    rightBtnStyle: {
        marginLeft: 6,
        marginRight: 6,
    },
    topTagContainer: {
        backgroundColor: "#fff",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#efefef",
    },
    tag: {
        margin:5,
        paddingLeft:8,
        paddingRight:8,
        paddingBottom: 5,
        paddingTop: 5
    },
    titleContainer: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    titleText: {
        color: "#fff",
        fontSize: 14
    },
    logo: {
        width: 40,
        height: 40,
        marginLeft: 15
    }
});
