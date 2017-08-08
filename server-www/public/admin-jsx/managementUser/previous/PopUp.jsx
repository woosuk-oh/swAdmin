import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {};
const defaultProps = {};

class PopUp extends Component {
    constructor(props) {
        super(props);
        var order = this.props.elements.order
        var price = parseInt(order.pickup.finalPrice);
        var payType = order.pickup.payType

        if (this.props.elements.type == "diffCharge") {
            payType = "bill"
            var diffCharge = (order.pickup.payType == 'later') ? LATER : 0;
            var alert = order.alert
            alert = (Array.isArray(alert)) ? alert : [];
            for (var i in alert) {
                if (alert[i].button != undefined) {
                    if (alert[i].button.action == "payment") {
                        diffCharge = ADDTIONAL_PEE;
                        price = parseInt(alert[i].button.needPayPrice);
                        break;
                    } else if (alert[i].button.action == "refund") {
                        diffCharge = REFUND;
                        price = parseInt(alert[i].button.needRefundPrice);
                        break;
                    }
                }
            }
        }
        return {
            order: this.props.elements.order,
            target: this.props.elements.target,
            type: this.props.elements.type,
            isReturn: false,
            payType: payType,
            finalPrice: price,
            diffCharge: diffCharge
        };
    }


    componentDidMount() {
        if (this.state.type == "discount") {
            this.changeDiscountType();
        }
        $('textarea').keypress(function (event) {
            if (event.which == 13) {
                event.preventDefault();
                var s = $(this).val();
                $(this).val(s + "\n");
            }
        });
    }

    payDiffCharge() {
        var payType = this.state.payType
        var finalPrice = this.state.finalPrice
        var _this = this
        $.post("/admin/updateDiffCharge", {
            'type': this.state.diffCharge,
            'objectId': this.state.order._id,
            'payType': payType,
            'finalPrice': finalPrice,
            'swatId': getCookie("swatId")
        }, function (data) {
            if (data.code == 200) {
                alert('등록성공')
                _this.setState({order: data.order});
                _this.props.elements.target.setState({order: data.order});
            } else {
                alert('error')
            }
        }, 'json');
    }

    changeDiscountType() {
        var discountType = $('#popupDiscountType').val();
        if (discountType == "none") {
            $("#discount").attr("readonly", true);
            var totalPrice = this.state.order.pickup.totalPrice;
            if (this.state.order.pickup.isPayDeliveryFee) {
                totalPrice += 2000;
            }
            this.state.order.pickup.finalPrice = totalPrice
            var finalPrice = totalPrice.toString().replace(/(\d)(?=(\d\d\d)+$)/g, '$1,') + "원";
            $('#finalPrice').val(finalPrice);
            $('#discount').val('');
        } else {
            $("#discount").attr("readonly", false);
        }
    }

    changeDiscount() {
        var discount = $('#discount').val();
        if (isNaN(discount)) {
            return;
        }
        var finalPrice = this.state.order.pickup.finalPrice.toString().replace(/(\d)(?=(\d\d\d)+$)/g, '$1,') + "원";
        if (discount == '') {
            $('#finalPrice').val(finalPrice);
            return;
        }

        var type = $('#popupDiscountType').val();
        finalPrice = this.state.order.pickup.finalPrice
        var totalPrice = this.state.order.pickup.totalPrice;
        if (this.state.order.pickup.isPayDeliveryFee) {
            totalPrice += 2000;
        }

        if (type == "discountRate") {
            var newDiscount = totalPrice * parseInt(discount) / 100;
            finalPrice = totalPrice - newDiscount;
        } else {
            finalPrice = totalPrice - parseInt(discount);
        }
        this.state.order.pickup.finalPrice = finalPrice
        finalPrice = finalPrice.toString().replace(/(\d)(?=(\d\d\d)+$)/g, '$1,') + "원";
        $('#finalPrice').val(finalPrice);
    }

    closePopUp() {
        $('#myModal').modal('hide');
        $('#myModal').html('');
    }

    checkTag(code) {
        var issue = (this.state.order.issue != undefined) ? this.state.order.issue : [];
        var check = false;
        for (var i = 0; i < issue.length; i++) {
            if (issue[i].code == code) {
                if (issue[i].isIssue) {
                    check = true;
                }
            }
        }
        return check;
    }

    addComment() {
        var comment = $('.commentTextarea').val();

        if (comment == '') {
            alert('코멘트를 입력하세요');
            return;
        }

        var objectId = this.state.order._id;
        var swatId = getCookie("swatId");

        var o = {
            "objectId": objectId,
            "type": "insert",
            "swatId": swatId,
            "comment": comment
        }

        var _this = this;
        $.post("/admin/commentHandler", {'obj': JSON.stringify(o)}, function (data) {
            if (data.code === 200) {
                var order = _this.state.order;
                var commentList = order.swatComment;
                for (var i = 0; i < commentList.length; i++) {
                    commentList[i].isKing = "false";
                }

                commentList.push({
                    "comment": comment,
                    "isKing": "true",
                    "swatId": swatId,
                    "regdate": new Date()
                });

                order.swatComment = commentList;
                _this.setState({order: order});
                _this.props.elements.target.setState({order: order});
                $('.commentTextarea').val('');
            } else {
                alert('에러!');
            }
        }, 'json');
    }

    deleteComment(index) {
        var commentList = this.state.order.swatComment;
        if (commentList[index].isKing == "true") {
            alert('대표 코멘트는 삭제할수 음슴');
        } else {
            if (confirm("이거 삭제??") == true) {
                var objectId = this.state.order._id;
                var o = {
                    "objectId": objectId,
                    "type": "delete",
                    "index": index
                }

                var _this = this;
                $.post("/admin/commentHandler", {'obj': JSON.stringify(o)}, function (data) {
                    if (data.code === 200) {
                        var order = _this.state.order;
                        var commentList = order.swatComment;
                        commentList.splice(index, 1);
                        order.swatComment = commentList;
                        _this.setState({order: order});
                        _this.props.elements.target.setState({order: order});
                        $('.commentTextarea').val('');
                    } else {
                        alert('에러!');
                    }
                }, 'json');
            } else {
                return;
            }
        }
    }

    changeKingComment(index) {
        var commentList = this.state.order.swatComment;
        if (commentList[index] == undefined) {
            return;
        }
        if (commentList[index].isKing != "true") {
            if (confirm("이 코멘트를 대표 코멘트로 설정 하시겠습니까?") == true) {
                var objectId = this.state.order._id;

                var o = {
                    "objectId": objectId,
                    "type": "changeKing",
                    "index": index
                }

                var _this = this;
                $.post("/admin/commentHandler", {'obj': JSON.stringify(o)}, function (data) {
                    if (data.code === 200) {
                        var order = _this.state.order;
                        var commentList = order.swatComment;
                        for (var i = 0; i < commentList.length; i++) {
                            if (index == i) {
                                commentList[i].isKing = "true";
                            } else {
                                commentList[i].isKing = "false";
                            }
                        }

                        order.swatComment = commentList;
                        _this.setState({order: order});
                    } else {
                        alert('에러!');
                    }
                }, 'json');
            }
        } else {
            return;
        }
    }

    updateUComment(index, type) {
        var commentList = this.state.order.swatComment;
        var comment = (type == 'update') ? commentList[index].comment : '';
        var objectId = this.state.order._id;

        var o = {
            "objectId": objectId,
            "uid": this.state.order.userInfo.uid,
            "type": "uComment",
            "comment": comment
        }

        var _this = this;
        $.post("/admin/commentHandler", {'obj': JSON.stringify(o)}, function (data) {
            if (data.code === 200) {
                var order = _this.state.order;
                order.userInfo.comment = comment;
                _this.setState({order: order});
                alert('완료!');
            } else {
                alert('에러!');
            }
        }, 'json');
    }

    updateDiscount() {
        var _this = this;
        var order = this.state.order;
        var pickup = order.pickup;

        pickup.discountRate = 0;
        pickup.eventDiscount = 0;
        pickup.usePoint = 0;
        var discountType = $('#popupDiscountType').val();
        if (discountType != 'none') {
            pickup[discountType] = parseInt($('#discount').val());
        }

        var obj = {
            objectId: order._id,
            updateType: 'newDiscount',
            totalPrice: pickup.totalPrice,
            finalPrice: pickup.finalPrice,
            discountRate: pickup.discountRate,
            eventDiscount: pickup.eventDiscount,
            usePoint: pickup.usePoint
        }

        if (pickup.usePoint > 0) {
            obj.payType = 'usePoint'
        }

        if (!confirm('할인 정보를 변경을 저장 하시겠습니까?\n 다시 한번 확인 하시고 \'확인\'버튼을 눌러주세요.')) {
            return;
        }

        if (pickup.usePoint > 0 && !confirm('포인트 할인을 선택하셨습니다. 유저의 포인트가 ' + pickup.usePoint.toString().replace(/(\d)(?=(\d\d\d)+$)/g, '$1,') + '원 추가 차감됩니다. 단순히 확인을 위해서 팝업창을 경우에는 \'취소\'를 누르고 \'닫기\'를 누르세요')) {
            return;
        }

        $.post("/admin/updateOrder", {'obj': JSON.stringify(obj)}, function (data) {
            if (data.code == 100) {
                alert('error');
            } else if (data.code == 300) {
                alert('포인트가 부족합니다. 어드민에서 확인해주세요.\n');
                _this.setState({'order': order});
                _this.state.target.setState({'order': order});
            }
            else {
                alert('저장 완료');
                _this.setState({'order': order});
                _this.state.target.setState({'order': order});
                _this.closePopUp()
            }
        }, 'json')
    }

    updatePayment() {
        var _this = this;
        var order = this.state.order;
        var pickup = order.pickup;

        pickup.payType = $('#popupPayType').val();

        var obj = {
            objectId: order._id,
            updateType: 'payType',
            payType: pickup.payType
        }

        if (!confirm('결제 수단 변경을 저장 하시겠습니까?\n 다시 한번 확인 하시고 \'확인\'버튼을 눌러주세요.')) {
            return;
        }

        $.post("/admin/updateOrder", {'obj': JSON.stringify(obj)}, function (data) {
            if (data.code == 100) {
                alert('error');
            } else {
                alert('저장 완료');
                _this.setState({'order': order});
                _this.state.target.setState({'order': order});
                _this.closePopUp()
            }
        }, 'json')
    }

    updateDeliveryTime(order, target) {
        var dateSelector = $('#daySelector').val();
        var hourSelector = $('#TimeSelector').val();
        var _this = this;
        var objectId = order._id;
        var o;

        if (dateSelector == "none") {
            o = {
                "updateType": "deliveryTimeDelete",
                "objectId": objectId,
            }
        } else {
            var dateArr = dateSelector.split(" ");
            var month = parseInt(dateArr[0]);
            var date = parseInt(dateArr[1]);
            var hours = parseInt(hourSelector.split(":")[0]);
            var curDate = new Date();
            var deliveryTime = new Date(curDate.getFullYear(), month - 1, date, hours);
            var t = new Date(deliveryTime);
            var deliveryTimeString = t.format('MM월 dd일 E요일 HH:00-')
            t.setHours(hours + 1);
            deliveryTimeString += t.format('HH:00');
            t.setHours(hours);

            o = {
                "updateType": "deliveryTime",
                "objectId": objectId,
                "deliveryTime": deliveryTime,
                "deliveryTimeString": deliveryTimeString,
                "originOrder": order
            }
        }

        $.post("/admin/updateOrder", {"obj": JSON.stringify(o)}, function (result) {
            if (result.code != 200) {
                alert('error');
            } else {
                order.deliveryTime = deliveryTime
                order.deliveryTimeString = deliveryTimeString
                target.setState({order: order})
                _this.closePopUp();
            }
        }, 'json');
    }


    render() {
        var title = "";
        var content;
        var popUpWidth = "modal-dialog";
        var _this = this;

        switch (this.state.type) {
            case "pay" :
                title = "지불수단";

                var formLabel = {
                    verticalAlign: 'middle',
                    textAlign: 'center',
                }
                content = (
                    <div>
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                    onClick={(event) => this.closePopUp()}>&times;</button>
                            <h4 className="modal-title">{title}</h4>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <label className='col-sm-2 control-label' htmlFor='totalPrice'>지불수단 : </label>
                                    <div className='col-sm-10'>
                                        <select className='form-control' id='popupPayType'
                                                defaultValue={this.state.order.pickup.payType}>
                                            <option value='bill'>모바일결제</option>
                                            <option value='cash'>현금결제</option>
                                            <option value='card'>카드결제</option>
                                            <option value='later'>후불</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer marginZero">
                            <button type="button" id="btn_save" onClick={(event) => this.updatePayment()}
                                    className="btn btn-success">저장
                            </button>
                            <button type="button" className="btn btn-default" data-dismiss="modal"
                                    onClick={(event) => this.closePopUp()}>닫기
                            </button>
                        </div>
                    </div>
                );
                break;

            case "discount":
                title = "할  인";
                var discountType = "none";
                var discount = '';
                if (this.state.order.pickup.usePoint > 0) {
                    discountType = "usePoint";
                    discount = this.state.order.pickup.usePoint;
                } else if (this.state.order.pickup.eventDiscount > 0) {
                    discountType = "eventDiscount";
                    discount = this.state.order.pickup.eventDiscount;
                } else if (this.state.order.pickup.discountRate > 0) {
                    discountType = "discountRate";
                    discount = this.state.order.pickup.discountRate;
                }

                var totalPrice = this.state.order.pickup.totalPrice.toString().replace(/(\d)(?=(\d\d\d)+$)/g, '$1,') + "원";
                var finalPrice = this.state.order.pickup.finalPrice.toString().replace(/(\d)(?=(\d\d\d)+$)/g, '$1,') + "원";

                var formLabel = {
                    verticalAlign: 'middle',
                    textAlign: 'center',
                }
                content = (
                    <div>
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                    onClick={(event) => this.closePopUp()}>&times;</button>
                            <h4 className="modal-title">{title}</h4>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <label className='col-sm-2 control-label' htmlFor='totalPrice'>품목합계 : </label>
                                    <div className='col-sm-10'>
                                        <input id='totalPrice' type='text' className='form-control'
                                               defaultValue={totalPrice} placeholder='총액' readOnly/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className='col-sm-2 control-label' htmlFor='totalPrice'>할 인 : </label>
                                    <div className='col-sm-10'>
                                        <select className='form-control discountSelector' id='popupDiscountType'
                                                defaultValue={discountType}
                                                onChange={(event) => this.changeDiscountType()}>
                                            <option value='none'>할인없음</option>
                                            <option value='usePoint'>포인트사용</option>
                                            <option value='eventDiscount'>이벤트할인</option>
                                            <option value='discountRate'>비율할인</option>
                                        </select>
                                        <input type='text' className='form-control discountPrice'
                                               defaultValue={discount} id='discount' placeholder='할인'
                                               onChange={(event) => this.changeDiscount()}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className='col-sm-2 control-label' htmlFor='finalPrice'>결제금액 : </label>
                                    <div className='col-sm-10'>
                                        <input type='text' className='form-control' defaultValue={finalPrice}
                                               id='finalPrice' placeholder='결제금액' readOnly/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer marginZero">
                            <button type="button" id="btn_save" onClick={(event) => this.updateDiscount()}
                                    className="btn btn-success">저장
                            </button>
                            <button type="button" className="btn btn-default" data-dismiss="modal"
                                    onClick={(event) => this.closePopUp()}>닫기
                            </button>
                        </div>
                    </div>
                );
                break;
            default :
                title = (this.state.type == "pTime") ? "수거시간 선택" : "배달시간 선택";
                var beforeTime = (this.state.type == "pTime") ? new Date(this.state.order.pickupTime) : new Date(this.state.order.deliveryTime);
                var dayArray = [0, 1, 2, 3, 4, 5, 6];
                var timeArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

                var defaultDay = (beforeTime.getMonth() + 1) + "월 " + beforeTime.getDate() + "일";
                var defaultTime = ((beforeTime.getHours() < 10) ? '0' + beforeTime.getHours() : beforeTime.getHours() ) + ":00-" + (beforeTime.getHours() + 1) + ":00";
                var undecidedTitle = (this.state.type == "pTime") ? "" : (
                    <option value='none'>배달시간 미정</option>
                );

                content = (
                    <div>
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                    onClick={(event) => this.closePopUp()}>&times;</button>
                            <h4 className="modal-title">{title}</h4>
                        </div>
                        <div className="modal-body">
                            <div>
                                <select className='form-control discountSelector' id='daySelector'
                                        defaultValue={defaultDay}>
                                    {undecidedTitle}
                                    {
                                        dayArray.map(function (d) {
                                            var today = new Date();
                                            today.setDate(today.getDate() + d);
                                            var optionString = (today.getMonth() + 1) + "월 " + today.getDate() + "일";
                                            return <option key={d} value={optionString}>{optionString}</option>
                                        })
                                    }
                                </select>
                                <select className='form-control discountPrice' id='TimeSelector'
                                        defaultValue={defaultTime}>
                                    {
                                        timeArray.map(function (t) {
                                            var time = 9 + t;
                                            var endTime = time + 1;
                                            if (time == 9) {
                                                time = "0" + time;
                                            }
                                            var optionString = time + ":00-" + endTime + ":00";
                                            return <option key={t} value={optionString}>{optionString}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer marginZero">
                            <button type="button" id="btn_save" className="btn btn-success"
                                    onClick={(event) => this.updateDeliveryTime(_this.state.order, _this.state.target)}>
                                저장
                            </button>
                            <button type="button" className="btn btn-default" data-dismiss="modal"
                                    onClick={(event) => this.closePopUp()}>닫기
                            </button>
                        </div>
                    </div>
                );
                break;
        }
        return (
            <div className={popUpWidth}>
                <div className="modal-content">
                    {content}
                </div>
            </div>
        );
    }
}
PopUp.propTypes = propTypes;
PopUp.defaultProps = defaultProps;


export default PopUp;
