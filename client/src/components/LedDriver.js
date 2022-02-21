import React, { Component } from 'react';
import axios from 'axios';
import '../styles/LedDriver.css';

import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined';

class LedDriver extends Component {

    constructor(props) {
        super(props)
        
        let DateTime = new Date(Date.now() + 300000);

        this.state = {
            device: {
                signal: false
            },
            time: DateTime.toLocaleTimeString('pl-PL', {hour: 'numeric', minute: 'numeric'}),
            onClicked: false,
            countClick: 0,
            lastClicked: 0,
            getDerivedStateFromProps: false
        };

        this.driverCLick = this.driverCLick.bind(this);
        this.driverTime = this.driverTime.bind(this);
    }

    componentWillMount(){
        const server_dev = 'http://localhost:9000';
        const server_build = 'https://cml-homekit-server.herokuapp.com';

        axios.get(server_dev + '/device/signal')
        .then(res => {
          console.log(res.data.signal);
          this.setState((prevState, props) => ({
            device: {
              signal: (1 === res.data.signal) ? true : false
            }
          }));
        })
        .catch(err => {
          console.log(err);
        });
    }

    driverCLick(){
        //https://cml-homekit-server.herokuapp.com/device/signal
        this.setState((prevState, props) => ({
            device: {
                signal: !prevState.device.signal ? true : false
            },
            onClicked: true
        }), () => {
            axios.post('http://localhost:9000/device/signal', {signal: this.state.device.signal, time: this.state.time})
            .catch(err => {
                this.setState((prevState, props) => ({
                    device: {
                        signal: false
                    }
                }));
            });
        });
    }

    driverTime(e){
        this.setState({
            time: e.target.value
        });
    }

    render() {
        return (
            <div>
                <div className="driver-box" onClick={this.driverCLick} dv-status={this.state.device.signal.toString()} >
                    <div className="driver-box--content d-flex align-items-center">
                        <div>
                            <h2><EmojiObjectsOutlinedIcon fontSize="large" /></h2>
                            <p className="mb-0">Oświetlenie LED {this.state.clicked}</p>
                            <p className="device-active-text">Aktywny</p>
                        </div>
                    </div>
                </div>
                <div className="driver-time">
                    <div className="form-group">
                        <label>Godzina wyłączenia</label>
                        <input className="form-control" type="time" name="driver-setting['time']" onChange={this.driverTime} value={this.state.time}></input>
                    </div>
                </div>
            </div>
        )
    }
}

export default LedDriver
