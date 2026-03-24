import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const LogoHeader = ({ width = 240, height = 120 }) => {
    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/images/logo.png')}
                style={[styles.logo, { width, height }]}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        marginTop: 40,
    },
    logo: {
        // Dimensions controlled via props or default width/height
    }
});

export default LogoHeader;
