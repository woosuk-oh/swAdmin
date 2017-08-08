import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {};
const defaultProps = {};

class WorkSheet extends Component {
    constructor(props)
    {
        super(props);
    }
    
    render() {
        var head = [];
        var content = [];
        var workSheetData = {
            '전체 거래액': 0,
            '최종 결제액': 0,
            '카드': 0,
            '빌링': 0,
            '현금': 0,
            '후불': 0,
            '이벤트 할인': 0,
            '퍼센트 할인': 0,
            '포인트 할인': 0,
            '거래수': 0,
            '객단가': 0
        };

        for (var key in workSheetData) {
            workSheetData[key] = 0;
        }
        var orderList = this.props.data;
        for (var i = 0; i < orderList.length; i++) {
            var order = orderList[i];
            var totalPrice = order.pickup.totalPrice + ((order.pickup.isPayDeliveryFee) ? 2000 : 0);
            var finalPrice = order.pickup.finalPrice;
            var discount = (finalPrice * (order.pickup.discountRate) / 100) + order.pickup.eventDiscount + order.pickup.usePoint;
            if (finalPrice != 0) {
                workSheetData['거래수']++;
            }
            workSheetData['전체 거래액'] += totalPrice
            workSheetData['최종 결제액'] += finalPrice
            workSheetData['이벤트 할인'] += order.pickup.eventDiscount;
            workSheetData['퍼센트 할인'] += ((totalPrice) * (order.pickup.discountRate) / 100);
            workSheetData['포인트 할인'] += order.pickup.usePoint;
            switch (order.pickup.payType) {
                case 'bill':
                    workSheetData['빌링'] += finalPrice;
                    break;
                case 'cash':
                    workSheetData['현금'] += finalPrice;
                    break;
                case 'card':
                    workSheetData['카드'] += finalPrice;
                    break;
                case 'later':
                    workSheetData['후불'] += finalPrice;
                    break;
                default:
            }
            workSheetData['객단가'] = parseInt(workSheetData['전체 거래액'] / workSheetData['거래수']);
        }
        var data = workSheetData;
        for (var i in data) {
            head.push(i);
            content.push(data[i]);
        }
        return (
            <table className="table table-bordered">
                <thead>
                <tr key="WorkSheetHead">
                    {head.map(function (head, idx) {
                        return <th key={"WSTH#" + idx}>{head}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                <tr key="WorkSheetBody">
                    {content.map(function (content, idx) {
                        return <td key={"WSTD#" + idx}>{content.toString().replace(/(\d)(?=(\d\d\d)+$)/g, '$1,')}</td>
                    })}
                </tr>
                </tbody>
            </table>
        )
    }
}
WorkSheet.propTypes = propTypes;
WorkSheet.defaultProps = defaultProps;


export default WorkSheet;
