import React, {useCallback} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native';
import * as S from './styles';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import ForecastCard from '../forecast-card/forecast-card';
import LinearGradient from 'react-native-linear-gradient';
import {
  setLocationError,
  selectWeatherData,
  selectWeatherError,
  selectLocationStatus,
} from '../../store/locationSlice';
import {
  capitalizeFirstLetter,
  formatTemperature,
  formatHumidity,
  formatWindSpeed,
} from '../../utils/formatting';

// Simple skeleton component with proper styling
const SkeletonView = ({
  width,
  height,
  circle = false,
}: {
  width: number;
  height: number;
  circle?: boolean;
}) => (
  <S.SkeletonContainer
    width={width}
    height={height}
    borderRadius={circle ? height / 2 : 4}
  />
);

const WeatherDisplay: React.FC = () => {
  const weather = useAppSelector(selectWeatherData);
  const weatherError = useAppSelector(selectWeatherError);
  const dispatch = useAppDispatch();

  // Loading state from parent component
  const locationStatus = useAppSelector(selectLocationStatus);
  const isLoading =
    locationStatus.hasValidCoordinates && weather.temperature === null;

  // Handle retry
  const handleRetry = useCallback(() => {
    if (dispatch) {
      dispatch(setLocationError(''));
    }
    // We don't need to refetch here, as the parent component will handle that
  }, [dispatch]);

  // Show loading skeleton if data is being loaded
  if (isLoading) {
    return (
      <>
        <LinearGradient
          colors={[
            'rgba(236, 236, 236, 0.4)',
            'rgba(0,0,0,0.1)',
            'rgba(0,0,0,0)',
          ]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={S.gradientContainerStyle}>
          <S.WeatherInfo>
            <S.CurrentWeatherRow>
              <S.TemperatureContainer>
                <SkeletonView width={100} height={40} />
                <SkeletonView width={150} height={20} />
              </S.TemperatureContainer>
              <SkeletonView width={100} height={100} circle />
            </S.CurrentWeatherRow>

            <S.DetailsContainer>
              <S.DetailItem>
                <S.DetailLabel>Feels like</S.DetailLabel>
                <SkeletonView width={50} height={20} />
              </S.DetailItem>

              <S.DetailItem>
                <S.DetailLabel>Humidity</S.DetailLabel>
                <SkeletonView width={50} height={20} />
              </S.DetailItem>

              <S.DetailItem>
                <S.DetailLabel>Wind</S.DetailLabel>
                <SkeletonView width={50} height={20} />
              </S.DetailItem>
            </S.DetailsContainer>
          </S.WeatherInfo>
        </LinearGradient>
        <S.Space />
        <LinearGradient
          colors={[
            'rgba(236, 236, 236, 0.4)',
            'rgba(0,0,0,0.1)',
            'rgba(0,0,0,0)',
          ]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={S.gradientContainerStyle}>
          <S.ForecastContainer>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[...Array(5)].map((_, index) => (
                <S.SkeletonCard key={index}>
                  <SkeletonView width={80} height={20} />
                  <SkeletonView width={60} height={60} circle />
                  <SkeletonView width={80} height={20} />
                  <SkeletonView width={60} height={20} />
                </S.SkeletonCard>
              ))}
            </ScrollView>
          </S.ForecastContainer>
        </LinearGradient>
      </>
    );
  }

  // Show error message if there's an error
  if (weatherError) {
    return (
      <S.ErrorContainer>
        <S.ErrorIcon>
          <S.ErrorIconText>!</S.ErrorIconText>
        </S.ErrorIcon>
        <S.ErrorTitle>Weather Data Unavailable</S.ErrorTitle>
        <S.ErrorText>{weatherError}</S.ErrorText>
        <TouchableOpacity
          onPress={handleRetry}
          accessibilityRole="button"
          accessibilityLabel="Try again to fetch weather data"
          accessibilityHint="Tap to retry loading weather information">
          <S.RetryButton>
            <S.RetryButtonText>Try Again</S.RetryButtonText>
          </S.RetryButton>
        </TouchableOpacity>
      </S.ErrorContainer>
    );
  }

  // Show empty state if no weather data is available
  if (!weather.temperature) {
    return (
      <S.EmptyContainer>
        <S.EmptyIcon>
          <S.EmptyIconText>?</S.EmptyIconText>
        </S.EmptyIcon>
        <S.EmptyText>No weather data available</S.EmptyText>
        <TouchableOpacity
          onPress={handleRetry}
          accessibilityRole="button"
          accessibilityLabel="Refresh weather data"
          accessibilityHint="Tap to refresh weather information">
          <S.RetryButton>
            <S.RetryButtonText>Refresh</S.RetryButtonText>
          </S.RetryButton>
        </TouchableOpacity>
      </S.EmptyContainer>
    );
  }

  // // Render weather data
  return (
    <>
      <LinearGradient
        colors={[
          'rgba(236, 236, 236, 0.4)',
          'rgba(0,0,0,0.1)',
          'rgba(0,0,0,0)',
        ]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={S.gradientContainerStyle}>
        <S.WeatherInfo>
          <S.CurrentWeatherRow>
            <S.TemperatureContainer>
              <S.Temperature>
                {formatTemperature(weather.temperature)}
              </S.Temperature>
              <S.Description>
                {capitalizeFirstLetter(weather.description)}
              </S.Description>
            </S.TemperatureContainer>

            {weather.icon ? (
              <S.WeatherIcon
                source={{
                  uri: `https://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                }}
                onError={() => console.warn('Failed to load weather icon')}
                accessibilityLabel={`Weather icon showing ${
                  weather.description || 'current weather conditions'
                }`}
                accessibilityRole="image"
              />
            ) : (
              <S.WeatherIconPlaceholder>
                <S.WeatherIconPlaceholderText>?</S.WeatherIconPlaceholderText>
              </S.WeatherIconPlaceholder>
            )}
          </S.CurrentWeatherRow>

          <S.DetailsContainer>
            <S.DetailItem>
              <S.DetailLabel>Feels like</S.DetailLabel>
              <S.DetailText>
                {formatTemperature(weather.feelsLike)}
              </S.DetailText>
            </S.DetailItem>

            <S.DetailItem>
              <S.DetailLabel>Humidity</S.DetailLabel>
              <S.DetailText>{formatHumidity(weather.humidity)}</S.DetailText>
            </S.DetailItem>

            <S.DetailItem>
              <S.DetailLabel>Wind</S.DetailLabel>
              <S.DetailText>{formatWindSpeed(weather.windSpeed)}</S.DetailText>
            </S.DetailItem>
          </S.DetailsContainer>
        </S.WeatherInfo>
      </LinearGradient>
      <S.Space />
      <LinearGradient
        colors={[
          'rgba(236, 236, 236, 0.4)',
          'rgba(0,0,0,0.1)',
          'rgba(0,0,0,0)',
        ]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={S.gradientContainerStyle}>
        <S.ForecastContainer>
          <S.ForecastTitle>5-Day Forecast</S.ForecastTitle>
          {weather.forecast && weather.forecast.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {weather.forecast.map((day, index) => (
                <ForecastCard
                  key={`forecast-${day.date}-${index}`}
                  date={day.date}
                  minTemp={day.minTemp}
                  maxTemp={day.maxTemp}
                  description={day.description}
                  icon={day.icon}
                  humidity={day.humidity}
                  windSpeed={day.windSpeed}
                  isNight={weather?.icon?.endsWith('n') ? true : false}
                />
              ))}
            </ScrollView>
          ) : (
            <S.EmptyForecastText>
              No forecast data available
            </S.EmptyForecastText>
          )}
        </S.ForecastContainer>
      </LinearGradient>
    </>
  );
};

export default React.memo(WeatherDisplay);
