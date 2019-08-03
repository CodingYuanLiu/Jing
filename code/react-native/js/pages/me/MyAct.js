import React from "react";
import {View, Text, StyleSheet} from "react-native";
import ActivityTab from "./MyActivityTab/ActivityTab";
import {ArrowLeftIcon} from "../../common/components/Icons";
import {Button} from "react-native-elements";
import HeaderBar from "../../common/components/HeaderBar";
import NavigationUtil from "../../navigator/NavUtil";


export default class MyAct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recentData: 0,
        }
    }

    render() {
        let header = this.renderHeader();
        return (
            <View style={styles.container}>
                {header}
                <ActivityTab/>
            </View>
        )
    };
    renderHeader = () => {
        let leftButton = (
            <ArrowLeftIcon
                color={"#8a8a8a"}
                style={styles.headerLeftIcon}
                onPress={this.goBack}
            />
        );
        let title=`草稿箱(0)`;
        let rightButton = (
            <Button
                title={title}
                titleStyle={styles.headerRightButtonText}
                type={"clear"}
                onPress={this.toDraftPage}
                buttonStyle={styles.headerRightButton}
            />
        );
        return (
            <HeaderBar
                leftButton={leftButton}
                rightButton={rightButton}
                title={"我的活动"}
                titleStyle={styles.headerTitle}
                titleLayoutStyle={styles.headerTitleContainer}
                style={{backgroundColor: "#fff"}}
            />
        )
    };
    toDraftPage = () => {
        NavigationUtil.toPage(null, "PublishDraft");
    };
    goBack = () => {
        NavigationUtil.back(this.props);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerTitleContainer: {
        alignItems: "flex-start",
        marginLeft: 16,
    },
    headerLeftIcon: {
        marginLeft: 20,
    },
    headerRightButton: {
        marginRight: 10,
    },
    headerRightButtonText: {
        color: "#8a8a8a",
        fontSize: 16,
    },
    headerTitle: {
        fontSize: 24,
        color: "#8a8a8a",
    },
});

