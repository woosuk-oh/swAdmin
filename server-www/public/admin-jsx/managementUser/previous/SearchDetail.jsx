import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SearchBar from './SearchBar.jsx';
import utilFunction from './utilFunction.jsx';

const propTypes = {};
const defaultProps = {};

class SearchDetail extends utilFunction {
    constructor(props) {
        super(props);


        this.onClickedSearch = this.onClickedSearch.bind(this);
        this.search = this.search.bind(this);
        this.searchWidthParam = this.searchWidthParam.bind(this);
    }


    componentDidMount() {
        this.setDefault(this.props.type);

    }

    setDefault(type) {
        var _this = this;
        if (type == "기간") {
            var start = new Date();
            start.setDate(start.getDate() - 2);
            $('#picker-start').datepicker({
                format: 'yyyy-mm-dd',
                todayHighlight: true,
                orientation: 'top'
            }).datepicker('update', start);
            $('#picker-end').datepicker({
                format: 'yyyy-mm-dd',
                todayHighlight: true,
                orientation: 'top'
            }).datepicker('update', new Date());
        } else if (type == "날짜별") {
            $('#picker-date').datepicker({
                format: 'yyyy-mm-dd',
                todayHighlight: true,
                orientation: 'top'
            }).datepicker('update', new Date());
        } else {
            var id = "#searchKeyword_" + this.props.type;
            $(id).keydown(function (key) {
                if (key.keyCode == 13) {
                    _this.searchWidthParam(type);
                    return false;
                }
            });
        }

    }

    onClickedSearch(event) {
        this.search()
    }

    search() {
        if (this.ContenerClass != null) {
            this.ContenerClass.setState({
                payType: ListDefault.payType,
                pickupRanger: ListDefault.pickupRanger,
                deliveryRanger: ListDefault.pickupRanger
            });
        }
        this.getData(this.props.type);
    }

    searchWidthParam(type) {
        if (this.ContenerClass != null) {
            this.ContenerClass.setState({
                payType: ListDefault.payType,
                pickupRanger: ListDefault.pickupRanger,
                deliveryRanger: ListDefault.pickupRanger
            });
        }
        this.props.getData(type);
    }

    render() {
        var type = this.props.type;
        if(type == "기간") {
            return (
                <div className="col-xs-12">
                    <div className="col-xs-5">
                        <div className="pickerLabel">
                            <label>시작일 : </label>
                        </div>
                        <div className="pickerDate marginRight">
                            <div className='input-group date datepicker pickerD' id='picker-start' data-provide='datepicker'>
                                <input id='date-start' type='text' className='form-control'/>
                                <span className='input-group-addon'>
									<span className='glyphicon glyphicon-calendar'></span>
								</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-5">
                        <div className="pickerLabel">
                            <label>종료일 : </label>
                        </div>
                        <div className="pickerDate marginRight">
                            <div className='input-group date datepicker pickerD' id='picker-end' data-provide='datepicker'>
                                <input id='date-end' type='text' className='form-control'/>
                                <span className='input-group-addon'>
									<span className='glyphicon glyphicon-calendar'></span>
								</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-2 button-to-bottom-with-picker">
                        <button type='button' className='btn btn-primary ' onClick={this.onClickedSearch}>검색</button>
                    </div>
                </div>
            );
        } else if(type == "날짜별") {
            return (
                <div className="col-xs-12">
                    <div className="col-xs-10">
                        <div className="pickerLabel">
                            <label>날짜 : </label>
                        </div>
                        <div className="pickerDate marginRight">
                            <div className='input-group date datepicker pickerD' id='picker-date' data-provide='datepicker'>
                                <input id='date-date' type='text' className='form-control'/>
                                <span className='input-group-addon'>
									<span className='glyphicon glyphicon-calendar'></span>
								</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-2 button-to-bottom-with-picker">
                        <button type='button' className='btn btn-primary searchBtn' onClick={this.onClickedSearch}>검색</button>
                    </div>
                </div>
            );
        } else {
            var id="searchKeyword_"+type;
            return (
                <div className="col-xs-12">
                    <div className="col-xs-10 ">
                        <input type='text' className='form-control search-kw' id={id} placeholder={type}/>
                    </div>
                    <div  className="col-xs-2 button-to-bottom">
                        <button type='button' className='btn btn-primary' onClick={this.onClickedSearch}>검색</button>
                    </div>
                </div>
            );
        }
    }
}
SearchDetail.propTypes = propTypes;
SearchDetail.defaultProps = defaultProps;


export default SearchDetail;
