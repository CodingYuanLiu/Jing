import React from "react";
import { Icon } from "react-native-elements";
import {TouchableWithoutFeedback} from "react-native-gesture-handler";

class SearchIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"octicons"}
                name={"search"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class PlusIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"feather"}
                name={"plus"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class TaxiIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"font-awesome"}
                name={"taxi"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class ShoppingBagIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"font-awesome"}
                name={"shopping-bag"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
// Need to confirm the icon name
class FoodIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material-community"}
                name={"food"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class MultiUserIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"ionicon"}
                name={"md-contacts"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class CalendarIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material-community"}
                name={"taxi"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class ArrowLeftIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material-community"}
                name={"keyboard-backspace"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class ArrowDownIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"simple-line-icon"}
                name={"arrow-down"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class MessageIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material-community"}
                name={"message-text"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class UserIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"font-awesome"}
                name={"user"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class LockIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"fontisto"}
                name={"locked"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class GreaterIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"entypo"}
                name={"chevron-thin-right"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}

class CloseIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"antdesign"}
                name={"close"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}

class CommentIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }

    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material"}
                name={"comment"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}

class ReplyIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }

    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material-community"}
                name={"comment-outline"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class EmojiIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }

    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material"}
                name={"insert-emoticon"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}

class LeftUpArrowIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"feather"}
                name={"arrow-up-left"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class CaretRightIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"antdesign"}
                name={"caretright"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class SettingIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"feather"}
                name={"settings"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class MessageOneToOneIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"antdesign"}
                name={"message1"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class ChevronIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"feather"}
                name={"chevron-right"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class CameraIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"font-awesome"}
                name={"camera"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class DeleteIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material-community"}
                name={"delete"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class EllipsisIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"antdesign"}
                name={"ellipsis1"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class PaperPlaneIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"font-awesome"}
                name={"paper-plane"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class EditIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"font-awesome"}
                name={"edit"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class CheckIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"entypo"}
                name={"check"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class DotIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"entypo"}
                name={"dot-single"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class ClockIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material-community"}
                name={"clock-outline"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class CarIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material-community"}
                name={"car-side"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class LocationIcon extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material"}
                name={"location-on"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}

class ChevronDownIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"entypo"}
                name={"chevron-down"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class ChevronUpIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"entypo"}
                name={"chevron-up"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class ImageIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material-community"}
                name={"image-plus"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class MultiCommentIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"octicon"}
                name={"comment-discussion"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class PencilIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material-community"}
                name={"pencil"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class GenderMaleIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material-community"}
                name={"gender-male"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class GenderFemaleIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material-community"}
                name={"gender-female"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class GenderSecretIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"fontisto"}
                name={"genderless"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class MajorIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"material-community"}
                name={"school"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class BirthdayCakeIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;
        return (
            <Icon
                type={"font-awesome"}
                name={"birthday-cake"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class NumericIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress, number} = this.props;

        return (
            <Icon
                type={"material-community"}
                name={`numeric-${number}-circle`}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class CircleIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;

        return (
            <Icon
                type={"material-community"}
                name={"circle"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class EyeIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;

        return (
            <Icon
                type={"material-community"}
                name={"eye"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
class EyeOffIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;

        return (
            <Icon
                type={"material-community"}
                name={"eye-off"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}

class CheckIconReversed extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props;

        return (
            <Icon
                type={"material-community"}
                name={"checkbox-marked-circle"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
                {...this.props}
            />)
    }
}
export {
    // Configure the magic constant here
    SearchIcon,
    PlusIcon,
    TaxiIcon,
    ShoppingBagIcon,
    FoodIcon,
    MultiUserIcon,
    CalendarIcon,
    ArrowLeftIcon,
    ArrowDownIcon,
    UserIcon,
    MessageIcon,
    LockIcon,
    GreaterIcon,
    PencilIcon,
    CloseIcon,
    CommentIcon,
    EmojiIcon,
    LeftUpArrowIcon,
    CaretRightIcon,
    ReplyIcon,
    SettingIcon,
    MessageOneToOneIcon,
    ChevronIcon,
    CameraIcon,
    DeleteIcon,
    EllipsisIcon,
    PaperPlaneIcon,
    EditIcon,
    CheckIcon,
    CheckIconReversed,
    DotIcon,
    ClockIcon,
    CarIcon,
    LocationIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ImageIcon,
    MultiCommentIcon,
    GenderFemaleIcon,
    GenderMaleIcon,
    GenderSecretIcon,
    MajorIcon,
    BirthdayCakeIcon,
    NumericIcon,
    CircleIcon,
    EyeIcon,
    EyeOffIcon,
}
