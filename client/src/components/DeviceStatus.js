import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';

class DeviceStatus extends Component {
    render() {
        return (
            
            <div className={`topper-notice ${('false' === this.props.status) ? 'visible' : '' }`}>
            <Container>
              <p>Frendzolku, brak połączenia z urządzeniem.</p>
            </Container>
          </div>

        )
    }
}

export default DeviceStatus
