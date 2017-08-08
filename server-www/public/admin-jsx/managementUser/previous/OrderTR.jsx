import React, {Component} from 'react';
import PropTypes from 'prop-types';
import utilFunction from './utilFunction.jsx';

const propTypes = {};
const defaultProps = {};

class OrderTR extends Component {
    constructor(props) {
        super(props);


        order: this.props.order

    }

    onChangedDeliveryPee(event) {
        let _this = this;
        let order = this.state.order;
        let isChecked = !order.pickup.isPayDeliveryFee;
        order.pickup.isPayDeliveryFee = isChecked;
        $.post("updateJulieCheck", {
            "check": isChecked,
            "objectId": order._id,
            "type": "isDeliveryFee"
        }, function (data) {
            if (data.code != 200) {
                alert('error')
            } else {
                _this.setState({'order': order})
            }
        }, 'json');
    }

    showCommentHandler(objectId) {
        let url = '/admin/commentHandler/' + objectId;
        let dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        let dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        let w = 1100;
        let h = 800;
        let left = ((width / 2) - (w / 2)) + dualScreenLeft;
        let top = ((height / 2) - (h / 2)) + dualScreenTop;
        let option = 'height=' + h + ',width=' + w + ',top=' + top + ',left=' + left;
        let wi = window.open(url, 'time', option);
        wi.focus();
    }

    showClietHandler(uid, orderId) {
        let url = '/admin/clientHandler/' + uid + "?initOrderId=" + orderId;
        let dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        let dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        let w = 1400;
        let h = 800;
        let left = ((width / 2) - (w / 2)) + dualScreenLeft;
        let top = ((height / 2) - (h / 2)) + dualScreenTop;
        let option = 'height=' + h + ',width=' + w + ',top=' + top + ',left=' + left;
        let wi = window.open(url, 'time', option);
        wi.focus();
    }


    render() {
        var _this = this;
        var idx = this.props.index;
        var order = this.state.order;
        var centerName = this.props.getCenterName(order.userInfo.centerId).name;
        var centerColorIndex = this.props.getCenterName(order.userInfo.centerId).index;
        var name = (order.userInfo.name == "" || order.userInfo.name == undefined || order.userInfo.name==null )?'(이름없음)':order.userInfo.name;
        var url = "/admin/changeUserInfo?uid=" + order.userInfo.uid + "&objectId=" + order._id;
        var itemUrl = "/admin/itemHandler/" + order._id;
        var deliveryDate;


        if(order.status == 'wait' || order.status == 'ing' || order.status == 'delivery') {
            deliveryDate = (
                <a className="pointer" onClick={(event)=>this.props.showPopUp(order._id, "deliveryTime", _this)}>
                    {(order.deliveryTimeString != undefined )?order.deliveryTimeString:'배달시간미`정'}
                </a>)
        }


        else {
            deliveryDate = (<p>{(order.deliveryTimeString != undefined )?order.deliveryTimeString:'-'}</p>)
        }





        var totalPrice = order.pickup.totalPrice + ((order.pickup.isPayDeliveryFee)?2000:0);
            var discount = (totalPrice)*(order.pickup.discountRate/100) + order.pickup.usePoint + order.pickup.eventDiscount
        var finalPrice = order.pickup.finalPrice

        var persistentComm = order.userInfo.comment;
        var hasPersistentComment = 0;
        if( persistentComm != undefined && persistentComm != ""){
            hasPersistentComment += 1;
        }
        var commentLength =((order.swatComment.length + hasPersistentComment) == 0)?"-" : "[ " + (order.swatComment.length + hasPersistentComment) + " ]"
        var pickupRanger = this.props.sliceSwatId(order.pickup.swatId);
        var deliveryRanger = (order.delivery != undefined)?this.props.sliceSwatId(order.delivery.swatId):<p className='centerAlign' style={middleAlign}>-</p>;
        var isPayDeliveryFee = (order.pickup.isPayDeliveryFee != undefined )? order.pickup.isPayDeliveryFee : false;
        var deliveryFeeText = (isPayDeliveryFee === true) ? "●" : "X";


        var diffCharge = (order.pickup.payType == 'later')?LATER:0;
        var alert = order.alert
        alert = (Array.isArray(alert))? alert : [];
        for ( var i in alert ){
            if ( alert[i].button != undefined ){
                if ( alert[i].button.action == "payment" ){
                    diffCharge = ADDTIONAL_PEE;
                    break;
                } else if ( alert[i].button.action == "refund" ){
                    diffCharge = REFUND;
                    break;
                }
            }
        }

        var btnDiffCharge
        switch (diffCharge) {
            case LATER:
                btnDiffCharge = <div className="btnDiffCharge" >후불결제</div>
                break;
            case ADDTIONAL_PEE:
                btnDiffCharge = <div className="btnDiffCharge" >추가금</div>
                break;
            case REFUND:
                btnDiffCharge = <div className="btnDiffCharge" >환불</div>
                break;
            default:

        }

        var nowrap = {
            whiteSpace: 'nowrap',
            verticalAlign: 'middle'
        };
        var centerAlign = {
            textAlign: 'center'
        };
        var middleAlign = {
            verticalAlign: 'middle'
        };

        var centerColorArray = [
            {color: "Blue"},
            {color: "Cyan"},
            {color: "hotpink"},
            {color: "Green"},
            {color: "Red"},
            {color: "Yellow"}
        ]
        var checkbox = {
            verticalAlign: 'middle',
            textAlign: 'center'
        }

        return (
            <tr id={'order#'+order._id} key={'Order#'+order._id} >
                <td className='orderIndex centerAlign' style={middleAlign}>{idx+1}</td>
                <td style={ Object.assign({},middleAlign,centerAlign,centerColorArray[centerColorIndex])}>{centerName}</td>

                <td className='userInfo' style={nowrap}>
                    <a className="pointer" href={url} target="_blank">{name}</a><br/>{order.userInfo.phone}{order.phone}
                </td>
                <td className='orderId'  style={nowrap}>{order.orderId}</td>
                <td className='pickupTime centerAlign' style={nowrap}>{new Date(order.pickup.regdate).format('MM/dd HH:mm')}</td>
                <td className='deliveryDate' style={middleAlign}>
                    {deliveryDate}
                </td>
                <td className='finalPrice' style={middleAlign}>{finalPrice.toString().replace(/(\d)(?=(\d\d\d)+$)/g , '$1,')}</td>
                <td className='discountType' style={middleAlign}>
                    {discount.toString().replace(/(\d)(?=(\d\d\d)+$)/g , '$1,')}
                </td>
                <td className='paymentType' style={middleAlign}>
                    {order.pickup.payType}
                </td>
                <td style={nowrap}>
                    {btnDiffCharge}
                </td>
                <td className='centerAlign' style={middleAlign}>
                    <a className="pointer" onClick={(event)=>_this.showClietHandler(order.userInfo.uid, order.orderId)}>{commentLength}</a>
                    <br />
                </td>
                <td className='centerAlign' style={middleAlign}><a className="pointer" onClick={(event)=>showItemList(itemUrl)}>보기</a></td>
                <td style={middleAlign}>{pickupRanger}</td>
                <td style={middleAlign}>{deliveryRanger}</td>
                <td id='DeliveryPee' className='centerAlign' style={middleAlign}>
                    {deliveryFeeText}
                </td>
            </tr>
        )
    }
}
OrderTR.propTypes = propTypes;
OrderTR.defaultProps = defaultProps;


export default OrderTR;


