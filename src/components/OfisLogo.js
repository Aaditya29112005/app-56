import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LOGO_WIDTH = SCREEN_WIDTH * 0.98;
const LOGO_HEIGHT = LOGO_WIDTH * 0.5;

const OfisLogo = ({ scale = 1 }) => {
  return (
    <View style={[styles.container, { transform: [{ scale }] }]}>
      <Image 
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  }
});

export default OfisLogo;
