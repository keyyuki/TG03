import React, {Component} from 'react';
import { connect } from 'react-redux';
import {View, TextInput, TouchableWithoutFeedback} from 'react-native';
import {ListItem, CheckBox, Input, Button, Icon, Text} from 'native-base';
import {eventAddCheckListItem, eventUpdateChecklistItem, eventDeleteChecklistItem} from '../../../actions'


class ChecklistBox extends Component{
    _onClickDeleteItem(key){
        this.props.deleteChecklistItem(key)
    }
    _onUpdateItemText(item, text){
        this.props.updateChecklistItem(item.key, text, item.checked)
    }
    _onUpdateItemChecked(item, checked){
        this.props.updateChecklistItem(item.key, item.text, checked)
    }
    _renderChecklistItem() {
        let result = [];
        if(this.props.checkListItems && this.props.checkListItems.length){
            this.props.checkListItems.map((item, i) => {
                result.push(
                    <ListItem key={item.key} style={{paddingVertical:5}}>
                        <CheckBox checked={item.checked} onPress={() => {this._onUpdateItemChecked(item, !item.checked)}}/>
                        <Input
                            style={{ borderColor: 'gray', borderWidth: 0}}
                            placeholder="Nhập vào đây" placeholderTextColor="darkgrey"
                            value={item.text}
                            onChangeText={(text) => {this._onUpdateItemText(item, text)}}
                        />
                        <Button transparent onPress={() => this._onClickDeleteItem(item.key)}><Icon style={{color:'red'}} name="ios-close-circle-outline"/></Button>
                    </ListItem>
                )
            })
        } else {
            result.push(
                <ListItem key="checklist-item-0" style={{paddingVertical:5}}>
                    <CheckBox checked={false} />
                    <Input
                        style={{ borderColor: 'gray', borderWidth: 0}}
                        placeholder="Nhập vào đây" placeholderTextColor="darkgrey"
                    />
                    <Button transparent onPress={() => {}}><Icon style={{color:'red'}} name="ios-close-circle-outline"/></Button>
                </ListItem>
            )
        }
        return result;
    }
    render(){
        return (
            <View>

                {this._renderChecklistItem()}
                
                <ListItem style={{borderBottomWidth:0}} onPress={() => this.props.addChecklistItem()}>
                    <Icon style={{marginLeft:40, marginRight:10, color:'gray'}} size={14} name="ios-add-outline" />
                    <Text style={{fontSize:14, color:'gray', fontWeight:'bold'}}>Thêm mới</Text>
                </ListItem>
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        checkListItems: state.event.checklist
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addChecklistItem: () => {
            dispatch(eventAddCheckListItem())
        },
        updateChecklistItem: (key, text, checked) => {
            dispatch(eventUpdateChecklistItem(key, text, checked))
        },
        deleteChecklistItem: (key) => {
            dispatch(eventDeleteChecklistItem(key))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChecklistBox)