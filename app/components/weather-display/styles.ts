import styled from '@emotion/native';
import {Colors, Sizes} from '../../theming';

export const Container = styled.View({
  padding: Sizes.spacing.medium,
  backgroundColor: Colors.background.transparent.medium,
  borderRadius: Sizes.borderRadius.medium,
  shadowColor: Colors.shadow.color,
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: Colors.shadow.opacity.light,
  shadowRadius: 4,
  elevation: Sizes.shadow.small.elevation,
  marginVertical: Sizes.spacing.small,
});

export const Title = styled.Text({
  fontSize: Sizes.textSizes.heading3,
  fontWeight: 'bold',
  marginBottom: Sizes.spacing.small,
  color: Colors.text.light,
});

export const WeatherInfo = styled.View({
  alignItems: 'center',
  marginTop: Sizes.spacing.small,
});

export const CurrentWeatherRow = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: Sizes.gutterSize * 2,
});

export const TemperatureContainer = styled.View({
  flex: 1,
});

export const Temperature = styled.Text({
  fontSize: 36,
  fontWeight: 'bold',
  marginBottom: Sizes.spacing.tiny,
  color: Colors.white,
});

export const Description = styled.Text({
  fontSize: Sizes.textSizes.heading3,
  marginBottom: Sizes.spacing.medium,
  color: Colors.white,
});

export const WeatherIcon = styled.Image({
  width: Sizes.icon.xLarge + 36,
  height: Sizes.icon.xLarge + 36,
});

export const WeatherIconPlaceholder = styled.View({
  width: Sizes.icon.xLarge + 36,
  height: Sizes.icon.xLarge + 36,
  backgroundColor: 'rgba(100, 181, 246, 0.3)',
  borderRadius: Sizes.borderRadius.circle,
  justifyContent: 'center',
  alignItems: 'center',
});

export const WeatherIconPlaceholderText = styled.Text({
  fontSize: Sizes.textSizes.bigger,
  color: Colors.info,
  textAlign: 'center',
});

export const DetailsContainer = styled.View({
  width: '100%',
  marginTop: Sizes.spacing.medium,
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: Sizes.gutterSize * 2,
});

export const DetailItem = styled.View({
  marginBottom: Sizes.spacing.small,
});

export const DetailLabel = styled.Text({
  fontSize: Sizes.textSizes.normal,
  color: Colors.text.light,
});

export const DetailText = styled.Text({
  fontSize: Sizes.textSizes.bigger,
  marginBottom: Sizes.spacing.tiny,
  color: Colors.text.tertiary,
});

export const Text = styled.Text({
  fontSize: Sizes.textSizes.bigger,
  marginBottom: Sizes.spacing.tiny,
  textAlign: 'center',
  marginTop: Sizes.spacing.small,
  color: Colors.text.primary,
});

export const ErrorText = styled.Text({
  fontSize: Sizes.textSizes.bigger,
  color: Colors.error,
  marginBottom: Sizes.spacing.medium,
  textAlign: 'center',
});

// Error state components
export const ErrorContainer = styled.View({
  padding: Sizes.spacing.large,
  backgroundColor: Colors.background.transparent.light,
  borderRadius: Sizes.borderRadius.large,
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: Sizes.spacing.medium,
});

export const ErrorIcon = styled.View({
  width: Sizes.icon.medium + 18,
  height: Sizes.icon.medium + 18,
  borderRadius: Sizes.borderRadius.circle,
  backgroundColor: 'rgba(255, 107, 107, 0.2)',
  marginBottom: Sizes.spacing.medium,
  justifyContent: 'center',
  alignItems: 'center',
});

export const ErrorIconText = styled.Text({
  fontSize: Sizes.textSizes.heading2,
  color: Colors.error,
  fontWeight: 'bold',
});

export const ErrorTitle = styled.Text({
  fontSize: Sizes.textSizes.heading3,
  fontWeight: 'bold',
  color: Colors.text.primary,
  marginBottom: Sizes.spacing.small,
  textAlign: 'center',
});

export const RetryButton = styled.View({
  backgroundColor: Colors.error,
  paddingHorizontal: Sizes.spacing.medium,
  paddingVertical: Sizes.spacing.small,
  borderRadius: Sizes.borderRadius.pill,
  marginTop: Sizes.spacing.medium,
});

export const RetryButtonText = styled.Text({
  color: Colors.text.light,
  fontWeight: 'bold',
  fontSize: Sizes.textSizes.bigger,
});

// Empty state components
export const EmptyContainer = styled.View({
  padding: Sizes.spacing.large,
  backgroundColor: Colors.background.transparent.light,
  borderRadius: Sizes.borderRadius.large,
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: Sizes.spacing.medium,
});

export const EmptyIcon = styled.View({
  width: Sizes.icon.medium + 18,
  height: Sizes.icon.medium + 18,
  borderRadius: Sizes.borderRadius.circle,
  backgroundColor: 'rgba(100, 181, 246, 0.2)',
  marginBottom: Sizes.spacing.medium,
  justifyContent: 'center',
  alignItems: 'center',
});

export const EmptyIconText = styled.Text({
  fontSize: Sizes.textSizes.heading2,
  color: Colors.info,
  fontWeight: 'bold',
});

export const EmptyText = styled.Text({
  fontSize: Sizes.textSizes.heading3,
  color: Colors.text.secondary,
  marginBottom: Sizes.spacing.small,
  textAlign: 'center',
});

export const EmptyForecastText = styled.Text({
  fontSize: Sizes.textSizes.bigger,
  color: Colors.text.tertiary,
  textAlign: 'center',
  paddingVertical: Sizes.spacing.medium,
});

// Skeleton loading components
export const SkeletonCard = styled.View({
  width: 120,
  height: 180,
  backgroundColor: Colors.background.transparent.medium,
  borderRadius: Sizes.borderRadius.medium,
  marginRight: Sizes.spacing.small + 4,
  padding: Sizes.spacing.small + 4,
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const ForecastContainer = styled.View({
  padding: Sizes.gutterSize * 2,
});

export const Space = styled.View({
  marginTop: Sizes.spacing.large,
});

export const ForecastTitle = styled.Text({
  fontSize: Sizes.textSizes.heading3,
  fontWeight: 'bold',
  marginBottom: Sizes.spacing.small + 2,
  color: Colors.white,
});

// Skeleton view component
export const SkeletonContainer = styled.View<{
  width: number;
  height: number;
  borderRadius: number;
}>(({width, height, borderRadius}) => ({
  width,
  height,
  borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  marginVertical: 4,
}));

// Gradient container styles - export as plain object for LinearGradient style prop
export const gradientContainerStyle = {
  padding: 8,
  borderRadius: 8,
};
