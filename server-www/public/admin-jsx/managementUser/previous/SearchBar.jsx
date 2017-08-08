import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SearchDetail from './SearchDetail.jsx';
    import utilFunction from './utilFunction.jsx'

const propTypes = {};
const defaultProps = {};



let defaultPageSize = 100;

class SearchBar extends utilFunction {
    constructor(props) {

        super(props);

        let SAERCHLIST = [
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

            type: SAERCHLIST

        }

    }


    render() {
        var _this = this;
        return (
            <div className="col-xs-12">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Option
                    </div>
                    <div className="panel-body">
                        <ul className="nav nav-tabs">
                            {_this.state.type.map(function (type) {
                                var id = "#" + type.id;
                                return <li value={type.name} key={type.id}><a href={id}
                                                                              data-toggle="tab">{type.name}</a></li>
                            })}
                        </ul>
                        <div className="tab-content">
                            {_this.state.type.map(function (type) {
                                return <div className="tab-pane fade in " key={type.id} id={type.id}>
                                    <div className="padding-1em"></div>
                                    <SearchDetail type={type.name}/></div>
                            })}
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}


SearchBar.propTypes = propTypes;
SearchBar.defaultProps = defaultProps;


export default SearchBar;


$(document).ready(function () {
    ReactDOM.render(<SearchBar />, document.getElementById('SearchBar'))

    this.props.getData(SAERCHLIST[0].name);
});