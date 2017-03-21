import React, {Component} from 'react';
import {Animated, Easing, Text, Dimensions, View, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { connect } from 'react-redux';
import {  Content, ListItem, Icon, List } from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import {closeAddEventMenuBottom, changeNavigation, eventAddImages, eventDeleteImage, eventChangeInputMode} from '../../../actions';
import styles from './style'
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class SlidingBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            slidingAnimationValue: new Animated.Value(0),
            show: this.props.show,

        }
    }
    componentDidUpdate() {
        this.changeAppear();

    }
    menuHeight = 0

    changeAppear() {
        if(this.props.show){
            Keyboard.dismiss()
        }
        const animationConfig = {
            duration: 200,
            delay: 0,
            easing: Easing.in(Easing.ease)
        }
        const value = this.state.slidingAnimationValue;
        if(this.props.show){
            this.state.slidingAnimationValue.setValue(0)
        } else {
            this.state.slidingAnimationValue.setValue(1)
        }
        const slidingInAnimation = Animated.timing(this.state.slidingAnimationValue, {
            ...animationConfig, // ES6 spread operator
            toValue: this.props.show ? 1 : 0
        }).start();

    }
    _onClickChangeDateTimeButton(){
        this.props.changeNavigation('push', {key:'add-event-pick-datetime'})
        this.props.closeBox()
    }
    _onClickAddNextCalendarButton(){
        this.props.changeNavigation('push', {key:'add-event-add-calendar'})
        this.props.closeBox()
    }
    _closeBox() {
        this.props.closeBox()
    }
     _onClickSelectImageButton(){
        ImagePicker.openPicker({
            multiple: true
        }).then(images => {
            let arr = [];
            images.map((item, i) => {
                arr.push({
                    uri: item.path,
                    name: this.getFileName(item.path),
                    
                })
            });

            this.props.addImages(arr)
            this.props.closeBox()
        
        }).catch(e => alert(e));
    }
    getFileName(str){
        return str.split('\\').pop().split('/').pop();
    }

    _onClickTakePhoto(){
        ImagePicker.openCamera({
           
            width: 500,
            height: 500,
        }).then(image => {
           
            this.props.addImages([{
                uri: image.path,
                name: this.getFileName(image.path),
            }])
            this.props.closeBox()
        }).catch(e => alert(e));
    }
    _renderMenu() {
        if(this.props.menuType == 'menu1'){
            return this._renderMenu1();
        }
        if(this.props.menuType == 'menu2'){
            return this._renderMenu2();
        }
    }
    _renderInputMode(){
            if(this.props.inputMode == 'checklist'){
                return (
                    <ListItem iconLeft onPress={() => {
                        this.props.changeInputMode('note')
                        this.props.closeBox()
                        }}>
                        <Icon name="md-create" style={{  marginRight:10 }} />
                        <Text>Chuyển thành ghi chú</Text>
                    </ListItem>
                )
            }
            if(this.props.inputMode == 'note'){
                return (
                    <ListItem iconLeft onPress={() => {
                        this.props.changeInputMode('checklist')
                        this.props.closeBox()
                        }}>
                        <Icon name="ios-list-box-outline" style={{  marginRight:10 }} />
                        <Text>Chuyển thành checklist</Text>
                    </ListItem>
                )
            }
    }
    _renderMenu1(){
        return (
            <List>
                <ListItem iconLeft onPress={() => this._onClickTakePhoto()}>
                  <Icon name="ios-camera-outline" style={{  marginRight:10 }} />
                  <Text>Chụp ảnh</Text>
                </ListItem>
                <ListItem iconLeft onPress={() => this._onClickSelectImageButton()}>
                  <Icon name="ios-image-outline" style={{  marginRight:10 }} />
                  <Text>Đính kèm ảnh</Text>
                </ListItem>
                {
                    this._renderInputMode()
                }
                
                <ListItem iconLeft onPress={() => this._onClickAddNextCalendarButton()}>
                  <Icon name="ios-calendar-outline" style={{  marginRight:10 }} />
                  <Text>Đặt lịch hẹn lần sau</Text>
                </ListItem>
            </List>
        )
    }
    _renderMenu2() {
        return (<List>
            <ListItem iconLeft>
              <Icon name="ios-trash-outline" style={{ marginRight:10 }} />
              <Text>Xóa</Text>
            </ListItem>
            <ListItem iconLeft>
              <Icon name="ios-pricetag-outline" style={{  marginRight:10 }} />
              <Text>Gắn thẻ</Text>
            </ListItem>
            <ListItem iconLeft
                onPress={() => {
                    this.props.openContactPicker();
                    this.props.closeBox()
                }}
            >
              <Icon name="md-person-add" style={{  marginRight:10 }} />
              <Text>Thêm người tham dự</Text>
            </ListItem>

            <ListItem iconLeft onPress={() => this._onClickChangeDateTimeButton()}>
              <Icon name="ios-clock-outline" style={{ marginRight:10 }} />
              <Text>Sửa giờ</Text>
            </ListItem>
            <ListItem iconLeft>
              <Icon name="ios-star-outline" style={{  marginRight:10 }} />
              <Text>Đánh giá</Text>
            </ListItem>
        </List>)
    }
    _renderOverLay(){
        if(!this.props.show){
            return null
        }
        return (
            <View style={[styles.overlay, {
                elevation:  4 ,
                opacity: 1 ,
                }]}>
                <TouchableWithoutFeedback  onPress={()=>this.props.closeBox()}>
                    <View style={{flex:1,}}></View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
    render() {
        if(!this.props.show){
            return null;
        }
        // Get the initial transform style
        const slidingAnimationStyle = this.state.slidingAnimationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-500, 0]
        });
        return (
            <View>
                {/* this is overlay */}
                {this._renderOverLay()}
                {/* end overlay */}
                <Animated.View ref="menu" style={{
                    position: 'absolute',
                    backgroundColor:'#f9fafa',
                    bottom: slidingAnimationStyle,
                    elevation: this.props.show ? 5 : 0,
                    width:deviceWidth,
                }}>
                {this._renderMenu()}
                </Animated.View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        show: state.event.menuBottom.isOpen,
        menuType: state.event.menuBottom.menuType,
        inputMode: state.event.inputMode
    }
}
const mapDispatchToProps = dispatch => {
    return {
        closeBox : () => {dispatch(closeAddEventMenuBottom())},
        changeNavigation: (changeType, route) => {dispatch(changeNavigation(changeType, route))},
        addImages: (images) =>  {dispatch(eventAddImages(images))},
        changeInputMode: (inputMode) => {dispatch(eventChangeInputMode(inputMode))}
    }
}
export default connect(mapStateToProps, mapDispatchToProps) (SlidingBox);
