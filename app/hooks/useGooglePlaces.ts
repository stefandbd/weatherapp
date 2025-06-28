import {useRef, useCallback} from 'react';
import Config from 'react-native-config';
import {
  GooglePlacesAutocompleteRef,
  GooglePlaceData,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import {showErrorAlert, logError} from '../utils/errorHandling';

/**
 * Custom hook to manage Google Places Autocomplete functionality
 */
export const useGooglePlaces = (
  onLocationSelected: (lat: number, lng: number, description: string) => void,
) => {
  // Reference to the GooglePlacesAutocomplete component
  const googlePlacesRef = useRef<GooglePlacesAutocompleteRef | null>(null);

  // Handle place selection
  const handlePlaceSelect = useCallback(
    (data: GooglePlaceData, details: GooglePlaceDetail | null = null) => {
      console.log('GooglePlaces: Place selected', {data, details});

      if (details?.geometry?.location) {
        const {lat, lng} = details.geometry.location;
        console.log('GooglePlaces: Calling onLocationSelected with:', {
          lat,
          lng,
          description: data.description,
        });
        onLocationSelected(lat, lng, data.description);
      } else {
        logError('No location details found', 'GooglePlaces');
        showErrorAlert('Could not get location details', 'Location Error');
      }
    },
    [onLocationSelected],
  );

  // Update the search text
  const setSearchText = useCallback((text: string) => {
    if (googlePlacesRef.current) {
      googlePlacesRef.current.setAddressText(text);
    }
  }, []);

  // Configuration for Google Places
  const placesConfig = {
    ref: googlePlacesRef,
    placeholder: 'Search for a city',
    fetchDetails: true,
    onPress: handlePlaceSelect,
    query: {
      key: Config.GOOGLE_PLACES_KEY,
      language: 'en',
      types: '(cities)',
    },
    enablePoweredByContainer: false,
    debounce: 300,
    minLength: 2,
    textInputProps: {
      autoCapitalize: 'none',
      autoCorrect: false,
      editable: true,
      returnKeyType: 'search',
      clearButtonMode: 'while-editing',
    },
    listViewDisplayed: true,
    keepResultsAfterBlur: false,
    suppressDefaultStyles: false,
    isRowScrollable: false, // Prevent conflicts with parent ScrollView
    disableScroll: false, // Allow scrolling in the dropdown
    keyboardShouldPersistTaps: 'handled' as const, // Important for Android touch handling
    listUnderlayColor: 'transparent', // Android-specific
    onFail: (error: any) => {
      logError(error, 'Google Places API');
      showErrorAlert('Failed to search for locations', 'Search Error');
    },
  };

  return {
    googlePlacesRef,
    placesConfig,
    setSearchText,
  };
};
