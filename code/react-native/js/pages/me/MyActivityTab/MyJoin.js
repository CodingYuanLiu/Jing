import React from "react";
import {View, StyleSheet, Text, FlatList, RefreshControl} from "react-native";
import Activity from "../../../actions/activity";
import {connect} from "react-redux";
import MyJoinItem from "../components/MyJoinItem";

class MyJoin extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        let joinAct = this.props.myAct.joinAct;
        if (!joinAct) {
            joinAct = {
                items: [],
                isLoading: false,
            }
        }
        return (
            <View style={styles.container}>
                <FlatList
                    data={joinAct.items}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={joinAct.isLoading}
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
            <MyJoinItem
                act={item}
                applicants={[]}
            />
        )
    };
    loadData = () => {
        let currentUser = this.props.currentUser;
        this.props.onLoadMyJoinAct(currentUser.jwt);
    }
}
const mapStateToProps = state => ({
   myAct: state.myAct,
   currentUser: state.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onLoadMyJoinAct: (jwt) => dispatch(Activity.onLoadMyJoinAct(jwt)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyJoin)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",
        minHeight: 600,
    },
});
