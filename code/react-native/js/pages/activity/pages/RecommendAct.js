import React from "react"
import { View, Text, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import NavigationUtil from '../../../navigator/NavUtil';
import Api from '../../../api/Api';


export default class HomeScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            activities: [
                {
                    title: "测试",
                    bodyText: "这个是一个测试，用来验证是不是可以渲染出想要的效果",
                    departTime: "2019-07-09",
                    endTime: "2019-07-10",
                    source: "上海交大",
                    dest: "闵行小区",
                    tag: ["测试", "更长的测试", "超级超级超级超级长的测试"]
                }
            ]
        }
    }

    componentDidMount(){
        /*
        Api.getAllAct()
            .then(data => {
                this,this.setState({activities: data})
            })
            .catch(err => {
                console.log(err)
            })

         */
    }

    rederItem = (item) => {

    }

    render() {
        const actList = this.state.activities

        return(
            <View>
                <FlatList

                />
            </View>
        )
    }
}
