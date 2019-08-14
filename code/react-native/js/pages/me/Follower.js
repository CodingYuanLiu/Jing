import React from "react"
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {connect} from "react-redux";
import Api from "../../api/Api";
import { onFollow, onUnFollow } from "../../actions/currentUserFollowing";
import * as actionTypes from "../../common/constant/ActionTypes";
import FollowItem from "./components/FollowItem";
import HeaderBar from "../../common/components/HeaderBar";
import {ArrowLeftIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";

class Follower extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            followerList: [],
            isLoading: false,
        }
    }
    componentDidMount() {
        this.loadData();
    }

    render() {
        let header = this.renderHeader();
        return(
            <View style={{flex:1}}>
                {header}
                <FlatList
                    data={this.state.followerList}
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
        let header = (
            <HeaderBar
                leftButton={
                    <ArrowLeftIcon
                        onPress={() => {NavigationUtil.toPage(null, "Home")}}
                        color={"#ffffff"}
                        style={styles.headerIcon}
                    />
                }
                title={"我的粉丝"}
                titleStyle={styles.headerTitle}
                titleLayoutStyle={styles.headerTitleContainer}
                style={styles.headerContainer}
            />
        );
        return header;
    };
    renderItem = ({item}) => {
        return (
            <FollowItem
                item={item}
                setFollowed={this.setItemFollowed}
            />
        )
    };
    loadData = () => {
        this.setState({isLoading: true});
        let { currentUserFollower, currentUser } = this.props;
        Api.getFollowers(currentUser.jwt)
            .then(data => {
                this.props.dispatch({
                    type: actionTypes.GET_USER_FOLLOWERS_OK,
                    items: data ? data : [],
                });
                for (let item of data) {
                    item.followed = false;
                    for (let followingItem of currentUserFollower.items) {
                        if (item.id === followingItem.id) {
                            item.followed = true;
                            break;
                        }
                    }
                }
                this.setState({followerList: data})
            })
            .catch(err => {
                console.log(err);
            })
            .finally(this.setState({isLoading: false}));
    };
    setItemFollowed = (item, flag) => {
        item.followed = flag;
    }
}

const mapStateToProps = state => ({
    currentUser: state.currentUser,
    currentUserFollower: state.currentUserFollower,
});

const mapDispatchToProps = dispatch => ({
    follow: (from, to, jwt, that) => dispatch(onFollow(from, to, jwt, that)),
    unFollow: (from, to, jwt, that) => dispatch(onUnFollow(from, to, jwt, that)),
    dispatch: dispatch,
});
export default connect(mapStateToProps, mapDispatchToProps)(Follower)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerIcon: {
        marginLeft: 20,
        marginRight: 10,
    },
    headerTitleContainer: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "800",
    },
    headerContainer: {
        elevation: 10,
    },
});
