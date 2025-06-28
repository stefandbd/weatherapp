import React, {useCallback} from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import LoadingIndicator from '../../components/ui/loading-indicator';
import * as S from './home-screen.style';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import WeatherDisplay from '../../components/weather-display/weather-display';
import RecentSearchesModal from '../../components/recent-searches-modal/recent-searches-modal';
import {
  useLocation,
  useWeather,
  useWeatherUI,
  useGooglePlaces,
} from '../../hooks';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {setLocation, selectLocationStatus} from '../../store/locationSlice';
import {SafeAreaView} from 'react-native-safe-area-context';

/**
 * HomeScreen component - Main weather display screen
 */
const HomeScreen = () => {
  const dispatch = useAppDispatch();

  // Custom hooks for better separation of concerns
  const locationStatus = useAppSelector(selectLocationStatus);
  const {cityName, error, isLoadingLocation} = useLocation();

  const {
    weather,
    isLoadingWeather,
    isFetchingWeather,
    refreshing,
    getWeatherByCoordinates,
    handleRefresh,
    handleRetry,
  } = useWeather();

  const {modalVisible, setModalVisible, backgroundImage} = useWeatherUI(
    weather.icon,
    weather.description,
  );

  // Handle location selection from Google Places
  const handleLocationSelected = useCallback(
    (lat: number, lng: number, description: string) => {
      dispatch(setLocation({latitude: lat, longitude: lng}));
      getWeatherByCoordinates(lat, lng, description);
    },
    [dispatch, getWeatherByCoordinates],
  );

  const {placesConfig, setSearchText} = useGooglePlaces(handleLocationSelected);

  // Show loading overlay when fetching initial data
  const isLoading = isLoadingWeather || isLoadingLocation || isFetchingWeather;

  // Use the hasValidCoordinates property from the memoized selector
  const hasValidLocation = locationStatus.hasValidCoordinates;

  return (
    <S.MainContainer source={backgroundImage} resizeMode="cover">
      <SafeAreaView edges={['top', 'left', 'right']} style={{flex: 1}}>
        <S.ContentContainer>
          <S.HeaderRow>
            <S.Title>
              {isLoadingLocation
                ? 'Loading location...'
                : hasValidLocation
                ? cityName || 'Unknown Location'
                : 'No Location Selected'}
            </S.Title>
            <S.HistoryButton
              onPress={() => setModalVisible(true)}
              disabled={isLoading}>
              <S.HistoryButtonText>History</S.HistoryButtonText>
            </S.HistoryButton>
          </S.HeaderRow>

          {/* GooglePlacesAutocomplete is outside of ScrollView to avoid nesting VirtualizedLists */}
          <S.AutocompleteWrapper>
            <GooglePlacesAutocomplete
              {...placesConfig}
              styles={S.googlePlacesStyles}
            />
          </S.AutocompleteWrapper>

          {error && (
            <S.ErrorContainer>
              <S.ErrorText>{error}</S.ErrorText>
              <S.RetryButton onPress={handleRetry}>
                <S.RetryButtonText>Retry</S.RetryButtonText>
              </S.RetryButton>
            </S.ErrorContainer>
          )}

          {isFetchingWeather && (
            <S.LoadingOverlay>
              <LoadingIndicator
                message="Fetching weather data..."
                color="#ffffff"
                overlay={false}
              />
            </S.LoadingOverlay>
          )}

          {/* Weather display is wrapped in its own ScrollView */}
          <ScrollView
            style={S.scrollContainerStyle}
            contentContainerStyle={S.scrollContentContainerStyle}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#FFFFFF"
                colors={['#FFFFFF']}
                progressBackgroundColor="transparent"
              />
            }>
            <WeatherDisplay />
          </ScrollView>

          <RecentSearchesModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSelectLocation={(cityNameRecentSearch, latitude, longitude) => {
              setSearchText(cityNameRecentSearch);
              getWeatherByCoordinates(
                latitude,
                longitude,
                cityNameRecentSearch,
              );
              setModalVisible(false);
            }}
          />
        </S.ContentContainer>
      </SafeAreaView>
    </S.MainContainer>
  );
};

export default HomeScreen;
