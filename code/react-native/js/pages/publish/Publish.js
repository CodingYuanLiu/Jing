import React from "react"
import {View, Text, StyleSheet, StatusBar } from 'react-native';
import { Icon, Button } from "react-native-elements";
import NavigationUtil from '../../navigator/NavUtil';
import {connect} from "react-redux";
import {ArrowDownIcon, FoodIcon, MultiUserIcon, ShoppingBagIcon, TaxiIcon} from "../../common/components/Icons";

class PublishScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this._navListener = this.props.navigation.addListener('didFocus',() => {
            StatusBar.setBarStyle("dark-content", true);
            StatusBar.setBackgroundColor("#efefef", true);
        })
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    render() {
        const taxi =
            <TaxiIcon
            reverse
            color={"#0072ff"}
            onPress={() => {this.toPublishPage("taxi")}}
            />;
        const taxiTitle = "发起拼车";
        const shopping =
            <ShoppingBagIcon
                 reverse
                 color={"#007bff"}
                 onPress={() => {this.toPublishPage("order")}}
            />;
        const shoppingTitle = "拼网购";
        const takeOut =
            <FoodIcon
                reverse
                color={"#0090ff"}
                onPress={() => {this.toPublishPage("takeout")}}
            />;
        const takeOutTitle = "拼外卖";
        const activity =
            <MultiUserIcon
                reverse
                color={"#009eff"}
                onPress={() => {this.toPublishPage("other")}}
            />;
        const activityTitle = "发起活动";
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <ArrowDownIcon
                        size={32}
                        color={"#d3d3d3"}
                        onPress={this.goBack}
                    />
                </View>
                <View style={styles.main}>
                    <View style={styles.iconContainer}>
                        {taxi}
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{taxiTitle}</Text>
                        </View>
                    </View>
                    <View style={styles.iconContainer}>
                        {shopping}
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{shoppingTitle}</Text>
                        </View>
                    </View>
                    <View style={styles.iconContainer}>
                        {takeOut}
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{takeOutTitle}</Text>
                        </View>
                    </View>
                    <View style={styles.iconContainer}>
                        {activity}
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{activityTitle}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    };
    goBack = () => {
        StatusBar.setBarStyle("light-content", true);
        StatusBar.setBackgroundColor("#0084ff", true);
        let from = this.props.navigation.getParam("from");
        if(from === "home"){
            NavigationUtil.toPage(null, "Home");
        } else {
            NavigationUtil.back(this.props)
        }
    };
    toPublishPage = type => {
        NavigationUtil.toPage({type: type}, "PublishPage");
        /*
        if (this.props.logged) {
            NavigationUtil.toPage({actType: type}, "PublishCommon");
        } else {
            alert("Need login")
        }

         */
    };
}

const mapStateToProps = state => ({
    currentUser: state.currentUser,
});
export default connect(mapStateToProps, null)(PublishScreen)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eeeeee",
    },
    header: {
        marginTop: 16,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
    },
    main:{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    iconContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer: {
        alignItems: "center",
    },
});
