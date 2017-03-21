export default vietnameseDayOfWeek = (d, mode=1) => {
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