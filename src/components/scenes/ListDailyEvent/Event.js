import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, Text, ListView, Dimensions, TouchableOpacity} from 'react-native';
import { Container,H3, Header, Title, Content, Button, Icon, List, ListItem,Card,CardItem } from 'native-base';
import ImageGrid from '../../ImageGrid';
import {eventUpdateRating, eventUpdateCheckedChecklistItem} from '../../../actions';
import Text12 from './Text12';
import StarRating from 'react-native-star-rating'
import ContactModel from '../../../model/ContactModel'
import Moment from 'moment'
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class Event extends Component {

    constructor(props){
        super(props)
        var checklist = [];
        this.props.item.checklist.map(item => {
            checklist.push({...item} )
        })
       
        this.state = {
            rating: this.props.item.star,
            checklist: checklist
        }
        
        
    }

    onStarRatingPress(rating){
        
        this.setState({rating: rating});
        var date = new Moment(this.props.date, ['DD/MM/YYYY', 'YYYY-MM-DD', 'YYYYMMDD']);
        this.props.eventUpdateRating(this.props.item.id, rating, date);
        
    }
    onClickChecklistItem( key){
        
        var checklist = this.state.checklist;
        var checked = null
        var checklistItemIndex = null
        checklist.map((item, i) => {
            if(item.key == key){
                checked = !item.checked;
                checklist[i].checked = !item.checked
                
                checklistItemIndex = i;
            }
        });
        this.setState({checklist: checklist});

        if(checked !== null){
            this.props.eventUpdateCheckedChecklistItem(this.props.item.checklist[checklistItemIndex], checked);
        }
        
    }
    _renderContent(){
        if(this.props.item.inputMode == 'note'){
            return (
                <Text12>{this.props.item.content}</Text12>
            )
        }
        if(this.props.item.inputMode == 'checklist'){
            if(this.state.checklist){
                var arr = []
                this.state.checklist.map(item => {
                    arr.push(
                    <TouchableOpacity key={item.key} onPress={() => {this.onClickChecklistItem(item.key)}}>
                        <Text12 style={{lineHeight:28,}}>
                            <Icon style={{fontSize:16}} name={ !item.checked ? 'ios-square-outline' : 'ios-checkbox-outline'}/><Text12>&nbsp;</Text12>
                            <Text12 style={{textDecorationLine: !item.checked ?'none': 'line-through', fontSize:13}}>{item.text}</Text12>
                        </Text12>
                    </TouchableOpacity >
                    )
                })
                return <View>{arr}</View>
            }
        }
        return null;
    }

    _getVietnameseDayOfWeekName(d){
        switch(parseInt(d)){
            case 0:
                return 'Chủ nhật';
            case 1:
                return 'Thứ hai';
            case 2:
                return 'Thứ ba';
            case 3:
                return 'Thứ tư';
            case 4:
                return 'Thứ năm';
            case 5:
                return 'Thứ sáu';
            case 6:
                return 'Thứ bảy';
           
        }
        return null;
    }


    _renderEtc(){
        var arr = []
        if(this.props.item.repeatType && this.props.item.repeatType != 'none'){
            arr.push(<Text12 key="repeatType" style={{fontWeight:"bold", }}>#Lặp lại {this.props.item.repeatDisplay}</Text12>)
        }
        if(this.props.item.nextEventDate){
            if(this.props.item.nextEventTime){
                var date = Moment(this.props.item.nextEventDate + ' ' + this.props.item.nextEventTime, 'YYYYMMDD hh:mm A')
                arr.push(<Text12 style={{fontWeight:"bold", }}>#Tiếp tục vào {this._getVietnameseDayOfWeekName(date.format('d'))} {date.format('DD/MM/YYYY hh:mm A')}</Text12>)
            } else {
                 var date = Moment(this.props.item.nextEventDate, 'YYYYMMDD')
                arr.push(<Text12 key="nextEventDate" style={{fontWeight:"bold", }}>#Tiếp tục vào {this._getVietnameseDayOfWeekName(date.format('d'))} {date.format('DD/MM/YYYY')}</Text12>)
            }

        }
        if(this.props.item.members.length){
            var names = [];
            this.props.item.members.map(contact => {
                names.push(ContactModel.getDisplayName(contact))
            });
            arr.push(<Text12 key="member" style={{fontWeight:"bold", }}>@{names.join(', @')}</Text12>)
        }
        if(arr.length){
            return (
            <View style={{marginTop:10}}> 
                {arr}
            </View>
            )
        }
        return null;
        
    }
    

    render(){
        var item = this.props.item
        var timeDisplay = item.startTime;
        if(item.endTime){
            timeDisplay += ' - ' + item.endTime
        }
        
        var images = [];
        this.props.item.images.map(image => {
            images.push(image);
        })

        return (
            <Card style={{width:deviceWidth-20, backgroundColor:"#f9fafa", marginTop:10, flex:-1 }}>
                <CardItem style={{paddingVertical:5}}>
                    
                    <Text12 style={{ fontWeight:"bold", color:"black"}}>{timeDisplay}</Text12>
                    <Text12 style={{ color:"gray"}}>{item.duration ? item.duration : ''}</Text12>
                </CardItem>

                <CardItem style={{backgroundColor:"#f9fafc"}}>
                    <ImageGrid dataSource={images} style={{marginBottom:10, width:deviceWidth-24}}/>
                    {this._renderContent()}
                    {this._renderEtc()}
                </CardItem>
                <CardItem header>
                    <StarRating 
                        disabled={false}
                        maxStars={5}
                        rating={this.state.rating}
                        starSize={28}
                        iconSet='Ionicons'
                        emptyStar="md-star-outline"
                        fullStar="md-star"
                        starColor="gold"
                        emptyStarColor="gray"
                        selectedStar={(rating) => {this.onStarRatingPress(rating)}}
                    />
                </CardItem>
            </Card>
        )
        
    }
}
Event.propTypes = {
    item: React.PropTypes.object

}
const mapStateToProps = (state, ownProps) => {
    return {
        date: state.eventList.date
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        eventUpdateCheckedChecklistItem: (realmObject, checked) => {
            dispatch(eventUpdateCheckedChecklistItem(realmObject, checked))
        },
        eventUpdateRating: (id, rating, date) => {
            dispatch(eventUpdateRating(id, rating, date))
        }

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Event)