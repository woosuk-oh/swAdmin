import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ContentBody from './ContentBody.jsx';
import style from './style.jsx';
import util from './util.jsx';


const propTypes = {};
const defaultProps = {};

class Content extends util {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            campList: [],
            selectedCamp: "",
            selectedPayType: "",
            selectedPickupRanger: "",
            selectedDeliveryRanger: "",


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

        console.log(orderList);


        /** 캠프 셀렉트 **/
        if (this.state.selectedCamp == "전체" || this.state.selectedCamp == "") {

            //캠프 선택을 전체로 해놓거나 초기 값인 경우. 전체캠프 데이터 가져옴.
        } else {

            orderList = orderList.filter(function (item) {

                return this.getSelectCenterId(_this.state.selectedCamp) == item.userInfo.centerId
                // 선택한 캠프로 설정된 데이터만 가져옴.
                // 캠프 id값을 받아오고 있기 때문에, util에 있는 getSelectCenterId 함수 이용하고
                // 캠프이름을 다시 가져와서 선택한 캠프명과 같은지 비교함
            }, this)


        }

        /** 결제수단 셀렉트 **/
        if (this.state.selectedPayType == "전체" || this.state.selectedPayType == "") {


        } else {

            //위에서 필터링된 결과인 orderList를 한번 더 필터링 (중첩 필터)
            orderList = orderList.filter(function (item) {
                return _this.state.selectedPayType == item.pickup.payType;

            })

   /*          //콘솔 보기용 맵 함수
             orderList.map(function (order, idx) {
             console.log(_this.getCenterName(order.userInfo.centerId));

             })*/
        }
        /** 수거요원 셀렉트 **/

        if (this.state.selectedPickupRanger == "전체" || this.state.selectedPickupRanger == "") {
            // console.log(swatRanger);
        } else {

            orderList = orderList.filter(function (item) {
                return this.state.selectedPickupRanger == this.getSliceSwatId(item.pickup.swatId);

            }, this)

            // console.log(this.state.selectedPickupRanger)

        }


        /** 배달요원 셀렉트 **/
        if (this.state.selectedDeliveryRanger == "전체" || this.state.selectedDeliveryRanger == "") {

        } else {
            orderList = orderList.filter(function (item) {

                if (item.delivery != undefined) {
                    return this.state.selectedDeliveryRanger == _this.getSliceSwatId(item.delivery.swatId);
                }
            }, this)

          /* 로그찍으려면 맵함수 필요. order배열의 크기만큼 반복해주기 때문
          orderList.map(function (order, idx) {
                console.log(this.getSliceSwatId(order.delivery.swatId));

            }, this)*/

        }


        return (
            <div className="col-xs-12">
                <table className="table table-bordered" id="all">
                    <thead>
                    <tr>
                        <th style={cssStyle.centerAlign}>#</th>

                        <th style={cssStyle.centerAlign}>{/*<p>캠프</p>*/}
                            <select id="camp-select" className="form-control"
                                    onChange={(event) =>
                                        this.setState({selectedCamp: this.handleCampSelectChange(event)})}>
                                <option value="전체">전체</option>
                                {
                                    centerArray.map(function (index) {
                                        return <option value={index.name}>{index.name}</option>
                                    })
                                }

                            </select>
                        </th>
                        <th style={cssStyle.centerAlign}>이름 <br/>전화번호</th>
                        <th style={cssStyle.centerAlign}>주문번호</th>
                        <th style={cssStyle.centerAlign}>결제시간</th>
                        <th style={cssStyle.centerAlign}>배달 예정 시간</th>
                        <th style={cssStyle.centerAlign}>최종결제금액</th>
                        <th style={cssStyle.centerAlign}>할인금액</th>
                        <th style={cssStyle.centerAlign}>
                            <select id="payType-select" className="form-control"
                                    onChange={(event) =>
                                        this.setState({selectedPayType: event.target.value})}>
                                <option value="전체">전체</option>
                                <option value="bill">bill</option>
                                <option value="cash">cash</option>
                                <option value="card">card</option>
                                <option value="later">later</option>
                            </select>
                        </th>
                        <th style={cssStyle.centerAlign}>차액</th>
                        <th style={cssStyle.centerAlign}>상세보기</th>
                        <th style={cssStyle.centerAlign}>

                            수거요원

                            <select id="pickupRanger_select" className="form-control"
                                    onChange={(event) =>
                                        this.setState({selectedPickupRanger: event.target.value})}>
                                <option value="전체">전체</option>
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

                            배달요원

                            <select id="deliveryRanger_select" className="form-control"
                                    onChange={(event) =>
                                        this.setState({selectedDeliveryRanger: event.target.value})}>
                                <option value="전체">전체</option>
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
            </div >

        );
    }
}
Content.propTypes = propTypes;
Content.defaultProps = defaultProps;


export default Content;
