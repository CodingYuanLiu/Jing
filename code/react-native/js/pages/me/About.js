import React from "react";
import {View, Text, StyleSheet} from "react-native";
import HeaderBar from "../../common/components/HeaderBar";
import {ArrowLeftIcon} from "../../common/components/Icons";
import {Image} from "react-native-elements";
import {WINDOW} from "../../common/constant/Constant";
import NavigationUtil from "../../navigator/NavUtil";

export default class AboutPage extends React.PureComponent{
    constructor(props){
        super(props);
    };

    render() {
        return (
            <View
                style={styles.container}
            >
                <HeaderBar
                    title={"关于即应"}
                    titleLayoutStyle={{alignItems: "center"}}
                    leftButton={
                        <ArrowLeftIcon
                            onPress={this.goBack}
                            color={"#fff"}
                        />
                    }
                />
                <View
                    style={styles.logoContainer}
                >
                    <Image
                        source={require("../../static/images/logo-white.png")}
                        style={{width: 100, height: 100}}
                    />
                    <Text
                        style={{fontSize: 30, color: "#0084ff", marginLeft: 20}}
                    >
                        即应
                    </Text>
                </View>
                <Text
                    style={{width: WINDOW.width, justifyContent: "center", alignItems: "center", color: "#666", fontSize: 16, textAlign: "center"}}
                >
                    你的要求，即应帮你实现
                </Text>

                <View
                    style={{ marginLeft: 20, marginRight: 20, marginTop: 60, alignItems: "center"}}
                >
                    <Text
                        style={{color: "#0084ff", fontSize: 20}}
                    >
                        版本号
                        <Text
                            style={{color: "#666"}}
                        >
                            {` : 1.0.0`}
                        </Text>
                    </Text>
                </View>
            </View>
        )
    };
    goBack = () => {
        NavigationUtil.back(this.props);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 30,
    },


});
