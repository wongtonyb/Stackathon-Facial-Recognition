import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as FaceDetector from 'expo-face-detector';
import { Camera } from 'expo-camera';

class DetectFace extends React.Component {
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

  // on face detection, update state.faces
  handleFacesDetected = ({ faces }) => {
    this.setState({ faces });
    console.log(faces);
  };

  // for each face in state.faces, invoke renderFace on it
  renderFaces = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderFace)}
    </View>
  );

  // styling on face, depended on internal face-detection information
  renderFace({ bounds, faceID, rollAngle, yawAngle, smilingProbability }) {
    if (smilingProbability > 0.8) {
      return (
        <Image
          style={{
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          }}
          source={{
            uri:
              'https://cdn.shopify.com/s/files/1/1061/1924/products/Smiling_Emoji_with_Smiling_Eyes_large.png?v=1480481060',
          }}
        />
      );
    } else {
      return (
        <View
          key={faceID}
          transform={[
            { perspective: 600 },
            { rotateZ: `${rollAngle.toFixed(0)}deg` },
            { rotateY: `${yawAngle.toFixed(0)}deg` },
          ]}
          style={[
            styles.face,
            {
              ...bounds.size,
              left: bounds.origin.x,
              top: bounds.origin.y,
            },
          ]}
        >
          <Text style={styles.faceText}>ID: {faceID}</Text>
          <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
          <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
          <Text style={styles.faceText}>Smiling%: {smilingProbability}</Text>
        </View>
      );
    }
  }

  // re-renders every time state changes
  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{
              flex: 4,
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
              mode: FaceDetector.Constants.Mode.accurate,
              detectLandmarks: FaceDetector.Constants.Landmarks.all,
              runClassifications: FaceDetector.Constants.Classifications.all,
            }}
          />
          {this.renderFaces()}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
});

export default DetectFace;
