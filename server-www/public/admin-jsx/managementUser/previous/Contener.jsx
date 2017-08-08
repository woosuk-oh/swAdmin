import React, {Component} from 'react';
import PropTypes from 'prop-types';
import WorkSheet from './WorkSheet.jsx';
import OrderTR from './OrderTR.jsx';
import utilFunction from './utilFunction.jsx';

const propTypes = {};
const defaultProps = {};

class Contener extends Component {
    constructor(props) {
        super(props);

        const ListDefault = {
            payType: "ALL",
            pickupRanger: "ALL",
            deliveryRanger: "ALL",
            camp: "ALL",
            pageIndex: 1
        }

        return {
            payType: ListDefault.payType,
            pickupRanger: ListDefault.payType,
            deliveryRanger: ListDefault.payType,
            camp: ListDefault.camp,
            pageIndex: ListDefault.pageIndex,
            loading: true,
            error: null,
        }

        this.changeOrderList = this.changeOrderList.bind(this);
        this.onChangedPayType = this.onChangedPayType.bind(this);
        this.onChangePRF = this.onChangePRF.bind(this);
        this.onChangeDRF = this.onChangeDRF.bind(this);
        this.onChangeCamp = this.onChangeCamp.bind(this);
        this.setList = this.setList.bind(this);

    }

    componentDidMount() {
        var _this = this;
        this.props.promise.then(function (value) {
            var data = JSON.parse(value)
            if (data.code != 200) {
                alert('error');
            }
            var pageSize = Math.ceil(data.data.length / defaultPageSize);
            _this.setState({
                orderList: data.data,
                "origin": data.data,
                loading: false,
                pageSize: pageSize,
                currentIdx: 1
            });
        }, function (reason) {
            alert('error')
            console.error(reason);
        });


    }

    componentDidUpdate() {
        setTimeout(() => {
            resizeUI();
        }, 0);

    }

    changeOrderList(idx) {
        $("html, body").animate({scrollTop: 0}, 800);
        this.setState({currentIdx: parseInt(idx)});
    }

    onChangedPayType(event) {
        this.setList();
    }

    onChangePRF(event) {
        this.setList();
    }

    onChangeDRF(event) {
        this.setList();
    }

    onChangeCamp(event) {
        this.setList();
    }

    setList() {
        var orderList = (this.state.dump != undefined) ? this.state.dump : this.state.origin;
        var payType = ($("#payTypeFilter").val() == undefined) ? "" : ($("#payTypeFilter").val() == ListDefault.payType) ? "" : $("#payTypeFilter").val();
        var pickupRanger = ($("#pickupRanger").val() == undefined) ? "" : ($("#pickupRanger").val() == ListDefault.pickupRanger) ? "" : $("#pickupRanger").val() + "@washswat.com";
        var deliveryRanger = ($("#deliveryRanger").val() == undefined) ? "" : ($("#deliveryRanger").val() == ListDefault.deliveryRanger) ? "" : $("#deliveryRanger").val() + "@washswat.com";
        var campName = ($("#selectCamp").val() == undefined) ? "" : ($("#selectCamp").val() == ListDefault.camp) ? "" : $("#selectCamp").val();
        var query = {};
        var setObj = {};

        if (payType != '') {
            query["pickup.payType"] = payType;
            setObj["payType"] = payType;
        }
        if (pickupRanger != '') {
            query["pickup.swatId"] = pickupRanger;
            setObj["pickupRanger"] = this.props.sliceSwatId(pickupRanger);
        } else {
            setObj["pickupRanger"] = ListDefault.pickupRanger;
        }
        if (deliveryRanger != '') {
            query["delivery.swatId"] = deliveryRanger;
            setObj["deliveryRanger"] = this.props.sliceSwatId(deliveryRanger);
        } else {
            setObj["deliveryRanger"] = ListDefault.pickupRanger;
        }
        if (campName != '') {
            var centerId = this.props.getSelectCenterId(campName);
            query['userInfo.centerId'] = centerId;
            setObj["camp"] = campName;
        }
        var array = [];
        for (var i = 0; i < orderList.length; i++) {
            var obj = orderList[i];
            var check = 0;
            for (var key in query) {
                var qArr = key.split('.');
                if (query[key] === this.props.getObjectLastValue(obj, qArr)) {
                    check++;
                }
            }
            if (Object.keys(query).length === check) {
                array.push(obj);
            }
        }
        setObj["orderList"] = array;
        var pageSize = Math.ceil(array.length / defaultPageSize);
        setObj["pageSize"] = pageSize;
        this.setState(setObj);
    }

    showPopUp(objectId, type, target) {
        $('#myModal').html('');
        var _this = this;
        var orderList = _this.state.orderList;
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
        ReactDOM.render(<PopUp elements={obj}/>, document.getElementById('myModal'));
        $('#myModal').modal('show');
    }


    render() {
        var _this = this;
        var orderList = this.state.orderList;
        if (orderList != undefined) {
            var pageDiv = [];
            for (var i = 0; i < this.state.pageSize; i++) {
                var value = i + 1;
                var cl = "";
                if (this.state.currentIdx === value) {
                    cl = "active";
                }
                pageDiv.push(<Navi key={"##" + i} changeOrderList={this.changeOrderList} index={i} value={value}
                                   cl={cl}/>);
            }
            var max = defaultPageSize * this.state.currentIdx;
            var min = (max - defaultPageSize === 0) ? 0 : (max - defaultPageSize) + 1;
            if (max >= orderList.length) {
                /** last **/
                max = orderList.length;
                var t = this.state.currentIdx - 1;

                min = (t * defaultPageSize);
                if (min > 0) min += 1;
            }
            orderList = orderList.slice(min, max);
        }
        if (this.state.loading) {
            return (<h1 className='centerAlign'> loading </h1>)
        } else {
            return (
                <div>
                    <div className="col-xs-12">
                        <WorkSheet data={this.state.orderList}/>
                    </div>
                    <div className="col-xs-12">
                        <table className="table table-bordered" id="all">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>
                                    <select className='form-control' id='selectCamp' value={this.state.camp}
                                            onChange={this.onChangeCamp}>
                                        <option>{ListDefault.camp}</option>
                                        {centerArray.map(function (center, idx) {
                                            return <option key={center._id}>{center.name.replace('캠프', '')}</option>
                                        })}
                                    </select>
                                </th>
                                <th>이름/<br/>전화번호</th>
                                <th>주문번호</th>
                                <th>결제시간</th>
                                <th>배달 예정 시간</th>
                                <th>결제<br/>금액</th>
                                <th>할인<br/>금액</th>
                                <th>
                                    <select className='form-control' id='payTypeFilter'
                                            onChange={this.onChangedPayType}>
                                        <option>{ListDefault.payType}</option>
                                        <option>bill</option>
                                        <option>cash</option>
                                        <option>card</option>
                                        <option>later</option>
                                    </select>
                                </th>
                                <th>차액</th>
                                <th>댓글</th>
                                <th>품목</th>
                                <th>
                                    <select className='form-control' id='pickupRanger' onChange={this.onChangePRF}
                                            value={this.state.pickupRanger}>
                                        <option>{ListDefault.pickupRanger}</option>
                                        {Object.keys(swatRanger).map(function (group, idx) {
                                            var option = [];
                                            {
                                                swatRanger[group].map(function (ranger, idx) {
                                                    option.push(<option value={sliceSwatId(ranger.email)}
                                                                        key={'pickupRanger#' + idx}>{ranger.name}({ranger.koName})</option>);
                                                })
                                            }
                                            return [
                                                <option key={'pickupRanger#' + idx} disabled>
                                                    --{swatRanger[group][0].role}--</option>,
                                                option
                                            ]
                                        })}
                                    </select>
                                </th>
                                <th>
                                    <select className='form-control' id='deliveryRanger' onChange={this.onChangeDRF}
                                            value={this.state.deliveryRanger}>
                                        <option>{ListDefault.pickupRanger}</option>
                                        {Object.keys(swatRanger).map(function (group, idx) {
                                            var option = [];
                                            {
                                                swatRanger[group].map(function (ranger, idx) {
                                                    option.push(<option value={sliceSwatId(ranger.email)}
                                                                        key={'deliveryRanger#' + idx}>{ranger.name}({ranger.koName})</option>);
                                                })
                                            }
                                            return [
                                                <option key={'deliveryRanger#' + idx} disabled>
                                                    --{swatRanger[group][0].role}--</option>,
                                                option
                                            ]
                                        })}
                                    </select>
                                </th>
                                <th>배달비</th>
                            </tr>
                            </thead>
                            <tbody id='table-body'>
                            {orderList.map(function (order, idx) {
                                return <OrderTR key={order._id} order={order} index={idx} showPopUp={_this.showPopUp}/>
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-xs-12">
                        <nav aria-label="Page navigation">
                            <ul className="pagination">
                                <li>
                                    <a href="#" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                                {pageDiv}
                                <li>
                                    <a href="#" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )
        }
    }
}
let Navi = React.createClass({
    render : function(){
        return (<li className={this.props.cl}><a className="pointer" onClick={()=>this.props.changeOrderList(this.props.index+1)}>{this.props.value}</a></li>);
    },
})

Contener.propTypes = propTypes;
Contener.defaultProps = defaultProps;


export default Contener;
