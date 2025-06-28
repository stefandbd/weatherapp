import styled from '@emotion/native';
import {Dimensions} from 'react-native';
import {Colors, Sizes, flex1} from '../../theming';

const {width} = Dimensions.get('window');

export const MainContainer = styled.ImageBackground({
  ...flex1,
  width: '100%',
  height: '100%',
});

export const ContentContainer = styled.View({
  padding: Sizes.spacing.medium,
  backgroundColor: 'transparent',
  borderRadius: Sizes.borderRadius.medium,
  shadowColor: Colors.shadow.color,
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: Colors.shadow.opacity.light,
  shadowRadius: 4,
  elevation: Sizes.shadow.small.elevation,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

export const HeaderRow = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: Sizes.spacing.small,
});

export const HistoryButton = styled.TouchableOpacity(props => ({
  backgroundColor: Colors.info,
  paddingHorizontal: Sizes.spacing.small + 4,
  paddingVertical: Sizes.spacing.tiny + 2,
  borderRadius: Sizes.borderRadius.pill - 5,
  opacity: props.disabled ? 0.5 : 1,
}));

export const HistoryButtonText = styled.Text({
  color: Colors.text.light,
  fontWeight: '500',
  fontSize: Sizes.textSizes.normal,
});

export const Title = styled.Text({
  fontSize: Sizes.textSizes.heading3,
  fontWeight: 'bold',
  marginBottom: Sizes.spacing.small,
  color: Colors.text.light,
});

export const Text = styled.Text({
  fontSize: Sizes.textSizes.bigger,
  marginBottom: Sizes.spacing.tiny,
  color: Colors.text.primary,
});

export const ErrorText = styled.Text({
  color: Colors.error,
  fontSize: Sizes.textSizes.bigger,
  fontWeight: '500',
  marginBottom: Sizes.spacing.tiny,
});

export const ErrorContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'rgba(255, 0, 0, 0.1)',
  padding: Sizes.spacing.small,
  paddingHorizontal: Sizes.spacing.small + 4,
  borderRadius: Sizes.borderRadius.medium,
  marginVertical: Sizes.spacing.small,
});

export const RetryButton = styled.TouchableOpacity({
  backgroundColor: Colors.error,
  paddingHorizontal: Sizes.spacing.small + 4,
  paddingVertical: Sizes.spacing.tiny + 2,
  borderRadius: Sizes.borderRadius.pill - 5,
  marginLeft: Sizes.spacing.small,
});

export const RetryButtonText = styled.Text({
  color: Colors.text.light,
  fontWeight: '500',
  fontSize: Sizes.textSizes.normal,
});

export const LoadingContainer = styled.ImageBackground({
  ...flex1,
  backgroundColor: Colors.background.primary,
  justifyContent: 'center',
  alignItems: 'center',
});

export const LoadingOverlay = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: Colors.background.transparent.dark,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
  borderRadius: Sizes.borderRadius.medium,
});

export const LoadingText = styled.Text({
  color: Colors.text.light,
  fontSize: Sizes.textSizes.bigger,
  fontWeight: '500',
  marginTop: Sizes.spacing.small,
});

export const WsIndicator = styled.View({
  position: 'absolute',
  top: Sizes.spacing.small + 2,
  right: Sizes.spacing.small + 2,
  backgroundColor: Colors.success,
  paddingHorizontal: Sizes.spacing.small,
  paddingVertical: Sizes.spacing.tiny,
  borderRadius: Sizes.borderRadius.pill - 8,
  zIndex: 10,
});

export const WsIndicatorText = styled.Text({
  color: Colors.text.light,
  fontSize: Sizes.textSizes.medium,
  fontWeight: 'bold',
});

// Google Places Autocomplete styles
export const googlePlacesStyles = {
  container: {
    flex: 0,
    width: width - 64,
    marginVertical: Sizes.spacing.small + 2,
    zIndex: 1000, // Higher z-index for Android
    elevation: 1000, // Android-specific elevation
  },
  textInputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRadius: Sizes.borderRadius.medium,
    paddingHorizontal: Sizes.spacing.small,
    elevation: 3, // Android shadow
    shadowColor: Colors.shadow.color,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: Colors.shadow.opacity.light,
    shadowRadius: 4,
  },
  textInput: {
    backgroundColor: 'transparent',
    height: 44,
    borderRadius: Sizes.borderRadius.medium,
    paddingVertical: Sizes.spacing.small,
    paddingHorizontal: Sizes.spacing.small,
    fontSize: Sizes.textSizes.normal,
    color: Colors.text.primary,
  },
  listView: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: Sizes.borderRadius.medium,
    marginTop: 2,
    elevation: 5, // Android-specific elevation for dropdown
    zIndex: 1001, // Higher than container
    maxHeight: 200, // Limit height to prevent overflow
  },
  row: {
    backgroundColor: 'transparent',
    padding: Sizes.spacing.small,
    minHeight: 44, // Minimum touch target size for Android
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border || '#E0E0E0',
  },
  description: {
    fontSize: Sizes.textSizes.normal,
    color: Colors.text.primary,
  },
  predefinedPlacesDescription: {
    color: Colors.text.secondary || '#666',
  },
};

// Additional styled components for inline styles
export const SafeAreaContainer = styled.SafeAreaView({
  flex: 1,
});

export const AutocompleteWrapper = styled.View({
  zIndex: 1000,
  elevation: 1000,
  position: 'relative',
});

// Plain style objects for ScrollView (can't use styled components with ScrollView style prop)
export const scrollContainerStyle = {
  flex: 1,
  marginTop: 10,
};

export const scrollContentContainerStyle = {
  flexGrow: 1,
};
