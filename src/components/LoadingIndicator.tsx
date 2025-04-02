import React from 'react';
import { View, ActivityIndicator, StyleSheet, ActivityIndicatorProps } from 'react-native';
// import { useTheme } from '../context/ThemeContext'; // Remove useTheme
import { COLORS } from '../styles/theme'; // Re-add COLORS

interface LoadingIndicatorProps extends ActivityIndicatorProps {}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = 'large', style, color = COLORS.primary, ...props }) => {
    // const { colors } = useTheme(); // Remove
    // const indicatorColor = color || colors.primary; // Remove

    return (
        <View style={[styles.container, style]}>
            {/* Use passed color or static default */}
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