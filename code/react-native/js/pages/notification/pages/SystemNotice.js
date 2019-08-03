import React from "react"
import { View, Text, StyleSheet, FlatList, RefreshControl, ToastAndroid } from 'react-native';
import NoticeHeader from '../components/NoticeHeader';
import Api from "../../../api/Api";
import {connect} from "react-redux";
import NoticeItem from "../components/NoticeItem";

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
                    keyExtractor={item => item.act_id.toString() + item.applicant_id.toString()}
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
        return (
            <NoticeItem
                applicant={{
                    id: item.applicant_id,
                    nickname: item.applicant_nickname,
                    avatar: item.applicant_avatar,
                }}
                act={{
                    id: item.act_id,
                    title: item.act_title,
                    type: item.type,
                }}
                isRejecting={item.isRejecting}
                isAccepting={item.isAccepting}
                onReject={() => {this.reject(item)}}
                onAccept={() => {this.accept(item)}}
            />
        );
    };

    loadData = () => {
        this.setState({isLoading: true});
        let currentUser = this.props.currentUser;
        console.log(this.props);
        Api.getActApplicants(currentUser.jwt)
            .then(data => {
                data = data ? data: [];
                for(let item of data ){
                    item.isAccepting = false;
                    item.isRejecting = false;
                }
                this.setState({
                    noticeList: data,
                });
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setState({
                    isLoading: false,
                })
            })
    };

    accept = (item) => {
        item.isAccepting=true;
        let currentUser = this.props.currentUser;
        Api.acceptApplicant(item.act_id, item.applicant_id, currentUser.jwt)
            .then((res) => {
                console.log(res);
                ToastAndroid.show("接受成功", 1000);
            })
            .catch(err => {
                console.log(err);
                ToastAndroid.show("接受失败", 1000);
            })
            .finally(() => {
                item.isAccepting = false;
            })
    };
    reject = (item) => {
        let currentUser = this.props.currentUser;
        Api.rejectApplicant(item.act_id, item.applicant_id, currentUser.jwt)
            .then((res) => {
                console.log(res);
                ToastAndroid.show("假的拒绝成功", 1000);
            })
            .catch(err => {
                console.log(err);
                ToastAndroid.show("假的拒绝失败", 1000);
            })
            .finally(() => {
                item.isRejecting = false;
            })
    }
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
