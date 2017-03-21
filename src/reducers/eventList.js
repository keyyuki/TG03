import Moment from 'moment'
import Realm from 'realm';
import {
    imageSchema,
    eventSchema, 
    eventRepeatSchema, 
    checklistItemSchema, 
    eventRepeatData, 
    contact, 
    contactInfor, 
    label
} from '../etc/tableSchema'
import vietnameseDayOfWeek from '../etc/vietnameseDayOfWeek';
import EventModel from '../model/EventModel';
import {ListView} from 'react-native';


let moment = new Moment();
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

let initialState = {
    date: moment.format('DD/MM/YYYY'),
    prevDate: null,
    forceUpdate: false,
    isLoading: false,
    dataSource: ds.cloneWithRows([]),
    rawDataSource : []
}

const eventList = (state = initialState, action) => {
    switch(action.type){
        case 'EL_SET_DATE':
            return {
                ...state,
                date: action.date,
                isLoading: false,
                dataSource: state.dataSource.cloneWithRows([]),
                rawDataSource: []
            }
        case 'EL_PREPAIR_FETCH':
            return {
                ...state,
                forceUpdate: false,
                isLoading: true
            }
        case 'EL_SET_DATASOURCE':
            if(state.date != action.date){
                return state;
            }
            var ds = state.dataSource.cloneWithRows(action.dataSource);
            return {
                ...state,
                dataSource: ds,
                rawDataSource: action.dataSource
            }
        
        default:
            return state;
    }

}
export default eventList;