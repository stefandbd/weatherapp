import {useCallback, useEffect, useState} from 'react';
import Config from 'react-native-config';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {
  setCityName,
  setLocation,
  setLocationError,
} from '../store/locationSlice';
import {getLocationNameFromCoordinates} from '../utils/geolocation';
import {showErrorAlert, logError} from '../utils/errorHandling';

/**
 * Custom hook to manage location-related functionality
 */
export const useLocation = () => {
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {latitude, longitude, cityName, error} = useAppSelector(
    state => state.location,
  );

  // Fetch location name for current location when coordinates change
  useEffect(() => {
    const abortController = new AbortController();

    const fetchLocationName = async () => {
      if (latitude !== null && longitude !== null && Config.GOOGLE_PLACES_KEY) {
        setIsLoadingLocation(true);
        try {
          // Get city and country name from coordinates
          const locationName = await getLocationNameFromCoordinates(
            latitude,
            longitude,
            Config.GOOGLE_PLACES_KEY,
            abortController.signal,
          );

          // Check if request wasn't aborted before updating state
          if (!abortController.signal.aborted) {
            if (locationName) {
              dispatch(setCityName(locationName));
            } else {
              dispatch(setCityName('Unknown Location'));
            }
          }
        } catch (err) {
          // Only handle error if request wasn't aborted
          if (!abortController.signal.aborted) {
            logError(err, 'fetchLocationName');
            dispatch(setCityName('Unknown Location'));
          }
        } finally {
          if (!abortController.signal.aborted) {
            setIsLoadingLocation(false);
          }
        }
      }
    };

    fetchLocationName();

    // Cleanup function to abort ongoing requests
    return () => {
      abortController.abort();
    };
  }, [latitude, longitude, dispatch]);

  // Function to update location
  const updateLocation = useCallback(
    (lat: number, lon: number) => {
      dispatch(setLocation({latitude: lat, longitude: lon}));
    },
    [dispatch],
  );

  // Function to handle location errors
  const handleLocationError = useCallback(
    (errorMessage: string) => {
      dispatch(setLocationError(errorMessage));
      showErrorAlert(errorMessage, 'Location Error');
    },
    [dispatch],
  );

  return {
    latitude,
    longitude,
    cityName,
    error,
    isLoadingLocation,
    updateLocation,
    handleLocationError,
  };
};
