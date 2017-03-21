import Moment from 'moment'
import Realm from 'realm';
import tableSchema from '../etc/tableSchema';
import ContactModel from './ContactModel';
import EventModel from './EventModel';

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

export const getHaveEventContact = () => {
    var result = [];
    realm.objects('eventMember').map(eventMember => {
        if(result.findIndex((i) => {return i.id == eventMember.contactId}) == -1){
            var contact = realm.objects('contact').filtered('id="' + eventMember.contactId + '"');
            if(contact.length){
                result.push(contact[0])
            }
        }
    });
    return result.length ? result : [];
}
const getDateRange = (f, t) => {
    // lấy ra danh sách các ngày
    var fromDate = new Moment(f, ['DD/MM/YYYY', 'YYYY-MM-DD', 'YYYYMMDD']);
    var toDate = new Moment(t, ['DD/MM/YYYY', 'YYYY-MM-DD', 'YYYYMMDD']);
    var currentDate = new Moment();
    currentDate = currentDate.format('YYYYMMDD');
    if(currentDate < fromDate.format('YYYYMMDD')){
        return null;
    }
    if(currentDate < toDate.format('YYYYMMDD')){
        toDate = new Moment(currentDate, 'YYYYMMDD');
    }
    var dateArr = []
    while(fromDate <= toDate){
        dateArr.push(new Moment(fromDate.format('YYYYMMDD'), 'YYYYMMDD'));
        fromDate.add(1, 'days');
        
    }
    return dateArr;
}
/**
 * mục tiêu của hàm là xây dựng 1 ma trận có dạng 
 * [
 * contactId1: [1,0,0,0,3,5...]
 * contactId2: [1,0,0,0,0,0...]
 * ...
 * ]
 * với column = các ngày trong khoảng lọc
 * row = các contact 
 * @param {*} f : from date
 * @param {*} t : to date
 */
export const getContactEventCountMatrix = (f, t) => {
    var contacts = getHaveEventContact();
    if(!contacts.length){
        return null;
    }
    var matrix = {};
    contacts.map(contact => {
        matrix[contact.id] = []
    });

    var dateArr = getDateRange(f, t)
    

    dateArr.forEach((date) => {

        var eventOfDate = EventModel.getEventOfDay(date.format('YYYYMMDD'))
        if(eventOfDate.length){
            // chỉ lọc lấy các event có contact
            var query = []
            eventOfDate.forEach(event => {
                query.push(`eventId="${event.id}"`)
            })

            var es = realm.objects('eventMember').filtered(query.join(' OR '));
            
            if(es.length){
                for(var contactId in matrix){
                    if( es.findIndex((i) => {return contactId == i.contactId}) != -1) {
                        matrix[contactId].push(
                            es.filtered(`contactId=="${contactId}"`).length)
                    } else {
                        matrix[contactId].push(0)
                    }
                }
            } else {
                for(var contactId in matrix){
                    matrix[contactId].push(0)
                }
            }

        } else {
            for(var contactId in matrix){
                matrix[contactId].push(0)
            }
        }
    });
    return matrix;
}

/**
 * Mục tiêu là tạo ra 1 ma trận có dạng 
 *  * [
 * contactId1: [100,200,15,0,3,5...]
 * contactId2: [15,10,20,40,50,0...]
 * ...
 * ]
 * trong đó column là tổng số duration trong từng ngày (tính = phút). Nếu duration = 0 sẽ tính = 5 phút
 * row là contact
 * @param {*} f 
 * @param {*} t 
 */
export const getContactEventTimeMatrix = (f, t) => {
    var contacts = getHaveEventContact();
    if(!contacts.length){
        return null;
    }
    var matrix = {};
    contacts.map(contact => {
        matrix[contact.id] = []
    });

    var dateArr = getDateRange(f, t)
    
    dateArr.forEach((date) => {
        var eventOfDate = EventModel.getEventOfDay(date.format('YYYYMMDD'))
        if(eventOfDate.length){
            // chỉ lọc lấy các event có contact
            var query = []
            eventOfDate.forEach(event => {
                query.push(`eventId="${event.id}"`)
            })

            var es = realm.objects('eventMember').filtered(query.join(' OR '));
            if(es.length){
                for(var contactId in matrix){
                    if( es.findIndex((i) => {return contactId == i.contactId}) != -1) {
                        var totalMinute = 0
                        es.filtered(`contactId=="${contactId}"`).map((em) => {
                            var event = realm.objects('event').filtered(`id="${em.eventId}"`)[0]
                            if(event.duration){
                                totalMinute += event.duration
                            } else {
                                totalMinute += 5
                            }
                        })
                        matrix[contactId].push(totalMinute)
                    } else {
                        matrix[contactId].push(0)
                    }
                }
            } else {
                for(var contactId in matrix){
                    matrix[contactId].push(0)
                }
            }
        } else {
            for(var contactId in matrix){
                matrix[contactId].push(0)
            }
        }
    });
    return matrix
}
/**
 * Mục tiêu là tạo ra 1 ma trận có dạng 
 *  * [
 * contactId1: [3,0,0,0,3,5...]
 * contactId2: [2,1,0,-4,-6,0...]
 * ...
 * ]
 * trong đó column là hiệu quả trong từng ngày, tính bằng tổng số sao, 1,2,3,4,5 sao tương ứng -2,-1,0,1,2 điểm
 * row là contact
 * @param {*} f 
 * @param {*} t 
 */
export const getContactEventEffectiveMatrix = (f, t) => {
    var contacts = getHaveEventContact();
    if(!contacts.length){
        return null;
    }
    var matrix = {};
    contacts.map(contact => {
        matrix[contact.id] = []
    });

    var dateArr = getDateRange(f, t)
    dateArr.forEach((date) => {
        var eventOfDate = EventModel.getEventOfDay(date.format('YYYYMMDD'))
        if(eventOfDate.length){
            // chỉ lọc lấy các event có contact
            var query = []
            eventOfDate.forEach(event => {
                query.push(`eventId="${event.id}"`)
            })

            var es = realm.objects('eventMember').filtered(query.join(' OR '));
            if(es.length){
                for(var contactId in matrix){
                    if( es.findIndex((i) => {return contactId == i.contactId}) != -1) {
                        var totalPoint = null
                        es.filtered(`contactId=="${contactId}"`).map((em) => {
                            var event = realm.objects('event').filtered(`id="${em.eventId}"`)[0]
                            console.log(event)
                            if(event.star && totalPoint ===  null){
                                totalPoint = 0
                            }
                            switch(event.star){
                                case 1:
                                    totalPoint += -2;
                                    break;
                                case 2:
                                    totalPoint += -1;
                                    break;
                                case 3:
                                    totalPoint += 0;
                                    break;
                                case 4:
                                    totalPoint += 1;
                                    break;
                                case 5: 
                                    totalPoint += 2;
                                    break;
                                default: break;
                            }
                            
                        })
                        matrix[contactId].push(totalPoint)
                    } else {
                        matrix[contactId].push(null)
                    }
                }
            } else {
                for(var contactId in matrix){
                    matrix[contactId].push(null)
                }
            }
        } else {
            for(var contactId in matrix){
                matrix[contactId].push(null)
            }
        }
    });
    return matrix
}

export const getContactDashboardData = (fromDate, toDate) => {
    // lấy ma trận đếm số event của các contact
    var countMatrix =  getContactEventCountMatrix(fromDate, toDate);
    // chuyển đổi thành dạng array chỉ có thông tin contact và tổng số event
    var countArr = [];
    for(var contactId in countMatrix){
        // lấy ra contact
        var contact = ContactModel.getContact(contactId);

        // lấy tổng số event
        var count = 0;
        countMatrix[contactId].forEach(c => {count += c});
        if(count > 0){
            countArr.push({
                contact: contact,
                total: count
            })
        }
        

    }
    countArr.sort((a, b) => {
        if(a.total == b.total){
            return 0
        }
        return a.total > b.total ? -1 : 1;
    })

    // lấy ma trận đếm duration
    var timeMatrix = getContactEventTimeMatrix(fromDate, toDate);
    // chuyển đổi thành dạng array chỉ có thông tin contact và tổng thời gian
    var timeArr = [];
    for(var contactId in timeMatrix){
        // lấy ra contact
        var contact = ContactModel.getContact(contactId);

        // lấy tổng số thời gian
        var total = 0;
        timeMatrix[contactId].forEach(c => {total += c});
        if(total > 0){
             timeArr.push({
                contact: contact,
                total: total
            })
        }
       
    }
    timeArr.sort((a, b) => {
        if(a.total == b.total){
            return 0
        }
        return a.total > b.total ? -1 : 1;
    })

    // lấy ma trận đếm hiệu quả
    var effectiveMatrix = getContactEventEffectiveMatrix(fromDate, toDate);
    // chuyển đổi thành dạng array chỉ có thông tin contact và hiệu quả
    var effectiveArr = [];
    for(var contactId in effectiveMatrix){
        // lấy tổng số thời gian
        var total = 0;
        var havePoint = false;
        effectiveMatrix[contactId].forEach(c => {
            if(c !== null){
                havePoint = true;
                total += c
            }
            
        });
        
        if(havePoint){
            // lấy ra contact
            var contact = ContactModel.getContact(contactId);
             effectiveArr.push({
                contact: contact,
                total: total
            })
        }
       
    }
    effectiveArr.sort((a, b) => {
        if(a.total == b.total){
            return 0
        }
        return a.total > b.total ? -1 : 1;
    })

    return {
        countData: countArr.slice(0, 3),
        timeData: timeArr.slice(0, 3),
        effectData: effectiveArr.slice(0, 3),
    }
}

const getContactDaterangeDetailOverviewData = (fromDate, toDate) => {
    var result = {};
    var contacts = {};
    // lấy ma trận đếm số event của các contact
    var countMatrix =  getContactEventCountMatrix(fromDate, toDate);
    // tính tổng số lần gặp + tìm người gặp nhiều nhất
    var totalCount = 0;
    var theMostCountContact = {
        contactId: '',
        count: 0
    }
    for(var contactId in countMatrix){
        var count = 0;
        countMatrix[contactId].forEach(c => {
            count += c
        });
        if(count > theMostCountContact.count){
            theMostCountContact.contactId = contactId;
            theMostCountContact.count = count;
        }
        totalCount += count;

        if(contacts[contactId] == undefined){
            contacts[contactId] = {
                count: count,
                duration: 0,
                effective: 0
            }
        } else {
            contacts[contactId].count = count
        }
    }
    if(theMostCountContact.contactId){
        result.theMostCountContact = ContactModel.getContact(theMostCountContact.contactId)
    }
    result.totalCount = totalCount;

    
    // lấy ma trận đếm duration
    var timeMatrix = getContactEventTimeMatrix(fromDate, toDate);
    // chuyển đổi thành dạng array chỉ có thông tin contact và tổng thời gian
    var totalDuaration = 0;
    var theMostDurationContact = {
        contactId: '',
        duration: 0
    }
    for(var contactId in timeMatrix){
        // lấy tổng số thời gian
        var total = 0;
        timeMatrix[contactId].forEach(c => {total += c});
        if(total > theMostDurationContact.duration){
            theMostDurationContact.duration = total;
            theMostDurationContact.contactId =  contactId;
        }

        totalDuaration += total

        if(contacts[contactId] == undefined){
            contacts[contactId] = {
                count: 0,
                duration: total,
                effective: 0
            }
        } else {
            contacts[contactId].duration = total
        }
    }
    if(theMostDurationContact.contactId){
        result.theMostDurationContact = ContactModel.getContact(theMostDurationContact.contactId)
    }
    result.totalDuration = totalDuaration;

    // lấy ma trận đếm hiệu quả
    var effectiveMatrix = getContactEventEffectiveMatrix(fromDate, toDate);
    var contactMostEffect = {
        contactId: '',
        effectPoint: null
    }
    for(var contactId in effectiveMatrix){
        var total = 0;
        var checked = false;
        effectiveMatrix[contactId].forEach(c => {
            if(c !== null){
                total += c;
                checked = true;
            }
        });
        if(checked){
            if(contactMostEffect.effectPoint === null || contactMostEffect.effectPoint < total){
                contactMostEffect.contactId = contactId;
                contactMostEffect.effectPoint = total;
            } 

            if(contacts[contactId] == undefined){
                contacts[contactId] = {
                    count: 0,
                    duration: 0,
                    effective: total
                }
            } else {
                contacts[contactId].effective = total
            }
        }
    }
    if(contactMostEffect.contactId){
        result.theMostEffectiveContact = ContactModel.getContact(contactMostEffect.contactId)
    }

    for(var contactId in contacts){
        if(contacts[contactId].count == 0){
            delete contacts[contactId];
        }
    }
    result.contacts = contacts;
    return result;
}

export const getContactEvents = (contactId) => {
    var ems =  realm.objects('eventMember').filtered(`contactId="${contactId}"`).sorted('date', true)
    var dateEvents = {}
    ems.map(eventMember => {
        if(dateEvents[eventMember.date] == undefined){
            dateEvents[eventMember.date] = [];
        }
        var event = realm.objects('event').filtered(`id="${eventMember.eventId}"`)[0]
        dateEvents[eventMember.date].push(event)
    });

    var result = [];
    for(var date in dateEvents){
        result.push({
            date: date,
            events: dateEvents[date]
        })
    }
    return result;
}

export const getContactOverview = (contactId) => {
    var ems = realm.objects('eventMember').filtered(`contactId="${contactId}"`)
    var eventIdQuery = []
    ems.forEach(eventMember => {
        if(eventIdQuery.findIndex(eventId => {return eventId == eventMember.eventId}) == -1){
            eventIdQuery.push(`id="${eventMember.eventId}"`)
        }
    });
    var events = realm.objects('event').filtered(eventIdQuery.join(' OR '));

    var star = {
        1 : 0,
        2 : 0,
        3 : 0,
        4 : 0,
        5 : 0,
    }
    var totalDuration =0;
    var totalEvent = events.length
    events.forEach(event => {
        if(event.star){
            star[event.star] += 1;
        }
        if(!event.duration){
            totalDuration += EventModel.defaultDuration
        } else {
            totalDuration += event.duration
        }
    })
    return {
        totalEvent,
        totalDuration,
        stars : star
    }
}

export default ReportModel = {
    getHaveEventContact,
    getContactEventCountMatrix,
    getContactDashboardData,
    getContactDaterangeDetailOverviewData,
    getContactEvents,
    getContactOverview
}