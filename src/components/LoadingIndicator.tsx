import React from 'react';
import { View, ActivityIndicator, StyleSheet, ActivityIndicatorProps } from 'react-native';
import { COLORS } from '../styles/theme';

interface LoadingIndicatorProps extends ActivityIndicatorProps {}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = 'large', style, color = COLORS.primary, ...props }) => {

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={color} {...props} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingIndicator; 