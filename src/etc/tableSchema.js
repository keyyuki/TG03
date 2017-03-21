export const eventSchema = {
    name: 'event',
    primaryKey: 'id',
    properties: {
        id: {type: 'string', indexed: true},
        date: {type: 'string', indexed: true},
        startTime: {type: 'string'},
        endTime: {type: 'string', optional: true},
        duration: {type: 'int', default: 0},
        repeatType: {type: 'string', optional: true},
        repeatData: {type: 'eventRepeatData', optional: true},
        repeatDisplay: {type: 'string', optional: true},
        nextEventDate: {type: 'string', optional: true},
        nextEventTime: {type: 'string', optional: true},
        images: {type: 'list', objectType: 'image',default:[]},
        content: {type: 'string', optional: true},
        checklist: {type: 'list', objectType: 'checklistItem',  default:[]},
        inputMode: {type: 'string'},

        relatedEventId: {type: 'string', optional: true, indexed: true},
        
        
        labels: {type: 'list', objectType: 'label', default:[]},
        star: {type: 'int', default: 0},

        status: {type: 'string', default: 'ACTIVE'},
        createdDateTime: {type: 'int'},
        repeatId: {type: 'string', optional: true}
    }
}

export const eventRepeatSchema = {
    name: 'eventRepeat',
    primaryKey: 'id',
    properties: {
        id: {type: 'string', indexed: true},
        startTimeStamp: {type: 'int'},
        endTimeStamp: {type: 'int', optional: true},
        interval: {type: 'int', optional: true},
        repeatDayOfMonth: {type: 'int', optional: true},
        repeatDayOfWeek: {type: 'int', optional: true},
        repeatWeekOfMonth: {type: 'int', optional: true},
        repeatMonth: {type: 'int', optional: true},
        repeatYear: {type: 'int', optional: true},
        status: {type: 'string', default: 'ACTIVE'},
        isParent: {type: 'int', default: '0'},
        parentId: {type: 'string', optional: true},
        startEventId: {type: 'string'}
    }
} 

export const imageSchema = {
    name: 'image',
    properties: {
        uri: {type: 'string'},
        name: {type: 'string'},
    }
}

export const checklistItemSchema = {
    name: 'checklistItem',
    primaryKey: 'key',
    properties: {
        key: {type: 'string'},
        text: {type: 'string'},
        checked: {type: 'bool'}
    }
}

export const eventRepeatData = {
    name: 'eventRepeatData',
    properties: {
        dayOfWeek: {type: 'string'},
        endDate: {type: 'string', optional: true},
        
    }
}

export const contact = {
    name : 'contact',
    primaryKey: 'id',
    properties: {
        id: 'string',
        
        givenName: {type: 'string', optional: true},
        middleName: {type: 'string', optional: true},
        familyName: {type: 'string', optional: true},
        searchString: {type: 'string', indexed: true},
        firstLetter: {type: 'string', optional: true},
        jobTitle: {type: 'string', optional: true},

        prefix: {type: 'string', optional: true},
        suffix: {type: 'string', optional: true},
        company: {type: 'string', optional: true},
        department: {type: 'string', optional: true},
        thumbnailPath: {type: 'string', optional: true},

    }
}

export const eventMember = {
    name : 'eventMember',
    primaryKey: 'id',
    properties: {
        id: 'string',
        eventId: 'string',
        contactId: 'string',
        date: {type: 'string', indexed: true},
        startTime: {type: 'string'},
        relatedEventId: {type: 'string', optional: true, indexed: true},
        createdDateTime: {type: 'int', optional: true},
    }
}
export const contactInfor = {
    name: 'contactInfor',
    primaryKey: 'id',
    properties: {
        id: 'string',
        type: 'string',
        contactId: 'string',
        content: 'string',
        extraContent: {type: 'string', optional: true}, // dạng JSON
    }
}

export const label = {
    name: 'label',
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        color: 'string',
        parentId: 'string'
    }
}
export default tableSchema = {
    imageSchema,
    eventSchema, 
    eventRepeatSchema, 
    checklistItemSchema, 
    eventRepeatData, 
    eventMember,
    contact, 
    contactInfor, 
    label
}