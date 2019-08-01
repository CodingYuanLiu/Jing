import React from "react"
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import NoticeHeader from '../components/NoticeHeader';
import Api from "../../../api/Api";
import {connect} from "react-redux";

class SystemNoticeScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            noticeList: [],
            isLoading: false,
        }
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        return(
            <View style={styles.container}>
                <NoticeHeader
                    title="系统通知"
                    onPress={() => {alert("press!")}}
                />
                <FlatList
                    data={this.state.noticeList}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
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
        return null;
    };

    loadData = () => {
        let currentUser = this.props.currentUser;
        Api.getActApplicants(currentUser.jwt)
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            })
    };
}

const mapStateToProps = state => ({
    currentUser: state.currentUser,
});

const mapDispatchToProps = dispatch => ({
    //
});
export default connect(mapStateToProps, null)(SystemNoticeScreen)
const styles = StyleSheet.create({
    container: {
        flex :1,
    }
});
