import React from 'react';
import {render} from '@testing-library/react-native';
import WeatherDisplay from '../../app/components/weather-display/weather-display';
import {useWeatherByCoordinates} from '../../app/httpclient/queries/weatherQueries';
import {useAppSelector} from '../../app/store/hooks';

// Mock dependencies
jest.mock('../../app/httpclient/queries/weatherQueries');
jest.mock('../../app/store/hooks');
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

// Mock the useWeatherByCoordinates hook
const mockedUseWeatherByCoordinates =
  useWeatherByCoordinates as jest.MockedFunction<
    typeof useWeatherByCoordinates
  >;

// Import the selectors we need to mock
import {
  selectWeatherData,
  selectWeatherError,
  selectLocationStatus,
} from '../../app/store/locationSlice';

// Mock the useAppSelector hook
const mockedUseAppSelector = useAppSelector as jest.MockedFunction<
  typeof useAppSelector
>;

// Mock the styles to avoid styling-related issues in tests
jest.mock('../../app/components/weather-display/styles', () => ({
  WeatherInfo: 'View',
  CurrentWeatherRow: 'View',
  TemperatureContainer: 'View',
  Temperature: 'Text',
  Description: 'Text',
  WeatherIcon: 'Image',
  WeatherIconPlaceholder: 'View',
  WeatherIconPlaceholderText: 'Text',
  DetailsContainer: 'View',
  DetailItem: 'View',
  DetailLabel: 'Text',
  DetailText: 'Text',
  ForecastContainer: 'View',
  ForecastTitle: 'Text',
  EmptyForecastText: 'Text',
  ErrorContainer: 'View',
  ErrorIcon: 'View',
  ErrorIconText: 'Text',
  ErrorTitle: 'Text',
  ErrorText: 'Text',
  RetryButton: 'TouchableOpacity',
  RetryButtonText: 'Text',
  EmptyContainer: 'View',
  EmptyIcon: 'View',
  EmptyIconText: 'Text',
  EmptyText: 'Text',
  LoadingOverlay: 'View',
  LoadingText: 'Text',
  Space: 'View',
  SkeletonCard: 'View',
  SkeletonContainer: 'View',
  gradientContainerStyle: {},
}));

// Mock the ForecastCard component
jest.mock(
  '../../app/components/forecast-card/forecast-card',
  () => 'ForecastCard',
);

describe('WeatherDisplay Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading skeleton when data is loading', () => {
    // Mock the useWeatherByCoordinates hook to return loading state
    mockedUseWeatherByCoordinates.mockReturnValue({
      isLoading: true,
      isFetching: false,
      isError: false,
      error: null,
      data: undefined,
      refetch: jest.fn(),
    } as any);

    // Mock the useAppSelector hook to handle different selectors
    mockedUseAppSelector.mockImplementation(selector => {
      // Handle different selectors based on reference equality
      if (selector === selectWeatherData) {
        return {
          temperature: null,
          feelsLike: null,
          humidity: null,
          windSpeed: null,
          description: null,
          icon: null,
          forecast: [],
        };
      } else if (selector === selectWeatherError) {
        return null;
      } else if (selector === selectLocationStatus) {
        return {
          latitude: 40.7128,
          longitude: -74.006,
          cityName: 'New York',
          error: null,
          hasValidCoordinates: true, // This is important for the loading state
        };
      }

      // Default return
      return null;
    });

    const {getByText} = render(<WeatherDisplay />);

    // Check if "Feels like" label is displayed in the skeleton UI
    expect(getByText('Feels like')).toBeTruthy();

    // Check if "Humidity" label is displayed in the skeleton UI
    expect(getByText('Humidity')).toBeTruthy();

    // Check if "Wind" label is displayed in the skeleton UI
    expect(getByText('Wind')).toBeTruthy();

    // The loading skeleton doesn't include the "5-Day Forecast" title
    // Just check for the skeleton UI elements
  });

  it('should render weather data when available', () => {
    // Mock the useWeatherByCoordinates hook to return success state
    mockedUseWeatherByCoordinates.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      data: {
        temperature: 25,
        feelsLike: 27,
        humidity: 60,
        windSpeed: 5,
        description: 'clear sky',
        icon: '01d',
        forecast: [
          {
            date: 1650034800,
            minTemp: 20,
            maxTemp: 28,
            description: 'few clouds',
            icon: '02d',
            humidity: 65,
            windSpeed: 4,
          },
        ],
      },
      refetch: jest.fn(),
    } as any);

    // Mock the useAppSelector hook to handle different selectors
    mockedUseAppSelector.mockImplementation(selector => {
      // Handle different selectors based on reference equality
      if (selector === selectWeatherData) {
        return {
          temperature: 25,
          feelsLike: 27,
          humidity: 60,
          windSpeed: 5,
          description: 'clear sky',
          icon: '01d',
          forecast: [
            {
              date: 1650034800,
              minTemp: 20,
              maxTemp: 28,
              description: 'few clouds',
              icon: '02d',
              humidity: 65,
              windSpeed: 4,
            },
          ],
        };
      } else if (selector === selectWeatherError) {
        return null;
      } else if (selector === selectLocationStatus) {
        return {
          latitude: 40.7128,
          longitude: -74.006,
          cityName: 'New York',
          error: null,
          hasValidCoordinates: true,
        };
      }

      // Default return
      return null;
    });

    const {getByText} = render(<WeatherDisplay />);

    // Check if temperature is displayed
    expect(getByText('25°C')).toBeTruthy();

    // Check if description is displayed and capitalized
    expect(getByText('Clear sky')).toBeTruthy();

    // Check if details are displayed
    expect(getByText('Feels like')).toBeTruthy();
    expect(getByText('27°C')).toBeTruthy();
    expect(getByText('Humidity')).toBeTruthy();
    expect(getByText('60%')).toBeTruthy();
    expect(getByText('Wind')).toBeTruthy();
    expect(getByText('5 m/s')).toBeTruthy();

    // Check if forecast title is displayed
    expect(getByText('5-Day Forecast')).toBeTruthy();
  });

  it('should render error state when there is an error', () => {
    // Mock the useWeatherByCoordinates hook to return error state
    mockedUseWeatherByCoordinates.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error('Failed to fetch weather data'),
      data: undefined,
      refetch: jest.fn(),
    } as any);

    // Mock the useAppSelector hook to handle different selectors
    mockedUseAppSelector.mockImplementation(selector => {
      // Handle different selectors based on reference equality
      if (selector === selectWeatherData) {
        return {
          temperature: null,
          feelsLike: null,
          humidity: null,
          windSpeed: null,
          description: null,
          icon: null,
          forecast: [],
        };
      } else if (selector === selectWeatherError) {
        return 'Failed to fetch weather data';
      } else if (selector === selectLocationStatus) {
        return {
          latitude: null,
          longitude: null,
          cityName: null,
          error: null,
          hasValidCoordinates: false, // Set to false to avoid loading state
        };
      }

      // Default return
      return null;
    });

    const {getByText} = render(<WeatherDisplay />);

    // Check if error message is displayed
    expect(getByText('Weather Data Unavailable')).toBeTruthy();
    expect(getByText('Failed to fetch weather data')).toBeTruthy();
    expect(getByText('Try Again')).toBeTruthy();
  });

  it('should render empty state when no weather data is available', () => {
    // Mock the useWeatherByCoordinates hook to return success state but no data
    mockedUseWeatherByCoordinates.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      data: undefined,
      refetch: jest.fn(),
    } as any);

    // Mock the useAppSelector hook to handle different selectors
    mockedUseAppSelector.mockImplementation(selector => {
      // Handle different selectors based on reference equality
      if (selector === selectWeatherData) {
        return {
          temperature: null,
          feelsLike: null,
          humidity: null,
          windSpeed: null,
          description: null,
          icon: null,
          forecast: [],
        };
      } else if (selector === selectWeatherError) {
        return null;
      } else if (selector === selectLocationStatus) {
        return {
          latitude: 40.7128,
          longitude: -74.006,
          cityName: null,
          error: null,
          hasValidCoordinates: false, // This is important for the empty state
        };
      }

      // Default return
      return null;
    });

    const {getByText} = render(<WeatherDisplay />);

    // Check if empty state message is displayed
    expect(getByText('No weather data available')).toBeTruthy();
    expect(getByText('Refresh')).toBeTruthy();
  });
});
