import React from "react";
import {StyleSheet, View, Text, FlatList, RefreshControl} from "react-native";
import {connect} from "react-redux";
import ManageItem from "./MyManageItem";
import {onDeleteCurrentUserManageAct, onGetCurrentUserManageAct} from "../../../actions/currentUserManage";
import Activity from "../../../actions/activity";
import {
    ACT_TYPE_ORDER,
    ACT_TYPE_OTHER,
    ACT_TYPE_TAKEOUT,
    ACT_TYPE_TAXI,
} from "../../../common/constant/Constant";

class MyManage extends React.Component{
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.loadData();
    }

    render() {
        let manageAct = this.props.currentUserManage;
        if (!manageAct) {
            manageAct = {
                items: [],
                isLoading: false,
            }
        }
        return (
            <View style={styles.container}>
                <FlatList
                    data={manageAct.items}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={manageAct.isLoading}
                            onRefresh={this.loadData}
                            title={"加载中..."}
                            titleColor={"#0084ff"}
                            colors={["#0084ff"]}
                            tintColor={"#0084ff"}
                        />
                    }
                />
            </View>
        );
    }
    renderItem = ({item}) => {
        return (
            <ManageItem
                {...item}
                onDelete={this.onDelete}
                onPublish={this.onPublish}
            />
        )
    };
    loadData = () => {
        let currentUser = this.props.currentUser;
        this.props.onGetCurrentUserManageAct(currentUser.jwt);
        console.log(this.props)
    };
    onDelete = (act) => {
        let {currentUser} = this.props;
        this.props.onDeleteCurrentUserManageAct(act.id, currentUser.jwt);
    };
    onPublish = (act) => {
        console.log(act);
        switch (act.type) {
            case ACT_TYPE_TAXI:
                this.props.saveTaxiAct(act);
                break;
            case ACT_TYPE_TAKEOUT:
                this.props.saveTakeoutAct(act);
                break;
            case ACT_TYPE_ORDER:
                this.props.saveOrderAct(act);
                break;
            case ACT_TYPE_OTHER:
                this.props.saveOtherAct(act);
                break;
            default:
                console.log("invalid type");
        }
    };
}
const mapStateToProps = state => ({
    currentUserManage: state.currentUserManage,
    currentUser: state.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onGetCurrentUserManageAct: (jwt) => dispatch(onGetCurrentUserManageAct(jwt)),
    onDeleteCurrentUserManageAct: (id, jwt) => dispatch(onDeleteCurrentUserManageAct(id, jwt)),
    saveOrderAct: act => dispatch(Activity.saveOrderAct(act)),
    saveTaxiAct: act => dispatch(Activity.saveTaxiAct(act)),
    saveOtherAct: act => dispatch(Activity.saveOtherAct(act)),
    saveTakeoutAct: act => dispatch(Activity.saveTakeoutAct(act)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyManage)


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

});
