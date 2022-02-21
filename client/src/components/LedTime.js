import React, {Component} from 'react';
import axios from 'axios';

import '.././styles/App.css';

export class LedTime extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             hour:      '00',
             minute:    '00'
        }
    }
    

    render() {
        return (
            <div>
                <div className="led-time">
                    <div className="led-time-container">
                        <div className="led-time-header"><div className="icon-clock icon-center"></div></div>
                        <div className="led-time-item">

                            <div className="clock-input-group">
                                <div className="clock-label"><p>Godzina</p></div>
                                <div className="clock-select" onClick={this.changeHour}>
                                    <p>{this.state.hour}</p>
                                </div>
                            </div>

                            <div className="clock-input-group">
                                <div className="clock-label"><p>Minuta</p></div>
                                <div className="clock-select" onClick={this.changeMinute}>
                                    <p>{this.state.minute}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LedTime
