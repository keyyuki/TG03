import {ListView} from 'react-native'
import format from '../etc/format';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
const initialState = {
    contactDetail: {
        contactId: null,
        contact: null,
        dataSource: ds.cloneWithRows([]),
        rawDataData: [],
        isLoading: false,
        isLoadingOverview: false,
        totalDuration: 0,
        totalEvent: 0,
        stars: {
            1 : 0,
            2 : 0,
            3 : 0,
            4 : 0,
            5 : 0,
        }
    }
}
const report = (state = initialState, action) => {
    switch (action.type) {
        case 'REPORT_CONTACTDETAIL_CHANGE_ID':
        console.log(action)
            return {
                ...state,
                contactDetail: {
                    contactId: action.id,
                    contact: action.contact,
                    dataSource: ds.cloneWithRows([]),
                    rawDataData: []
                }
            }
        case 'REPORT_CONTACTDETAIL_STARTLOADOVERVIEWDATA':
            return {
                    ...state,
                    contactDetail: {
                        ...state.contactDetail,
                        isLoadingOverview: true
                    }
                }
        case 'REPORT_CONTACTDETAIL_SETOVERVIEWDATA':
            return {
                ...state,
                contactDetail: {
                    ...state.contactDetail,
                    totalDuration: action.totalDuration,
                    totalEvent: action.totalEvent,
                    stars: {
                        ...state.contactDetail.stars,
                        ...action.stars
                    },
                    isLoadingOverview: false
                }
            }
        case 'REPORT_CONTACTDETAIL_STARTLOADDATA':
            return {
                ...state,
                contactDetail: {
                    ...state.contactDetail,
                    isLoading: true
                }
            }
        
        case 'REPORT_CONTACTDETAIL_ADDDATA': 
            var newData = state.contactDetail.rawDataData;
            if(action.data && action.data.length){
                action.data.forEach(item => {
                    newData.push(item)
                })
                newData = newData.filter((item, index, self) => {
                    return self.findIndex((element) => {return element.id == item.id}) == index
                })
            }
            return {
                ...state,
                contactDetail: {
                    ...state.contactDetail,
                    dataSource: ds.cloneWithRows(newData),
                    rawDataData: newData,
                    isLoading: false
                }
            }
        case 'REPORT_CONTACTDETAIL_RESET':
            return {
                ...state,
                contactDetail: initialState.contactDetail
            }
        default: return state;
    }

}
export default report;