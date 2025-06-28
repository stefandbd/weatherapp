import {PermissionsAndroid, Platform} from 'react-native';
import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import axios from '../httpclient/index';
import {store} from '../store';
import {
  setLocation,
  setPermissionStatus,
  setLocationError,
} from '../store/locationSlice';

/**
 * Request location permissions using the built-in Geolocation API
 */
const requestLocationWithGeolocation = (): Promise<boolean> => {
  return new Promise(resolve => {
    // Configure Geolocation
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
    });

    // Request location directly, which will trigger the permission prompt on iOS
    Geolocation.getCurrentPosition(
      () => {
        store.dispatch(setPermissionStatus('granted'));
        resolve(true);
      },
      error => {
        console.error('Geolocation error:', error);
        store.dispatch(setPermissionStatus('denied'));
        resolve(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};

/**
 * Request location permissions and get the current position
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    // Set permission status to requesting
    store.dispatch(setPermissionStatus('requesting'));

    // For iOS, we'll try both methods
    if (Platform.OS === 'ios') {
      try {
        // First check if we can use react-native-permissions
        const checkResult = await check(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ).catch(() => null);

        // If check works, we can use request
        if (checkResult !== null) {
          const permissionResult = await request(
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          );

          if (permissionResult === RESULTS.GRANTED) {
            store.dispatch(setPermissionStatus('granted'));
            return true;
          } else if (permissionResult === RESULTS.DENIED) {
            store.dispatch(setPermissionStatus('denied'));
            return false;
          } else {
            store.dispatch(setPermissionStatus('unavailable'));
            return false;
          }
        } else {
          // If check fails, fall back to Geolocation API
          console.warn(
            'react-native-permissions check failed, falling back to Geolocation API',
          );
          return await requestLocationWithGeolocation();
        }
      } catch (permissionError) {
        console.warn('react-native-permissions error:', permissionError);
        // Fallback to direct Geolocation API if react-native-permissions fails
        return await requestLocationWithGeolocation();
      }
    } else {
      // For Android, try to use react-native-permissions first
      try {
        const permissionResult = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );

        if (permissionResult === RESULTS.GRANTED) {
          store.dispatch(setPermissionStatus('granted'));
          return true;
        } else if (permissionResult === RESULTS.DENIED) {
          store.dispatch(setPermissionStatus('denied'));
          return false;
        } else {
          store.dispatch(setPermissionStatus('unavailable'));
          return false;
        }
      } catch (androidPermissionError) {
        console.warn(
          'react-native-permissions Android error:',
          androidPermissionError,
        );

        // Fallback to standard PermissionsAndroid API
        const permissionResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'WeatherApp needs access to your location to show weather data.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (permissionResult === PermissionsAndroid.RESULTS.GRANTED) {
          store.dispatch(setPermissionStatus('granted'));
          return true;
        } else if (permissionResult === PermissionsAndroid.RESULTS.DENIED) {
          store.dispatch(setPermissionStatus('denied'));
          return false;
        } else {
          store.dispatch(setPermissionStatus('unavailable'));
          return false;
        }
      }
    }
  } catch (error) {
    console.error('Error requesting location permission:', error);

    // Last resort fallback - try direct Geolocation API
    try {
      return await requestLocationWithGeolocation();
    } catch (fallbackError) {
      store.dispatch(setPermissionStatus('unavailable'));
      store.dispatch(setLocationError('Error requesting location permission'));
      return false;
    }
  }
};

// Define types for geolocation
interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

interface GeolocationError {
  code: number;
  message: string;
}

/**
 * Get the current position
 */
export const getCurrentPosition = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const {latitude, longitude} = position.coords;
        store.dispatch(setLocation({latitude, longitude}));
        resolve();
      },
      (error: GeolocationError) => {
        store.dispatch(setLocationError(error.message));
        console.error('Error getting current position:', error);
        reject(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};

/**
 * Initialize location services - request permission and get position
 */
export const initializeLocation = async (): Promise<void> => {
  try {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      await getCurrentPosition();
    }
  } catch (error) {
    console.error('Error initializing location:', error);
  }
};

/**
 * Get city and country name from coordinates using Google's Reverse Geocoding API
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 * @param apiKey - Google API key
 * @param signal - AbortSignal for request cancellation
 * @returns A promise that resolves to a formatted location string or null
 */
export const getLocationNameFromCoordinates = async (
  latitude: number,
  longitude: number,
  apiKey: string,
  signal?: AbortSignal,
): Promise<string | null> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
      {signal},
    );

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      // Extract city and country from address components
      let city = null;
      let country = null;

      // Loop through address components to find city and country
      for (const component of response.data.results[0].address_components) {
        if (component.types.includes('locality')) {
          city = component.long_name;
        } else if (component.types.includes('country')) {
          country = component.long_name;
        }
      }

      // If city not found, try to find it in other results
      if (!city) {
        for (const result of response.data.results) {
          for (const component of result.address_components) {
            if (
              component.types.includes('locality') ||
              component.types.includes('administrative_area_level_1')
            ) {
              city = component.long_name;
              break;
            }
          }
          if (city) break;
        }
      }

      // Return formatted location name
      if (city && country) {
        return `${city}, ${country}`;
      } else if (city) {
        return city;
      } else if (country) {
        return country;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching location name:', error);
    return null;
  }
};
