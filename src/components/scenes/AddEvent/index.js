import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    toggleMenu1, 
    openAddEventMenuBottom, 
    closeAddEventMenuBottom, 
    changeNavigation,
    eventUpdateContent,
    eventSave,
    eventListFetchData,
    eventSetMember,
    eventListSetDate
} from '../../../actions'
import ReactNative,
{
    View,
    Text,
    TextInput,
    ScrollView,
    Platform,
    Dimensions,
    TouchableHighlight,
    TouchableWithoutFeedback
} from 'react-native';
import {
    Container,
    Title,
    Content,
    Footer,
    Header,
    FooterTab,
    Button,
    Icon,
    Left,
    Item,
    Input,
} from 'native-base';
import styles from './style';
import Swiper from './Swiper'
import Slidebox from './Slidebox';
import ChecklistBox from './ChecklistBox';
import ContactPicker from '../../ContactPicker'
import Moment from 'moment'
import ContactModel from '../../../model/ContactModel'
import theme from '../../../theme'

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class AddEvent extends Component{
    constructor(props){
        super(props);
        this.state = {
            contentInputHeight: 0,
            showMenu1: false,
            showContactPicker: false
        }
        this.menuBottom1Actived = false;
        this.menuBottom2Actived = false;
        if(this.props.menuBottom.isOpen){
            if(this.props.menuBottom.menuType == 'menu1'){
                this.menuBottom1Actived = true;
                this.menuBottom2Actived = false;
            } else {
                this.menuBottom1Actived = false;
                this.menuBottom2Actived = true;
            }
        }
        this.closeMenuBottom = this.props.closeMenuBottom.bind(this);
        this.openMenuBottom = this.props.openMenuBottom.bind(this);
    }

    _onClickFooterMenuButton1(){

        if(this.props.menuBottom.isOpen && this.props.menuBottom.menuType == 'menu1'){
            this.closeMenuBottom()
        } else {
            this.openMenuBottom('menu1')
        }
    }

    _onClickFooterMenuButton2(){
        if(this.props.menuBottom.isOpen && this.props.menuBottom.menuType == 'menu2'){
            this.closeMenuBottom()
        } else {
            this.openMenuBottom('menu2')
        }
    }
    _onClickSelectDateTimeButton(){
        this.props.changeNavigation('push', {key:'add-event-pick-datetime'})
    }
    _onClickSelectImageButton(){
        ImagePicker.openPicker({
            multiple: true
        }).then(images => {
            let arr = [];
            images.map((item, i) => {
                arr.push({
                    uri: item.path,
                    name: item.path,
                    number: i+1
                })
            })

            
        
        }).catch(e => alert(e));
    }
    _displayDuration(duration){
        let hour = Math.floor(duration / 60);
        let minute = duration % 60;
        let result = '';
        if(hour){
            result += hour.toString() + ' giờ ';
        }
        if(minute){
            result += minute.toString() +' phút'
        }
        return result;
    }
    _renderRepeat(){
        
        if(this.props.repeat){
            let result = '';
            let repeat = this.props.repeat;
            switch(repeat.type){
                case 'none':
                    return 'null';
                case 'ED':
                    result = 'Hàng ngày';
                    break;
                case 'EW':
                    result = 'Hàng tuần';
                    break;
                case 'WD1':
                    result = 'Thứ 2,3,4,5,6 hàng tuần';
                    break;
                case 'WD2':
                    result = 'Thứ 2,3,4,5,6,7 hàng tuần';
                    break;
                case 'EM':
                    result = 'Hàng tháng';
                    break;
                case 'CUSTOM':
                    result = this._getCustomRepeatCalendarDescription();
                    break;
                default:
                    return null
            }
            return (
                <View style={{flexDirection:'row', paddingHorizontal:10}}>
                    <TouchableWithoutFeedback onPress={() => this._onClickSelectDateTimeButton()}>
                        <View style={[styles.additionalItem, {flex: -1, flexDirection:'column'}]}>
                            <Text>
                                <Icon name="ios-refresh" style={{fontSize: 16}}/>&nbsp;
                                <Text style={{marginLeft:10}}>{result}</Text>
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )
        }
    }
    _getCustomRepeatCalendarDescription(){
        let result = '';
        
        if(this.props.repeat && this.props.repeat.data){
            let mapDayOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            result = 'Mỗi '
            let arr =[]
            this.props.repeat.data.dayOfWeek.map((index) => {
                arr.push(mapDayOfWeek[index])
            })
            result += arr.join(', ');
            if(this.props.repeat.data.endDate){
                result += ' kéo dài đến ' + this.props.repeat.endDate
            }
        }
        return result;
    }
    _renderMainInput(){
        if(this.props.inputMode == 'checklist'){
            return (
                <ChecklistBox />
            )
        }
        if(this.props.inputMode == 'note'){
            return (
                <TextInput placeholder="Nhập nội dung sự kiện" ref="myInput"
                    multiline={true}
                    underlineColorAndroid="transparent"
                    onChange={(event) => {
                        if(event.nativeEvent.contentSize.height != this.state.contentInputHeight){
                            this.setState({
                                contentInputHeight: event.nativeEvent.contentSize.height,
                            })
                        }

                    }}
                    onChangeText={(text) => this.props.updateContent(text)}
                    style={[styles.contentInput, {
                        height: Math.max(180, this.state.contentInputHeight),

                    }]}
                    autoCorrect={false}
                    value={this.props.content}
                />
            )
        }
    }
    _onClickChangeNextCalendarButton(){
        this.props.changeNavigation('push', {key:'add-event-add-calendar'})
        
    }
    _renderNextCalendar(){
        if(this.props.nextEvent){
             let result = this.props.nextEvent.date;
             if(this.props.nextEvent.time){
                 result += ' ' + this.props.nextEvent.time
             }
             return (
                <View style={{flexDirection:'row', paddingHorizontal:10}}>
                    <TouchableWithoutFeedback onPress={() => this._onClickChangeNextCalendarButton()}>
                        <View style={[styles.additionalItem, {flex: -1, flexDirection:'column'}]}>
                            <Text>
                                <Icon name="md-calendar" style={{fontSize: 16}}/>&nbsp;
                                <Text style={{marginLeft:10}}>{result}</Text>
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )
        }
    }
    _renderMember(){

        if(this.props.members.length){
            var names = [];
            this.props.members.map(contact => {
                names.push(ContactModel.getDisplayName(contact));

            })
            return (
                <View style={{flexDirection:'row', paddingHorizontal:10}}>
                    <TouchableWithoutFeedback onPress={() => {this.setState({showContactPicker: true})}}>
                        <View style={[styles.additionalItem, {flex: -1, flexDirection:'column'}]}>
                        <Text>
                            <Icon name="md-person" style={{fontSize: 16}}/>&nbsp;
                            <Text style={{marginLeft:10}}>{names.join(', ')}</Text>
                        </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )
            
        }
        return null;
    }
    _onSave(){
        this.props.save();
        this.props.changeNavigation('pop');
        
        this.props.eventListFetchData(this.props.date);
    }
    render(){
        let moment = Moment.unix(this.props.startTimeStamp)
        let timeDisplay = moment.format('hh:mm A DD/MM/YY');
        if(this.props.duration){
            timeDisplay += ' Kéo dài: ' + this._displayDuration(this.props.duration) ;
        }
        
        return (
            <Container>

                <Header style={{backgroundColor:theme.mainColor}}>
                    <Title>Thêm mới</Title>
                    <Button transparent onPress={() => this.props.changeNavigation('pop')}>
                        <Icon name='md-arrow-back' style={{
                            color: 'white'
                        }}/>
                    </Button>
                    <Button transparent onPress={() => {
                        this._onSave()
                        }}> 
                        <Icon name='md-checkmark' style={{
                            color: 'white'
                        }}/>
                    </Button>
                </Header>
                <View style={{flex:1}}>
                    <Swiper />
                    <ScrollView
                        ref="scrollView"
                        //onContentSizeChange={(width,height) => this.refs.scrollView.scrollTo({y:height})}
                        style={[styles.content]}>
                            
                            {this._renderMainInput()}
                            
                            <View style={{flexDirection:'row', paddingHorizontal:10}}>
                                <TouchableWithoutFeedback onPress={() => this._onClickSelectDateTimeButton()}>
                                    <View style={[styles.additionalItem, {flex: -1, flexDirection:'column'}]}>
                                        <Text>
                                            <Icon name="ios-clock-outline" style={{fontSize: 16}}/>&nbsp;
                                            <Text style={{marginLeft:10}}>{timeDisplay}</Text>
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            {this._renderRepeat()}
                            {this._renderMember()}
                            {this._renderNextCalendar()}
                    </ScrollView>
                    <Slidebox 
                        openContactPicker={() => {this.setState({showContactPicker: true})}}
                    />
                    <ContactPicker 
                        isOpen={this.state.showContactPicker}
                        onCancel={() => {this.setState({showContactPicker: false})}}
                        onSelect={(selectedItems) => {
                            
                            this.setState({showContactPicker: false})
                            this.props.setMember(selectedItems)
                        }}
                        selectedItems={this.props.members}
                    />
                    
                </View>
                <Footer style={{
                    elevation:6,
                    backgroundColor: '#b0bec5'
                }}>
                    <Button active={this.menuBottom1Actived} transparent vertical
                        style={{paddingHorizontal:10}}
                        onPress={()=>this._onClickFooterMenuButton1()}>
                      <Icon name="md-add"/>
                    </Button>
                    <Text>welcome</Text>
                    <Button active={this.menuBottom2Actived} transparent vertical
                        style={{paddingHorizontal:10}}
                        onPress={()=>this._onClickFooterMenuButton2()}>
                      <Icon name="ios-more" />
                    </Button>
                </Footer>
            </Container>
        )
    }


}
const mapStateToProps = state => {
    return {
        menuBottom: state.event.menuBottom,
        menuType: state.event.menuType,
        menuShow: state.event.menuBottom.isOpen,
        date: state.event.date,
        startTimeStamp: state.event.startTimeStamp,
        duration: state.event.duration,
        content: state.event.content,
        repeat: state.event.repeat,
        inputMode: state.event.inputMode,
        nextEvent: state.event.nextEvent,
        members: state.event.members
    }
}
const mapDispatchToProps = dispatch => {
    return {
        toggleMenu1 : () => {dispatch(toggleMenu1())},
        openMenuBottom : menuType => dispatch(openAddEventMenuBottom(menuType)),
        closeMenuBottom: () => {dispatch(closeAddEventMenuBottom())},
        changeNavigation: (changeType, route) => {dispatch(changeNavigation(changeType, route))},
        updateContent : (content) => {dispatch(eventUpdateContent(content))},
        save: () => {dispatch(eventSave())},
        eventListFetchData: (date) => {
            dispatch(eventListSetDate(date))
            dispatch(eventListFetchData(date))
        },
        setMember: (contacts) => {dispatch(eventSetMember(contacts))}
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AddEvent)
