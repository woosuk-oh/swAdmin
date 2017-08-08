/*
import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {};
const defaultProps = {};

class ContentPage extends Component {
    constructor(props)
    {
        super(props);

        this.state={
            pageOfItems: [],
            orderList: this.props.orderList,

        }

    }

    render()
    {
        return (
            <div>ContentPage</div>
        );
    }
}
ContentPage.propTypes = propTypes;
ContentPage.defaultProps = defaultProps;


export default ContentPage;





/!*
{
 this.state.pageOfItems.map(
 item =>
 <div key={item.id}>{item.name}</div>
 )
 }
 <Pagination item={this.state.orderList} onChangePage={this.onChangePage}/>
 *!/
*/
