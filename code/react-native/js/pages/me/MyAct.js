import React from "react";
import {View, Text, StyleSheet} from "react-native";
import ActivityTab from "./MyActivityTab/ActivityTab";
import {ArrowLeftIcon} from "../../common/components/Icons";
import {Button} from "react-native-elements";
import HeaderBar from "../../common/components/HeaderBar";
import NavigationUtil from "../../navigator/NavUtil";
import LocalApi from "../../api/LocalApi";

export default class MyAct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            draftLength: 0,
        }
    }

    componentDidMount() {
        this.loadData();
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
                onPress={this.goBack}
            />
        );
        let title=`草稿箱(${this.state.draftLength})`;
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
    };
    loadData = () => {
        LocalApi.getPublishDraft()
            .then(data => {
                this.setState({draftLength: data.length});
            })
            .catch(err => {
                console.log(err);
            })
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerTitleContainer: {
        alignItems: "flex-start",
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

