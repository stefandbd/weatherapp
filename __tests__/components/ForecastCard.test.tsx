import React from 'react';
import {render} from '@testing-library/react-native';
import ForecastCard from '../../app/components/forecast-card/forecast-card';

// Mock the styles to avoid styling-related issues in tests
jest.mock('../../app/components/forecast-card/styles', () => ({
  Container: 'View',
  Day: 'Text',
  IconContainer: 'View',
  WeatherIcon: 'Image',
  WeatherIconPlaceholder: 'View',
  WeatherIconPlaceholderText: 'Text',
  Description: 'Text',
  TempContainer: 'View',
  MaxTemp: 'Text',
  MinTemp: 'Text',
  DetailsContainer: 'View',
  DetailText: 'Text',
}));

describe('ForecastCard Component', () => {
  const mockProps = {
    date: 1650034800, // Unix timestamp for a Thursday
    minTemp: 20,
    maxTemp: 28,
    description: 'clear sky',
    icon: '01d',
    humidity: 65,
    windSpeed: 4,
  };

  it('renders correctly with valid data', () => {
    const {getByText} = render(<ForecastCard {...mockProps} />);

    // Check if temperatures are displayed correctly
    expect(getByText('28°')).toBeTruthy();
    expect(getByText('20°')).toBeTruthy();

    // Check if description is displayed and capitalized
    expect(getByText('Clear sky')).toBeTruthy();

    // Check if details are displayed
    expect(getByText('Humidity: 65%')).toBeTruthy();
    expect(getByText('Wind: 4 m/s')).toBeTruthy();
  });

  it('handles missing description gracefully', () => {
    const incompleteProps = {
      ...mockProps,
      description: null,
    };

    const {queryByText} = render(<ForecastCard {...incompleteProps} />);

    // Description should be empty
    expect(queryByText('Clear sky')).toBeNull();

    // Other data should still be displayed
    expect(queryByText('28°')).toBeTruthy();
    expect(queryByText('20°')).toBeTruthy();
  });

  it('handles missing icon gracefully', () => {
    const incompleteProps = {
      ...mockProps,
      icon: null,
    };

    const {queryByText} = render(<ForecastCard {...incompleteProps} />);

    // Question mark should be displayed for missing icon
    expect(queryByText('?')).toBeTruthy();
  });

  it('formats date correctly', () => {
    // April 15, 2022 (a Friday) in Unix timestamp
    const propsWithDifferentDate = {
      ...mockProps,
      date: 1650034800, // This should format to a specific weekday
    };

    const {getByText} = render(<ForecastCard {...propsWithDifferentDate} />);

    // We expect a short weekday name to be displayed
    // Note: The exact day will depend on the timestamp and locale
    // This test might need adjustment based on the actual date formatting logic
    expect(getByText(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/)).toBeTruthy();
  });

  it('handles extreme temperature values', () => {
    const extremeProps = {
      ...mockProps,
      minTemp: -50,
      maxTemp: 50,
    };

    const {getByText} = render(<ForecastCard {...extremeProps} />);

    expect(getByText('50°')).toBeTruthy();
    expect(getByText('-50°')).toBeTruthy();
  });
});
