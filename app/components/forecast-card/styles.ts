import styled from '@emotion/native';
import {Colors, Sizes} from '../../theming';

export const Container = styled.View<{isNight?: boolean}>(({isNight}) => ({
  backgroundColor: 'transparent',
  borderRadius: Sizes.borderRadius.medium,
  borderWidth: 1,
  borderColor: isNight
    ? Colors.background.transparent.dark
    : Colors.background.transparent.medium,
  padding: Sizes.spacing.small + 4,
  marginVertical: Sizes.spacing.tiny + 2,
  marginHorizontal: Sizes.spacing.tiny,
  shadowColor: Colors.shadow.color,
  shadowOffset: {width: 0, height: 1},
  shadowOpacity: Colors.shadow.opacity.medium,
  shadowRadius: 1.41,
  elevation: Sizes.shadow.small.elevation,
  width: 150,
}));

export const Day = styled.Text({
  fontSize: Sizes.textSizes.bigger,
  fontWeight: 'bold',
  marginBottom: Sizes.spacing.tiny,
  textAlign: 'center',
  color: Colors.white,
});

export const IconContainer = styled.View({
  alignItems: 'center',
  marginVertical: Sizes.spacing.tiny,
});

export const WeatherIcon = styled.Image({
  width: Sizes.icon.medium + 18,
  height: Sizes.icon.medium + 18,
});

export const WeatherIconPlaceholder = styled.View({
  width: Sizes.icon.medium + 18,
  height: Sizes.icon.medium + 18,
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

export const Description = styled.Text({
  fontSize: Sizes.textSizes.medium,
  textAlign: 'center',
  marginTop: Sizes.spacing.tiny / 2,
  minHeight: 30,
  color: Colors.white,
});

export const TempContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
  marginVertical: Sizes.spacing.tiny,
});

export const MaxTemp = styled.Text({
  fontSize: Sizes.textSizes.bigger,
  fontWeight: 'bold',
  marginRight: Sizes.spacing.small,
  color: Colors.white,
});

export const MinTemp = styled.Text({
  fontSize: Sizes.textSizes.bigger,
  color: Colors.white,
});

export const DetailsContainer = styled.View({
  marginTop: Sizes.spacing.tiny,
});

export const DetailText = styled.Text({
  fontSize: Sizes.textSizes.medium,
  color: Colors.white,
  marginBottom: Sizes.spacing.tiny / 2,
});
