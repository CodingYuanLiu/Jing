import React from "react"
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import FakeSearchBar from "../activity/components/FakeSearchBar"
import NavigationUtil from '../../navigator/NavUtil';
import Octicons from "react-native-vector-icons/Octicons";
import HeaderBar from "../../common/components/HeaderBar";
import Tag from "../../common/components/Tag";
import Activity, {onDeleteTypeAct} from "../../actions/activity";
import {connect} from "react-redux";
import ActItem from "../activity/components/ActItem";
import {Image} from "react-native-elements";

class DiscoverScreen extends React.Component{
    constructor(props) {
        super(props);
        this.types = [
            {title: "所有", name: "all"},
            {title: "拼车", name: "taxi"},
            {title: "网购", name: "order"},
            {title: "外卖", name: "takeout"},
            {title: "其他", name: "other"},
        ];
        this.state = {
            type: "all",
        }
    }

    componentDidMount(){
        this.loadData("all");
    }

    render() {
        const leftIcon = <Octicons name={"search"} color={"#7ecaff"} size={20}/>;
        const ActSearch =
            <View
                style={{flexDirection: "row", flex: 1, alignItems: "center", left: -8}}
            >
                <Image
                    style={styles.logo}
                    source={require("../../static/images/logo-white.png")}
                />
                <FakeSearchBar
                    leftIcon={leftIcon}
                    title={"搜索，即刻响应"}
                    onPress={this.toSearch}
                    style={{flex: 1,}}
                />
            </View>;
        let {typeAct} = this.props;
        let actStore = typeAct[this.state.type];
        if (!actStore) {
            actStore = {
                items: [],
                isLoading: false,
            }
        }
        return(
            <View style={{flex:1, }}>
                <HeaderBar
                    titleView={ActSearch}
                    titleLayoutStyle={{flexDirection: "row", flex: 1,}}
                    statusBar={{backgroundColor: "#0084ff", barStyle: "light-content"}}
                    style={{backgroundColor:"#0084ff"}}
                />
                <View
                    style={styles.topTagContainer}
                >
                    {
                        this.types.map((type, i) => {
                            return (
                                <Tag
                                    title={type.title}
                                    key={i}
                                    onPress={() => {this.changeType(type.name)}}
                                    active={this.state.type===type.name}
                                    style={styles.tag}
                                    backgroundColor={"#dddddd"}
                                    color={"#b0b0b0"}
                                    activeBackgroundColor={"#d4e6ff"}
                                />
                            )
                        })
                    }
                </View>
                <FlatList
                    data={actStore.items}
                    renderItem={this.renderItem}
                    keyExtractor={item => (item.id.toString())}
                    refreshControl={
                        <RefreshControl
                            refreshing={actStore.isLoading}
                            onRefresh={() => {this.loadData(this.state.type)}}
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

    renderItem = ({item}) => {
        return (
            <ActItem
                {...item}
                image={item.images.length > 0 ? item.images[0] : null}
                taxiSpecInfo={
                    item.type==="taxi" ? {
                        departTime: item.departTime,
                        origin: item.origin,
                        dest: item.dest,
                    } : null}
                orderSpecInfo={
                    item.type === "order" ? {
                        store: item.store,
                    } : null
                }
                takeoutSpecInfo={
                    item.type === "takeout" ? {
                        orderTime: item.orderTime,
                        store: item.store,
                    } : null
                }
                otherSpecInfo={
                    item.type === "other" ? {
                        activityTime: item.activityTime,
                    } : null
                }
                metadata={
                    {
                        comments: item.comments.length,
                        participants: item.participants,
                        maxMember: item.maxMember,
                    }
                }
                onPress={() => {this._onPressItem(item.id)}}
                onDelete={() => {this.deleteAct(item.id)}}
            />)
    };
    toSearch = () => {
        NavigationUtil.toPage(this.props, "Search")
    };
    toPublishPage = () => {
        NavigationUtil.toPage({from: "home"}, "Publish");
    };
    changeType = (type) => {
        this.setState(state => {
            state.type = type;
            this.loadData(type);
            return state;
        });
    };
    loadData = (type) => {
        let {onLoadTypeAct} = this.props;
        onLoadTypeAct(type);
    };
    _onPressItem = (id: number) => {
        NavigationUtil.toPage({id:id}, "ActDetail")
    };
}

const mapStateToProps = state => ({
    typeAct: state.typeAct,
    currentUser: state.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onLoadTypeAct: (type) => dispatch(Activity.onLoadTypeAct(type)),
    onDeleteTypeAct: (id, type, jwt) => dispatch(onDeleteTypeAct(id, type, jwt)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverScreen)

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
    logo: {
        width: 40,
        height: 40,
    }
});
