import React from "react"
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import Default from "../../../common/constant/Constant";
import ActItem from "../components/ActItem";
import NavigationUtil from "../../../navigator/NavUtil";
import Activity from "../../../actions/activity";
import {connect} from "react-redux";
import Api from "../../../api/Api";

class RecommendAct extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            logged: true,
        }
    }
    componentDidMount() {
        this.loadData();
    }
    render() {
        let {recommendAct} = this.props;
        let activities = recommendAct.items;
        if (!activities) {
            activities=[];
        }
        return(
            <View style={styles.container}>
                {this.state.logged ? <FlatList
                    data={activities}
                    renderItem={this.renderItem}
                    keyExtractor={item => (item.id.toString())}
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
                /> : null}
            </View>
        )
    };
    renderItem = ({item}) => {
        return (
            <ActItem
                id={item.id}
                endTime={item.endTime}
                sponsor={item.sponsor}
                description={item.description}
                title={item.title}
                tags={item.tags}
                type={item.type}
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
            />)
    };
    loadData = () => {

        let {onLoadRecommendAct} = this.props;
        let {jwt} = this.props.currentUser;
        if (jwt) {
            onLoadRecommendAct(jwt);
        } else {
            this.setState(state => {
                state.logged = true;
                return state;
            })
        }
    };
    _onPressItem = (id: number) => {
        NavigationUtil.toPage({id:id}, "ActDetail")
    };
}

const mapStateToProps = state => ({
    recommendAct: state.recommendAct,
    currentUser: state.currentUser,
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
