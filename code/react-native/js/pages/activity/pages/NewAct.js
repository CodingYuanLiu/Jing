import React from "react"
import {View, Text, FlatList, RefreshControl, StyleSheet, ScrollView} from 'react-native';
import ActItem from "../components/ActItem";
import NavigationUtil from "../../../navigator/NavUtil";
import Activity from "../../../actions/activity";
import {connect} from "react-redux";
import {onDeleteTypeAct} from "../../../actions/activity";

class NewAct extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.loadData('all');
    }
    render() {
        let {typeAct} = this.props;
        let actStore = typeAct["all"];
        if (!actStore) {
            actStore = {
                items: [],
                isLoading: false,
            }
        }

        return(
            <View style={styles.container}>
                <FlatList
                    data={actStore.items}
                    renderItem={this.renderItem}
                    keyExtractor={item => (item.id.toString())}
                    refreshControl={
                        <RefreshControl
                            refreshing={actStore.isLoading}
                            onRefresh={() => {this.loadData("all")}}
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
                onDelete={() => {this.deleteAct(item.id)}}
                isSelf={item.sponsor.id === this.props.currentUser.id}
            />)
    };
    loadData = (type) => {
        let {onLoadTypeAct} = this.props;
        onLoadTypeAct(type);
    };
    _onPressItem = (id: number) => {
        NavigationUtil.toPage({id:id}, "ActDetail")
    };
    deleteAct = (id) => {
        let {currentUser} = this.props;
        console.log(currentUser);
        if (!currentUser.logged) {
            //...
        } else {
            this.props.onDeleteTypeAct(id, "all", currentUser.jwt);
        }
    }
}

const mapStateToProps = state => ({
    typeAct: state.typeAct,
    currentUser: state.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onLoadTypeAct: (type) => dispatch(Activity.onLoadTypeAct(type)),
    onDeleteTypeAct: (id, type, jwt) => dispatch(onDeleteTypeAct(id, type, jwt)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewAct)

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#eeeeee"
    },
});
