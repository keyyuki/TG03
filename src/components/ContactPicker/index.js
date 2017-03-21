import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, Dimensions, Modal, TouchableOpacity, Text, ScrollView} from 'react-native';
import {InputGroup, Icon, Input, List, ListItem, Button, Card, Header, Title} from 'native-base';
import { ListView } from 'realm/react-native';
import Styles from './style';

import ContactModel from '../../model/ContactModel'

export default class ContactPicker extends Component{
    static propTypes = {
        isOpen: React.PropTypes.bool,
        onCancel: React.PropTypes.func,
        onSelect: React.PropTypes.func,
        selectedItems: React.PropTypes.array,
    }

    constructor(props){
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {
            query: '',
            selectedItems: this.props.selectedItems ? this.props.selectedItems : [],
            prepairDeleteItems: [],
            isLoadingData: true,
            dataSource: ds.cloneWithRows([]),
            mainSource: [],
            totalLoaded: 0,
            isLoading: false
        }

    }

    async loadData(){
        return ContactModel.fetchAll();
    }
    async updateContactList(){
        return ContactModel.sync()
    }

    loadContactToDataSource(){
        if(this.state.isLoading){
            return null;
        }
        if(this.state.totalLoaded >= this.state.mainSource.length){
            return null;
        }
        this.setState({
            isLoading: true
        })
        var dataSource = this.state.mainSource.slice(0, this.state.totalLoaded + 15)
        
        this.setState({
            dataSource : this.state.dataSource.cloneWithRows(dataSource),
            totalLoaded: this.state.totalLoaded + 15,
            isLoading: false
        })
    }

    componentDidMount(){
       
        this.loadData().then(listContact => {
            this.setState({
                
                mainSource: listContact
            });
        
            this.loadContactToDataSource();
            if(!listContact.length){
                this.updateContactList().then(response => {}).done()
            }
        }).done()
        
    }
   
    
    onSearch(q = ''){
        q = q.toLowerCase().trim()
        if(q){
            var query = 'searchString CONTAINS "' + q + '"';
            var src = ContactModel.fetchAll(query)
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(src),
                query: q,
                mainSource: src
            })
        } else {
            var src = ContactModel.fetchAll()
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(src),
                query: '',
                mainSource: src
            })
        }
    }
    _onClickBack(){
        this.props.onCancel();
        this.setState({
            selectedItems: this.props.selectedItems,
            prepairDeleteItems: []
        })
    }
    _onClickSelect(){
        this.props.onSelect( this.state.selectedItems.slice(0) )
        this.setState({
            ...this.state,
            prepairDeleteItems: []
        })
    }
    _onSelect(item){
        var index = this.state.selectedItems.findIndex((i) => {return i.id == item.id})
        if(index != -1){
            var selectedItems = this.state.selectedItems;
            var prepairDeleteItems = this.state.prepairDeleteItems;
            
            selectedItems.splice(index, 1)
            
            // xóa cả ở prepair
            if(this.state.prepairDeleteItems.length){
                var indexPrepair = this.state.prepairDeleteItems.findIndex((i) => {return i.id == item.id})
                prepairDeleteItems.splice(indexPrepair, 1);
            }
            
            this.setState({
                ...this.state,
                selectedItems: selectedItems,
                prepairDeleteItems: prepairDeleteItems
            });
        } else {
            var selectedItems = this.state.selectedItems;
            selectedItems.push(item)
            this.setState({...this.state, selectedItems: selectedItems});
        }

        
    }

    onTagClick(item){
        var selectedIndex = this.state.selectedItems.findIndex((i) => {return i.id == item.id});
        var prepairIndex = this.state.prepairDeleteItems.findIndex((i) => {return i.id == item.id});
        var prepairDeleteItems = this.state.prepairDeleteItems;
        var selectedItems = this.state.selectedItems;

        if(prepairIndex == -1){
            prepairDeleteItems.push(item)
        } else {
            prepairDeleteItems.splice(prepairIndex, 1);
            selectedItems.splice(selectedIndex, 1);
        }
        this.setState({
            selectedItems: selectedItems,
            prepairDeleteItems: prepairDeleteItems
        });
    }

    renderListItem(item) {
       
        /*var isSelected = false;
        if(this.state.selectedItems.find((i) => {return i.id == item.id}) != undefined){
            isSelected = true;
        }
        if(!isSelected){*/
            return (
                <ListItem key={'listItem_' + item.id} iconLeft onPress={() => {this._onSelect(item)}}>
                    <Icon name="md-person"/>
                    <Text style={{marginLeft:10}}>{ContactModel.getDisplayName(item)}</Text>
                </ListItem>
            )
        /*} else {
            return (
                <ListItem key={'listItem_' + item.id} iconLeft onPress={() => {this._onSelect(item)}}>
                    <Icon name="md-person"/>
                    <Text style={{marginLeft:10, color:'#41f925'}}>{ContactModel.getDisplayName(item)}</Text>
                    <Text note><Icon name="md-checkmark" style={{fontSize:18, color:"#41f925"}}/></Text>
                </ListItem>
            )
        }*/
        
    }

    renderTag(){
        if(!this.state.selectedItems.length){
            return null
        }
        return (
            <ListItem>
                <View style={Styles.tagContainer}>
                    {
                        this.state.selectedItems.map(item => {
                            var isPrepairDelete = false;
                            if(this.state.prepairDeleteItems.find((i) => {return i.id == item.id}) != undefined){
                                isPrepairDelete = true;
                            }
                            return (
                                <TouchableOpacity key={'tag_' + item.id} style={[Styles.tag, isPrepairDelete ? Styles.tagDeleting : {}]} onPress={() => this.onTagClick(item)}>
                                    <Text style={{color: isPrepairDelete ? "red" : 'black'}}>
                                        {ContactModel.getDisplayName(item)} 
                                    </Text>
                                    
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </ListItem>
        )

        
    }
    
    render(){
        return (
            <Modal
                backdrop={false}
                ref={(c) => { this._modal = c; }}
                swipeToClose={false}
                onRequestClose={() => {}}
                visible={this.props.isOpen}
            >
                <View style={Styles.container}>
                    <Header style={{backgroundColor:'#ff5722'}}>
                        <Button transparent onPress={() => {this._onClickBack()}}>
                            <Icon name="md-arrow-back" />
                        </Button>

                        <Title>Thêm người</Title>
                        <Button transparent onPress={() => {this._onClickSelect()}}>
                            <Icon name='md-checkmark' style={{
                                color: 'white'
                            }}/>
                        </Button>
                    </Header>
                    <List>
                            
                        <ListItem style={{marginTop:10}}>
                            <InputGroup iconLeft>
                                <Icon name="md-search" style={{ color: '#00C497' }} />
                                 
                                <Input placeholder="Tìm kiếm" value={this.state.query}  onChangeText={(text) => {this.onSearch(text)}}/>
                            </InputGroup>
                        </ListItem>
                        {this.renderTag()}
                        
                        <ListView
                            enableEmptySections={true}
                            dataSource={this.state.dataSource}
                            renderRow={(item) => this.renderListItem(item)}
                           
                            onEndReached={() =>{this.loadContactToDataSource()}}
                        />
                        
                        
                    </List>
                </View>
            </Modal>
        )
    }
}