import React from "react"
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Api from '../../../api/Api';
import Default from "../../../constant/Default";
import ActItem from "../components/ActItem";
import NavigationUtil from "../../../navigator/NavUtil";


export default class RecommendAct extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            isLoading: true
        }
    }

    componentDidMount() {
        Api.getAllAct()
            .then(data => {
                console.log(data)
                console.log(this.state.activities)
                this.setState({activities: data})
                console.log(this.state.activities)
            })
            .catch(err => {
                console.log(err)
            })
    }

    renderItem = ({item}) => {
        return (
        <ActItem
            id={item.act_id}
            bodyText={item.description}
            user={{
                id: item.sponsor_id,
                nickname: item.sponsor_username,
                signature: Default.DEFAULT_SIGNATURE,
                avatarUri: Default.DEFAULT_AVATAR,
            }}
            title={item.title}
            tags={item.tag}
            type={item.type}
            taxiMeta={item.type==="taxi"
                ? {
                    departTime: item.depart_time,
                    endTime: item.end_time,
                    source: item.origin,
                    dest: item.destination,
                } : null}
            shopMeta={null}
            takeoutMeta={null}
            onPress={() => {this._onPressItem(item.act_id)}}
        />)
    }

    _onPressItem = (id: number) => {
        NavigationUtil.toPage({id:id}, "ActDetail")
    }

    render() {
        console.log(this.state.activities)
        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.activities}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    keyExtractor={(item, index) => (item.id)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#eeeeee"
    }
})
