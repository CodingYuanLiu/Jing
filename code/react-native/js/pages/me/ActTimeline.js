import React from "react";
import {View, StyleSheet, Text, Image} from "react-native";
import Timeline from "react-native-timeline-flatlist";
import {connect} from "react-redux";
import HeaderBar from "../../common/components/HeaderBar";
import {ArrowLeftIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import {WINDOW} from "../../common/constant/Constant";


class ActTimeline extends React.Component{
    constructor(props) {
        super(props);

        this.data = [
            {
                time: '09:00',
                title: 'Archery Training',
                description: 'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ',
                lineColor:'#009688',
                imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240340/c0f96b3a-0fe3-11e7-8964-fe66e4d9be7a.jpg'
            },
            {
                time: '10:45',
                title: 'Play Badminton',
                description: 'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.',
                imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg'
            },
            {
                time: '12:00',
                title: 'Lunch',
            },
            {
                time: '14:00',
                title: 'Watch Soccer',
                description: 'Team sport played between two teams of eleven players with a spherical ball. ',
                lineColor:'#009688',
                imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240419/1f553dee-0fe4-11e7-8638-6025682232b1.jpg'
            },
            {
                time: '16:30',
                title: 'Go to Fitness center',
                description: 'Look out for the Best Gym & Fitness Centers around me :)',
                imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg'
            }
        ]
    }

    render() {
        let {currentUserJoin: joinActs, currentUserManage: manageActs} = this.props;
        let data = this.generateData(joinActs, manageActs);
        console.log(data);
        return (
            <View
                style={styles.container}
            >
                <HeaderBar
                    leftButton={<ArrowLeftIcon
                        color={"#fff"}
                        onPress={this.goBack}
                    />}
                    title={"日程安排"}
                    titleStyle={{color: "#fff"}}
                    titleLayoutStyle={{alignItems:"flex-start"}}
                />
                <View
                    style={styles.wrapper}
                >
                    <Timeline
                        data={data}
                        renderDetail={this.renderDetail}
                        circleSize={20}
                        circleColor={'rgb(45,156,219)'}
                        lineColor={'rgb(45,156,219)'}
                        timeContainerStyle={{minWidth:52, marginTop: -5}}
                        timeStyle={{textAlign: 'center', backgroundColor:'#a2ddff', color:'white', padding:5, borderRadius:13}}
                        descriptionStyle={{color:'gray'}}
                        options={{
                            style:{paddingTop:5}
                        }}
                    />
                </View>
            </View>
        );
    }

    generateData = (joinActs, manageActs) => {

        console.log(joinActs, manageActs);

        let list = [];
        if (!joinActs || !manageActs) return [];
        for (let item of joinActs.items) {
            let date = new Date(item.createTime);
            let month = date.getUTCMonth() + 1;
            let day = date.getUTCDate();
            let obj = {
                time: `${month}-${day}`,
                title: item.title,
                description: item.description,
                //icon: this.renderIcon(item.type)
            };
            if (item.images.length > 0) obj.imageUrl=item.images[0];
            list.push(obj)
        }
        for (let item of manageActs.items) {
            let date = new Date(item.createTime);
            let month = date.getUTCMonth() + 1;
            let day = date.getUTCDate();
            let obj = {
                time: `${month}-${day}`,
                title: item.title,
                description: item.description,
                //icon: this.renderIcon(item.type)
            };
            if (item.images.length > 0) obj.imageUrl=item.images[0];
            list.push(obj)
        }
        return list;
    };

    renderIcon = (type) => {

    };

    renderDetail(rowData, sectionID, rowID) {
        let title = <Text style={[styles.title]}>{rowData.title}</Text>
        let desc, image = null;
        if (rowData.imageUrl) {
            image = <Image source={{uri: rowData.imageUrl}} style={styles.image}/>
        }
        desc = (
            <View style={styles.descriptionContainer}>
                {image}
                <Text style={[styles.textDescription]}>{rowData.description}</Text>
            </View>
        );

        return (
            <View style={{flex:1}}>
                {title}
                {desc}
            </View>
        )
    };
    goBack = () => {
        NavigationUtil.back(this.props);
    }
}

const mapStateToProps = state => ({
    currentUserJoin: state.currentUserJoin,
    currentUserManage: state.currentUserManage,
});
export default connect(mapStateToProps, null)(ActTimeline);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        minWidth: WINDOW.width,
        minHeight: WINDOW.height,
    },
    wrapper: {
        flex: 1,
        paddingLeft: 20,
        paddingTop: 40,
    },
    list: {
        flex: 1,
        marginTop:20,
    },
    title:{
        fontSize:16,
        fontWeight: 'bold'
    },
    descriptionContainer:{
        flexDirection: 'row',
        paddingRight: 50
    },
    image:{
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray'
    }
});


