import React from "react"
import { View, Text, FlatList, StyleSheet, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import NavigationUtil from "../../navigator/NavUtil";
import HeaderBar from "../../common/components/HeaderBar";
import {
    ArrowLeftIcon,
    DeleteIcon,
    FoodIcon,
    MultiUserIcon,
    ShoppingBagIcon,
    TaxiIcon
} from "../../common/components/Icons";
import LocalApi from "../../api/LocalApi";


export default class RecentScan extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            recentList: [],
            isLoading: false,
        }
    }
    componentDidMount() {
        this.loadData();
    }

    render() {
        let recentList = this.state.recentList;
        let header = this.renderHeader();
        return(
            <View style={styles.container}>
                {header}
                <FlatList
                    data={recentList}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this.loadData}
                            title={"加载中..."}
                            titleColor={"#0084ff"}
                            colors={["#0084ff"]}
                            tintColor={"#0084ff"}
                        />
                    }
                />
            </View>
        )
    };
    renderHeader = () => {
        let leftButton = (
            <ArrowLeftIcon
                color={"#6a6a6a"}
                style={styles.headerLeftIcon}
                onPress={this.goBack}
            />
        );
        let rightButton = (
            <DeleteIcon
                color={"#6a6a6a"}
                style={styles.headerRightIcon}
                onPress={this.clearRecent}
            />
        );
        return (
            <HeaderBar
                leftButton={leftButton}
                rightButton={rightButton}
                title={"最近浏览"}
                titleStyle={styles.headerTitle}
                titleLayoutStyle={styles.headerTitleContainer}
                style={styles.headerContainer}
            />
        )
    };
    renderItem = ({item}) => {
        let leftIcon = this.renderItemIcon(item.type);
        let title = (
            <View>
                <Text style={styles.itemTitleText}>{item.title}</Text>
            </View>
        );
        let description = (
            <View>
                <Text style={styles.itemBodyText}>{item.description}</Text>
            </View>
        );
        return (
            <TouchableWithoutFeedback
            onPress={() => {this.toActDetail(item.id)}}
            >
                <View style={styles.itemContainer}>
                    {leftIcon}
                    <View style={styles.itemRightContainer}>
                        {title}
                        {description}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    };
    renderItemIcon = (type) => {
        let leftIcon;
        switch(type) {
            case "taxi":
                leftIcon = (
                    <TaxiIcon
                        reverse
                        color={"#0072ff"}
                        size={18}
                        style={styles.itemLeftContainer}
                    />
                );
                break;
            case "order":
                leftIcon = (
                    <ShoppingBagIcon
                        reverse
                        color={"#107aff"}
                        size={18}
                        style={styles.itemLeftContainer}
                    />
                );
                break;
            case "takeout" :
                leftIcon = (
                    <FoodIcon
                        reverse
                        color={"#2378ff"}
                        size={18}
                        style={styles.itemLeftContainer}
                    />
                );
                break;
            case "other":
                leftIcon = (
                    <MultiUserIcon
                        reverse
                        color={"#3f79ff"}
                        size={18}
                        style={styles.itemLeftContainer}
                    />
                );
                break;
            default:
                leftIcon = null;
            // this should not happen
        }
        return leftIcon;
    };
    goBack = () => {
        NavigationUtil.back(this.props);
    };
    toActDetail = (id) => {
        NavigationUtil.toPage({id: id}, "ActDetail");
    };
    loadData = () => {
        this.setState({isLoading: false});
        LocalApi.getRecentScan()
            .then(data => {
                this.setState({recentList: data});
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setState({isLoading: false});
            })
    };
    clearRecent = () => {
        LocalApi.clearRecentScan()
            .then(() => {
                this.setState({
                    recentList: [],
                })
            })
            .catch(err => {
                console.log(err);
            })
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#eee",
        flex: 1,
    },
    headerContainer: {
        elevation: 4,
        backgroundColor: "#fff",
        marginBottom: 5,
    },
    headerTitle: {
        color: "#6a6a6a",
        fontSize: 20,
    },
    headerLeftIcon: {
        marginLeft: 20,
    },
    headerRightIcon: {
        marginRight: 10,
    },
    itemContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
    },
    itemLeftContainer: {
        marginRight: 8,
        marginLeft: 6,
    },
    itemRightContainer: {
        flex: 1,
        borderColor: "#efefef",
        borderBottomWidth: 0.5,
        paddingBottom: 10,
        marginTop: 10,
        marginRight: 8,
    },
    itemTitleText: {
        fontSize: 18,
        color: "#3a3a3a",
    },
    itemBodyText: {
        fontSize: 14,
        color: "#9f9f9f",
    },
});
