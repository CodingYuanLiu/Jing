import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import {Input, Button, Icon} from "react-native-elements";
import Api from "../../api/Api";
import {connect} from "react-redux";
import NavigationUtil from "../../navigator/NavUtil";
import NavigationBar from "../../common/components/NavigationBar";

class FillTable extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
    }

    publishAct = () => {
        this.setState({isLoading: true})
        let logged = this.props.logged;
        let jwt = this.props.jwt;
        console.log(this.props.logged, this.props.jwt)
        if (logged && jwt && jwt !== "") {
            let date = new Date().toISOString().replace("T", " ")
            let data = {
                type: "taxi",
                create_time: new Date().
                toISOString().replace("T"," ")
                    .substring(0, date.indexOf(".")),
                end_time: this.state.endTime,
                title: this.state.title,
                description: this.state.description,
                tag: ["测试"],
                images: [],
                depart_time: this.state.departTime,
                origin: this.state.source,
                destination: this.state.destination,

            }
            Api.publishAct(jwt, data)
                .then(res => {
                    console.log(res)
                    this.setState({isLoading: false})
                    NavigationUtil.toPage(null, "Home")
                })
                .catch(err => {
                    console.log("Err, in publish act", err)
                    this.setState({isLoading: false})
                    alert("出现了未知error")
                })
        } else {
            let login = alert("您似乎没有登录哦～")
            console.log(login)
            if (login) {
                NavigationUtil.toPage(null,"Login")
            }
        }
    }

    render() {
        let backBtn=
            <Icon
                type={"material-community"}
                name={"keyboard-backspace"}
                color={"#fff"}
                onPress={() => {NavigationUtil.back(this.props)}}
            />
        return(
            <View style={styles.container}>
                <NavigationBar
                leftButton={backBtn }/>
                <View style={styles.basicContainer}>
                    <Text>基本信息</Text>
                    <Input
                        label={"标题"}
                        placeholder={"好的标题比较简短～"}
                        value={this.state.title}
                        onChangeText={text => {this.setState({title: text})}}
                    />
                    <Input
                        label={"截止时间"}
                        placeholder={"其他人在此日期之前可以向您申请～"}
                        value={this.state.endTime}
                        onChangeText={text => {this.setState({endTime: text})}}
                    />
                    <Input
                        label={"出发时间"}
                        placeholder={"您的出发时间"}
                        value={this.state.departTime}
                        onChangeText={text => {this.setState({departTime: text})}}
                    />
                    <Input
                        label={"起点"}
                        placeholder={"您打的上车的地方～"}
                        value={this.state.source}
                        onChangeText={text => {this.setState({source: text})}}
                    />
                    <Input
                        label={"目的地"}
                        placeholder={"您要去的地方"}
                        value={this.state.destination}
                        onChangeText={text => {this.setState({destination: text})}}
                    />
                </View>
                <View style={styles.detailContainer}>
                    <Text>详细说明</Text>
                    <Input
                        placeholder={"为您的即刻添加点更详细的内容吧～"}
                        value={this.state.description}
                        onChangeText={text => {this.setState({description: text})}}
                    />
                </View>
                <View>
                    <Button
                        onPress={this.publishAct}
                        loading={this.state.isLoading}
                        title={"提交"}
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    logged: state.user.logged,
    jwt: state.user.jwt,
})
export default connect(mapStateToProps, null)(FillTable)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eeeeee",
    },
    basicContainer: {

    }
})
