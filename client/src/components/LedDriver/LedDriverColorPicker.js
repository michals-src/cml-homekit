import React, { Component } from 'react';
import '../../styles/LedDriver.css';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import CloseIcon from '@material-ui/icons/Close';

class LedDriverColorPicker extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             expanded: false
        }
    }
    

    render() {
        return (
            <div className="driver-box-colorpicker" aria-expanded={this.props.isVisible.toString()}>
                <div className="container">
                    <header id="main" className="d-flex align-items-center">
                        <div className="driver-box-colorpicker--header">
                            <Row>
                                <Col xs={10}>
                                    <h1>Wybierz kolor</h1>
                                    <h5>Sterowanie oświetleniem</h5>
                                </Col>
                                <Col xs={2} className="text-right">
                                   <button className="btn-icon" onClick={this.props.toggleColorPicker}>
                                        <CloseIcon/>
                                   </button>
                                </Col>
                            </Row>
                        </div>
                    </header>
                </div>
            </div>
        )
    }
}

export default LedDriverColorPicker
