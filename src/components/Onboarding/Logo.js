import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FONTS } from '../../theme/typography';
import { COLORS } from '../../theme/colors';

const Logo = ({ size = 120, color = '#FFFFFF' }) => {
    return (
        <View style={styles.container}>
            <View style={styles.logoWrapper}>
                <Text style={[styles.ofsText, { color }]}>OFS</Text>
                
                {/* Small Orange Triangles from screenshot */}
                <View style={styles.triangleTop}>
                    <Svg width="12" height="12" viewBox="0 0 12 12">
                        <Path d="M0 12L12 12L12 0L0 12Z" fill="#FF8A00" />
                    </Svg>
                </View>
                
                <View style={styles.triangleBottom}>
                    <Svg width="10" height="10" viewBox="0 0 10 10">
                        <Path d="M0 0L10 0L0 10L0 0Z" fill="#FF8A00" />
                    </Svg>
                </View>
            </View>
            <Text style={[styles.squareText, { color }]}>SQUARE</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoWrapper: {
        position: 'relative',
        paddingHorizontal: 10,
    },
    ofsText: {
        fontSize: 64,
        fontFamily: FONTS.bold,
        letterSpacing: 2,
    },
    squareText: {
        fontSize: 24,
        fontFamily: FONTS.medium,
        letterSpacing: 8,
        marginTop: -5,
    },
    triangleTop: {
        position: 'absolute',
        top: 10,
        right: -5,
    },
    triangleBottom: {
        position: 'absolute',
        bottom: 15,
        left: 25,
    }
});

export default Logo;
