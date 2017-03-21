export const uniqueArray = (arr, callback=null) => {
    return arr.filter((item, index, self) => {
        return self.findIndex(
            (element) => {
                if(!callback){
                    return element == item
                } else {
                    return callback(element, item, index)
                }
            }
        ) == index;
    })
}
export const vietnameseDayOfWeek = (d, mode=1) => {
    if(mode == 1){
        switch(parseInt(d)){
            case 0:
                return 'Chủ nhật';
            case 1:
                return 'Thứ hai';
            case 2:
                return 'Thứ ba';
            case 3:
                return 'Thứ tư';
            case 4:
                return 'Thứ năm';
            case 5:
                return 'Thứ sáu';
            case 6:
                return 'Thứ bảy';
        }
        return null;
    } 
    return null;
}

let getDisplayDuration = (duration, hourDisplay = ' giờ', minuteDisplay = ' phút') => {
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
export default format = {
    uniqueArray,
    vietnameseDayOfWeek,
    getDisplayDuration
}
