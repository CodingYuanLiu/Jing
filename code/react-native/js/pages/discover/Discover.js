import React from "react"
import { View, Text, StatusBar, StyleSheet, TouchableNativeFeedback, Animated } from 'react-native';
import {connect} from "react-redux";
import {PanGestureHandler} from "react-native-gesture-handler";
import {WINDOW} from "../../common/constant/Constant";


const circleRadius = 30;
const windowWidth = WINDOW.width;

class DiscoverScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    };
    componentDidMount(){
    }
    _touchX = new Animated.Value(windowWidth / 2 - circleRadius);
    _onPanGestureEvent = Animated.event([{nativeEvent: {x: this._touchX}}], );
    render() {
        return (
             <PanGestureHandler
                    onGestureEvent={this._onPanGestureEvent}>
                    <Animated.View style={{
                      height: 150,
                      justifyContent: 'center',
                    }}>
                      <Animated.View
                        style={[{
                            backgroundColor: '#42a5f5', borderRadius: circleRadius, height: circleRadius * 2, width: circleRadius * 2,
                          }, {
                            transform: [{translateX: Animated.add(this._touchX, new Animated.Value(-circleRadius))}]
                          }]}
                      />
                    </Animated.View>
             </PanGestureHandler>
        )
    };

}
const mapStateToProps = state => ({
    currentUser: state.currentUser,
});
export default connect(mapStateToProps, null)(DiscoverScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sendButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: "100%",
    },
});
