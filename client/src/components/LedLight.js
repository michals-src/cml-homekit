import React, {Component} from 'react';
import axios from 'axios';

import '.././styles/App.css';

export class LedLight extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            activeSegments: 0
        }
    }
    

    render() {

        const segmentsN = 7;
        let segments = [];

        for(let x = 0; x <= segmentsN; x++){
            let active = ((segmentsN - x) <= this.state.activeSegments && x !== segmentsN) ? true : false;
            let offSegment = (x >= segmentsN) ? true : false;

            segments.push(<div key={x} className={`led-light-child ${(offSegment ? `child-off` : ``)} ${((active) ? `child-active` : ``)}`}></div>);
        }

        return (
            <div>
                <div className="led-light-bar">
                    {(segments).map((item, key) => {
                        return item
                    })}
                </div>
            </div>
        )
    }
}

export default LedLight
