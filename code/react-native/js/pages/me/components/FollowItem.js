import React from "react";
import {StyleSheet} from "react-native";
import { PropTypes } from "prop-types";
import UserAvatar from "../../../common/components/UserAvatar";
import UserNickname from "../../../common/components/UserNickname";
import {Button, ListItem} from "react-native-elements";
import {PlusIcon} from "../../../common/components/Icons";
import {onFollow, onUnFollow} from "../../../actions/currentUserFollowing";
import {connect} from "react-redux";

class FollowItem extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            isFollowing: false,
            isUnFollowing: false,
        }
    }

    render() {
        let {item} = this.props;
        return  this.renderItem(item);
    }
    renderAvatar = (avatar, id) => {
        return (
            <UserAvatar
                source={{uri: avatar}}
                id={id}
            />
        )
    };
    renderNickname = (nickname, id) => {
        return (
            <UserNickname
                title={nickname}
                style={styles.listItemTitle}
                id={id}
            />
        )
    };
    renderFollowButton = (item) => {
        return (
            item.followed ?
                <Button
                    title={"已关注"}
                    titleStyle={styles.followedText}
                    buttonStyle={styles.followedButton}
                    containerStyle={styles.listItemButtonContainer}
                    onPress={() => {this.unFollow(item)}}
                    loading={this.state.isFollowing}
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
                    loading={this.state.isUnFollowing}
                />
        );
    };
    renderItem = (item) => {
        let avatar = this.renderAvatar(item.avatar, item.id);
        let nickname = this.renderNickname(item.nickname, item.id);
        let rightElement = this.renderFollowButton(item);
        return (
            <ListItem
                leftAvatar={avatar}
                title={nickname}
                subtitle={item.signature}
                subtitleStyle={styles.listItemSubtitle}
                subtitleProps={{ellipsizeMode: "tail", numberOfLines: 1}}
                rightElement={rightElement}
                containerStyle={styles.listItemContainer}
            />
        )
    };

    follow = (item) => {
        this.setState({isFollowing: true});
        let from = {
            id: this.props.currentUser.id,
        };
        let jwt = this.props.currentUser.jwt;
        let to = {
            id: item.id,
        };
        this.props.onFollow(from, to, jwt, this);
        this.props.setFollowed(item, true);
    };
    unFollow = (item) => {
        this.setState({isUnFollowing: true});
        let from = {
            id: this.props.currentUser.id,
        };
        let jwt = this.props.currentUser.jwt;
        let to = {
            id: item.id,
        };
        this.props.onUnFollow(from, to, jwt, this);
        this.props.setFollowed(item, false);
    };
}

const mapStateToProps = state => ({
    currentUser: state.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onFollow: (from, to, jwt, that) => dispatch(onFollow(from, to, jwt, that)),
    onUnFollow: (from, to, jwt, that) => dispatch(onUnFollow(from, to, jwt, that)),
});
export default connect(mapStateToProps, mapDispatchToProps)(FollowItem);

const ItemShape = {
    followed: PropTypes.boolean,
    avatar: PropTypes.string,
    id: PropTypes.number,
    nickname: PropTypes.string,
    signature: PropTypes.string,
};
FollowItem.propTypes = {
    item: PropTypes.shape(ItemShape),
    setFollowed: PropTypes.func,
};

const styles = StyleSheet.create({
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
