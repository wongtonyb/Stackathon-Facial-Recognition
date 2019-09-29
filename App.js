import React from 'react';
import Swiper from 'react-native-web-swiper';
import Main from './components/Main';
import Gallery from './components/Gallery';

export default class App extends React.Component {
  render() {
    return (
      <Swiper>
        <Main />
        <Gallery />
      </Swiper>
    );
  }
}
