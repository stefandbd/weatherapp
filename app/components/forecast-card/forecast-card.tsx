import React, {useMemo} from 'react';
import * as S from './styles';
import {
  capitalizeFirstLetter,
  formatTemperature,
  formatDate,
  formatHumidity,
  formatWindSpeed,
} from '../../utils/formatting';

interface ForecastCardProps {
  date: number;
  minTemp: number;
  maxTemp: number;
  description: string | null;
  icon: string | null;
  humidity: number;
  windSpeed: number;
  isNight?: boolean;
}

const ForecastCard: React.FC<ForecastCardProps> = ({
  date,
  minTemp,
  maxTemp,
  description,
  icon,
  humidity,
  windSpeed,
  isNight,
}) => {
  // Format date - memoized to avoid unnecessary recalculations
  const formattedDate = useMemo(() => formatDate(date), [date]);

  // Capitalize first letter with null safety
  const formattedDescription = useMemo(
    () => capitalizeFirstLetter(description),
    [description],
  );

  // Format temperature values with null safety
  const formattedMaxTemp = useMemo(
    () => formatTemperature(maxTemp, '°'),
    [maxTemp],
  );

  const formattedMinTemp = useMemo(
    () => formatTemperature(minTemp, '°'),
    [minTemp],
  );

  return (
    <S.Container isNight={isNight}>
      <S.Day>{formattedDate}</S.Day>

      <S.IconContainer>
        {icon ? (
          <S.WeatherIcon
            source={{
              uri: `https://openweathermap.org/img/wn/${icon}@2x.png`,
            }}
            onError={() => console.warn('Failed to load weather icon')}
          />
        ) : (
          <S.WeatherIconPlaceholder>
            <S.WeatherIconPlaceholderText>?</S.WeatherIconPlaceholderText>
          </S.WeatherIconPlaceholder>
        )}
        <S.Description>{formattedDescription}</S.Description>
      </S.IconContainer>

      <S.TempContainer>
        <S.MaxTemp>{formattedMaxTemp}</S.MaxTemp>
        <S.MinTemp>{formattedMinTemp}</S.MinTemp>
      </S.TempContainer>

      <S.DetailsContainer>
        <S.DetailText>Humidity: {formatHumidity(humidity)}</S.DetailText>
        <S.DetailText>Wind: {formatWindSpeed(windSpeed)}</S.DetailText>
      </S.DetailsContainer>
    </S.Container>
  );
};

export default React.memo(ForecastCard);
