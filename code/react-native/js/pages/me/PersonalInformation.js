import React from "react";
import {StyleSheet, View, Text, ScrollView} from "react-native";
import {connect} from "react-redux";
import HeaderBar from "../../common/components/HeaderBar";
import {
    ArrowLeftIcon, BirthdayCakeIcon,
    GenderFemaleIcon,
    GenderMaleIcon,
    GenderSecretIcon, LocationIcon, MajorIcon,
    PencilIcon, UserIcon
} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import {Avatar} from "react-native-elements";
import {GENDER_FEMALE, GENDER_MALE, GENDER_SECRET} from "../../common/constant/Constant";

class PersonalInformation extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        }
    }

    componentDidMount() {
        let user = this.props.navigation.getParam("user");
        console.log(user);
        this.setState({user: user});
    }

    render() {
        let user = this.state.user;
        let header = this.renderHeader(user);
        let avatarComponent = this.renderAvatar(user);
        let infoComponent = this.renderInfo(user);
        return (
            <View style={styles.container}>
                {header}
                {avatarComponent}
                {infoComponent}
            </View>
        )
    };
    renderHeader = (user) => {
        let { currentUser } = this.props;
        let leftIcon = (
            <ArrowLeftIcon
                color={"#5a5a5a"}
                onPress={this.goBack}
            />
        );
        let rightIcon = (
            <PencilIcon
                color={"#5a5a5a"}
                onPress={this.toModifyInformationPage}
            />
        );
        return (
            <HeaderBar
                leftButton={leftIcon}
                title={"详细资料"}
                titleStyle={styles.headerTitle}
                titleLayoutStyle={styles.headerTitleContainer}
                rightButton={currentUser.id === user.id ? rightIcon : null}
                style={{backgroundColor: "#fff",}}
            />
        )
    };
    renderAvatar = (user) => {
        return (
            <View style={styles.avatarContainer}>
                <Avatar
                    size={80}
                    rounded
                    source={{uri: user.avatar}}
                />
                <Text style={styles.nickname}>
                    {user.nickname}
                </Text>
            </View>
        )
    };
    renderInfo = (user) => {
        let dormitoryComponent = user.dormitory && user.dormitory !== "" ?
            this.renderDormitory(user.dormitory) : null;
        let genderComponent = user.gender ?
            this.renderGender(user.gender) : null;
        let signatureComponent = this.renderSignature(user.signature);
        let birthdayComponent = user.birthday && user.birthday !== "" ?
            this.renderBirthday(user.birthday) : null;
        let majorComponent = user.major &&user.major !== "" ?
            this.renderMajor(user.major) : null;
        return (
            <ScrollView>
                {signatureComponent}
                {genderComponent}
                {birthdayComponent}
                {dormitoryComponent}
                {majorComponent}
            </ScrollView>
        )
    };
    renderDormitory = (dormitory) => {
        let leftIcon = (
            <LocationIcon
                color={"#5a5a5a"}
            />
        );
        return (
            <View style={styles.itemContainer}>
                {leftIcon}
                <Text style={styles.itemText}>
                    {dormitory}
                </Text>
            </View>
        )
    };
    renderGender = (gender) => {
        let leftIcon = (
            gender === GENDER_SECRET ?
                <GenderSecretIcon
                    color={"#5a5a5a"}
                /> :
                gender === GENDER_MALE ?
                    <GenderMaleIcon
                        color={"#5a5a5a"}
                    /> :
                    <GenderFemaleIcon
                        color={"#5a5a5a"}
                    />
        );
        let genderText = gender ===  GENDER_SECRET ?
                "保密" :
                gender === GENDER_MALE ?
                    "男孩子哦～" : "小仙女哦～";
        return (
            <View style={styles.itemContainer}>
                {leftIcon}
                <Text style={styles.itemText}>
                    {genderText}
                </Text>
            </View>
        )
    };
    renderSignature = (signature) => {
        let leftIcon = (
            <UserIcon
                color={"#5a5a5a"}
            />
        );
        return (
            <View style={styles.itemContainer}>
                {leftIcon}
                <Text style={[styles.itemText, signature === "" ? {color: "#bfbfbf"} : null]}>
                    {
                        signature === "" ?
                        "暂时没有个性签名" :
                            signature
                    }
                </Text>
            </View>
        )
    };
    renderBirthday = (birthday) => {
        let leftIcon = (
            <BirthdayCakeIcon
                color={"#5a5a5a"}
            />
        );
        return(
            <View style={styles.itemContainer}>
                {leftIcon}
                <Text style={styles.itemText}>
                    {birthday.substring(0, birthday.indexOf(" ") !== -1 ? birthday.indexOf(" ") : birthday.length - 1)}
                </Text>
            </View>
        )
    };
    renderMajor = (major) => {
        let leftIcon = (
            <MajorIcon
                color={"#5a5a5a"}
            />
        );
        return (
            <View style={styles.itemContainer}>
                {leftIcon}
                <Text style={styles.itemText}>
                    {major}
                </Text>
            </View>
        )
    };

    goBack = () => {
        NavigationUtil.back(this.props);
    };
    toModifyInformationPage = () => {
        NavigationUtil.toPage(null, "ModifyInformation");
    };
}

const mapStateToProps = state => ({
    currentUser: state.currentUser,
});
export default connect(mapStateToProps, null)(PersonalInformation);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerTitleContainer: {
        alignItems: "flex-start",
    },
    headerTitle: {
        fontSize: 20,
        color: "#5a5a5a",
    },
    avatarContainer: {
        width: "100%",
        minHeight: 130,
        alignItems: "center",
        marginTop: 25,
        marginBottom: 20,
    },
    nickname: {
        fontWeight: "bold",
        color: "#2a2a2a",
        fontSize: 20,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 20,
        marginRight: 20,
    },
    itemText: {
        flex: 1,
        fontSize: 18,
        color: "#4a4a4a",
        paddingBottom: 15,
        paddingTop: 15,
        marginLeft: 15,
        padding: 0,
        borderBottomWidth: 0.5,
        borderColor: "#eee",
    },
});
