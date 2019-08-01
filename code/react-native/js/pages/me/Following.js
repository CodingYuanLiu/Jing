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
                        title={"加载中..."}
                        titleColor={"#0084ff"}
                        colors={["#0084ff"]}
                        refreshing={this.state.isFollowing}
                        onRefresh={this.loadData}
                        tintColor={"#0084ff"}
                    />
                }
                />
            </View>
        )
    };
    renderItem = ({item}) => {
        let avatar = (
            <UserAvatar
                source={{uri: item.avatar_url}}
                rounded
                id={item.id}
            />
        );
        let rightElement = (
            item.followed ?
                <Button
                    title={"已关注"}
                    titleStyle={styles.followedText}
                    buttonStyle={styles.followedButton}
                    containerStyle={styles.listItemButtonContainer}
                    onPress={() => {this.unFollow(item)}}
                    loading={this.props.currentUser.isFollowing}
                /> :
                <Button
                    title={"关注"}
                    icon={
                        <PlusIcon
                            color={"#0084ff"}
                        />
                    }
                    titleStyle={styles.unFollowedText}
                    buttonStyle={styles.unFollowedButton}
                    containerStyle={styles.listItemButtonContainer}
                    onPress={() => {this.follow(item)}}
                    loading={this.props.currentUser.isUnFollowing}
                />
        );
        return (
            <ListItem
                leftAvatar={avatar}
                title={item.nickname}
                titleStyle={styles.listItemTitle}
                titleProps={{ellipsizeMode: "tail", numberOfLines: 1}}
                subtitle={item.signature}
                subtitleStyle={item.listItemSubtitle}
                subtitleProps={{ellipsizeMode: "tail", numberOfLines: 1}}
                rightElement={rightElement}
                containerStyle={styles.listItemContainer}
            />
        )
    };
    renderHeader = () => {
        let header = (
            <HeaderBar
            leftButton={
                <ArrowLeftIcon
                onPress={() => {NavigationUtil.back(this.props)}}
                color={"#ffffff"}
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
        let currentUser = this.props.currentUser;
        Api.getFollowings(currentUser.jwt)
            .then(data => {
                this.props.dispatch({
                    type: actionTypes.GET_USER_FOLLOWERS_OK,
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
            });
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
    onGetFollowers: (jwt) => dispatch(onGetFollowers(jwt)),
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
    listItemContainer: {
        width: "100%",
        borderBottomWidth: 0.8,
        borderBottomColor: "#efefef",
        height: 80,
    },
    listItemTitle: {
        fontWeight: "bold",
        fontSize: 15,
        color: "#3a3a3a",
    },
    listItemSubtitle: {
        color: "#bfbfbf",
    },
    followedButton: {
        backgroundColor: "#e0e0e0",
        height: 35,
        width: 80,
    },
    followedText: {
        color: "#8a8a8a",
    },
    unFollowedButton: {
        backgroundColor: "#e0e0e0",
        height: 35,
        width: 80,
    },
    unFollowedText: {
        color: "#0084ff",
    },
    listItemButtonContainer: {
        width: 100,
    },
});
