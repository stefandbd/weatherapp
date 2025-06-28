import {
  WeatherErrorType,
  createWeatherError,
} from '../../app/httpclient/queries/weatherQueries';
import {fetchWeatherData} from '../../app/services/weatherService';

// Mock dependencies
jest.mock('../../app/services/weatherService');

const mockedFetchWeatherData = fetchWeatherData as jest.MockedFunction<
  typeof fetchWeatherData
>;

describe('Weather Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createWeatherError', () => {
    it('should create a properly formatted error', () => {
      const message = 'Test error message';
      const type = WeatherErrorType.API_ERROR;
      const statusCode = 401;
      const originalError = new Error('Original error');

      const error = createWeatherError(
        message,
        type,
        statusCode,
        originalError,
      );

      expect(error.message).toBe(message);
      expect(error.type).toBe(type);
      expect(error.statusCode).toBe(statusCode);
      expect(error.originalError).toBe(originalError);
    });

    it('should create error with minimal parameters', () => {
      const message = 'Simple error';
      const type = WeatherErrorType.NETWORK_ERROR;

      const error = createWeatherError(message, type);

      expect(error.message).toBe(message);
      expect(error.type).toBe(type);
      expect(error.statusCode).toBeUndefined();
      expect(error.originalError).toBeUndefined();
    });

    it('should create different error types correctly', () => {
      const networkError = createWeatherError(
        'Network error',
        WeatherErrorType.NETWORK_ERROR,
      );
      const apiError = createWeatherError(
        'API error',
        WeatherErrorType.API_ERROR,
        500,
      );
      const coordError = createWeatherError(
        'Invalid coords',
        WeatherErrorType.INVALID_COORDINATES,
      );
      const unknownError = createWeatherError(
        'Unknown error',
        WeatherErrorType.UNKNOWN_ERROR,
      );

      expect(networkError.type).toBe(WeatherErrorType.NETWORK_ERROR);
      expect(apiError.type).toBe(WeatherErrorType.API_ERROR);
      expect(apiError.statusCode).toBe(500);
      expect(coordError.type).toBe(WeatherErrorType.INVALID_COORDINATES);
      expect(unknownError.type).toBe(WeatherErrorType.UNKNOWN_ERROR);
    });
  });

  describe('Weather Service Integration', () => {
    it('should handle successful weather data fetch', async () => {
      // Create a complete mock weather data that matches the WeatherData interface
      const mockWeatherData = {
        lat: 40.7128,
        lon: -74.006,
        timezone: 'America/New_York',
        timezone_offset: -14400,
        current: {
          dt: 1650034800,
          sunrise: 1650012345,
          sunset: 1650062345,
          temp: 25,
          feels_like: 27,
          pressure: 1015,
          humidity: 60,
          dew_point: 15,
          uvi: 5,
          clouds: 10,
          visibility: 10000,
          wind_speed: 5,
          wind_deg: 180,
          weather: [
            {
              id: 800,
              main: 'Clear',
              description: 'clear sky',
              icon: '01d',
            },
          ],
        },
        daily: [
          {
            dt: 1650034800,
            sunrise: 1650012345,
            sunset: 1650062345,
            moonrise: 1650022345,
            moonset: 1650072345,
            moon_phase: 0.5,
            temp: {
              day: 25,
              min: 20,
              max: 28,
              night: 18,
              eve: 23,
              morn: 21,
            },
            feels_like: {
              day: 25,
              night: 18,
              eve: 23,
              morn: 21,
            },
            pressure: 1015,
            humidity: 65,
            dew_point: 15,
            wind_speed: 4,
            wind_deg: 180,
            weather: [
              {
                id: 801,
                main: 'Clouds',
                description: 'few clouds',
                icon: '02d',
              },
            ],
            clouds: 10,
            pop: 0.1,
            uvi: 5,
          },
          {
            dt: 1650121200,
            sunrise: 1650098765,
            sunset: 1650148765,
            moonrise: 1650108765,
            moonset: 1650158765,
            moon_phase: 0.6,
            temp: {
              day: 23,
              min: 19,
              max: 26,
              night: 17,
              eve: 22,
              morn: 20,
            },
            feels_like: {
              day: 23,
              night: 17,
              eve: 22,
              morn: 20,
            },
            pressure: 1016,
            humidity: 70,
            dew_point: 16,
            wind_speed: 3,
            wind_deg: 190,
            weather: [
              {
                id: 802,
                main: 'Clouds',
                description: 'scattered clouds',
                icon: '03d',
              },
            ],
            clouds: 20,
            pop: 0.2,
            uvi: 4,
          },
        ],
      };

      mockedFetchWeatherData.mockResolvedValueOnce(mockWeatherData);

      const result = await fetchWeatherData(40.7128, -74.006);

      expect(result).toEqual(mockWeatherData);
      expect(mockedFetchWeatherData).toHaveBeenCalledWith(40.7128, -74.006);
    });

    it('should handle error when fetching weather data', async () => {
      const mockError = createWeatherError(
        'API error',
        WeatherErrorType.API_ERROR,
        401,
      );

      mockedFetchWeatherData.mockRejectedValueOnce(mockError);

      await expect(fetchWeatherData(40.7128, -74.006)).rejects.toEqual(
        mockError,
      );
    });

    it('should handle invalid coordinates', async () => {
      const mockError = createWeatherError(
        'Invalid coordinates provided',
        WeatherErrorType.INVALID_COORDINATES,
      );

      mockedFetchWeatherData.mockRejectedValueOnce(mockError);

      await expect(fetchWeatherData(0, 0)).rejects.toEqual(mockError);
    });
  });
});
