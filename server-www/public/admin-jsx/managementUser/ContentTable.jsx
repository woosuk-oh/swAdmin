import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ContentBody from './ContentTR.jsx';
import style from './style.jsx';
import util from './util.jsx';
import Container from './Container.jsx';


const propTypes = {};
const defaultProps = {};

class Content extends util {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            campList: [],



        }
        // console.log(this.props.data);

    }

    componentWillReceiveProps(newProps) {
        //console.log(newProps.data)
        this.setState({data: newProps.data || []})


        // console.log("componentWillReceiveProps: " + JSON.stringify(newProps));

    }

    componentDidMount(props) {
        this.setState({

            'data': this.props.data,

        });
    }


    render() {
        let cssStyle = new style();
        let orderList = this.state.data || [];
        let _this = this;




       /* /!** 수거요원 셀렉트 **!/

        if (this.state.selectedPickupRanger == "전체" || this.state.selectedPickupRanger == "") {
            // console.log(swatRanger);
        } else {

            orderList = this.pickupRangerSelected(_this.state.selectedPickupRanger);

            // console.log(this.state.selectedPickupRanger)

        }*/


 /*       /!** 배달요원 셀렉트 **!/
        if (this.state.selectedDeliveryRanger == "전체" || this.state.selectedDeliveryRanger == "") {

        } else {
            orderList = orderList.filter(function (item) {

                if (item.delivery != undefined) {
                    return this.state.selectedDeliveryRanger == _this.getSliceSwatId(item.delivery.swatId);
                }
            }, this)

            /!* 로그찍으려면 맵함수 필요. order배열의 크기만큼 반복해주기 때문
             orderList.map(function (order, idx) {
             console.log(this.getSliceSwatId(order.delivery.swatId));

             }, this)*!/

        }*/


        console.log(orderList);


        return (

            <table className="table table-bordered" id="all">
                <thead>
                <tr>
                    <th style={cssStyle.centerAlign}>#</th>

                    <th style={cssStyle.centerAlign}>{/*<p>캠프</p>*/}
                        <select id="camp-select" className="form-control"
                                onChange={(event) => {
                                    _this.props.selectedCamp(event.target.value)
                                }}>
                            <option value="ALL">캠프</option>
                            {
                                centerArray.map(function (elem) {
                                    return <option value={elem._id}>{elem.name}</option>
                                })
                            }

                        </select>
                    </th>
                    <th style={cssStyle.centerAlign}>고객정보</th>
                    <th style={cssStyle.centerAlign}>주문번호</th>
                    <th style={cssStyle.centerAlign}>결제시간</th>
                    <th style={cssStyle.centerAlign}>배달 예정 시간</th>
                    <th style={cssStyle.centerAlign}>최종결제금액</th>
                    <th style={cssStyle.centerAlign}>할인금액</th>
                    <th style={cssStyle.centerAlign}>
                        <select id="payType-select" className="form-control"
                                onChange={(event) => {
                                    _this.props.onSelectedPayType(event.target.value)
                                }
                                }>
                            {/* this.setState({selectedPayType: event.target.value})*/}
                            <option value="ALL">결제수단</option>
                            <option value="bill">bill</option>
                            <option value="cash">cash</option>
                            <option value="card">card</option>
                            <option value="later">later</option>
                        </select>
                    </th>
                    <th style={cssStyle.centerAlign}>차액</th>
                    <th style={cssStyle.centerAlign}>상세보기</th>
                    <th style={cssStyle.centerAlign}>

                        <select id="pickupRanger-select" className="form-control"
                                onChange={(event) => {
                                    _this.props.onSelectedPickupRanger(event.target.value)}
                                }>
                            <option value="ALL">수거요원</option>
                            {

                                Object.keys(swatRanger).map(function (group, idx) {
                                    const option = [];
                                    {
                                        swatRanger[group].map(function (ranger, idx) {
                                            option.push(<option value={this.getSliceSwatId(ranger.email)}
                                                                key={'pickupRanger#' + idx}>{ranger.name}({ranger.koName})</option>);
                                        }, this)
                                    }
                                    return [<option key={'pickupRanger#' + idx} disabled>
                                        --{swatRanger[group][0].role}--</option>, option]
                                }, this)}
                            }

                        </select>
                    </th>
                    <th style={cssStyle.centerAlign}>


                        <select id="deliveryRanger-select" className="form-control"
                                onChange={(event) =>

                                {_this.props.onSelectedDeliveryRanger(event.target.value)}
                                }>
                            <option value="ALL">배달요원</option>
                            {


                                Object.keys(swatRanger).map(function (group, idx) {
                                    const option = [];
                                    {
                                        swatRanger[group].map(function (ranger, idx) {
                                            option.push(<option value={this.getSliceSwatId(ranger.email)}
                                                                key={'deliveryRanger#' + idx}>{ranger.name}({ranger.koName})</option>);
                                        }, this)
                                    }
                                    return [<option key={'deliveryRanger#' + idx} disabled>
                                        --{swatRanger[group][0].role}--</option>, option]
                                }, this)}
                            }
                        </select>


                    </th>
                    <th style={cssStyle.centerAlign}>배달비</th>
                </tr>
                </thead>

                <tbody id='table-body'>


                {orderList.map(function (order, idx) {


                    // if(centerArray[i]._id == order.userInfo.centerId && )
                    return <ContentBody key={order._id} order={order} index={idx}/>
                })}


                </tbody>


            </table>


        );
    }
}
Content.propTypes = propTypes;
Content.defaultProps = defaultProps;


export default Content;
