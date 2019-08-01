import React from "react";
import {StyleSheet} from "react-native";
import { PropTypes } from "prop-types";
import UserAvatar from "../../../common/components/UserAvatar";
import UserNickname from "../../../common/components/UserNickname";
import {Button, ListItem} from "react-native-elements";
import {PlusIcon} from "../../../common/components/Icons";

export default class FollowItem extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        let {isFollowing, isUnFollowing, item, onFollow, onUnFollow} = this.props;
        let followItem = this.renderItem(item, onFollow, onUnFollow, isFollowing, isUnFollowing);
        return followItem;
    }
    renderAvatar = (avatar, id) => {
        return (
            <UserAvatar
                source={{uri: avatar}}
                rounded
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
    renderFollowButton = (followed, onFollow, onUnFollow, isFollowing, isUnFollowing) => {
        let rightElement = (
            followed ?
                <Button
                    title={"已关注"}
                    titleStyle={styles.followedText}
                    buttonStyle={styles.followedButton}
                    containerStyle={styles.listItemButtonContainer}
                    onPress={onUnFollow}
                    loading={isFollowing}
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
                    onPress={onFollow}
                    loading={isUnFollowing}
                />
                );
        return rightElement;
    };
    renderItem = (item, onFollow, onUnFollow, isFollowing, isUnFollowing) => {
        let avatar = this.renderAvatar(item.avatar_url, item.id);
        let nickname = this.renderNickname(item.nickname, item.id);
        let rightElement = this.renderFollowButton(
            item.followed, onFollow, onUnFollow, isFollowing, isUnFollowing
            );
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
}
const ItemShape = {
    followed: PropTypes.boolean,
    avatar_url: PropTypes.string,
    id: PropTypes.number,
    nickname: PropTypes.string,
    signature: PropTypes.string,
};
FollowItem.propTypes = {
    onFollow: PropTypes.func,
    onUnFollow: PropTypes.func,
    item: PropTypes.shape(ItemShape),
};
FollowItem.defaultProps = {
    isFollowing: false,
    isUnFollowing: false,
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
