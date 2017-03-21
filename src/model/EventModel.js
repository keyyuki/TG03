import Moment from 'moment'
import Realm from 'realm';
import tableSchema, {
    imageSchema,
    eventSchema, 
    eventRepeatSchema, 
    checklistItemSchema, 
    eventRepeatData, 
    contact, 
    contactInfor, 
    label
} from '../etc/tableSchema';
import vietnameseDayOfWeek from '../etc/vietnameseDayOfWeek';
import generateUUID from '../etc/generateUUID';

let realm = new Realm({schema: [
                tableSchema.imageSchema,
                tableSchema.checklistItemSchema, 
                tableSchema.eventRepeatData, 
                tableSchema.contact, 
                tableSchema.contactInfor, 
                tableSchema.eventMember, 
                tableSchema.label, 
                tableSchema.eventSchema, 
                tableSchema.eventRepeatSchema]});
const defaultDuration = 5;
export const toEventNomalObject = (event) =>{
    var result = {};
    for(var property in tableSchema.eventSchema.properties){
        result[property] = event[property];
    }
    return result;
}

const toUniqueArray = (arr) => {
    var result = arr.filter((item, index, self) => {
        return self.findIndex((i) => {return i.id == item.id}) == index
    }) 
    return result;
}
export const getEventOfDay = (day) => {
    
    var dataSource = [];
    var currentDate = new Moment(day, ['DD/MM/YYYY', 'YYYY-MM-DD', 'YYYYMMDD']);
    var dateToCompare = currentDate.format('YYYYMMDD');
    var nomalEventIds = [];

    // lấy ra các sự kiện xảy ra trong ngày 
    var es1 = realm.objects('event').filtered('date == "' + dateToCompare + '" AND status=="ACTIVE"')
    es1.map((item) => {
        item.mode = 'nomal'
        dataSource.push(item)
        
    });

    // lấy ra các sự kiện liên quan
    var es2 = realm.objects('event').filtered(`nextEventDate == "${dateToCompare}" AND status=="ACTIVE"`)
    es2.map((item) => {
        item.mode = 'related'
        dataSource.push(item)
    });

    // lấy ra các sự kiện được lặp lại
    var timeStamp = parseInt(currentDate.unix());
    // lặp lại theo thứ trong tuần
    var dayOfWeek = parseInt(currentDate.format('d'));
    
    var es = realm.objects('eventRepeat').filtered(
        'interval == null AND status=="ACTIVE" AND isParent==0 AND startTimeStamp<='+timeStamp
        +' AND (endTimeStamp == null OR endTimeStamp >= '+timeStamp+') AND repeatDayOfWeek=='+dayOfWeek)
    eventRepeatIds = [];
    
    es.map((repeat) => {
        var events = realm.objects('event').filtered('id = "' +repeat.startEventId +'"')
        var item = events[0];
        
        item.mode = 'calendar';
        
        dataSource.push(item)
    });

    // lặp lại theo ngày trong tháng
    var dayOfMonth = parseInt(currentDate.format('D'));
    var es = realm.objects('eventRepeat').filtered(
        'interval == null AND status=="ACTIVE" AND isParent==0 AND startTimeStamp<='+timeStamp
        +' AND (endTimeStamp == null OR endTimeStamp >= '+timeStamp+') AND repeatDayOfMonth==' + dayOfMonth)
    eventRepeatIds = [];
    es.map((repeat) => {
        var events = realm.objects('event').filtered('id == "'+repeat.startEventId+'"')
        var item = events[0];
        item.mode = 'calendar';
        dataSource.push(item)
    });

    // lặp lại theo chu kì
    var es = realm.objects('eventRepeat').filtered(
        'interval > 0 AND status=="ACTIVE" AND isParent==0 AND startTimeStamp<='+timeStamp
        +' AND (endTimeStamp == null OR endTimeStamp >= '+timeStamp+')')
    es.map((repeat) => {
        if((repeat.startTimeStamp - timeStamp)% repeat.interval == 0){
            var events = realm.objects('event').filtered('id == "'+repeat.startEventId+'"')
            var item = events[0];
            item.mode = 'calendar';
            dataSource.push(item)
        }
    });

    

    // lọc ra các event có relatedEventId
    var relatedIds = []
    dataSource.map((e, i) => {
        if(e.relatedEventId){
            relatedIds.push(e.relatedEventId)
        }
    });

    // nếu tồn tại 1 cặp event1.id == event2.relatedEventId thì bỏ event1, giữ lại event2
    var result = [];
    dataSource.map((e, i) => {
        if(relatedIds.findIndex((relatedId) => {return relatedId == e.id}) == -1){
            result.push(e)
        }
    })

    result = toUniqueArray(result);

    result.map(e => {
        getMemberOfEvent(e)
    })
  
    return result;
}

export const get = (id) => {
    var result = realm.objects('event').filtered('id="' + id + '"');
    if(result.length){
        return result[0]
    }
    return null;
}
export const getMemberOfEvent = (event) => {
    var eventMembers =  realm.objects('eventMember').filtered('eventId="' + event.id + '"');
    if(eventMembers.length){
        var contacts = [];
        eventMembers.map(eventMember => {
            var c = realm.objects('contact').filtered('id="' + eventMember.contactId + '"').find(() => {return true});
            contacts.push(c);
        });
        event.members = contacts
        return contacts
    }
    event.members = []
    return []
}

export const updateEvent = (id, data) => {
    
    realm.write(() => {
        realm.create('event', {...data, id: id}, true);
    });
    return true;
}

export const updateEventChecklist = (realmObject, checked) => {
    
    realm.write(() => {
        realmObject.checked = checked;
    });
    return true;
}
export const cloneNewEventFromRepeat = (event, date) => {
    var currentTime = new Moment();
    var newEvent = {
        id: event.id + date.format('YYYYMMDD'),
        date: date.format('YYYYMMDD'),
        startTime: event.startTime,
        endTime:event.endTime,
        duration: event.duration,
        repeatType: event.repeatType,
        repeatDisplay: event.repeatDisplay,
        images: event.images,
        content: event.content,
        checklist: event.checklist,
        inputMode: event.inputMode,

        relatedEventId: event.id,
        
        labels: event.labels,
        star: 0,

        status: 'ACTIVE',
        createdDateTime: currentTime.unix(),
        
    }
    realm.write(() => {
        realm.create('event', newEvent);
    })

    // clone event contact
    var eventContact = realm.objects('eventMember').filtered(`eventId="${event.id}"`);
    if(eventContact.length){
        var now = new Moment()
        realm.write(() => {
            eventContact.map((item) => {
                realm.create('eventMember', {
                    id: generateUUID(),
                    eventId: newEvent.id,
                    contactId: item.contactId,
                    createdDateTime: now.unix(),
                })
            })
        });
    }
    return realm.objects('event').filtered('id="' + newEvent.id + '"')[0]
}

export const createEvent = (state) => {
    let startDate = Moment(state.date, ['YYYY-MM-DD', 'DD/MM/YYYY'])
    // lưu event
    let startTime = Moment.unix(state.startTimeStamp);
    let currentDateTime = new Moment()
    let event = {
        id: generateUUID(),
        date: startDate.format('YYYYMMDD'), // định dạng này cho dễ so sánh
        startTime: startTime.format('hh:mm A'),
        endTime: null,
        duration: 0,
        repeatType: null,
        repeatData: null,
        repeatDisplay: null,
        nextEventDate: null,
        nextEventTime: null,
        images: [],
        content: state.content,
        checklist: state.checklist,
        inputMode: state.inputMode,

        relatedEventId: null,
        location: null,
        members: [],
        labels: [],
        star: 3,

        status:  'ACTIVE',
        createdDateTime: currentDateTime.unix(),
        repeatId:  null
    }
    
    if(state.endTimeStamp){
        let endTime = Moment.unix(state.endTimeStamp);
        event.endTime = endTime.format('hh:mm A');
        event.duration = state.duration;
    }
    if(state.repeat){
        event.repeatType =  state.repeat.type;
        event.repeatData = JSON.stringify(state.repeat.data);
        let repeatDisplay =  '';
        switch(event.repeatType){
            case 'ED':
                repeatDisplay = 'Hàng ngày';
                break;
            case 'EW':
                repeatDisplay = 'Hàng tuần';
                break;
            case 'WD1':
                repeatDisplay = 'Thứ 2,3,4,5,6 hàng tuần'
                break;
            case 'WD2':
                repeatDisplay = 'Thứ 2,3,4,5,6,7 hàng tuần'
                break;
            case 'EM':
                repeatDisplay = 'Hàng tháng';
                break;
            case 'CUSTOM':
                let mapDayOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                result = 'Mỗi '
                let arr =[]
                state.repeat.data.dayOfWeek.map((index) => {
                    arr.push(mapDayOfWeek[index])
                })
                repeatDisplay += arr.join(', ');
                if(state.repeat.data.endDate){
                    repeatDisplay += ' kéo dài đến ' + state.repeat.data.endDate
                }
                break;
            default:
                break;
        }
        event.repeatDisplay = repeatDisplay
    }
    if(state.nextEvent){
        let nextDate = Moment(state.nextEvent.date, 'DD/MM/YYYY')
        event.nextEventDate = nextDate.format('YYYYMMDD')
        event.nextEventTime = state.nextEvent.time
    }
    if(state.images){
        event.images = state.images
    }
    if(state.inputMode != 'checklist'){
        event.checklist = []
    }
    
    realm.write(() => {
        realm.create('event', event);
    })
    

    // lưu repeat
    let repeatId = null;
    
    if(state.repeat){
        repeatId = generateUUID()
        let repeatObj = {
            id: repeatId,
            startTimeStamp: null,
            endTimeStamp: null,
            interval: null,
            repeatDayOfMonth: null,
            repeatDayOfWeek: null,
            repeatWeekOfMonth: null,
            repeatMonth: null,
            repeatYear: null,
            status: 'ACTIVE',
            startEventId: event.id
        }
        
        repeatObj.startTimeStamp = startDate.unix();
        if(state.repeat.type== 'CUSTOM' && state.repeat.data.endDate){
            let endDate =  Moment(state.repeat.data.endDate, 'DD/MM/YYYY')
            repeatObj.endTimeStamp = endDate.unix()
        }
        switch(state.repeat.type){
            case 'ED':
                repeatObj.interval = 24*60*60;
                break;
            case 'EW':
                repeatObj.interval = 7*24*60*60;
                break;
            case 'WD1':
                repeatObj.isParent = 1;
                realm.write(() => {
                    realm.create('eventRepeat', repeatObj);
                    [1,2,3,4,5].map(dayOfWeek => {
                        var newObj = Object.assign({}, repeatObj);
                        newObj.id = generateUUID()
                        newObj.isParent = 0;
                        newObj.parentId = repeatObj.id;
                        newObj.repeatDayOfWeek = dayOfWeek;
                        realm.create('eventRepeat', newObj);
                    });
                })

                break;
            case 'WD2':
                repeatObj.isParent = 1;
                realm.write(() => {
                    realm.create('eventRepeat', repeatObj);
                    
                    [1,2,3,4,5,6].map(dayOfWeek => {
                        var newObj = Object.assign({}, repeatObj);
                        newObj.id = generateUUID()
                        newObj.isParent = 0;
                        newObj.parentId = repeatObj.id;
                        newObj.repeatDayOfWeek = dayOfWeek;

                        realm.create('eventRepeat', newObj);
                    });
                })
                

                break;
            case 'EM':
                repeatObj.repeatDayOfMonth = parseInt(startDate.format('D'));
                realm.write(() => {
                    realm.create('eventRepeat', repeatObj);
                })
                break;
            case 'CUSTOM':
                repeatObj.isParent = 1;
                realm.write(() => {
                    realm.create('eventRepeat', repeatObj);
                    state.repeat.data.dayOfWeek.map(dayOfWeek => {
                        var newObj = Object.assign({}, repeatObj);
                        newObj.id = generateUUID()
                        newObj.isParent = 0;
                        newObj.parentId = repeatObj.id;
                        newObj.repeatDayOfWeek = dayOfWeek;

                        realm.create('eventRepeat', newObj);
                    })
                })
                break;
            default:
                break;
        }
        
    }
    
    // nếu có member thì lưu cả member
    // xóa các member cũ

    var contacts = realm.objects('eventMember').filtered('eventId="' + event.id + '"');
    if(contacts.length){
        contacts.map((contact) => {
            realm.delete(contact);
        })
    }
    if(state.members.length){
        realm.write(() => {
            state.members.map((contact) => {
                realm.create('eventMember', {
                    id: generateUUID(),
                    eventId: event.id,
                    contactId: contact.id,
                    date: event.date,
                    startTime: event.startTime,
                    relatedEventId: event.relatedEventId,
                    createdDateTime: currentDateTime.unix(),
                })
            })
        })
        
    }
}

const getDisplayDuration = (duration, hourDisplay = ' giờ', minuteDisplay = ' phút') => {
    var hour = Math.floor(duration / 60);
    var minute = duration % 60;
    var result = [];

    if(hour){
        result.push(hour.toString() + hourDisplay) ;
    }
    
    if(minute){
        result.push(minute.toString() + minuteDisplay);
    }
    return result.join(' ');
}
export default EventModel = {
    defaultDuration,
    get: (id) => get(id),
    getEventOfDay: (day) => getEventOfDay(day),
    updateEvent: (id, data) => updateEvent(id, data),
    updateEventChecklist: (realmObject, checked) => updateEventChecklist(realmObject, checked),
    cloneNewEventFromRepeat,
    createEvent,
    getDisplayDuration
}
