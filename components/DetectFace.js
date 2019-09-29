/* eslint-disable camelcase */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import axios from 'axios';
// import request from 'request';
import base64ToArrayBuffer from 'base64-arraybuffer';

const key = '97ca6854b01a4c668929ac6285be746b';
const loc = 'https://westcentralus.api.cognitive.microsoft.com/';

const params = { returnFaceId: 'true' };

let base_instance_options = {
  baseURL: `https://${loc}/face/v1.0/detect`,
  qs: params,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': key,
  },
};

class DetectFace extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    orginalFace: null,
    originalFaceId: null,
    comparingFace: null,
    comparingFaceId: null,
    capturedPhoto: null,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  }

  //snap original
  snapOrginal = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      let imageUrl = photo.uri;
      base_instance_options = {
        ...base_instance_options,
        body: '{"url": ' + '"' + imageUrl + '"}',
      };

      axios.post(base_instance_options, (error, response, body) => {
        if (error) {
          console.log('Error: ', error);
          return;
        }
        let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
        console.log('JSON Response\n');
        console.log(jsonResponse);
      });
    }
  };

  //snap original
  // snapOrginal = async () => {
  //   if (this.camera) {
  //     let photo = await this.camera.takePictureAsync({
  //       qaulity: 0.25,
  //       base64: true,
  //     });
  //     this.setState({ orginalFace: photo });
  //     //photo:{base64:}
  //     let photob64 = base64ToArrayBuffer.decode(photo.base64);

  //     const facedetect_instance_options = { ...base_instance_options };
  //     facedetect_instance_options.headers['Content-Type'] = 'application/json';
  //     const facedetect_instance = axios.create(facedetect_instance_options);

  //     const facedetect_res = await facedetect_instance.post(
  //       `/detect?returnFaceId=true&detectionModel=detection_02`,
  //       photob64
  //     );

  //     console.log(facedetect_res.data);
  //   }
  // };

  //snap compare
  snapCompare = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({
        option: { base64: true },
      });
      this.setState({ comparingFace: photo });
      console.log('org', this.state.orginalFace);
      console.log('comp', this.state.comparingFace);
    }
  };

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
    } else if (this.state.originalFaceId === null) {
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
          >
            <TouchableOpacity
              style={{
                top: -75,
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
            <Text style={{ alignSelf: 'center', color: 'white' }}>
              Take A Photo Of Original Face
            </Text>
            <TouchableOpacity style={{ top: 75 }} onPress={this.snapOrginal}>
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
    } else if (this.state.comparingFace === null) {
      console.log(this.state.orginalFace);
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
          >
            <TouchableOpacity
              style={{
                top: -75,
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
            <Text style={{ alignSelf: 'center', color: 'white' }}>
              Take A Photo Of Face To Compare
            </Text>
            <TouchableOpacity style={{ top: 75 }} onPress={this.snapCompare}>
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
    } else {
      return <Text>ASDF</Text>;
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
