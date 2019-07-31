import React from "react"
import {
    View, Text, ScrollView, FlatList,
    TouchableWithoutFeedback, StyleSheet, StatusBar,
    RefreshControl,
} from 'react-native';
import {
    ArrowLeftIcon,
    DeleteIcon,
    FoodIcon,
    MultiUserIcon,
    ShoppingBagIcon,
    TaxiIcon
} from "../../common/components/Icons";
import {Button} from "react-native-elements";
import LocalApi from "../../api/LocalApi";
import HeaderBar from "../../common/components/HeaderBar";
import NavigationUtil from "../../navigator/NavUtil";
import Activity from "../../actions/activity";
import {connect} from "react-redux";

class PublishDraft extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            draftList: [],
            isLoading: false,
        }
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        let draftList = this.state.draftList;
        let header = this.renderHeader();
        return(
            <View style={styles.container}>
                {header}
                <FlatList
                    data={draftList}
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
        let leftIcon = (
            <ArrowLeftIcon
                color={"#6a6a6a"}
                onPress={this.goBack}
                style={styles.headerLeftIcon}
            />
        );
        return (
            <HeaderBar
                leftButton={leftIcon}
                title={"选择帖子草稿"}
                titleStyle={styles.headerTitle}
                titleLayoutStyle={styles.headerTitleLayout}
                style={styles.headerContainer}
            />
        )
    };
    renderItem = ({item}) => {
        let type = item.type;
        let leftIcon;
        switch(type) {
            case "taxi":
                leftIcon = (
                    <TaxiIcon
                        reverse
                        color={"#0072ff"}
                        style={styles.itemLeftContainer}
                    />
                );
                break;
            case "order":
                leftIcon = (
                    <ShoppingBagIcon
                        reverse
                        color={"#107aff"}
                        style={styles.itemLeftContainer}
                    />
                );
                break;
            case "takeout" :
                leftIcon = (
                    <FoodIcon
                        reverse
                        color={"#2378ff"}
                        style={styles.itemLeftContainer}
                    />
                );
                break;
            case "other":
                leftIcon = (
                    <MultiUserIcon
                        reverse
                        color={"#3f79ff"}
                        style={styles.itemLeftContainer}
                    />
                );
                break;
            default:
                leftIcon = null;
                // this should not happen
        }
        let title = this.renderItemTitle(item.title);
        let description = this.renderItemDesc(item.description);
        let footer = this.renderItemFooter(item.saveTime, item.id);
        return (
            <TouchableWithoutFeedback
                onPress={() => {this.toPublishPage(item)}}
            >
                <View style={styles.itemContainer}>
                    {leftIcon}
                    <View style={styles.itemRightContainer}>
                        {title}
                        {description}
                        {footer}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    };
    renderItemTitle = (title) => {
        return (
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
            </View>
        )
    };
    renderItemDesc = (description) => {
        return (
            <View style={styles.bodyContainer}>
                <Text
                    style={styles.body}
                    ellipsizeMode={"tail"}
                    numberOfLines={1}
                >{description}</Text>
            </View>
        )
    };
    renderItemFooter = (saveTime, id) => {
        let deleteIcon = (
            <DeleteIcon
                color={"#afafaf"}
            />
        );
        return (
            <View style={styles.footerContainer}>
                <Text
                    style={styles.footerText}
                >{saveTime}</Text>
                <Button
                    title={"删除"}
                    titleStyle={styles.footerButtonTitle}
                    icon={deleteIcon}
                    type={"clear"}
                    buttonStyle={styles.button}
                    containerStyle={styles.buttonContainer}
                    onPress={() => {this.removeDraft(id)}}
                />
            </View>
        )
    };
    loadData = () => {
        this.setState({isLoading: true});
        LocalApi.getPublishDraft()
            .then(data => {
                this.setState({
                    draftList: data,
                })
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setState({
                    isLoading: false,
                })
            })
    };
    removeDraft = (id) => {
        LocalApi.removePublishDraft(this.state.draftList, id)
            .then(data => {
                this.setState({
                    draftList: data,
                })
            })
            .catch(err => {
                console.log(err);
            })
    };
    goBack = () => {
        NavigationUtil.back(this.props);
    };
    toPublishPage = (item) => {
        switch (item.type) {
            case "taxi":
                this.props.saveTaxiAct(item);
                break;
            case "takeout":
                this.props.saveTakeoutAct(item);
                break;
            case "order":
                this.props.saveOrderAct(item);
                break;
            case "other":
                this.props.saveOtherAct(item);
                break;
            default:
                console.log("invalid act type");
                // this should not happen
        }
        NavigationUtil.toPage({type: item.type}, "PublishPage");
    };
}

const mapDispatchToProps = dispatch => ({
    saveTaxiAct: data => dispatch(Activity.saveTaxiAct(data)),
    saveTakeoutAct: data => dispatch(Activity.saveTakeoutAct(data)),
    saveOrderAct: data => dispatch(Activity.saveOrderAct(data)),
    saveOtherAct: data => dispatch(Activity.saveOtherAct(data)),
});

export default connect(null, mapDispatchToProps)(PublishDraft);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#eee",
    },
    itemContainer: {
        flexDirection: "row",
        marginBottom: 5,
        backgroundColor: "#fff",
    },
    itemLeftContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    itemRightContainer: {
        flex: 1,
        marginLeft: 10,
    },
    headerContainer: {
        backgroundColor: "#fff",
        elevation: 2,
        marginBottom: 8,
    },
    headerLeftIcon: {
        marginLeft: 20,
    },
    headerTitle: {
        color: "#6a6a6a",
    },
    headerTitleLayout: {
        alignItems: "flex-start",
        marginLeft: 20,
    },
    titleContainer: {
        marginBottom: 8,
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2a2a2a",
    },
    bodyContainer: {
        marginBottom: 5,
    },
    body: {
        fontSize: 16,
        color: "#7a7a7a",
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    footerText: {
        fontSize: 14,
        color: "#bfbfbf",
    },
    buttonContainer: {
        marginRight: 10,
        padding: 0,
        margin: 0,
    },
    button: {
        padding: 0,
        margin: 0,
    },
    footerButtonTitle: {
        fontSize: 14,
        color: "#afafaf",
    },
});
