import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import NoticeHeader from '../components/NoticeHeader';
import Dao from '../../../api/dao/Dao';


export default class SystemNoticeScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }


    render() {
        return(
            <View style={styles.container}>
                <NoticeHeader
                    title="系统通知"
                    onPress={() => {alert("press!")}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex :1,
    }
})
