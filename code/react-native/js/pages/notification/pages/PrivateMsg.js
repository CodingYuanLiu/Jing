import React from "react"
import { View, Text } from 'react-native';
import NoticeHeader from '../components/NoticeHeader';


export default class PrivateMsgScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <NoticeHeader
                    title="私信列表"
                    onPress={() => {alert("clear")}}
                />
            </View>
        )
    }
}

