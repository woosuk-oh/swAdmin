import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Contener from './Contener.jsx'

const propTypes = {};
const defaultProps = {};

var utilFunction = {}

utilFunction.getDate = function(type){
    let ContenerClass = null;


    switch (type) {
        case "기간" :
        case "날짜별" :
            var getType = (type == "기간") ? "term" : "day";
            var start = (type == "기간") ? new Date($('#date-start').val()) : new Date($('#date-date').val());
            var end = (type == "기간") ? new Date($('#date-end').val()) : new Date($('#date-date').val());
            end.setDate(end.getDate() + 1);
            var check = false;
            if (type === "기간") {
                if (dateInvlidCheck(start) && dateInvlidCheck(end) && dateDiffCheck(start, end)) {
                    check = true;
                }
            } else {
                if (dateInvlidCheck(start) && dateDiffCheck(start, end)) {
                    check = true;
                }
            }
            var obj = {
                'start': start,
                'end': end
            }
            if (ContenerClass == null) {
                ContenerClass = ReactDOM.render(<Contener
                    promise={$.post("/admin/getManagementUser", {'data': JSON.stringify(obj)})}/>, document.getElementById('Contener'));
            } else {
                ContenerClass.setState({loading: true});
                $.post("/admin/getManagementUser", {'data': JSON.stringify(obj)}, function (data) {
                    if (data.code != 200) {
                        alert('error');
                    }
                    ContenerClass.setState({
                        orderList: data.data,
                        "dump": data.data,
                        loading: false,
                        pageSize: Math.ceil(data.data.length / defaultPageSize)
                    })
                }, 'json')
            }
            break;
        default :
            var searchType = "";
            switch (type) {
                case "이름" :
                    searchType = "name";
                    break;
                case "uid" :
                    searchType = "uid";
                    break;
                case "주소" :
                    searchType = "address";
                    break;
                case "바코드" :
                    searchType = "barcodeId";
                    break;
                case "전화번호" :
                    searchType = "phone";
                    break;
                case "주문번호" :
                    searchType = "orderId";
                    break;
                case "가방번호" :
                    searchType = "bagNum";
                    break;
            }
            var id = "#searchKeyword_" + type;
            var searchKeyword = $(id).val();
            var obj = {
                'type': searchType,
                'searchKeyword': searchKeyword
            }
            if (ContenerClass != null) {
                ContenerClass.setState({loading: true});
            }
            $.post("/admin/getSearchUser", {'data': JSON.stringify(obj)}, function (data) {
                if (data.code != 200) {
                    alert('error');
                } else {
                    var orderList = [];
                    for (var i in data.data) {
                        switch (data.data[i].status) {
                            case 'wait':
                            case 'ing':
                            case 'delivery':
                            case 'over':
                            case 'complete':
                                orderList.push(data.data[i]);
                                break;
                            default:
                                continue;
                        }
                    }

                    if (ContenerClass == null) {
                        ContenerClass = ReactDOM.render(<Contener
                            order={orderList}/>, document.getElementById('Contener'));
                    } else {
                        ContenerClass.setState({
                            'orderList': orderList,
                            "dump": data.data,
                            'loading': false,
                            pageSize: Math.ceil(data.data.length / defaultPageSize)
                        });
                    }
                }
            }, 'json');
    }
}

// class utilFunction{
// /*    constructor(props) {
//         super(props);
//
//         this.getData = this.getData.bind(this);
//         this.deleteTag = this.deleteTag.bind(this);
//
//     }*/
//
//     /*
//      render()
//      {
//      return (
//      <div>utilFunction</div>
//      );
//      }
//      */
//     deleteTag(obj) {
//         if (confirm("이거 삭제??") == true) {
//             var objectId = $('#myModal2').attr('objectId');
//             var changeRow;
//             $('#all').children('tbody').children('tr').each(function (j) {
//                 var keepObjectId = $(this).attr('objectId');
//                 if (keepObjectId === objectId) {
//                     changeRow = $(this);
//                     return false;
//                 }
//             });
//
//             var selected = $(obj).attr("code");
//             var o = {
//                 "objectId": objectId,
//                 "type": selected,
//                 "isIssue": false,
//                 "from": getCookie('swatId')
//             }
//
//             $.post("/admin/updateIssue", {'data': JSON.stringify(o)}, function (data) {
//                 if (data.code === 200) {
//                     var list = $("#issueList").val().split("/");
//                     var issueList = "";
//                     for (var i = 0; i < list.length - 1; i++) {
//                         if (list[i] != selected) {
//                             issueList += list[i] + "/";
//                         }
//                     }
//                     $(changeRow).children('.issue').children('a').attr('message', issueList);
//                 } else {
//                     alert('에러!');
//                 }
//                 $('#myModal2').modal('hide');
//             }, 'json');
//
//         } else {
//             return;
//         }
//     }
//
//     saveIssue(obj) {
//         var objectId = $('#myModal2').attr('objectId');
//         var changeRow;
//         $('#all').children('tbody').children('tr').each(function (j) {
//             var keepObjectId = $(this).attr('objectId');
//             if (keepObjectId === objectId) {
//                 changeRow = $(this);
//                 return false;
//             }
//         });
//
//         var selected = $("#issueSelector option:selected").attr("code");
//         var o = {
//             "objectId": objectId,
//             "type": selected,
//             "isIssue": true,
//             "from": getCookie('swatId')
//         }
//
//         $.post("/admin/updateIssue", {'data': JSON.stringify(o)}, function (data) {
//             if (data.code === 200) {
//                 var issueList = $("#issueList").val() + selected + "/";
//                 $(changeRow).children('.issue').children('a').attr('message', issueList);
//             } else {
//                 alert('에러!');
//             }
//             $('#myModal2').modal('hide');
//         }, 'json');
//     }
//
//     changeShop(from) {
//         var shop = $(from).attr('cl');
//         for (var z = 0; z < shopArray.length; z++) {
//             if (shop === shopArray[z].cl) {
//                 $("select[name=laundryShop]").val(shopArray[z].shop);
//             }
//         }
//     }
//
//     splitSwatId(swatId) {
//         if (swatId === undefined) return "";
//         return swatId.split("@")[0];
//     }
//
//     showItemList(url) {
//         var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
//         var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
//         var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
//         var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
//         var w = 1100;
//         var h = 800;
//         var left = ((width / 2) - (w / 2)) + dualScreenLeft;
//         var top = ((height / 2) - (h / 2)) + dualScreenTop;
//         var option = 'height=' + h + ',width=' + w + ',top=' + top + ',left=' + left;
//         var wi = window.open(url, 'window_name', option);
//         wi.focus();
//
//     }
//
//     sliceMessage(message) {
//         if (message.length > 10) {
//             message = message.substring(0, 10) + "...";
//         }
//         return message;
//     }
//
//     sliceSwatId(swatId) {
//         if (swatId === undefined || swatId === null) {
//             return "-";
//         }
//         var re = swatId.split("@");
//         if (re.length === 1) {
//             return "-";
//         } else {
//             return re[0];
//         }
//     }
//
//     getIssueColor(code) {
//         var color = "";
//         for (var i = 0; i < adminTag.length; i++) {
//             if (code == adminTag[i].code) {
//                 color = adminTag[i].color;
//             }
//         }
//         return color;
//     }
//
//     getIssueTextColor(code) {
//         var color = "";
//         for (var i = 0; i < adminTag.length; i++) {
//             if (code == adminTag[i].code) {
//                 color = adminTag[i].textColor;
//             }
//         }
//         return color;
//     }
//
//     dateInvlidCheck(date) {
//         if (isNaN(date)) {
//             alert('정상적인 날짜를 입력!');
//             return false;
//         }
//         return true;
//     }
//
//     dateDiffCheck(start, end) {
//         if (end < start) {
//             alert('시작일이 클 수 없어!');
//             return false;
//         }
//         return true;
//     }
//
//     countMonths(start_date, end_date) {
//         return (end_date.getFullYear() - start_date.getFullYear()) * 12 + (end_date.getMonth() - start_date.getMonth());
//     }
//
//     getPayType(pickup) {
//         if (pickup != undefined) {
//             var temp = "-";
//             switch (pickup.payType) {
//                 case "card" :
//                     temp = "카드결제";
//                     break;
//                 case "cash" :
//                     temp = "현금결제";
//                     break;
//                 case "bill" :
//                     temp = "모바일결제";
//                     break;
//                 case "later" :
//                     temp = "후불";
//                     break;
//             }
//             return temp;
//         } else {
//             return "-";
//         }
//     }
//
//     getObjectLastValue(obj, array) {
//         if (array.length > 1) {
//             var newObj = obj[array[0]];
//             if (newObj === undefined) {
//                 return ListDefault.deliveryRanger;
//             } else {
//                 array.shift();
//                 var key = array[0];
//                 var value = newObj[key];
//                 return newObj[key];
//             }
//         } else {
//             var key = array[0];
//             var value = obj[key];
//             return value;
//         }
//     }
//
//     getSelectCenterId(campName) {
//         var _id = "";
//         for (var i = 0; i < centerArray.length; i++) {
//             var name = centerArray[i].name;
//             if (name.indexOf(campName) !== -1) {
//                 _id = centerArray[i]._id;
//                 break;
//             }
//         }
//         return _id;
//     }
//
//     getSelectCenterId(campName) {
//         var _id = "";
//         for (var i = 0; i < centerArray.length; i++) {
//             var name = centerArray[i].name;
//             if (name.indexOf(campName) !== -1) {
//                 _id = centerArray[i]._id;
//                 break;
//             }
//         }
//         return _id;
//     }
//
//     getCookie(cName) {
//         cName = cName + '=';
//         var cookieData = document.cookie;
//         var start = cookieData.indexOf(cName);
//         var cValue = '';
//         if (start != -1) {
//             start += cName.length;
//             var end = cookieData.indexOf(';', start);
//             if (end == -1) end = cookieData.length;
//             cValue = cookieData.substring(start, end);
//         }
//         return unescape(cValue);
//     }
//
//     getCenterName(centerId) {
//         for (var i = 0; i < centerArray.length; i++) {
//             if (centerArray[i]._id == centerId) {
//                 var name = centerArray[i].name;
//                 return {"name": name.replace('캠프', ''), "index": i};
//             }
//         }
//         return {"name": "세특", "index": centerArray.length};
//         ;
//     }
//
// }


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

utilFunction.propTypes = propTypes;
utilFunction.defaultProps = defaultProps;


export default utilFunction();
