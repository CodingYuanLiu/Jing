import React from "react";
import {StyleSheet, View, Text, FlatList, RefreshControl} from "react-native";
import Activity from "../../../actions/activity";
import {connect} from "react-redux";

class MyManage extends React.Component{
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.loadData();
    }

    render() {
        let manageAct = this.props.myAct.manageAct;
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
            <View style={{flex: 1}}>
                <Text>{JSON.stringify(item)}</Text>
            </View>
        )
    };
    loadData = () => {
        let currentUser = this.props.currentUser;
        this.props.onLoadMyManageAct(currentUser.jwt);
        console.log(this.props)
    }
}
const mapStateToProps = state => ({
    myAct: state.myAct,
    currentUser: state.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onLoadMyManageAct: (jwt) => dispatch(Activity.onLoadMyManageAct(jwt)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyManage)


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

});
