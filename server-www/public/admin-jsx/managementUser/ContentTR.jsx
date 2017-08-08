import React, {Component} from 'react';
import PropTypes from 'prop-types';
import style from './style.jsx';
import util from './util.jsx';
import Pagination from './Pagination.jsx';


import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import Snackbar from 'material-ui/Snackbar';


const propTypes = {};
const defaultProps = {};


class ContentBody extends util {
    constructor(props) {
        super(props);

        // var exampleItems = _.range(1, order._id.length).map(i => { return { id: i, name: 'Item ' + i }; });

        this.state = {
            open: false,
            pageOfItems:[],

            objId: "",
            order: [],

            // exampleItems: exampleItems,


            status: "",
            // index: 0,
            centerId: "",
            campColorIndex: "",
            userName: "",
            userPhone: "",
            orderId: "",
            payedTime: "",
            deliveryTime: "",
            price: "",
            totalPrice: 0,
            discount: 0,
            isPayDeliveryPee: 0,
            discountRate: 0,
            usePoint: 0,
            eventDiscount: 0,
            payType: "",
            alert: [],
            persistentComm: "",
            swatComment: "",
            userId: 0,
            pickupRanger: "",
            deliveryRanger: "",
        }


        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleSaveClose = this.handleSaveClose.bind(this);
        this.handleTouchTap = this.handleTouchTap.bind(this);

        this.onChangePage = this.onChangePage.bind(this);


    }

    handleSaveClose(order) {
        var _this = this;
        console.log("눌림");
        this.updateDeliveryTime(order, function (err, result) { // 콜백 제외한 부분들 모두 실행 완료 후에 콜백함수 실행.
            if (err) {
                alert('error')
            } else if (result.code == 200) {
                let returnOrder = result.data;

                _this.setState({
                    open: false,
                    deliveryTime: returnOrder.deliveryTimeString,
                });

            }
        }, this)

        /* TODO 완료시 우측 상단에 뜨는 메시지 확인 필요

         return (
         <div>

         <Snackbar
         anchorOrigin={ {vertical : 'top', horizontal: 'right' }}
         open={open}
         onRequestClose={this.handleRequestClose}
         SnackbarContentProps={{
         'aria-describedby': 'message-id',
         }}
         message={<span id="message-id">I love snacks</span>}
         />

         </div>

         );*/


    }

    handleRequestClose() {
        this.setState({
            open: false,
        });
    }

    handleTouchTap() {
        this.setState({
            open: true,
        });
    }
    onChangePage(order){
        this.setState({order: order});

    }


    componentDidMount(props) {
        // 전부 쪼개서 독립적으로 저장. 좋은점은 아직 모르겠음.
        this.setState({
            'objId': this.props.order._id,
            'order': this.props.order,
            'status': this.props.order.status,
            // 'index': this.props.index,
            'centerId': this.props.order.userInfo.centerId,
            'campColorIndex': this.getCenterName(this.props.order.userInfo.centerId).index,
            'userName': this.props.order.userInfo.name,
            'userPhone': this.props.order.phone,
            'orderId': this.props.order.orderId,
            'userId': this.props.order.userInfo.uid,
            'payedTime': this.props.order.pickup.regdate,//결제시간
            'deliveryTime': this.props.order.deliveryTimeString,//배달시간
            'price': parseInt(this.props.order.pickup.finalPrice),//최종금액 (결제금액)
            'totalPrice': parseInt(this.props.order.pickup.totalPrice),
            'isPayDeliveryPee': this.props.order.pickup.isPayDeliveryFee, //수거.배달비
            'discountRate': parseInt(this.props.order.pickup.discountRate),
            'usePoint': parseInt(this.props.order.pickup.usePoint),
            'eventDiscount': parseInt(this.props.order.pickup.eventDiscount), //이벤트 할인
            'payType': this.props.order.pickup.payType,
            'alert': this.props.order.alert, //고객에게 발송하는 알림 메시지 (액션바)
            'persistentComm': this.props.order.userInfo.comment, //영구코멘트
            'swatComment': this.props.order.swatComment,
            'pickupRanger': this.getSliceSwatId(this.props.order.pickup.swatId),
            'deliveryRanger': (this.props.order.delivery != undefined) ? this.getSliceSwatId(this.props.order.delivery.swatId) :
                <p className='centerAlign'> - </p>,


        });

        // console.log(this.props.order);

    }


    render() {


        let cssStyle = new style();

        let _this = this;
        let idx = this.props.index;

        let objId = this.state.objId;
        let order = this.state.order;
        let status = this.state.status;


        const LATER = 1
        const ADDTIONAL_PEE = 2
        const REFUND = 3


        let campName = this.getCenterName(this.state.centerId).name;
        let campColorIndex = this.state.campColorIndex;
        let userName = this.state.userName;
        let userPhone = this.state.userPhone;
        let userId = this.state.userId;
        let orderId = this.state.orderId;
        let payTime = new Date(this.state.payedTime).format('MM월 dd일 HH:mm');
        let deliveryTime = this.state.deliveryTime;
        let payPrice = this.getPriceFormat(this.state.price)
        let totalPrice = this.state.totalPrice + ((this.state.isPayDeliveryPee) ? 2000 : 0)
        let discount = (totalPrice) * (this.state.discountRate / 100) + this.state.usePoint + this.state.eventDiscount;
        discount = this.getPriceFormat(discount);

        let payType = this.state.payType;
        let diffCharge = (payType == 'later') ? LATER : 0;
        diffCharge = this.getDiffCahrge(this.state.alert, diffCharge);
        let btnDiffCharge = this.getPaySticker(diffCharge);
        let persistentComm = this.state.persistentComm;
        let swatComment = this.state.swatComment;
        swatComment = this.getCommLength(persistentComm, swatComment);
        let pickupRanger = this.state.pickupRanger;
        let deliveryRanger = this.state.deliveryRanger;
        let deliveryFeeText = (this.state.isPayDeliveryPee === true) ? "●" : "X";


        let beforeTime = new Date(this.state.deliveryTime);

        if (status == 'wait' || status == 'ing' || status == 'delivery') {
            console.log(deliveryTime);


            deliveryTime = (

                <div>

                    <Button color="primary" onClick={() => this.setState({open: true})}
                            set>{this.state.deliveryTime}</Button>
                    <Dialog maxWidth="md" size="200%" open={this.state.open} transition={Slide}
                            onRequestClose={this.handleRequestClose}>
                        <DialogTitle>
                            {"배달 시간 선택"}
                        </DialogTitle>
                        <DialogContent>
                            {/*  <DialogContentText>
                             Let Google help apps determine location. This means sending anonymous location data to
                             Google, even when no apps are running.
                             </DialogContentText>*/}

                            {this.getDayArray(beforeTime)}
                            {this.getTimeArray(beforeTime)}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleRequestClose} color="primary">
                                Disagree
                            </Button>
                            <Button onClick={(event) => this.handleSaveClose(order)} color="primary">
                                Agree
                            </Button>
                        </DialogActions>
                    </Dialog>

                </div>
            )

        } else {
            // console.log(deliveryTime);

            deliveryTime = (<p>{(order.deliveryTimeString != undefined ) ? order.deliveryTimeString : '-'}</p>)

        }


        return (


                <tr id={'order#' + order.id} key={"Order#" + order._id}>
                    <td className="orderIndex centerAlign">{idx + 1}</td>
                    <td className="campName "
                        style={ Object.assign({}, cssStyle.middleAlign, cssStyle.centerAlign, cssStyle.campColorArray[campColorIndex])}>{campName}</td>
                    <td className="userInfo centerAlign" style={cssStyle.middleAlign}>
                        <a className="pointer"
                           onClick={(event) => _this.showUserInfoHandler(userId, objId)}>{userName}</a><br/>{userPhone}
                    </td>
                    <td className="orderId centerAlign" style={cssStyle.middleAlign}>{orderId}</td>
                    <td className="payTime centerAlign" style={cssStyle.middleAlign}>{payTime}</td>
                    <td className="deliveryTime centerAlign" style={cssStyle.middleAlign}>
                        <p> {deliveryTime} </p>


                    </td>
                    <td className="payPrice centerAlign" style={cssStyle.middleAlign}>{payPrice}</td>
                    <td className="discount centerAlign" style={cssStyle.middleAlign}>{discount}</td>
                    <td style={Object.assign({}, cssStyle.centerAlign, cssStyle.middleAlign)}>{payType}</td>
                    <td className="nowrap" style={cssStyle.middleAlign}>{btnDiffCharge}</td>
                    <td className='centerAlign' style={cssStyle.middleAlign}>
                        <a className="pointer"
                           onClick={(event) => _this.showClietHandler(userId, orderId)}>{swatComment}</a>
                    </td>
                    <td style={Object.assign({}, cssStyle.centerAlign, cssStyle.middleAlign)}>{pickupRanger}</td>
                    <td style={Object.assign({}, cssStyle.centerAlign, cssStyle.middleAlign)}>{deliveryRanger}</td>
                    <td style={Object.assign({}, cssStyle.centerAlign, cssStyle.middleAlign)}>{deliveryFeeText}</td>

                </tr>


        );
    }
}


ContentBody.propTypes = propTypes;
ContentBody.defaultProps = defaultProps;


export default ContentBody;
