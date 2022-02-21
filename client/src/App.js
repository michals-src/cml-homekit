import React, {Component} from 'react';
import axios from 'axios';

import './styles/App.css';
import LedLight from './components/LedLight';
import LedTime from './components/LedTime';

class App extends Component {

  /**
   * TODO
   * Schedule
   * Pasek aktywności czasu (progress bar)
   * Dodawanie urządzeń
   * Dodawanie kolorów
   * Zmiana kolorów
   * Łączenie się z urządzeniem (css)
   * Zablokowany przycisk (w przypadku braku, gdy nie ma połączenia z urządzeniem)
   */

  constructor(props) {
    super(props)

    let DateTime = new Date(Date.now() + 300000);
  
    this.state = {
      device: {
          signal: false
      },
      intensity: 0,
      time: DateTime.toLocaleTimeString('pl-PL', {hour: 'numeric', minute: 'numeric'}),
      onClicked: false,
      //countClick: 0,
      //lastClicked: 0,
      getDerivedStateFromProps: false,
      hour: DateTime.toLocaleTimeString('pl-PL', {hour: 'numeric'}),
      minute: DateTime.toLocaleTimeString('pl-PL', {minute: 'numeric'}),
      selectWinVal: [],
      selectWinVisible: false,
      activeSegments: 0
    }

    //this.showColorPicker = this.showColorPicker.bind(this);
    //this.hideColorPicker = this.hideColorPicker.bind(this);

    this.deviceClick = this.deviceClick.bind(this);
    this.changeHour = this.changeHour.bind(this);
    this.changeMinute = this.changeMinute.bind(this);

    this.selectWin = this.selectWin.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.intensityUp = this.intensityUp.bind(this);
    this.intensityDown = this.intensityDown.bind(this);
    this.intensityUpdate = this.intensityUpdate.bind(this);

  }


  componentDidMount(){
      const server_dev = 'http://localhost:9000';
      const server_build = 'https://srv-homekit-cml.herokuapp.com';


      axios.get(server_build + '/device/signal')
      .then(res => {

        let updateData = {
          device: {}
        };
        //updateData.device.signal = (1 === res.data.state) ? true : false;
  
        if( 0 < res.data.brightness ){
          updateData.hour = res.data.reccurenceRule.hour;
          updateData.minute = res.data.reccurenceRule.minute;
        }
        
        updateData.activeSegments = res.data.brightness;
        console.log(res);
        this.setState(updateData);
      })
      .catch(err => {
        console.log(err);
      });
  }

  deviceClick(){
      //https://cml-homekit-server.herokuapp.com/device/state
      this.setState((prevState, props) => ({
          device: {
              signal: !prevState.device.signal ? true : false
          },
          onClicked: true
      }), () => {
          axios.post('https://srv-homekit-cml.herokuapp.com/device/signal', {
            signal: this.state.device.signal, 
            time: this.state.hour + ':' + this.state.minute
          })
          .catch(err => {
              this.setState((prevState, props) => ({
                  device: {
                      signal: false
                  }
              }));
          });
      });
  }

  //componentDidMount(){
    
    // const device_url = 'http://10.0.0.55';
    

    //   axios.get(device_url + '/handshake/')
    //       .then(res => {

    //       })
    //       .catch( err => {

    //         this.setState((prevState, props) => ({
    //             device: {
    //               signal: prevState.device.signal,
    //               status: false
    //             }
    //         }));

    //         console.log('Nie połączono z urządzeniem');
    //       });

  //}


  // showColorPicker(){
  //   this.setState(props => ({
  //     LedDriverColorPicker: {
  //       visible: true
  //     } 
  //   }), () => {
  //     console.log(this.state.LedDriverColorPicker.visible);
  //   });
    
  // }

  // hideColorPicker(){
  //   this.setState(props => ({
  //     LedDriverColorPicker: {
  //       visible: false
  //     } 
  //   }));
  // }

  selectWin = (e) => {
    this.setState({
      selectWinVisible: true,
      selectWinVal: e.value,
      selectWinOnUpdate: e.onClick
    });
  }

  changeHour(e){

    const hours = [];
    for(let x=0;x<24;x++){
      let val = (x < 10) ? '0' + x : ''+ x + '';
      hours.push(val);
    }


    if(!this.selectWinVisible){
      this.selectWin({
        value: hours,
        onClick: 'hour'
      });
    }

  }

  changeMinute(e){
    const minutes = [];
    for(let x=0;x<60;x++){
      let val = (x < 10) ? '0' + x : x;
      minutes.push(val);
    }


    if(!this.selectWinVisible){
      this.selectWin({
        value: minutes,
        onClick: 'minute'
      });
    }
  }

  handleClick = value => () => {
    
    let p = this.state.selectWinOnUpdate;
    let abc = {
      selectWinVisible: false,
      selectWinVal: []
    };
    abc[p] = value;

    this.setState(abc);
  };

  intensityUp(){
      this.setState((prev, state) => ({
        intensity: (prev.intensity < 4) ? (prev.intensity+1) : 4
      }), () => {
        this.intensityUpdate();
      });
  }
  intensityDown(){
      this.setState((prev, state) => ({
        intensity: (prev.intensity > 0 ) ? (prev.intensity-1) : 0
      }), () => {
        this.intensityUpdate();
      });
  }
  intensityUpdate(){
    axios.post('https://srv-homekit-cml.herokuapp.com/device/power', {
      intensity: this.state.intensity
    })
    .then((res) => {

    })
    .catch(err => {
        
    });
  }
  
  changeLight = e => () => {

    const url_dev = 'http://localhost:9000/device/signal';
    const url = 'https://srv-homekit-cml.herokuapp.com/device/signal';


    
    this.setState((prev,state) => ({
      activeSegments: e
    }), () => {
      axios.post(url, {
        brightness: this.state.activeSegments,
        time: {
          hour: this.state.hour,
          minute: this.state.minute
        }
      })
      .catch( err => {
        console.log("Błąd komunikacji z serwerem, dane nie zostały zapisane", err);
      });
    });
  }

  render(){

    const intensityChildren = [0,1,2,3];
    let tmrSection = this.state.device.signal ? '' : 'out';


    const segmentsN = 8;
    let segments = [];

    for(let x = 0; x <= segmentsN; x++){
        let active = ((segmentsN - x) <= this.state.activeSegments && x !== segmentsN) ? true : false;
        let offSegment = (x >= segmentsN) ? true : false;

        segments.push(<div key={x} onClick={this.changeLight((segmentsN - x))} className={`led-light-child ${(offSegment ? `child-off` : ``)} ${((active) ? `child-active` : ``)}`}></div>);
    }

    return (
        <div>
          
          <div className="overall">
            <div className="work-area">
              <header id="main">
                  <h5>Cameolon homekit</h5>
                  <h1><strong>Sterowanie</strong></h1>

              </header>

              <div className="row">
                <div className="col-5">
                  
                  
                  
                <div>
                    <div className="led-light-bar">
                        {(segments).map((item, key) => {
                            return item
                        })}
                    </div>
                </div>
                
               
               
               </div>
                <div className="col-7">



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




                </div>
              </div>
            </div>
          </div>

          <div className="overall" style={{display: 'none'}}>

            <header id="main">
                <h3 className="font-black">Cameolon homekit</h3>
                <p><span className="icon-broadcast icon-right"></span >Bezprzewodowe sterowanie</p>
            </header>

            <div className={`timer-section ${tmrSection}`}>
              <div className="row">
                <div className="col-6">
                  <div className="icon-timer"></div>
                  <p className="font-title">Czas wyłączenia</p>
                </div>
                <div className="col-6">
                  <div className="flex">
                    <h3 className="text-right w-100">{this.state.hour} <small>h</small> {this.state.minute} <small>min</small></h3> 
                  </div>
                </div>
              </div>
            </div>

            <div className={`sleep-section ${this.state.device.signal ? '' : ' in'}`}>
              <div className="icon-zzz icon-center"></div>
            </div>

            <div className="device-section">
              <div className="device-container" onClick={this.deviceClick}>
                <div className="row">
                  <div className="col-6">
                    <div className="flex">
                      <h5 className="device-title">Moje oświetlenie</h5>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="flex">
                      <div className="icon-play icon-pos-right"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="intensity-section">
              <div className="intensity">
                {
                  intensityChildren.map((val, key) => {
                    return (
                      <div key={key} className={`intensity-child ${(key < this.state.intensity) ? `in` : ``}`}></div>
                    )
                  })
                }
              </div>
              <div className="row">
                <div className="col-6 text-left"><button className="intensity-btn" onClick={this.intensityDown}>-</button></div>
                <div className="col-6 text-right"><button className="intensity-btn" onClick={this.intensityUp}>+</button></div>
              </div>
            </div>

            <div className="clock-section">
              <div className="row">
                <div className="col-5">
                  <div className="icon-clock icon-right"></div>
                  <p>Automatyczne wyłączenie</p>
                </div>

                <div className="col-7" style={{textAlign: 'right'}}>
            <div className="clock-section">
              <div className="row">
                <div className="col-5">
                  <div className="icon-clock icon-right"></div>
                  <p>Automatyczne wyłączenie</p>
                </div>

                <div className="col-7" style={{textAlign: 'right'}}>
                    <div className="clock-input-group">
                      <div className="clock-select" onClick={this.changeHour}>
                          <p>{this.state.hour}</p>
                      </div>
                      <div className="bottom-text">
                        <p>Godzina</p>
                      </div>
                    </div>

                    <div className="clock-input-group">
                      <div className="clock-select" onClick={this.changeMinute}>
                          <p>{this.state.minute}</p>
                      </div>
                      <div className="bottom-text">
                        <p>Minuta</p>
                      </div>
                    </div>
                </div>

              </div>
            </div>
          
                </div>

              </div>
            </div>
            
            

          </div>

          <div className={`select-win ${(this.state.selectWinVisible) ? `visible` : ``}`}>
            <div className="select-win-overall">
              <div className="select-win-container row">
                {(this.state.selectWinVal).map((val, key) => {
                  return (<div className={`select-win-item col-3`} key={key} onClick={this.handleClick(val)}>
                    <div><p>{val}</p></div>
                  </div>)
                })}
              </div>
            </div>
          </div>
          
          {/* <Container>

            <LedDriver device_signal={this.state.device.signal} />
            <RightBar toggleColorPicker={this.showColorPicker} />

            <LedDriverColorPicker toggleColorPicker={this.hideColorPicker} isVisible={this.state.LedDriverColorPicker.visible.toString()} />
      
        </Container> */}
        </div>
      );
    }
}

export default App;
