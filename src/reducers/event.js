import Moment from 'moment'
import update from 'react-addons-update';
import generateUUID from '../etc/generateUUID';
import Realm from 'realm';
import tableSchema from '../etc/tableSchema'
import EventModel from '../model/EventModel'

let moment = new Moment()
let initialState = {
    menuBottom: {
        isOpen: false,
        menuType: 'menu1'
    },
    content: '',
    id: '',
    date: moment.format('YYYY-MM-DD'),
    startTimeStamp: moment.unix(),
    endTimeStamp: null,
    duration: 0,
    repeat:null,
    nextEvent: null, // {date: DD/MM/YYYY, time: hh:mm A}
    images: [
    ],
    members: [
        // object contact
    ],
    checklist: [
        {
            text: '',
            checked: false,
            key: generateUUID()
        },
        
    ],
    inputMode: 'note'
}

let realm = new Realm({schema: [
    tableSchema.imageSchema,
    tableSchema.checklistItemSchema, 
    tableSchema.eventRepeatData, 
    tableSchema.eventMember,
    tableSchema.contact, 
    tableSchema.contactInfor, 
    tableSchema.label, 
    tableSchema.eventSchema, 
    tableSchema.eventRepeatSchema]});
const event = (state = initialState, action) => {
    console.log('action type', action.type)
    switch (action.type) {
        case 'ADD_EVENT_CONTENT':
            return Object.assign({}, {
                id: action.id,
                content: action.text
            })
        case 'ADD_EVENT_DATE':
            return Object.assign({},  {
                id: action.id,
                date: action.date
            });
        case 'ADD_EVENT_START_TIME':
            return Object.assign({},  {
                id: action.id,
                startTime: action.startTime
            });
        case 'ADD_EVENT_END_TIME':
            return Object.assign({},  {
                id: action.id,
                startTime: action.endTime
            });

        case 'ADD_EVENT_CLOSE_MENU_BOTTOM':
            return {
                ... state,
                menuBottom: {
                    isOpen: false
                }
            };
        case 'ADD_EVENT_OPEN_MENU_BOTTOM':
            return  {
                ...state,
                menuBottom: {
                    isOpen: true,
                    menuType: action.menuType
                },
                menuType: action.menuType
            };
        case 'EVENT_CHANGE_TIME':
            return {
                ...state,
                id: action.id,
                date: action.date,
                startTimeStamp: action.startTimeStamp,
                endTimeStamp: action.endTimeStamp,
                duration: action.duration,
                repeat: action.repeat
            }
        case 'EVENT_SET_NEXT_MEETING':
            return {
                ...state,
                nextEvent: {
                    date: action.date,
                    time: action.time
                }
            }
        case 'EVENT_ADD_IMAGES':
           
            let images = state.images;
            if(action.images && action.images.length){
                action.images.map((item) => {
                    // check duplicate
                    let isDuplicate = false;
                    images.map((itemCheck) => {
                        if(item.uri == itemCheck.uri){
                            isDuplicate = true;
                        }
                    })
                    // nếu ảnh ko bị duplicate thì mới đẩy vào
                    if(!isDuplicate){
                        
                        images.push(item)
                    }
                })
            }

            images.map((item, index) => {
                images[index].number = index + 1;
            });
           
            return {
                ...state,
                images: update([], {$push: images})
            }
        case 'EVENT_DELETE_IMAGE':
            
            images =  state.images;
            let index =  -1;
            images.map((item, i) => {
                if(item.uri == action.uri){
                    index = i
                }
            })
            if(index != -1){
                images.splice(index, 1);
            }
            images.map((item, i) => {
                images[i].number = i + 1;
            });
            return {
                ...state,
                images: update([], {$push: images})
            }
        case 'EVENT_ADD_CHECKLIST_ITEM':
            state.checklist.push({
                text: '',
                checked: false,
                key: generateUUID()
            })
            return {
                ...state,
                checklist: update([], {$push: state.checklist})
            }
        case 'EVENT_UPDATE_CHECKLIST_ITEM':
            state.checklist.map((item, i) => {
                if(action.key == item.key){
                    state.checklist[i].text = action.text;
                    state.checklist[i].checked = action.checked;
                }
            })
            return {
                ...state,
                checklist: update([], {$push: state.checklist})
            }
        case 'EVENT_DELETE_CHECKLIST_ITEM':
            let deleteItemIndex = -1;
            state.checklist.map((item, i) => {
                if(action.key == item.key){
                    deleteItemIndex = i 
                }
            })
            if(deleteItemIndex != -1){
                state.checklist.splice(deleteItemIndex, 1);
            }
            // nếu TH checklist trống, sẽ tự insert 1 checklist item rỗng vào
            if(!state.checklist.length){
                state.checklist.push({
                    text: '',
                    checked: false,
                    key: generateUUID()
                })
            }
            return {
                ...state,
                checklist: update([], {$push: state.checklist})
            }
        case 'EVENT_CHANGE_INPUT_MODE':
            
            if(action.inputMode == state.inputMode){
                return state;
            }
            // chuyển sang dạng checklist thì lấy mỗi dòng trong content thành check lít
            if(action.inputMode == 'checklist'){
                let arr = state.content.split("\n");
                let checklist = []
                arr.map(text => {
                    if(text.trim()){
                        checklist.push({
                            text: text.trim(),
                            checked: false,
                            key: generateUUID()
                        })
                    }
                })
                if(!checklist.length){
                    
                    checklist.push({
                        text: '',
                        checked: false,
                        key: generateUUID()
                    })
                }
                return {
                    ...state,
                    inputMode: action.inputMode,
                    checklist: checklist
                }
                
            }
            // chuyển sang dạng note thì lại lấy mỗi checklist item làm 1 dòng của checklist
            if(action.inputMode == 'note'){
                let texts = []
                state.checklist.map(item => {
                    if(item.text.trim()){
                        texts.push(item.text.trim())
                    }
                })
                return {
                    ...state,
                    inputMode: action.inputMode,
                    content: texts.join("\n")
                }
            }

            return state;
        case 'EVENT_UPDATE_CONTENT':
            return {
                ...state,
                content: action.content
            }
        case 'EVENT_SET_MEMBER':
            return {
                ...state,
                members: action.contacts
            }
        case 'EVENT_SAVE':
            EventModel.createEvent(state);
            return initialState;
        case 'EVENT_UPDATE_RATING':
            // lấy ra object realm event của action.id
            var event = EventModel.get(action.id)
            if(!event){
                return state;
            }


            // nếu event.date != action.date, nghĩa là đây là eventRelated => clone 1 event related
            if(event.date != action.date.format('YYYYMMDD')){
                var newEvent = EventModel.cloneNewEventFromRepeat(event, action.date)
                EventModel.updateEvent(newEvent.id, {star: action.rating});
                return state;
            }

            // nếu event.date == action.date, đây chỉ là update thông thường
            EventModel.updateEvent(action.id, {star: action.rating});
            return state;
        case 'EVENT_UPDATE_CHECKED_CHECKLISTITEM':
            
            EventModel.updateEventChecklist(action.realmObject,  action.checked);
            return state;
        default:
            return state;
    }
}
export default event;
