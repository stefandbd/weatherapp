import React from 'react';
import {ActivityIndicator} from 'react-native';
import * as S from './styles';

interface SearchItem {
  cityName: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface SearchListItemProps {
  item: SearchItem;
  index: number;
  isSelected: boolean;
  onSelect: (
    cityName: string,
    latitude: number,
    longitude: number,
    index: number,
  ) => void;
  formatDate: (timestamp: number) => string;
}

const SearchListItem: React.FC<SearchListItemProps> = ({
  item,
  index,
  isSelected,
  onSelect,
  formatDate,
}) => {
  return (
    <S.SearchItem
      onPress={() =>
        onSelect(item.cityName, item.latitude, item.longitude, index)
      }
      isLoading={isSelected}>
      <S.SearchItemContent>
        <S.CityName>{item.cityName}</S.CityName>
        <S.SearchDate>{formatDate(item.timestamp)}</S.SearchDate>
      </S.SearchItemContent>
      {isSelected && (
        <S.LoadingIndicator>
          <ActivityIndicator size="small" color="#0000ff" />
        </S.LoadingIndicator>
      )}
    </S.SearchItem>
  );
};

export default React.memo(SearchListItem);
