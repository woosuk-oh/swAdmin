import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import RaisedButton from 'material-ui/RaisedButton';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

const propTypes = {};
const defaultProps = {};

class style {


    constructor(props) {

        {/*<RaisedButton label="Default" />*/
        }

        this.nowrap = {
            whiteSpace: 'nowrap',
            verticalAlign: 'middle'
        },
            this.centerAlign = {
                textAlign: 'center'
            },

            this.middleAlign = {
                verticalAlign: 'middle'
            }
        this.campColorArray = [
            {color: "Blue"},
            {color: "Cyan"},
            {color: "hotpink"},
            {color: "Green"},
            {color: "Red"},
            {color: "Yellow"}
        ]
    }

/*
    getDialog() {

        return (
            <div>
                <Button onClick={() => this.setState({open: true})}>Open alert dialog</Button>
                <Dialog open={this.state.open} onRequestClose={this.handleRequestClose}>
                    <DialogTitle>
                        {"Use Google's location service?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Let Google help apps determine location. This means sending anonymous location data to
                            Google, even when no apps are running.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleRequestClose} color="primary">
                            Disagree
                        </Button>
                        <Button onClick={this.handleRequestClose} color="primary">
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }*/
}


export default style;

