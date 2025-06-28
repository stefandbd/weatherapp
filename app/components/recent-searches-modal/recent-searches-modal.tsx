import React, {useState, useCallback} from 'react';
import {Modal, FlatList, Alert} from 'react-native';
import * as S from './styles';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {
  clearRecentSearches,
  selectRecentSearches,
} from '../../store/locationSlice';
import SearchListItem from './search-list-item';

interface SearchItem {
  cityName: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface RecentSearchesModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation?: (
    cityName: string,
    latitude: number,
    longitude: number,
  ) => void;
}

const RecentSearchesModal: React.FC<RecentSearchesModalProps> = ({
  visible,
  onClose,
  onSelectLocation,
}) => {
  const dispatch = useAppDispatch();
  const recentSearches = useAppSelector(selectRecentSearches);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Handle search selection with loading state
  const handleSearchSelect = useCallback(
    (cityName: string, latitude: number, longitude: number, index: number) => {
      const itemId = `search-${index}`;
      setSelectedItemId(itemId);

      try {
        if (onSelectLocation) {
          // Use the callback if provided
          onSelectLocation(cityName, latitude, longitude);
          setSelectedItemId(null);
        }
      } catch (error) {
        setSelectedItemId(null);
        Alert.alert(
          'Error',
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        );
      }
    },
    [onSelectLocation],
  );

  // Handle clearing searches with confirmation
  const handleClearSearches = useCallback(() => {
    Alert.alert(
      'Clear Searches',
      'Are you sure you want to clear all recent searches?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => dispatch(clearRecentSearches()),
        },
      ],
    );
  }, [dispatch]);

  // Format date for display
  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <S.ModalOverlay>
        <S.ModalContent>
          <S.ModalHeader>
            <S.ModalTitle>Recent Searches</S.ModalTitle>
            <S.CloseButton onPress={onClose}>
              <S.CloseButtonText>✕</S.CloseButtonText>
            </S.CloseButton>
          </S.ModalHeader>

          {recentSearches.length > 0 ? (
            <>
              <FlatList<SearchItem>
                style={S.searchListStyle}
                data={recentSearches}
                keyExtractor={(item, index) => `search-${index}`}
                renderItem={({item, index}) => (
                  <SearchListItem
                    item={item}
                    index={index}
                    isSelected={selectedItemId === `search-${index}`}
                    onSelect={handleSearchSelect}
                    formatDate={formatDate}
                  />
                )}
                getItemLayout={(_, index) => ({
                  length: 60, // Approximate height of each item
                  offset: 60 * index,
                  index,
                })}
                windowSize={5}
                maxToRenderPerBatch={10}
                removeClippedSubviews={true}
                ItemSeparatorComponent={() => <S.Separator />}
              />

              <S.ClearButton onPress={handleClearSearches}>
                <S.ClearButtonText>Clear All Searches</S.ClearButtonText>
              </S.ClearButton>
            </>
          ) : (
            <S.EmptyContainer>
              <S.EmptyText>No recent searches</S.EmptyText>
            </S.EmptyContainer>
          )}
        </S.ModalContent>
      </S.ModalOverlay>
    </Modal>
  );
};

export default React.memo(RecentSearchesModal);
