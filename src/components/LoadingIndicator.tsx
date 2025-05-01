import React from 'react';
import { View, ActivityIndicator, StyleSheet, ActivityIndicatorProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface LoadingIndicatorProps extends ActivityIndicatorProps {
    color?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = 'large', style, color, ...props }) => {
    const { colors } = useTheme();
    const indicatorColor = color || colors.primary;

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={indicatorColor} {...props} />
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