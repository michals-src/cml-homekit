import React, { Component } from 'react';
import axios from 'axios';
import SettingsIcon from '@material-ui/icons/Settings';

import '../styles/LedDriver.css';

class RightBar extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             connection: true
        }
    }
    

    componentDidMount(){
        // axios.post('http://10.0.0.55/src_check/')
        // .then(res => {
        //     this.setState(props => ({
        //         connection: true
        //     }));
        // })
        // .catch(err => {
        //     this.setState(props => ({
        //         connection: false
        //     }));
        // });
    }

    render() {
        return (
            <div className="rightBar">
                <div className="rightBar--item" onClick={this.props.toggleColorPicker}>
                    <p>
                    <SettingsIcon />
                        <span className="p-2">Ustawienia</span>
                    </p>
                </div>
            </div>
        )
    }
}

export default RightBar
