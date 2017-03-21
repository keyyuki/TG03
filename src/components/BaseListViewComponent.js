import React, {
    Component
} from 'react';
import {
    ListView,
    Dimensions
} from 'react-native'

export default class BaseListViewComponent extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        var canLoadMore = true
        var isLoadingMore = false
        this.state = {
            dataSource: ds.cloneWithRows([])
        };
        this.onScroll = this.onScroll.bind(this)
        this.getListItems = this.getListItems.bind(this)
        this.handleGetItemsDone = this.handleGetItemsDone(this)
        this.handleGetItemsError = this.handleGetItemsError.bind(this)
        this.loadMoreItems = this.loadMoreItems.bind(this)
    }

    getListItems(offset: number) {

    }

    handleGetItemsDone(list, startIndex: number) {
        if (list.length == 0) {
            this.canLoadMore = false;
        } else {

            for (var i = 0; i < list.length; i++) {
                this.listItems.push(list[i]);
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.listItems)
            });
            this.isLoadingMore = false;
        }
    }

    handleGetItemsError(error) {
        this.isLoadingMore = false;
        Alert.alert('Alert', 'Error ' + error.toString(), [{
            text: 'OK'
        }])
    }

    loadMoreItems() {
        if (this.isLoadingMore) return;
        if (this.listItems.length == 0) return;
        this.isLoadingMore = true;
        this.getListItems(this.listItems.length);
    }

    onScroll(e) {
        var windowHeight = Dimensions.get('window').height,
            height = e.nativeEvent.contentSize.height,
            offset = e.nativeEvent.contentOffset.y;
        if (windowHeight + offset > height + 30) {
            this.loadMoreItems();
        }
    }
}