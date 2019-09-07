import React from "react"
import {View, Text, StyleSheet, FlatList, RefreshControl, ScrollView, Animated} from 'react-native';
import Activity, {onDeleteTypeAct} from "../../../actions/activity";
import {connect} from "react-redux";
import Modal from "react-native-modal";
import Avatar from "react-native-elements/src/avatar/Avatar";
import ActItem from "../components/ActItem";
import NavigationUtil from "../../../navigator/NavUtil";
import HeaderBar from "../../../common/components/HeaderBar";
import {CloseIcon} from "../../../common/components/Icons";

class FollowActScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isModalVisible: false,
            modalSponsor: {},
            isLoading: false,
        };
        this.scrollY = new Animated.Value(0);
    }

    componentDidMount(){
        this.loadData();
    }

    render() {

        let header = this.renderHeader();
        let modal = this.renderModal();
        return(
            <View style={styles.container}>
                <FlatList
                    ListHeaderComponent={header}
                    data={this.state.items}
                    keyExtractor={item => item.id.toString()}
                    renderItem={this.renderItem}
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
                {modal}
            </View>
        )
    };

    renderHeader = () => {
        return (
            <View
                style={styles.headerContainer}
            >
                <ScrollView
                    horizontal={true}
                >
                    {
                        this.props.currentUserFollowing.items.map((item, i) => {
                            return (
                                <View
                                    key={i.toString()}
                                >
                                    {this.renderAvatar(item)}
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    };
    renderAvatar = (item) => {
        return (
            <View
                style={styles.headerAvatarContainer}
            >
                <Avatar
                    source={{uri: item.avatar}}
                    size={45}
                    onPress={() => {
                        this.onPressAvatar(item)
                    }}
                    rounded={true}
                    containerStyle={{backgroundColor: "red"}}
                />
                <Text
                    style={styles.headerAvatarText}
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                >
                    {item.nickname}
                </Text>
            </View>
        )
    };
    renderModal = () => {
        return (
            <Modal
                useNativeDrive={true}
                isVisible={this.state.isModalVisible}
                propagateSwipe={true}
                onBackdropPress={() => {this.setState({isModalVisible: false})}}
                style={{margin: 0, justifyContent: "flex-end"}}
                onSwipeStart={(e) => {console.log(e)}}
                onSwipeMove={(e) => {console.log(e)}}
                onSwipeComplete={(e) => {console.log(e)}}
            >
                <Animated.View
                    style={styles.modalContainer}
                >
                    <HeaderBar
                        leftButton={
                            <CloseIcon
                                color={"#555"}
                                onPress={() => {this.setState({isModalVisible: false})}}
                            />
                        }
                        style={{backgroundColor: "transparent"}}
                    />
                    <Animated.ScrollView>
                        {
                            this.state.items
                                .filter(item => item.sponsor.id === this.state.modalSponsor.id)
                                .map(item => {
                                    return this.renderItem({item});
                            })
                        }
                    </Animated.ScrollView>
                </Animated.View>
            </Modal>
        )
    };

    renderItem = ({item}) => {
        return (
            <ActItem
                {...item}
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
        this.setState({isLoading: true});
        let {typeAct, currentUserFollowing} = this.props;
        let followings = currentUserFollowing.items;
        let list = [];
        if(typeAct["all"].items !== undefined && typeAct["all"].items !== null) {
            for (let item of typeAct["all"].items) {
                for (let user of followings) {
                    if (item.sponsor.id === user.id) {
                        list.push(item);
                        break;
                    }
                }
            }
        }

        this.setState({
            items: list,
            isLoading: false,
        })
    };
    onPressAvatar = (item) => {
        this.setState({
            isModalVisible: true,
            modalSponsor: item,
        })
    };
    _onPressItem = (id) => {
        NavigationUtil.toPage({id}, "ActDetail");
    }
}
const mapStateToProps = state => ({
    typeAct: state.typeAct,
    currentUser: state.currentUser,
    currentUserFollowing: state.currentUserFollowing,
});
const mapDispatchToProps = dispatch => ({
    onLoadTypeAct: (type) => dispatch(Activity.onLoadTypeAct(type)),
    onDeleteTypeAct: (id, jwt) => dispatch(onDeleteTypeAct(id, jwt)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FollowActScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(250,250,250)",
    },
    headerContainer: {
        marginTop: 8,
        marginLeft: 6,
        marginBottom: -6,
    },
    headerAvatarContainer: {
        alignItems: "center",
        marginLeft: 9,
        marginRight: 9,

    },
    headerAvatarText: {
        fontSize: 12,
        color: "#555",
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 10,
        maxWidth: 60,
    },

    itemContainer: {
        backgroundColor: "#fff",
        elevation: 2,
        marginBottom: 10,
        padding: 15,
    },
    modalContainer: {
        flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: "#fff",
    }
});
