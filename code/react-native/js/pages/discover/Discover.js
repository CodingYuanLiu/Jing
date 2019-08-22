import React from "react"
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import {Button} from 'react-native-elements';
import ToolTip from "../../common/components/ToolTip";


export default class DiscoverScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {

        return(
                <View style={styles.container}>
                    <ToolTip
                    >
                        <View>
                            <Button
                                title={"显示"}
                                onPress={() => {alert("带我")}}
                                type={"clear"}
                            />
                        </View>
                    </ToolTip>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
