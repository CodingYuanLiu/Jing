import React from "react"
import NavigationUtil from '../../navigator/NavUtil';
import { View, Text } from "react-native"
import {connect} from "react-redux";
import BottomTab from "./BottomTab";

class HomeScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        this.state = {
            publishModalVisible: true,
        }
    }

    componentDidMount(){
        // Expose outer stack navigation to inner navigation
        NavigationUtil.Navigation = this.props.navigation;
        console.log(this.props);
    };

    render() {
        return(
            <View style={{flex:1,}}>
                <BottomTab
                    logged={this.props.currentUser.logged}
                />
            </View>
        )
    };
}


const mapStateToProps = state => ({
    currentUser: state.currentUser,
});

export default connect(mapStateToProps,null)(HomeScreen);
