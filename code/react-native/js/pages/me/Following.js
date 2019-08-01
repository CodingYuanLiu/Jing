import React from "react"
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {Avatar, Button, ListItem} from "react-native-elements";
import {connect} from "react-redux";
import HeaderBar from "../../common/components/HeaderBar";
import {ArrowLeftIcon, PlusIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import {onFollow, onGetFollowers, onGetFollowings, onUnFollow} from "../../actions/currentUser";
import UserAvatar from "../../common/components/UserAvatar";
import Api from "../../api/Api";
import * as actionTypes from "../../common/constant/ActionTypes";
import UserNickname from "../../common/components/UserNickname";
import FollowItem from "./components/FollowItem";


class Following extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            followingList: [],
            isFollowing: false,
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
                data={this.state.followingList}
                renderItem={this.renderItem}
                keyExtractor={item => (item.id.toString())}
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
    renderItem = ({item}) => {

        return (
            <FollowItem
                item={item}
                onFollow={() => {this.follow(item)}}
                onUnFollow={() => {this.unFollow(item)}}
                isFollowing={this.props.currentUser.isFollowing}
                isUnFollowing={this.props.currentUser.isUnFollowing}
            />
        )
    };
    renderHeader = () => {
        let header = (
            <HeaderBar
            leftButton={
                <ArrowLeftIcon
                onPress={() => {NavigationUtil.toPage(null, "Home")}}
                color={"#fff"}
                style={styles.headerIcon}
                />
            }
            title={"我关注的"}
            titleStyle={styles.headerTitle}
            titleLayoutStyle={styles.headerTitleContainer}
            style={styles.headerContainer}
            />
        );
        return header;
    };

    loadData = () => {
        this.setState({isLoading: true});
        let currentUser = this.props.currentUser;
        Api.getFollowings(currentUser.jwt)
            .then(data => {
                this.props.dispatch({
                    type: actionTypes.GET_USER_FOLLOWINGS_OK,
                    data: data ? data : [],
                });
                for (let item of data) {
                    item.followed = true;
                }
                this.setState({
                    followingList: data,
                })
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setState({isLoading: false});
            })
    };

    follow = (item) => {
        let from = {
            id: this.props.currentUser.id,
        };
        let jwt = this.props.currentUser.jwt;
        let to = {
            id: item.id,
        };
        this.props.follow(from, to, jwt);
        item.followed = true;
    };
    unFollow = (item) => {
        let from = {
            id: this.props.currentUser.id,
        };
        let jwt = this.props.currentUser.jwt;
        let to = {
            id: item.id,
        };
        this.props.unFollow(from, to, jwt);
        item.followed = false;
    };
}

const mapStateToProps = state => ({
    currentUser: state.currentUser,
});
const mapDispatchToProps = dispatch => ({
    follow: (from, to, jwt) => dispatch(onFollow(from, to, jwt)),
    unFollow: (from, to, jwt) => dispatch(onUnFollow(from, to, jwt)),
    onGetFollowings: (jwt) => dispatch(onGetFollowings(jwt)),
    dispatch: dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(Following);

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
