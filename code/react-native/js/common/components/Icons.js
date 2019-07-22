import React from "react";
import { Icon } from "react-native-elements";

class SearchIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props
        return (
            <Icon
                type={"octicons"}
                name={"search"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
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
            />)
    }
}
class TaxiIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props
        return (
            <Icon
                type={"material-community"}
                name={"taxi"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
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
                name={"taxi"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
            />)
    }
}
class CalendarIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props
        return (
            <Icon
                type={"material-community"}
                name={"taxi"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
            />)
    }
}
class BackspaceIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props
        return (
            <Icon
                type={"material-community"}
                name={"keyboard-backspace"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
            />)
    }
}
class MessageIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props
        return (
            <Icon
                type={"material-community"}
                name={"message-text"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
            />)
    }
}
class UserIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props
        return (
            <Icon
                type={"fontawesome"}
                name={"user"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
            />)
    }
}
class LockIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props
        return (
            <Icon
                type={"fontisto"}
                name={"locked"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
            />)
    }
}
class GreaterIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props
        return (
            <Icon
                type={"entypo"}
                name={"chevron-thin-right"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
            />)
    }
}

class CloseIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }
    render() {
        let {size, color, style, onPress} = this.props
        return (
            <Icon
                type={"antdesign"}
                name={"close"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
            />)
    }
}

class CommentIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }

    render() {
        let {size, color, style, onPress} = this.props
        return (
            <Icon
                type={"material"}
                name={"comment"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
            />)
    }
}

class EmojiIcon extends React.PureComponent{
    constructor(props) {
        super(props)
    }

    render() {
        let {size, color, style, onPress} = this.props
        return (
            <Icon
                type={"material"}
                name={"insert-emoticon"}
                color={color}
                size={size}
                containerStyle={style}
                onPress={onPress ? onPress : null}
            />)
    }
}
export {
    // Configure the magic constant here
    SearchIcon,
    PlusIcon,
    TaxiIcon,
    FoodIcon,
    CalendarIcon,
    BackspaceIcon,
    UserIcon,
    MessageIcon,
    LockIcon,
    GreaterIcon,
    CloseIcon,
    CommentIcon,
    EmojiIcon,
}
