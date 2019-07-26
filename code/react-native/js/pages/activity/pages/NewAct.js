import React from "react"
import {View, Text, FlatList, RefreshControl, StyleSheet, ScrollView} from 'react-native';
import ActItem from "../components/ActItem";
import Default from "../../../common/constant/Constant";
import NavigationUtil from "../../../navigator/NavUtil";
import Activity from "../../../actions/activity";
import {connect} from "react-redux";
import Tag from "../../../common/components/Tag";

class NewAct extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            type: 'all',
        }
    }
    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {onLoadTypeAct} = this.props;
        let {type} = this.state;
        onLoadTypeAct(type);
    };
    renderItem = ({item}) => {
        return (
            <ActItem
                id={item.act_id}
                endTime={item.end_time}
                user={{
                    id: item.sponsor_id,
                    nickname: item.sponsor_username,
                    signature: item.signature,
                    avatarUri: item.sponsor_avatar,
                }}
                bodyText={item.description}
                title={item.title}
                tags={item.tag}
                type={item.type}
                image={item.images && item.images.length > 0? item.images[0] : null}
                taxiSpecInfo={
                    item.type==="taxi" ? {
                        departTime: item.depart_time,
                        origin: item.origin,
                        dest: item.destination,
                    } : null}
                shopSpecInfo={
                    item.type === "order" ? {
                        store: item.store,
                    } : null
                }
                takeoutSpecInfo={
                    item.type === "takeout" ? {
                        orderTime: item.order_time,
                        store: item.store,
                    } : null
                }
                otherSpecInfo={
                    item.type === "other" ? {
                        activityTime: item.activity_time,
                    } : null
                }
                metadata={
                    {
                        comments: item.comments.length,
                        participants: 0, // we don't have participants data here
                    }
                }
                onPress={() => {this._onPressItem(item.act_id)}}
            />)
    };
    _onPressItem = (id: number) => {
        NavigationUtil.toPage({id:id}, "ActDetail")
    };
    changeType = (type) => {
        this.setState({type: type});
    };
    render() {
        let {typeAct} = this.props;
        let {type} = this.state;
        let actStore = typeAct[type];
        if (!actStore) {
            actStore = {
                items: [],
                isLoading: false,
            }
        }
        if (!this.types) this.types = [
            {title: "所有", name: "all"},
            {title: "拼车", name: "taxi"},
            {title: "网购", name: "order"},
            {title: "外卖", name: "takeout"},
            {title: "其他", name: "other"},
        ];
        return(
            <View style={styles.container}>
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
                    keyExtractor={item => (item.act_id.toString())}
                    refreshControl={
                        <RefreshControl
                            title={"加载中..."}
                            titleColor={"#0084ff"}
                            colors={["#0084ff"]}
                            refreshing={actStore.isLoading}
                            onRefresh={this.loadData}
                            tintColor={"#0084ff"}
                        />
                    }
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    typeAct: state.typeAct,
    user: state.user,
});
const mapDispatchToProps = dispatch => ({
    onLoadTypeAct: (type) => dispatch(Activity.onLoadTypeAct(type))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewAct)

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#eeeeee"
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
    }
});
