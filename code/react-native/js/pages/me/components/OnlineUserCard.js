import React from "react"
import {  StyleSheet } from 'react-native';
import { PropTypes } from "prop-types";
import { Avatar, ListItem } from 'react-native-elements';


export default class OnlineUserCard extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {

        let {avatar, nickname, signature, onPress} = this.props;
        let avatarComponent = this.renderAvatar(avatar);
        return(
            <ListItem
                leftAvatar={avatarComponent}
                title={nickname}
                titleStyle={styles.title}
                titleProps={{ellipsizeMode: "tail", numberOfLines: 1}}
                subtitle={signature}
                subtitleProps={{ellipsizeMode: "tail", numberOfLines: 1}}
                subtitleStyle={styles.subtitle}
                chevron
                rightTitle={"个人主页"}
                rightTitleStyle={styles.rightTitle}
                containerStyle={styles.container}
                contentContainerStyle={{flex: 1, marginLeft: -8}}
                rightContentContainerStyle={styles.rightTitleContainer}
                onPress={onPress}
            />
        )
    }
    renderAvatar = (avatar) => {
        return (
            <Avatar
            source={{uri: avatar}}
            rounded
            size={60}
            />
        );
    };
}


OnlineUserCard.propTypes = {
    avatar: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    nickname: PropTypes.string.isRequired,
    signature: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 0,
        margin: 0,
    },
    title: {
        fontWeight: "bold",
        fontSize: 22,
    },
    subtitle: {
        fontSize: 13,
        color: "#bfbfbf",
    },
    rightTitle: {
        fontSize: 12,
        color: "#bfbfbf",
    },
    rightTitleContainer: {
        marginRight: -18,
        flex: 0,
    },
});
