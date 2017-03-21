import ReportModel from '../model/ReportModel';
import ContactModel from '../model/ContactModel';

async function getContactdetailOverview(contactId) {
    try{
        return ReportModel.getContactOverview(contactId)
    } catch (error) {
        console.log('ERROR', error)
        throw(error)
    }
}

function shouldLoadContactdetailOverview(state){
    return !state.report.contactDetail.isLoadingOverview;
}

export const reportcontactdetailStartLoadOverviewData = () => {
    return {
        type: 'REPORT_CONTACTDETAIL_STARTLOADOVERVIEWDATA',
    }
}

export const reportcontactdetailSetOverviewData = (data) => {
    return {
        type: 'REPORT_CONTACTDETAIL_SETOVERVIEWDATA',
        totalDuration: data.totalDuration,
        totalEvent: data.totalEvent,
        stars: data.stars
    }
}

export const reportcontactdetailLoadOverviewData = (contactId) => {
    return (dispatch, getState) => {
        if(shouldLoadContactdetailOverview(getState())){
            dispatch(reportcontactdetailStartLoadOverviewData());
            getContactdetailOverview(contactId).then(response => {
                dispatch(reportcontactdetailSetOverviewData(response))
            }).done()
        }
    }
}

async function getReportcontactdetailContactEvents (contactId) {
    try {
        return ReportModel.getContactEvents(contactId);
    } catch (error) {
        console.log('ERROR', error)
        throw(error)
    }
}

function shouldReportcontactdetailLoadContactEvents (state){
    return !state.report.contactDetail.isLoading
}

export const reportcontactdetailStartLoadData = () => {
    return {
        type: 'REPORT_CONTACTDETAIL_STARTLOADDATA',
    }
}

export const reportcontactdetailAddData = (data) => {
    return {
        type: 'REPORT_CONTACTDETAIL_ADDDATA',
        data: data
    }
}

export const reportcontactdetailLoadContact = (contactId) => {
    return (dispatch, getState) => {
        if(shouldReportcontactdetailLoadContactEvents(getState())){
            dispatch(reportcontactdetailStartLoadData())
            getReportcontactdetailContactEvents(contactId).then(response => {
                dispatch(reportcontactdetailAddData(response))
            }).done()
        } 
    }
}

export const reportcontactChangeContactId = (contactId) => {

    return {
        type: 'REPORT_CONTACTDETAIL_CHANGE_ID',
        id: contactId,
        contact: ContactModel.getContact(contactId)
    }
}