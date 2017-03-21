import Moment from 'moment';


let moment = new Moment()
export const addEventContent = () => {
    return {
        type: 'ADD_EVENT_CONTENT',
        text: '',
        id: ''
    }
}

export const addEventDate = () => {
    return  {
        type: 'ADD_EVENT_DATE',
        date: moment.format('YYYY-MM-DD'),
        id: ''
    }

}

export const closeDrawer = () => {
    return {
        type: 'CLOSE_DRAWER',
    }
}
export const openDrawer = () => {
    return {
        type: 'OPEN_DRAWER',
    }
}
export const changeNavigation = (changeType, route='home') => {
    return {
        type: 'NAV_CHANGE',
        changeType: changeType,
        route: route
    }
}

export const closeAddEventMenuBottom = () => {
    return {
        type: 'ADD_EVENT_CLOSE_MENU_BOTTOM',
    }
}
export const openAddEventMenuBottom = (menuType) => {
    return {
        type: 'ADD_EVENT_OPEN_MENU_BOTTOM',
        menuType: menuType
    }
}
export const eventChangeTime = (id, date, startTimeStamp, endTimeStamp, duration, repeat=null) => {
    return {
        type: 'EVENT_CHANGE_TIME',
        id: id,
        date: date,
        startTimeStamp: startTimeStamp,
        endTimeStamp: endTimeStamp,
        duration: duration,
        repeat: repeat
    }
}
export const eventSetNext = (date, time) => {
    return {
        type: 'EVENT_SET_NEXT_MEETING',
        date: date,
        time: time
    }
}
export const eventAddImages = (images) => {
    return {
        type: 'EVENT_ADD_IMAGES',
        images: images
    }
}
export const eventDeleteImage = (uri) => {
    return {
        type: 'EVENT_DELETE_IMAGE',
        uri: uri
    }
}
export const eventAddCheckListItem = () => {
    return {
        type: 'EVENT_ADD_CHECKLIST_ITEM'
    }
}
export const eventUpdateChecklistItem = (key, text, checked) => {
    return {
        type: 'EVENT_UPDATE_CHECKLIST_ITEM',
        key: key,
        text: text,
        checked: checked
    }
}
export const eventDeleteChecklistItem = (key) => {
    return {
        type: 'EVENT_DELETE_CHECKLIST_ITEM',
        key: key,
    }
}
export const eventChangeInputMode = (inputMode) => {
    return {
        type: 'EVENT_CHANGE_INPUT_MODE',
        inputMode: inputMode
    }
}
export const eventUpdateContent = (content) => {
    return {
        type: 'EVENT_UPDATE_CONTENT',
        content: content
    }
}
export const eventSetMember = (contacts) => {
    return {
        type: 'EVENT_SET_MEMBER',
        contacts: contacts
    }
}
export const eventSave = () => {
    return {
        type: 'EVENT_SAVE'
    }
}
export const eventUpdateRating = (id, rating, date) => {
    return {
        type: 'EVENT_UPDATE_RATING',
        id: id,
        rating: rating,
        date: date
    }
}
export const eventUpdateCheckedChecklistItem = (realmObject, checked) => {
    return {
        type: 'EVENT_UPDATE_CHECKED_CHECKLISTITEM',
        realmObject: realmObject,
        checked: checked
    }
}

//================ EVENT_LIST=============
export const eventListSetDate = (date) => {
    var moment =  new Moment(date, ['DD/MM/YYYY', 'YYYY-MM-DD', 'YYYYMMDD'])
    return {
        type: 'EL_SET_DATE',
        date: moment.format('DD/MM/YYYY')
    }
}
export const eventListPrepairFetch = () => {
    // set forceUpdate = false, isLoading = true
    return {
        type: 'EL_PREPAIR_FETCH'
    }
}
export const eventListSetDataSouce = (date, dataSource) => {
    return {
        type: 'EL_SET_DATASOURCE',
        date: date,
        dataSource: dataSource
    }
}

function EL_shouldFetchData(state, date){
    if(state.eventList.forceUpdate){
        return true;
    }
    if(date != state.eventList.date){
        return false;
    }
    if(state.eventList.isLoading){
        return false;
    }
    return true;
}
async function EL_fetchData(date, dispath){
    try {
        var dataSource = await EventModel.getEventOfDay(date);
    } catch (error) {
        console.log(error);
    }
    
   
    return dataSource;
}
export const eventListFetchData = (inputDate) => {
    
    return (dispatch, getState) => {
        
        var moment =  new Moment(inputDate, ['DD/MM/YYYY', 'YYYY-MM-DD', 'YYYYMMDD'])
        var date = moment.format('DD/MM/YYYY');
         if(EL_shouldFetchData(getState(), date)){
            dispatch(eventListPrepairFetch())
            EL_fetchData(date).then(
                (response) => {dispatch(eventListSetDataSouce(date, response))}
            ).done()
         } else {
             return Promise.resolve()
         }
    }
}

