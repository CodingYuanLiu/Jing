import React from "react"
import { View, Text, StatusBar, StyleSheet, TouchableNativeFeedback } from 'react-native';
import Modal from "react-native-modal";
import ImageViewer from "react-native-image-zoom-viewer";
import {Image} from "react-native-elements";
import {WINDOW} from "../../common/constant/Constant";
import ZhihuApi from "../../api/ZhihuApi";

export default class DiscoverScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            images: [
                {
                    url: "https://pic1.zhimg.com/v2-3b4fc7e3a1195a081d0259246c38debc_1200x500.jpg",
                    width: WINDOW.width,
                    height: WINDOW.height / 3,
                },
                {
                    url: "https://pic1.zhimg.com/v2-3b4fc7e3a1195a081d0259246c38debc_1200x500.jpg",
                    width: WINDOW.width,
                    height: WINDOW.height / 3,
                },
                {
                    url: "https://pic1.zhimg.com/v2-3b4fc7e3a1195a081d0259246c38debc_1200x500.jpg",
                    width: WINDOW.width,
                    height: WINDOW.height / 3,
                },
                {
                    url: "https://pic1.zhimg.com/v2-3b4fc7e3a1195a081d0259246c38debc_1200x500.jpg",
                    width: WINDOW.width,
                    height: WINDOW.height / 3,
                },
                {
                    url: "https://pic1.zhimg.com/v2-3b4fc7e3a1195a081d0259246c38debc_1200x500.jpg",
                    width: WINDOW.width,
                    height: WINDOW.height / 3,
                },
            ],
            isVisible: false,
            tags: [],
        }
    };
    componentDidMount(){
        ZhihuApi.getInputTips("android")
            .then(data => {
                this.setState({
                    tags: data,
                })
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {

        return(
            <View style={styles.container}>
                <TouchableNativeFeedback
                    onPress={() => {this.setState({isVisible: true})}}
                >
                    <Image
                        source={{uri: "https://pic1.zhimg.com/v2-3b4fc7e3a1195a081d0259246c38debc_1200x500.jpg"}}
                        style={{width: WINDOW.width, height: 200}}
                    />
                </TouchableNativeFeedback>
                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={() => {this.setState({isVisible: false})}}
                    backdropOpacity={1}
                    style={{margin: 0}}
                >
                    <ImageViewer
                        imageUrls={this.state.images}
                    />
                </Modal>

                <Text>
                    {JSON.stringify(this.state.tags)}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
