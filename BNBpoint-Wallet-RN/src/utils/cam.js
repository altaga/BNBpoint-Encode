import {View} from 'react-native';
import React, {Component} from 'react';
import {CameraScreen} from 'react-native-camera-kit';
import reactAutobind from 'react-autobind';
import ContextModule from './contextModule';

class Cam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scanning: true,
    };
    reactAutobind(this);
  }

  static contextType = ContextModule;

  render() {
    return (
      <CameraScreen
        scanBarcode={this.state.scanning}
        onReadCode={event => {
          let temp = event.nativeEvent.codeStringValue;
          if (
            temp.length === 42 ||
            temp.indexOf('ethereum:') > -1 ||
            temp.substring(0, 3) === 'wc:'
          ) {
            this.props.onSuccess({
              data: temp,
            });
            this.setState({scanning: false});
          }
        }}
        showFrame={true}
        laserColor="red"
        frameColor="white"
      />
    );
  }
}

export default Cam;
