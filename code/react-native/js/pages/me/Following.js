import React from "react"
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {connect} from "react-redux";
import HeaderBar from "../../common/components/HeaderBar";
import {ArrowLeftIcon, PlusIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import {onFollow, onUnFollow, onGetCurrentUserFollowing} from "../../actions/currentUserFollowing";
import Api from "../../api/Api";
import FollowItem from "./components/FollowItem";
import {GET_USER_FOLLOWINGS_OK} from "../../common/constant/ActionTypes";


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
                setFollowed={this.setItemFollowed}
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
                    type: GET_USER_FOLLOWINGS_OK,
                    items: data ? data : [],
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
    setItemFollowed = (item, flag) => {
        item.followed = flag;
    }
}

const mapStateToProps = state => ({
    currentUser: state.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onFollow: (from, to, jwt) => dispatch(onFollow(from, to, jwt)),
    onUnFollow: (from, to, jwt) => dispatch(onUnFollow(from, to, jwt)),
    onGetCurrentUserFollowing: (jwt) => dispatch(onGetCurrentUserFollowing(jwt)),
    dispatch: dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(Following);

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
