import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as FaceDetector from 'expo-face-detector';
import { Camera } from 'expo-camera';
import { captureScreen } from 'react-native-view-shot';

class DetectFace extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    faces: [],
    capturedPhoto: null,
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
  };

  // for each face in state.faces, invoke renderFace on it
  renderFaces = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderFace)}
    </View>
  );

  // styling on face, depended on internal face-detection information
  renderFace({ bounds, faceID, rollAngle, yawAngle, smilingProbability }) {
    if (smilingProbability > 0.5) {
      return (
        <Image
          key={faceID}
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

  //snap a pic
  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      console.log(this.state.capturedPhoto);
      this.setState({ capturedPhoto: photo });
      console.log(this.state.capturedPhoto);
    }
  };

  // re-renders every time state changes
  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (this.state.capturedPhoto) {
      return (
        <View>
          <ImageBackground
            style={{ height: '100%', width: '100%' }}
            resizeMode="contain"
            source={{ uri: this.state.capturedPhoto.uri }}
          >
            <TouchableOpacity
              style={{ top: 50, left: 15 }}
              onPress={() => this.setState({ capturedPhoto: null })}
            >
              <Image
                style={{ height: 40, width: 40 }}
                source={{
                  uri:
                    'https://cdn0.iconfinder.com/data/icons/web/512/e52-512.png',
                }}
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
            onFacesDetected={this.handleFacesDetected}
            faceDetectorSettings={{
              mode: FaceDetector.Constants.Mode.accurate,
              detectLandmarks: FaceDetector.Constants.Landmarks.all,
              runClassifications: FaceDetector.Constants.Classifications.all,
            }}
          >
            {this.renderFaces()}
            <TouchableOpacity
              style={{
                top: -125,
                right: 15,
              }}
              onPress={() => {
                this.setState({
                  type:
                    this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                });
              }}
            >
              <Image
                style={{
                  alignSelf: 'flex-end',
                  height: 50,
                  width: 50,
                }}
                source={{
                  uri:
                    'https://cdn3.iconfinder.com/data/icons/linecons-free-vector-icons-pack/32/camera-512.png',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ top: 100 }} onPress={this.snap}>
              <Image
                style={{
                  alignSelf: 'center',
                  height: 75,
                  width: 75,
                }}
                source={{
                  uri:
                    'https://cdn3.iconfinder.com/data/icons/navigation-and-settings/24/Material_icons-01-26-512.png',
                }}
              />
            </TouchableOpacity>
          </Camera>
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
