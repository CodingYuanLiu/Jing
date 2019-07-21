import React from "react"
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Default from "../../../common/constant/Default";
import ActItem from "../components/ActItem";
import NavigationUtil from "../../../navigator/NavUtil";
import Api from "../../../api/Api";

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
                console.log(data);
                this.setState({activities: data});
            })
            .catch(err => {
                console.log(err)
            })
    }

    renderItem = ({item}) => {
        return (
        <ActItem
            id={item.act_id}
            endTime={item.end_time}
            user={{
                id: item.sponsor_id,
                nickname: item.sponsor_username,
                signature: Default.DEFAULT_SIGNATURE,
                avatarUri: Default.DEFAULT_AVATAR,
            }}
            bodyText={item.description}
            title={item.title}
            tags={item.tag}
            type={item.type}
            image={item.images && item.images.length > 0? item.images[0] : null}
            taxiSpecInfo={
                item.type==="taxi" ? {
                    departTime: item.depart_time,
                    origin: item.origin,
                    dest: item.destination,
                } : null}
            shopSpecInfo={
                item.type === "order" ? {
                    store: item.store,
                } : null
            }
            takeoutSpecInfo={
                item.type === "takeout" ? {
                    orderTime: item.order_time,
                    store: item.store,
                } : null
            }
            normalSpecInfo={
                item.type === "other" ? {
                    activityTime: item.activity_time,
                } : null
            }
            metadata={
                {
                    comments: item.comments.length,
                    participants: 10, // we don't have participants data here
                }
            }
            onPress={() => {this._onPressItem(item.act_id)}}
        />)
    }

    _onPressItem = (id: number) => {
        NavigationUtil.toPage({id:id}, "ActDetail")
    }

    render() {

        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.activities}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    keyExtractor={(item, index) => (item.act_id.toString())}
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
