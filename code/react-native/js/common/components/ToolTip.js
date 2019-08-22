import React from "react";
import {
    View, StyleSheet, ViewPropTypes, Text,
    TouchableWithoutFeedback, UIManager,
    NativeModules,
} from "react-native";
import {PropTypes} from "prop-types";
import {EllipsisIcon} from "./Icons";
import Modal from "react-native-modal";
import {WINDOW} from "../constant/Constant";
import {Button} from "react-native-elements";

export default class ToolTip extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            toolTipVisible: false,
            layout: {
                x: 0,
                y: 0,
            },
        };
    };

    render() {
        let {style} = this.props;
        if (!style) style = null;

        let toolTip = this._renderToolTip();
        return (
            <View
                style={[styles.container, style, { backgroundColor: "red", marginTop: 20}]}
            >
                <EllipsisIcon
                    color={"#bfbfbf"}
                    onPress={this._onPress}
                />
                {toolTip}
            </View>
        )
    };
    _renderToolTip = () => {
        let {children, width, height, contentContainerStyle} = this.props;
        return (
            <Modal
                isVisible={this.state.toolTipVisible}
                onBackdropPress={this._onBackdropPress}
                style={
                    [
                        {
                            margin: 0,
                            position: "absolute",
                            top: this.state.layout.y - 20 ,// 20 is for completely cover icon
                            left: this.state.layout.x > width ?this.state.layout.x - width + 20: this.state.layout.x
                        },
                    ]
                }
                animationIn={"zoomInDown"}
                animationOut={"zoomOutUp"}
                userNativeDriver={true}
                backdropColor={"#fff"}
                backdropOpacity={0}
            >
                <View style={[styles.contentContainer, {width: width, height: height}, contentContainerStyle]}>
                    {children}
                </View>
            </Modal>
        )
    };
    _onPress = (e) => {
        let {nativeEvent} = e;
        this.setState({
            toolTipVisible: true,
            layout: {
                x: nativeEvent.pageX,
                y: nativeEvent.pageY,
            }
        });
    };
    _onBackdropPress = () => {
        this.setState({toolTipVisible: false});
    };
}
ToolTip.propTypes = {
    style: ViewPropTypes.style,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.array,
    ]),
    height: PropTypes.number,
    width: PropTypes.number,
    contentContainerStyle: ViewPropTypes.style,
};
ToolTip.defaultProps = {
    children: <View><Text>请添加children节点</Text></View>,
    height: 120,
    width: WINDOW.width / 2 - 30,
};

const styles = StyleSheet.create({
    container: {
    },
    contentContainer: {
        backgroundColor: "#eee",
        borderRadius: 2,
        elevation: 2,
    },
    modalContainer: {
        backgroundColor: "#eee",
        elevation: 2,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        position: "absolute"
    },
});

