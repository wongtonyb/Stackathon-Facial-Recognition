import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as FaceDetector from 'expo-face-detector';
import { Camera } from 'expo-camera';

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    faces: [],
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          type={'front'}
          ref={ref => {
            this.camera = ref;
          }}
          // https://docs.expo.io/versions/v35.0.0/sdk/facedetector/
          onFacesDetected={this.handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.Constants.Mode.fast,
            detectLandmarks: FaceDetector.Constants.Mode.none,
            runClassifications: FaceDetector.Constants.Mode.none,
          }}
        >
          <TouchableOpacity
            style={{ justifyContent: 'center' }}
            onPress={() => this.snap(false)}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
              {' '}
              Enroll{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ justifyContent: 'center' }}
            onPress={() => this.snap(true)}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
              {' '}
              Recognize{' '}
            </Text>
          </TouchableOpacity>
        </Camera>
      </View>
    );
  }

  snap = async recognize => {
    try {
      if (this.camera) {
        let photo = await this.camera.takePictureAsync({ base64: true });
        if (!faceDetected) {
          alert('No face detected!');
          return;
        }

        const userId = makeId();
        const { base64 } = photo;
        this[recognize ? 'recognize' : 'enroll']({ userId, base64 });
      }
    } catch (e) {
      console.log('error on snap: ', e);
    }
  };
}
