import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onClear }) => {
    const { colors } = useTheme();
    const styles = createThemedStyles(colors, SIZES, FONTS);
    
    const showClearButton = value.length > 0;

    const handleClear = () => {
        onChangeText('');
        onClear();
        Keyboard.dismiss();
    };

    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color={colors.gray} style={styles.searchIcon} />
            <TextInput
                style={styles.input}
                placeholder="Search Movies & TV Shows..."
                placeholderTextColor={colors.gray}
                value={value}
                onChangeText={onChangeText}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
                selectionColor={colors.primary}
                keyboardAppearance={colors.isDarkMode ? 'dark' : 'light'}
            />
            {showClearButton && (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color={colors.gray} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const createThemedStyles = (colors: any, SIZES: any, FONTS: any) => 
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: SIZES.padding,
            paddingVertical: SIZES.padding / 1.5,
            backgroundColor: colors.white,
            borderBottomWidth: 1,
            borderBottomColor: colors.lightGray,
        },
        searchIcon: {
            marginRight: SIZES.base,
        },
        input: {
            flex: 1,
            height: 40,
            backgroundColor: colors.background,
            borderRadius: SIZES.radius,
            paddingHorizontal: SIZES.padding,
            paddingVertical: SIZES.base,
            ...FONTS.body3,
            color: colors.textPrimary,
            paddingTop: Platform.OS === 'ios' ? SIZES.base : undefined,
            paddingBottom: Platform.OS === 'ios' ? SIZES.base : undefined,
        },
        clearButton: {
            marginLeft: SIZES.base,
            padding: SIZES.base / 2,
        },
});

export default SearchBar; 