/**
 * Utility functions for formatting data
 */

/**
 * Capitalize the first letter of a string
 * @param text - The text to capitalize
 * @returns The text with the first letter capitalized
 */
export const capitalizeFirstLetter = (text: string | null): string => {
  if (!text) return '';
  try {
    return text.charAt(0).toUpperCase() + text.slice(1);
  } catch (error) {
    console.warn('Error capitalizing text:', error);
    return text;
  }
};

/**
 * Format temperature value with proper rounding
 * @param temperature - The temperature value
 * @param unit - The unit to append (default: '°C')
 * @returns Formatted temperature string
 */
export const formatTemperature = (
  temperature: number | null | undefined,
  unit: string = '°C',
): string => {
  if (temperature === null || temperature === undefined) return 'N/A';
  try {
    return `${Math.round(temperature)}${unit}`;
  } catch (error) {
    console.warn('Error formatting temperature:', error);
    return 'N/A';
  }
};

/**
 * Format date from timestamp
 * @param timestamp - Unix timestamp
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  timestamp: number,
  options: Intl.DateTimeFormatOptions = {weekday: 'short'},
): string => {
  try {
    const dateObj = new Date(timestamp * 1000);
    return dateObj.toLocaleDateString('en-US', options);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'N/A';
  }
};

/**
 * Format wind speed with unit
 * @param windSpeed - Wind speed value
 * @param unit - Unit to append (default: 'm/s')
 * @returns Formatted wind speed string
 */
export const formatWindSpeed = (
  windSpeed: number | null | undefined,
  unit: string = 'm/s',
): string => {
  if (windSpeed === null || windSpeed === undefined) return 'N/A';
  try {
    return `${windSpeed} ${unit}`;
  } catch (error) {
    console.warn('Error formatting wind speed:', error);
    return 'N/A';
  }
};

/**
 * Format humidity percentage
 * @param humidity - Humidity value
 * @returns Formatted humidity string
 */
export const formatHumidity = (humidity: number | null | undefined): string => {
  if (humidity === null || humidity === undefined) return 'N/A';
  try {
    return `${humidity}%`;
  } catch (error) {
    console.warn('Error formatting humidity:', error);
    return 'N/A';
  }
};
