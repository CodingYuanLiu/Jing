import React from "react"
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {Avatar, Button, ListItem} from "react-native-elements";
import {connect} from "react-redux";
import HeaderBar from "../../common/components/HeaderBar";
import {ArrowLeftIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";


class Following extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log(this.props);
    }

    render() {
        let header = this.renderHeader();
        let follow = this.props.follow;
        if (!follow) {
            follow = {
                followings: [],
                isLoading: false,
            }
        }
        return(
            <View style={{flex:1}}>
                {header}
                <FlatList
                data={follow.followings}
                renderItem={this.renderItem}
                keyExtractor={item => (item.id.toString())}
                refreshControl={
                    <RefreshControl
                        title={"加载中..."}
                        titleColor={"#0084ff"}
                        colors={["#0084ff"]}
                        refreshing={false}
                        onRefresh={null}
                        tintColor={"#0084ff"}
                    />
                }
                />
            </View>
        )
    };
    renderItem = ({item}) => {
        let avatar = (
            <Avatar
            source={{uri: item.avatar_url}}
            rounded
            />
        );
        let rightElement = (
            <Button
            title={"已关注"}
            titleStyle={{color: "#7a7a7a"}}
            buttonStyle={styles.listItemButton}
            containerStyle={styles.listItemButtonContainer}
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
            titleLayoutStyle={styles.headerTitle}
            style={styles.headerContainer}
            />
        );
        return header;
    };
}

const mapStateToProps = state => ({
    follow: state.follow,
});

export default connect(mapStateToProps, null)(Following);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerIcon: {
        marginLeft: 20,
        marginRight: 10,
    },
    headerTitle: {
        color: "#8a8a8a",
        fontSize: 22,
        fontWeight: "800",
        justifyContent: "flex-start",
        alignItems: "flex-start",
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
    listItemButton: {
        backgroundColor: "#e0e0e0",
        height: 35,
        width: 80,
    },
    listItemButtonContainer: {

    },
});
