import React from "react"
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import Default from "../../../common/constant/Constant";
import ActItem from "../components/ActItem";
import NavigationUtil from "../../../navigator/NavUtil";
import Activity from "../../../actions/activity";
import {connect} from "react-redux";

class RecommendAct extends React.Component{
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {onLoadRecommendAct} = this.props;
        let {jwt} = this.props.user;
        if (jwt) {
            onLoadRecommendAct(jwt);
        } else {
            //...
        }
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
                avatarUri: Default.DEFAULT_AVATAR,
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

    render() {
        let {recommendAct} = this.props;
        let activities = recommendAct.items;
        if (!activities) {
            activities=[];
        }
        return(
            <View style={styles.container}>
                <FlatList
                    data={activities}
                    renderItem={this.renderItem}
                    keyExtractor={item => (item.act_id.toString())}
                    refreshControl={
                        <RefreshControl
                            title={"加载中..."}
                            titleColor={"#0084ff"}
                            colors={["#0084ff"]}
                            refreshing={recommendAct.isLoading}
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
    recommendAct: state.recommendAct,
    user: state.user,
});
const mapDispatchToProps = dispatch => ({
    onLoadRecommendAct: (jwt) => dispatch(Activity.onLoadRecommendAct(jwt))
});
export default connect(mapStateToProps, mapDispatchToProps)(RecommendAct)

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#eeeeee"
    }
});
