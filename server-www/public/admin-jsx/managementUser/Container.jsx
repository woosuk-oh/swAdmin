import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import swal from 'sweetalert';
import 'sweetalert/dist/sweetalert.css';
import '../../css/loading.css';
import 'react-datetime/css/react-datetime.css';
import 'rc-menu/assets/index.css';
import 'rc-dropdown/assets/index.css';

import style from './style.jsx';


import PropTypes from 'prop-types';
import ContentTable from './ContentTable.jsx';

const propTypes = {};
const defaultProps = {};
import util from './util.jsx';
import Pagination from "./Pagination.jsx";

class Container extends Component {
    constructor(props) {
        super(props);
        var SAERCHLIST = [
            {"name": '기간', "id": "period"},
            {"name": '날짜별', "id": "distance"},
            {"name": '이름', "id": "name"},
            {"name": '주소', "id": "address"},
            {"name": '바코드', "id": "code"},
            {"name": '전화번호', "id": "phone"},
            {"name": '주문번호', "id": "orderId"},
            {"name": '가방번호', "id": "bag"},
        ];

        this.state = {
            data: {},
            oderList: [],
            isLoaded: false,
            type: SAERCHLIST,
            orderList: {},
            dump: {},
            pageSize: "",
            selectedPayType: "ALL",
            selectedCampId: "ALL",
            selectedPickupRanger: "ALL",
            selectedDeliveryRanger: "ALL",
            pageOfItems: [],
        }

        this.selectedCamp = this.selectedCamp.bind(this);
        this.onSelectedPayType = this.onSelectedPayType.bind(this);
        this.filterHandler = this.filterHandler.bind(this);
        this.onSelectedPickupRanger = this.onSelectedPickupRanger.bind(this);
        this.onSelectedDeliveryRanger = this.onSelectedDeliveryRanger.bind(this);

        this.onChangePage = this.onChangePage.bind(this);

        //this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        let _this = this;

        let obj = {
            /*    'start': new Date($('#date-start').val()),
             'end': new Date($('#date-end').val())*/

            //TODO 서치바 만들면서 날짜 동적으로 바꿔야함
            'start': '2017-08-03',
            'end': '2017-08-04'

        }

        $.post('/admin/getManagementUser', {'data': JSON.stringify(obj)},
            function (result) {
                result = JSON.parse(result)
                if (result.code != 200) {
                    alert("오류ㅠ")
                    // TODO : 오류처리
                } else {
                    _this.setState({isLoaded: true, data: result.data, orderList: result.data}
                        , () => {
                            console.log("Data loaded!!!"), console.log(_this.state.data)

                        }
                    )
                }


            })


        //TODO 1. getData 완성. (위에 obj삭제 해야함
        // this.getData(SAERCHLIST[0].name);
    }


    //console.log(JSON.stringify(swatRanger)); // 요원릭스트


    /* getData(type) {
     switch (type) {
     case "기간:":
     case "날짜별":
     let start = (type=="기간")? new Date($('#date-end').val()) : new Date($('#date-date').val());
     let end = (type=="기간")? new Date($('#date-end').val()) : new Date($('#date-date').val());
     end.setDate(end.getDate()+1);
     let check = false;
     //TODO 2. 잘못된 기간 예외 처리 해야됨

     let obj = {
     'start' : start,
     'end':end
     }
     break;


     default :
     var searchType = "";
     switch(type) {
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


     }*/


    onSelectPage(page) {
        this.state.selectedPage = page
        this.filterHandler()

    }


    selectedCamp(campId) {
        this.state.selectedCampId = campId
        this.filterHandler()


    }


    onSelectedPayType(payType) {

        this.state.selectedPayType = payType;
        // console.log("선택: " + payType);
        this.filterHandler();


    }

    filterHandler() {

        let mUtil = new util();


        console.log(this.state.selectedCampId, this.state.selectedPayType, this.state.data)

        this.state.orderList
            = this.state.data.filter(function (item) {

            return (


                (this.state.selectedCampId == "ALL" || this.state.selectedCampId == item.userInfo.centerId) &&
                (this.state.selectedPayType == "ALL" || item.pickup.payType == this.state.selectedPayType) &&
                (this.state.selectedPickupRanger == "ALL" || this.state.selectedPickupRanger == mUtil.getSliceSwatId(item.pickup.swatId)) &&
                (this.state.selectedDeliveryRanger == "ALL" || item.delivery != undefined ? this.state.selectedDeliveryRanger == mUtil.getSliceSwatId(item.delivery.swatId) : false
                )


            )


        }, this)



        this.state.orderList.map(function (order, idx) {
            if (order.delivery != undefined)
                console.log(mUtil.getSliceSwatId(order.delivery.swatId));

        }, this)


        this.forceUpdate()
    }


    onSelectedPickupRanger(select) {

        this.state.selectedPickupRanger = select;
        console.log("선택한 픽업요원: " + this.state.selectedPickupRanger);
        this.filterHandler();

    }

    onSelectedDeliveryRanger(select) {
        this.state.selectedDeliveryRanger = select;
        console.log("선택한 배달요원 " + this.state.selectedDeliveryRanger);
        this.filterHandler();
    }


    onChangePage(pageOfItems) {

        console.log(this.state.orderList);
        this.setState({
            orderList: pageOfItems
        })

    }


    render() {


        if (this.state.isLoaded) {
            return (
                <div className="row">

                    <div className="col-md-12" style={{'marginTop': '7px'}}>
                        Container
                    </div>
                    <div className="row">
                    </div>
                    <div className="col-xs-12">
                        <ContentTable

                            selectedCamp={this.selectedCamp}
                            onSelectedPayType={this.onSelectedPayType}
                            onSelectedPickupRanger={this.onSelectedPickupRanger}
                            onSelectedDeliveryRanger={this.onSelectedDeliveryRanger}
                            data={this.state.orderList}
                        />
                        {/* {
                         this.state.pageOfItems.map(
                         item =>
                         <div key={item.id}>{item.name}</div>
                         )
                         }*/}

                        dddddddd

                        <Pagination item={this.state.orderList} onChangePage={this.onChangePage}/>
                    </div>


                </div>
            );


            /*  var _this = this;
             return(
             <div className="col-xs-12">
             <div className="panel panel-default">
             <div className="panel-heading">
             Option
             </div>
             <div className="panel-body">
             <ul className="nav nav-tabs">
             {_this.state.type.map(function (type) {
             var id = "#" + type.id;
             return <li value={type.name} key={type.id}><a href={id} data-toggle="tab">{type.name}</a></li>
             })}
             </ul>
             <div className="tab-content">
             {_this.state.type.map(function (type) {
             return <div className="tab-pane fade in " key={type.id} id={type.id}><div className="padding-1em"></div><SearchBar type={type.name}/></div>
             })}
             </div>
             </div>
             </div>
             </div>

             );*/

        } else {
            return (
                <div>
                    <div id="loading">
                        <ul className="bokeh">
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                </div>

            )
        }

    }
}
Container.propTypes = propTypes;
Container.defaultProps = defaultProps;


export default Container;


$(document).ready(function () {
    ReactDOM.render(<Container />, document.getElementById('Container'))

});
