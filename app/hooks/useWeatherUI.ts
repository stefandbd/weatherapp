import {useMemo, useState} from 'react';
import Images from '../theming/Images';

/**
 * Custom hook to manage UI-related state for the weather screen
 */
export const useWeatherUI = (
  weatherIcon: string | null,
  weatherDescription: string | null,
) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Determine background image based on weather condition and time of day
  const backgroundImage = useMemo(() => {
    // Default to sunny if no weather data is available
    if (!weatherIcon) {
      return Images.sunny;
    }

    // Check if it's night time (OpenWeatherMap icons end with 'n' for night)
    const isNight = weatherIcon.endsWith('n');
    if (isNight) {
      return Images.night;
    }

    // Determine weather type based on the icon or description
    const weatherMain = weatherDescription?.toLowerCase() || '';

    if (weatherMain.includes('snow')) {
      return Images.snowy;
    } else if (
      weatherMain.includes('rain') ||
      weatherMain.includes('drizzle') ||
      weatherMain.includes('thunderstorm')
    ) {
      return Images.rainy;
    } else if (
      weatherMain.includes('cloud') ||
      weatherMain.includes('fog') ||
      weatherMain.includes('mist')
    ) {
      return Images.cloudy;
    } else {
      // Default to sunny for clear skies or any other condition
      return Images.sunny;
    }
  }, [weatherIcon, weatherDescription]);

  // Toggle modal visibility
  const toggleModal = () => setModalVisible(!modalVisible);

  return {
    modalVisible,
    setModalVisible,
    toggleModal,
    backgroundImage,
  };
};
