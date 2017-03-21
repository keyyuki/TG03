import Moment from 'moment'
import Realm from 'realm';
import tableSchema from '../etc/tableSchema';
import unsignVietnamese from '../etc/unsignVietnamese';
import generateUUID from '../etc/generateUUID';
import Contacts from 'react-native-contacts';

const contactInforTypes = {
    email : 'email',
    phoneNumber : 'phoneNumber',
    address : 'address',
}

let realm = new Realm({
        schema:[
             tableSchema.imageSchema,
            tableSchema.checklistItemSchema, 
            tableSchema.eventRepeatData, 
            tableSchema.contact, 
            tableSchema.contactInfor, 
            tableSchema.label, 
            tableSchema.eventSchema, 
            tableSchema.eventRepeatSchema
        ]
    });
const getFirstLetter  =(str) => {
    str = unsignVietnamese(str);
    var firstLetter = str.slice(0, 1);
    if(firstLetter.match(/\w/g)){
        return firstLetter;
    }
    return '#';

}
const realm2NomalObject = (realmObject) => {
    var result = {};
    for(var property in tableSchema.contact.properties){
        result[property] = realmObject[property];
    }
    return result;
}
/**
 * 
 * Biến đổi từ object contact của react-native-contacts về schema contact của realm
 */
export const contactToModel = (contact) => {
    var result = {
        id: '',
        
        givenName: contact.givenName,
        middleName: contact.middleName,
        familyName: contact.familyName,
        //searchString: contact.givenName,
        //firstLetter: contact.givenName,
        jobTitle: contact.jobTitle,

        prefix: contact.prefix,
        suffix: contact.suffix,
        company: contact.company,
        department: contact.department,
        thumbnailPath: contact.thumbnailPath,
        information: []
    }

    // tổ hợp seachString và firstLetter
    var searchString = [];
    var firstString = '#';
    if(contact.familyName){
        searchString.push(unsignVietnamese(contact.familyName)) 
    }
    if(contact.middleName){
        searchString.push(unsignVietnamese(contact.middleName)) 
    }
    if(contact.givenName){
        searchString.push(unsignVietnamese(contact.givenName));
    }
    if(contact.company){
        searchString.push(unsignVietnamese(contact.company)) 
    }
    if(contact.department){
        searchString.push(unsignVietnamese(contact.department)) 
    }
    if(contact.jobTitle){
        searchString.push(unsignVietnamese(contact.jobTitle)) 
    }
    if(contact.givenName){
        firstString = getFirstLetter(contact.givenName);
    } else if(contact.familyName){
        firstString = getFirstLetter(contact.familyName);
    }
    result.searchString = searchString.join(' ') + ' | ' + searchString.reverse().join(' ');
    firstString = firstString.toUpperCase();
    result.firstLetter = firstString;

    // tổ hợp information
    if(contact.phoneNumbers !== undefined && contact.phoneNumbers.length){
        contact.phoneNumbers.map(item => {
            result.information.push({
                id: '',
                contactId: '',
                type: contactInforTypes.phoneNumber,
                content: item.number,
                extraContent: JSON.stringify(item)
            })
        });
        
    }
    if(contact.emailAddresses !== undefined && contact.emailAddresses.length){
        contact.emailAddresses.map(item => {
            result.information.push({
                id: '',
                contactId: '',
                type: contactInforTypes.email,
                content: item.email,
                extraContent: JSON.stringify(item)
            })
        });
        
    }
    if(contact.postalAddresses !== undefined && contact.postalAddresses.length){
        
        contact.postalAddresses.map(item => {
            result.information.push({
                id: '',
                contactId: '',
                type: contactInforTypes.address,
                content: item.formattedAddress,
                extraContent: JSON.stringify(item)
            })
        });
        
    }
    return result;
}
export const getDisplayName = (item, lang='vn') => {
    var name = [];
    if(lang=='en'){
        if(item.familyName){
            name.push(item.familyName)
        }
        if(item.middleName){
            name.push(item.middleName)
        }
        if(item.givenName){
            name.push(item.givenName)
        }
        return name.join(' ');
    }
    if(item.givenName){
        name.push(item.givenName)
    }
    if(item.middleName){
        name.push(item.middleName)
    }
    if(item.familyName){
        name.push(item.familyName)
    }
    return name.join(' '); 
}
/**
 * hàm check contactInfo đã tồn tại chưa
 * @param {*} item 
 */
export const isInforExisted = (item) => {
    var result = false;
    var query = 'content="' + item.content + '" AND type="' + item.type + '"';
    
    if(item.id) {
        query += ' AND id != "' + item.id + '"';
    } else if(item.contactId){
        query +=  ' AND contactId="' + item.contactId + '"';
    } 

    var r = realm.objects('contactInfor').filtered(query)
    if(!r.length){
        return false;
    }
    r.slice(0, 1).map(i => {
        item.id = i.id,
        item.contactId = i.contactId
    });
    return true;
}

/**
 * 
 * hàm check contact đã tồn tại trong db hay chưa
 * item là 1 object có dạng của model realm contact
 */
export const isExisted = (item) => {
    var result = false;
    if(!item.information || !item.information.length ){
        return null;
    }
    item.information.map(infor => {
        if(result){
            return result;
        }
        if(infor.type == contactInforTypes.phoneNumber || infor.type == contactInforTypes.email){
            if(isInforExisted(infor)){
                item.id = infor.contactId
                result =  true; 
            }
        }
    });
    
    return result;
}

export const saveContact = (item) => {
    
    if(!item.id){
        item.id = generateUUID()
    }
    realm.write(() => {
        
        realm.create('contact', item, true);
    });
    
}

export const saveInfor = (item) => {
    if(!item.id){
        item.id = generateUUID()
    }
    realm.write(() => {
        
        realm.create('contactInfor', item, true);
    });
}

export const fetchAll = (query = '', options = null) => {
    var arr = null;
    if(!query){
        arr =  realm.objects('contact').sorted('firstLetter');
    } else {
        arr = realm.objects('contact').filtered(query).sorted('firstLetter');
    }
    if(!options || options.conventToNomalObject == undefined || !options.conventToNomalObject){
        return arr;
    } else {
        result = arr.map(item => {
            return realm2NomalObject(item);
        });
        return result;
    }
}

export const getContact = (id) =>{
    var rows = realm.objects('contact').filtered('id= "' + id + '"');
    var result = null;
    if(rows.length){
        result = rows.find(() => {return true}) // lấy phần tử đầu tiên
         // lấy ra danh sách các infor 
        result.information = realm.objects('contactInfor').filtered('contactId= "' + id + '"');
    }

    return result;
    
}

export const sync = () => {
    
    Contacts.getAll((err, constacts) => {
        if(err){
            alert('Có lỗi trong quá trình xử lí')
            console.log('Lỗi: ' ,err);
        } else {
            
            
            constacts.map(item => {
                contact = contactToModel(item);

                // save contact
                if(isExisted(contact) === null){
                    return null;
                }
                saveContact(contact);

                // save contactInfo
                var inforIds = []
                contact.information.map(infor => {
                    infor.contactId = contact.id;
                    if(!isInforExisted(infor)){
                        saveInfor(infor);
                    }
                    inforIds.push(infor.id)
                })
                
                // xoas cac contactInfo không còn sử dụng
                var currentInfors = realm.objects('contactInfor').filtered('contactId="' + contact.id + '"');
                currentInfors.map(infor => {
                    if(inforIds.find( (inforId) => {return inforId == infor.id} ) == undefined){
                        realm.delete(infor)
                    }
                })

            })
        }
        
    
    })
    
    
}

export default ContactModel = {
    contactInforTypes,
    contactToModel,
    getDisplayName,
    isInforExisted,
    isExisted,
    saveContact,
    saveInfor,
    fetchAll,
    getContact,
    sync,
    realm2NomalObject
}