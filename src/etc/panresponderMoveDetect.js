/**
 * Hàm detect xem thao tác tay đang là vuốt hay bấm
 * Giới hạn: nếu khoảng cách dịch chuyển của ngón tay > 30px thì mới xác định đây là động tác vuốt
 * nếu <30, đó chỉ là bấm.
 * 
 * Điều này rất quan trọng khi để 1 thẻ tourchable bên trong 1 panresponder vì hệ thống sẽ không thể detect dc đâu là
 * thao tác với nút bấm, đâu là thao tác với panresponder
 * 
 * cách dùng
 * import vào component
 * dùng hàm này để detect onMoveShouldSetPanResponder
 * 
 * componentWillMount() {
 *  this._panResponder = PanResponder.create({
 *       onMoveShouldSetPanResponder: (evt, gestureState) => panresponderMoveDetect(gestureState),
 * })
 * }
 * 
 * 
 */
export default panresponderMoveDetect = ({moveX, moveY, dx, dy}, returnType="bool") => {
    const draggedDown = dy > 30;
  const draggedUp = dy < -30;
  const draggedLeft = dx < -30;
  const draggedRight = dx > 30;
  
  let dragDirection = '';
  if (draggedDown || draggedUp) {
    if (draggedDown) dragDirection += 'dragged down '
    if (draggedUp) dragDirection +=  'dragged up ';
  }
  if (draggedLeft || draggedRight) {
    if (draggedLeft) dragDirection += 'dragged left '
    if (draggedRight) dragDirection +=  'dragged right ';
  }
  if(returnType == 'bool'){
      return !!dragDirection;
  }
 
  return dragDirection;
}