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
import { SIZES, FONTS, COLORS } from '../styles/theme';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onClear }) => {
    const showClearButton = value.length > 0;

    const handleClear = () => {
        onChangeText('');
        onClear();
        Keyboard.dismiss();
    };

    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
            <TextInput
                style={styles.input}
                placeholder="Search Movies & TV Shows..."
                placeholderTextColor={COLORS.gray}
                value={value}
                onChangeText={onChangeText}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
            />
            {showClearButton && (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color={COLORS.gray} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding / 1.5,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    searchIcon: {
        marginRight: SIZES.base,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: COLORS.background,
        borderRadius: SIZES.radius,
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.base,
        ...FONTS.body3,
        color: COLORS.textPrimary,
        paddingTop: Platform.OS === 'ios' ? SIZES.base : undefined,
        paddingBottom: Platform.OS === 'ios' ? SIZES.base : undefined,
    },
    clearButton: {
        marginLeft: SIZES.base,
        padding: SIZES.base / 2,
    },
});

export default SearchBar; 