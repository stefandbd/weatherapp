import {Dimensions, Platform} from 'react-native';

import {gridSize} from './Constants';
import type {Size, Sizes as SizesType} from './Types';
const {width, height} = Dimensions.get('window');
const screenHeight = width < height ? height : width;
const screenWidth = width < height ? width : height;

/**
 * Main sizes object with all size-related values used throughout the app
 */
const Sizes = {
  // Grid and spacing
  grid: gridSize,
  gutterSize: 8,

  // Component heights
  customTabbarHeight: 105,
  headerHeight: {
    android: 40,
    ios: 40,
  },
  navbarHeight: Platform.OS === 'ios' ? 60 : 50,
  tabbarHeight: 51,
  statusBarHeight: Platform.OS === 'ios' ? 16 : 0,

  // Aspect ratios
  ratio_3_1: 3 / 1,
  ratio_16_9: 16 / 9,

  // Window Dimensions
  screen: {
    height: screenHeight,
    width: screenWidth,
    widthHalf: screenWidth * 0.5,
    widthQuarter: screenWidth * 0.25,
    widthThird: screenWidth * 0.333,
    widthThreeQuarters: screenWidth * 0.75,
    widthTwoThirds: screenWidth * 0.666,
  },

  // Text sizes
  textSizes: {
    tiny: 8,
    small: 10,
    medium: 12,
    normal: 14,
    ctaButton: 14,
    bigger: 16,
    heading3: 18,
    heading2: 27,
    heading1: 60,
  },

  // Border radius
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    pill: 20,
    circle: 50,
  },

  // Padding and margin
  spacing: {
    tiny: gridSize / 2, // 4
    small: gridSize, // 8
    medium: gridSize * 2, // 16
    large: gridSize * 3, // 24
    xLarge: gridSize * 4, // 32
    xxLarge: gridSize * 5, // 40
  },

  // Icon sizes
  icon: {
    tiny: 16,
    small: 24,
    medium: 32,
    large: 48,
    xLarge: 64,
  },

  // Shadow sizes
  shadow: {
    small: {
      shadowOffset: {width: 0, height: 1},
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowOffset: {width: 0, height: 2},
      shadowRadius: 3.84,
      elevation: 5,
    },
    large: {
      shadowOffset: {width: 0, height: 4},
      shadowRadius: 6,
      elevation: 10,
    },
  },
};

/**
 * This is the default predefined set of size factors in use in the app.
 * They are all calculated based on the grid size (8pt)
 */
export const sizes: SizesType = {
  xSmall: gridSize / 2,
  small: gridSize,
  medium: gridSize * 2,
  large: gridSize * 3,
  xLarge: gridSize * 4,
  xxLarge: gridSize * 5,
  xxxLarge: gridSize * 6,
  xxxxLarge: gridSize * 7,
};

/**
 * Helper function to get a size value from the sizes object
 */
export const relativeSize = (size: Size) => {
  return sizes[size];
};

// Base dimensions for responsive scaling
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 691;

/**
 * Scale a size horizontally based on the device width
 */
export const scale = (size: number) =>
  (screenWidth / guidelineBaseWidth) * size;

/**
 * Scale a size vertically based on the device height
 */
export const verticalScale = (size: number) =>
  (screenHeight / guidelineBaseHeight) * size;

/**
 * Scale a size proportionally based on the device width and height
 */
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

/**
 * Calculate height size based on device height
 */
export function calculateHeightSize() {
  if (screenHeight >= 932) {
    return screenHeight * 0.58;
  } else if (screenHeight >= 896 && screenHeight < 932) {
    return screenHeight * 0.54;
  } else if (screenHeight >= 852 && screenHeight < 896) {
    return screenHeight * 0.56;
  } else if (screenHeight >= 812 && screenHeight < 852) {
    return screenHeight * 0.56;
  } else if (screenHeight >= 667 && screenHeight < 812) {
    return screenHeight * 0.46;
  } else if (screenHeight < 667) {
    return screenHeight * 0.3;
  }
}

/**
 * Calculate margin size based on device height
 */
export function calculateMarginSize() {
  if (screenHeight >= 932) {
    return scale(screenHeight * 0.01);
  } else if (screenHeight >= 896 && screenHeight < 932) {
    return scale(screenHeight * 0.008);
  } else if (screenHeight >= 852 && screenHeight < 896) {
    return scale(screenHeight * 0.12);
  } else if (screenHeight >= 812 && screenHeight < 852) {
    return scale(screenHeight * 0.12);
  } else if (screenHeight >= 667 && screenHeight < 812) {
    return scale(screenHeight * 0.065);
  } else if (screenHeight < 667) {
    return scale(screenHeight * 0.05);
  }
}

/**
 * Calculate aspect ratio based on device height
 */
export function calculateAspectRatio() {
  if (screenHeight >= 932) {
    return 106 / 144;
  } else if (screenHeight >= 896 && screenHeight < 932) {
    return 114 / 144;
  } else if (screenHeight >= 852 && screenHeight < 896) {
    return 110 / 144;
  } else if (screenHeight >= 812 && screenHeight < 852) {
    return 130 / 144;
  } else if (screenHeight >= 667 && screenHeight < 812) {
    return 130 / 144;
  } else if (screenHeight < 667) {
    return 110 / 144;
  }
}

export default Sizes;
