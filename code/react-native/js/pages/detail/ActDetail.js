import React from "react";
import {View, Text, StyleSheet, ScrollView} from "react-native"
import NavigationBar from "../../common/components/NavigationBar"
import Api from "../../api/Api"
import {Button, Icon, Image} from "react-native-elements";
import NavigationUtil from "../../navigator/NavUtil";
import UserCard from "./components/UserCard";
import Default from "../../common/constant/Default";
import {TaxiSpec} from "../activity/components/SpecInfo";
import Comment from "./components/Comment";
import NoComment from "./components/NoComment";


export default class DetailScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state= {
            title: "",
            act_id: "",
            comments: [],
            create_time: "019-07-19 23:55:59",
            depart_time: "2019-07-19 23:55:59",
            end_time: "2019-07-19 23:55:59",
            description: "",
            origin: "",
            tag: [],
            images: [],
            nickname: "",
            id: "",
            signature: "",
        }
    }

    componentDidMount(){
        let actId = this.props.navigation.getParam("id");
        Api.getActDetail(actId)
            .then(data => {
                console.log(data)
                this.setState({...data})
                console.log(this.state)
            })
            .catch(err => {
                console.log(err)
            })
    }


    render() {
        let title=this.state.title;
        let id = this.state.act_id;
        let comments=this.state.comments;
        let publishTime=this.state.create_time;
        let departTime=this.state.depart_time;
        let endTime=this.state.end_time;
        let body=this.state.description;
        let source=this.state.origin;
        let tag=this.state.tag;
        let destination=this.state.destination;
        let images=this.state.images;
        let user={
            nickname: this.state.sponsor_username,
            id: this.state.sponsor_id,
            signature: this.state.signature,
        }
        let backBtn=
            <Icon
                type={"material-community"}
                name={"keyboard-backspace"}
                color={"#d3d3d3"}
                onPress={() => {NavigationUtil.back(this.props)}}
            />

        return(

            <View style={{flex:1, alignItems:"center"}}>
                <NavigationBar
                    leftButton={backBtn}
                    style={{backgroundColor: "#fff",
                        alignSelf: "flex-start",
                        marginLeft: 12,
                    }}
                />
                <ScrollView style={[{flex: 1}, styles.container]}>
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                        <View style={styles.userCard}>
                            <UserCard
                                avatarUri={Default.DEFAULT_AVATAR}
                                avatarSize={Default.DEFAULT_AVATAR_SIZE}
                                nickname={user.nickname}
                                signature={user.signature}
                                onPress={() => {this.toUserPersonalPage()}}
                            />
                        </View>
                    </View>
                    <View style={styles.bodyContainer}>
                        <TaxiSpec departTime={departTime}
                                  endTime={endTime} dest={destination} src={source}
                            style={{flex: 0}}
                        />
                        <Text>{body}</Text>
                        <View>
                            {
                                images && images.length > 0 && images.map((item, i) => (
                                    <Image
                                        source={{uri: item}}
                                        placeholderContent={<View><Text>picture</Text></View>}
                                    />
                                ))
                            }
                        </View>
                    </View>

                    <View style={styles.commentContainer}>
                        {
                            comments.length > 0 ?
                                comments.map((item, i) => (
                                    <Comment
                                        avatarUri={Default.DEFAULT_AVATAR}
                                        avatarSize={24}
                                        nickname={item.title}
                                        comment={item.content}
                                    />
                                )) : null
                        }
                        {
                            comments.length === 0 ?
                                <NoComment
                                /> : null
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }

    toUserPersonalPage = () => {
        NavigationUtil.toPage({id:user.id}, "PersonalPage")
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:"100%",
        backgroundColor: "#eeeeee",
    },
    header:{
        backgroundColor: "#fff",
        paddingLeft:"6%",
        paddingRight:"6%",
        marginTop: 5,
        marginBottom: 10,
    },
    titleContainer:{
        flex:1,
        marginTop: 10,
        marginBottom: 16,

    },
    title:{
        fontSize: 22,
        fontWeight: "700",
        color: "#1a1a1a",
    },
    userCard: {
        width: "100%",
        flex: 1,
        height: 80,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginBottom: 12,
    },
    bodyContainer: {
        backgroundColor: "#fff",
        flex: 1,
        width: "100%",
        paddingLeft:"6%",
        paddingRight:"6%",
        marginBottom: 12,
        minHeight: 250,
    },
    commentContainer: {
        backgroundColor: "#fff",
        paddingLeft:"6%",
        paddingRight:"6%",
    },
})
