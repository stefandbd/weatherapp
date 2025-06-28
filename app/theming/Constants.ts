import {Platform} from 'react-native';

// Aspect Ratio
export const ASPECT_RATIO = {
  IMAGE: {
    HEIGHT: 4,
    WIDTH: 3,
  },
  VIDEO: {
    HEIGHT: 9,
    WIDTH: 16,
  },
};

// Grid defaults
export const gridSize = 8;

// Flex 1
export const flex1 = {flex: 1};

// Font defaults
export const fontSize = 18;

export const videoAspectRatio =
  ASPECT_RATIO.VIDEO.WIDTH / ASPECT_RATIO.VIDEO.HEIGHT;
export const imageAspectRatio =
  ASPECT_RATIO.IMAGE.WIDTH / ASPECT_RATIO.IMAGE.HEIGHT;

export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';
