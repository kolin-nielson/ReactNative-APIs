import React from 'react';
import {
    Modal,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { Genre } from '../types/tmdb';
import { FONTS, SIZES } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface GenrePickerModalProps {
    isVisible: boolean;
    genres: Genre[];
    selectedGenreId: number | null;
    onSelectGenre: (genreId: number | null) => void;
    onClose: () => void;
}

const GenrePickerModal: React.FC<GenrePickerModalProps> = ({
    isVisible,
    genres,
    selectedGenreId,
    onSelectGenre,
    onClose,
}) => {
    const { colors } = useTheme();
    const styles = createThemedStyles(colors, SIZES, FONTS);
    
    const allGenresOption: Genre = { id: -1, name: 'All Genres' };
    const data = [allGenresOption, ...genres];

    const handleSelect = (genreId: number | null) => {
        onSelectGenre(genreId);
        onClose();
    };

    const renderItem = ({ item }: { item: Genre }) => {
        const isSelected = item.id === -1 ? selectedGenreId === null : selectedGenreId === item.id;
        const genreIdToSelect = item.id === -1 ? null : item.id;

        return (
            <TouchableOpacity 
                style={styles.itemContainer}
                onPress={() => handleSelect(genreIdToSelect)}
            >
                <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                    {item.name}
                </Text>
                {isSelected && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Select Genre</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                             <Ionicons name="close-circle" size={30} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                    
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        style={styles.list}
                    />
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const createThemedStyles = (colors: typeof import('../styles/theme').lightColors, SIZES: any, FONTS: any) => 
    StyleSheet.create({
        safeArea: {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalView: {
            backgroundColor: colors.background,
            borderTopLeftRadius: SIZES.radius * 2,
            borderTopRightRadius: SIZES.radius * 2,
            paddingHorizontal: SIZES.padding,
            paddingBottom: SIZES.padding * 2,
            paddingTop: SIZES.padding,
            maxHeight: '70%',
            shadowColor: colors.black,
            shadowOffset: {
                width: 0,
                height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: colors.lightGray,
            paddingBottom: SIZES.padding,
            marginBottom: SIZES.padding,
        },
        headerTitle: {
            ...FONTS.h3,
            color: colors.textPrimary,
        },
        closeButton: {
            padding: SIZES.base / 2,
        },
        list: {
        },
        itemContainer: {
            paddingVertical: SIZES.padding * 1.5,
            borderBottomWidth: 1,
            borderBottomColor: colors.lightGray2,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        itemText: {
            ...FONTS.body3,
            color: colors.textPrimary,
        },
        itemTextSelected: {
            color: colors.primary,
            fontWeight: 'bold',
        },
});

export default GenrePickerModal; 