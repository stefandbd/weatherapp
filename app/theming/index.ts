import {Colors} from './Colors';
import Sizes, {
  scale,
  verticalScale,
  moderateScale,
  relativeSize,
  sizes,
  calculateHeightSize,
  calculateMarginSize,
  calculateAspectRatio,
} from './Sizes';
import Images from './Images';
import {gridSize, flex1, isAndroid, isIOS} from './Constants';

// Export all theming components
export {
  // Main theme objects
  Colors,
  Sizes,
  Images,

  // Constants
  gridSize,
  flex1,
  isAndroid,
  isIOS,

  // Size utilities
  scale,
  verticalScale,
  moderateScale,
  relativeSize,
  sizes,
  calculateHeightSize,
  calculateMarginSize,
  calculateAspectRatio,
};
