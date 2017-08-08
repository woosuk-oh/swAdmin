import React, {Component} from 'react';
import PropTypes from 'prop-types';
import style from './style.jsx';
// import DatePicker from 'material-ui/DatePicker';
import ContentBody from './ContentTR.jsx';

const propTypes = {};
const defaultProps = {};


/** 베이스 컴포넌트 (컨트롤러 및 기타 유틸) **/

class util extends Component {


    constructor(props) {
        super(props);

        this.state = {}

        /** 날짜 포맷 관련 유틸**/

        Date.prototype.format = function (f) {
            if (!this.valueOf()) return "-";

            var weekName = ["일", "월", "화", "수", "목", "금", "토"];
            var d = this;
            var h;

            return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
                switch ($1) {
                    case "yyyy":
                        return d.getFullYear();
                    case "yy":
                        return (d.getFullYear() % 1000).zf(2);
                    case "MM":
                        return (d.getMonth() + 1);
                    case "dd":
                        return d.getDate();
                    case "E":
                        return weekName[d.getDay()];
                    case "HH":
                        return d.getHours().zf(2);
                    case "hh":
                        return ((h = d.getHours() % 12) ? h : 12).zf(2);
                    case "mm":
                        return d.getMinutes().zf(2);
                    case "ss":
                        return d.getSeconds().zf(2);
                    case "a/p":
                        return d.getHours() < 12 ? "오전" : "오후";
                    default:
                        return $1;
                }
            });
        };


    }

    /** 차액 확인 **/

    getDiffCahrge(alert, diffCharge) {
        const LATER = 1
        const ADDTIONAL_PEE = 2
        const REFUND = 3

        alert = (Array.isArray(alert)) ? alert : [];
        for (var i in alert) {
            if (alert[i].button != undefined) {
                if (alert[i].button.action == "payment") {
                    diffCharge = ADDTIONAL_PEE;
                    break;
                } else if (alert[i].button.action == "refund") {
                    diffCharge = REFUND;
                    break;
                }
            }
        }
        return diffCharge;


    }

    /** 차액 스티커 붙이는 용도 **/

    getPaySticker(diffCharge) {
        const LATER = 1
        const ADDTIONAL_PEE = 2
        const REFUND = 3

        var btnDiffCharge


        switch (diffCharge) {
            case LATER:
                btnDiffCharge = <div className="btnDiffCharge centerAlign">후불결제</div>
                break;
            case ADDTIONAL_PEE:
                btnDiffCharge = <div className="btnDiffCharge centerAlign">추가금</div>
                break;
            case REFUND:
                btnDiffCharge = <div className="btnDiffCharge centerAlign">환불</div>
                break;
            default:

        }
        return btnDiffCharge;
    }

    /** 어느 캠프인지 확인용 '캠프아이디 -> 캠프명' **/
    getCenterName(centerId) {

        for (var i = 0; i < centerArray.length; i++) {
            if (centerArray[i]._id == centerId) {
                var name = centerArray[i].name;
                return {"name": name.replace('캠프', ''), "index": i};
            }
        }
        return {"name": "세특", "index": centerArray.length};
    }

    /** 현재 받아오는 데이터에서는 캠프명이 아니라, 캠프 아이디로 받고 있기 때문에 '캠프명으로 작업하려면' 변환이 필요함.
     * '캠프명 -> 캠프아이디'   **/
    getSelectCenterId(campName) {
        var _id = "";
        for (var i = 0; i < centerArray.length; i++) {
            var name = centerArray[i].name;
            if (name.indexOf(campName) !== -1) {
                _id = centerArray[i]._id;
                break;
            }
        }
        return _id;
    }

    /** 1,000단위 '쉼표' 처리 **/
    getPriceFormat(price) {
        return price.toString().replace(/(\d)(?=(\d\d\d)+$)/g, '$1,') + ' 원';

    }

    /** (세특 내부용) 코멘트 몇개 달려있는지 확인 **/
    getCommLength(persistentComm, swatComm) {
        var hasPersistentComment = 0;
        let swatCommLength = swatComm.length;


        if (persistentComm != undefined && persistentComm != "") {
            hasPersistentComment += 1;
        }

        return ((swatCommLength + hasPersistentComment) == 0) ? "-" : "[ " + (swatCommLength + hasPersistentComment) + " ]"
    }

    /** 코멘트 관련 핸들러 **/
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

    /** 이름/전화번호 클릭하면 뜨는 윈도우 **/
    showUserInfoHandler(userId, objId) {
        let url = '/admin/changeUserInfo?uid=' + userId + "&objectId=" + objId;
        let dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        let dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        let w = 1400;
        let h = 800;
        let left = ((width / 2) - (w / 2)) + dualScreenLeft;
        let top = ((height / 2) - (h / 2)) + dualScreenTop;
        let option = 'height=' + h + ',width=' + w + ',top=' + top + ',left=' + left;
        let wi = window.open(url, 'userinfo', option);
        wi.focus();
    }

    /** 요원아이디 뒤에 이메일형식 자르기 (요원 이름만 보이도록) **/
    getSliceSwatId(swatId) {
        if (swatId === undefined || swatId === null) {
            return "-";
        }

        var re = swatId.split("@");
        if (re.length === 1) {
            return "-";
        } else {
            return re[0];
        }
    }

    /** ContentHead에서 캠프 셀렉트 했을때 선택한 값 반환해줌 **/
    handleCampSelectChange(e) {
        let type = e.target.value
        return type;
    }




    // TODO this 전체 데이터 받아와야하는듯
    // TODO popup 컴포넌트로 전달해야되는데 컴포넌트로? 아님 이 클래스 안에서 전달?
/*
    showPopUp(objectId, type, target) {
        $('#myModal').html('');


        var _this = target;
        var orderList = _this.state.order;
        console.log(_this.state.order)
        var index = -1;
        for (var i = 0; i < orderList.length; i++) {
            if (orderList[i]._id === objectId) {
                index = i;
            }
        }
        if (index < 0) {
            alert("에러 발생!!!");
            return;
        }

        var obj = {
            "order": orderList[index],
            "index": index,
            "type": type,
            "target": target
        }
        // $('#myModal').modal('show');

        ReactDOM.render(<PopUp elements={obj}/>, document.getElementById('myModal'));
        $('#myModal').modal('show');
    }*/



    updateDeliveryTime(order, callback, target) {

        // $('#myModal').html('');


        var dateSelector = $('#daySelector').val();
        var hourSelector = $('#TimeSelector').val();
        console.log(order);
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

        $.post( "/admin/updateOrder",{"obj" : JSON.stringify(o)} ,function( result ) {
            console.log(o);
            if(result.code!=200){
                callback('error',{code :100, result:'error'})
                alert('error');
            } else {

                //TODO 배달시간 변경되면 페이지에 적용되어야함(셋스테이트 해서 렌더링해야됨
                // target.setState({order:order})

                order.deliveryTime = deliveryTime
                order.deliveryTimeString =deliveryTimeString
                callback(null,{code :200, result:'ok', data: order})
            }

        },'json');

        // document.getElementById('myModal');
        // $('#myModal').modal('show');


    }

    /** 수거 및 배달시간 배열(오늘부터 ~ 일주일 뒤까지) **/
    getDayArray(beforeTime){
        var dayArray = [0, 1, 2, 3, 4, 5, 6];
        var defaultDay = (beforeTime.getMonth() + 1) + "월 " + beforeTime.getDate() + "일";


        return(
            <select className='form-control' id='daySelector' defaultValue={defaultDay}>
                {
                    dayArray.map(function(d) {
                        var today = new Date();
                        today.setDate(today.getDate() + d);
                        var optionString = (today.getMonth() + 1) + "월 " + today.getDate() + "일";
                        return <option key={d} value={optionString}>{optionString}</option>
                    })
                }
            </select>
        );
    }


    getTimeArray(beforeTime){
        var timeArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        var defaultTime = ((beforeTime.getHours() < 10)? '0' + beforeTime.getHours() : beforeTime.getHours() ) + ":00-" + (beforeTime.getHours() + 1) + ":00";

        return(
            <select className='form-control' id='TimeSelector' defaultValue={defaultTime}>
                {
                    timeArray.map(function(t) {
                        var time = 9 + t;
                        var endTime = time + 1;
                        if(time == 9) {
                            time = "0" + time;
                        }
                        var optionString = time + ":00-" + endTime + ":00";
                        return <option key={t} value={optionString}>{optionString}</option>
                    })
                }
            </select>
        );

    }



}


String.prototype.string = function (len) {
    var s = '', i = 0;
    while (i++ < len) {
        s += this;
    }
    return s;
};
String.prototype.zf = function (len) {
    return "0".string(len - this.length) + this;
};
Number.prototype.zf = function (len) {
    return this.toString().zf(len);
};


util.propTypes = propTypes;
util.defaultProps = defaultProps;


export default util;
