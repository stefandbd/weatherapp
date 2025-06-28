import {useCallback, useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {
  updateCityAndAddToRecentSearches,
  useWeatherByCoordinates,
} from '../httpclient/queries/weatherQueries';
import {setLocation} from '../store/locationSlice';
import {showErrorAlert, logError} from '../utils/errorHandling';

/**
 * Custom hook to manage weather data fetching and related state
 */
export const useWeather = () => {
  const [isFetchingWeather, setIsFetchingWeather] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {latitude, longitude, weather, error} = useAppSelector(
    state => state.location,
  );

  // Use React Query hooks
  const {isLoading: isLoadingWeather, refetch} = useWeatherByCoordinates(
    latitude,
    longitude,
    latitude !== null && longitude !== null,
  );

  // Use a ref to track if we've already fetched weather for these coordinates
  const lastFetchedCoordinates = useRef<{
    lat: number | null;
    lon: number | null;
  }>({
    lat: null,
    lon: null,
  });

  // Stable reference to refetch function
  const stableRefetch = useCallback(async () => {
    return await refetch();
  }, [refetch]);

  // Function to get weather by coordinates with city name
  const getWeatherByCoordinates = useCallback(
    async (lat: number, lon: number, city?: string) => {
      try {
        setIsFetchingWeather(true);

        // Update location in Redux store to ensure the query uses the new coordinates
        dispatch(setLocation({latitude: lat, longitude: lon}));

        // If city name is provided, update it and add to recent searches
        if (city) {
          updateCityAndAddToRecentSearches(dispatch, city, lat, lon);
        }

        // Refetch weather data
        await stableRefetch();
      } catch (err) {
        logError(err, 'getWeatherByCoordinates');
        showErrorAlert(err, 'Weather Error');
      } finally {
        setIsFetchingWeather(false);
      }
    },
    [dispatch, stableRefetch],
  );

  // Explicitly trigger weather fetch when coordinates change
  useEffect(() => {
    // Only fetch if coordinates are valid and have changed
    if (
      latitude !== null &&
      longitude !== null &&
      (latitude !== lastFetchedCoordinates.current.lat ||
        longitude !== lastFetchedCoordinates.current.lon)
    ) {
      // Update the ref with current coordinates
      lastFetchedCoordinates.current = {
        lat: latitude,
        lon: longitude,
      };

      // The React Query hook will automatically fetch when coordinates change
      // No need to manually trigger refetch here as it's handled by the query
    }
  }, [latitude, longitude]);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error('Error during refresh:', err);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Function to retry fetching weather data
  const handleRetry = useCallback(() => {
    if (latitude !== null && longitude !== null) {
      getWeatherByCoordinates(latitude, longitude);
    }
  }, [latitude, longitude, getWeatherByCoordinates]);

  return {
    weather,
    error,
    isLoadingWeather,
    isFetchingWeather,
    refreshing,
    getWeatherByCoordinates,
    handleRefresh,
    handleRetry,
  };
};
