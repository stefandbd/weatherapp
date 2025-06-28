import styled from '@emotion/native';
import {Dimensions, TouchableOpacity} from 'react-native';
import {Colors, Sizes} from '../../theming';

const {width} = Dimensions.get('window');

export const ModalOverlay = styled.View({
  flex: 1,
  backgroundColor: Colors.background.transparent.dark,
  justifyContent: 'center',
  alignItems: 'center',
});

export const ModalContent = styled.View({
  width: width * 0.9,
  maxHeight: 500,
  backgroundColor: Colors.background.primary,
  borderRadius: Sizes.borderRadius.large,
  padding: Sizes.spacing.large,
  shadowColor: Colors.shadow.color,
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: Colors.shadow.opacity.dark,
  shadowRadius: 3.84,
  elevation: Sizes.shadow.medium.elevation,
});

export const ModalHeader = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: Sizes.spacing.medium - 1,
});

export const ModalTitle = styled.Text({
  fontSize: Sizes.textSizes.heading3,
  fontWeight: 'bold',
  color: Colors.text.primary,
});

export const CloseButton = styled.TouchableOpacity(
  (props: {disabled?: boolean}) => ({
    padding: Sizes.spacing.tiny + 1,
    opacity: props.disabled ? 0.5 : 1,
  }),
);

export const CloseButtonText = styled.Text({
  fontSize: Sizes.textSizes.heading3,
  fontWeight: 'bold',
  color: Colors.text.primary,
});

export const searchListStyle = {
  maxHeight: 350,
};

// Custom SearchItem component with loading state
interface SearchItemProps {
  disabled?: boolean;
  isLoading?: boolean;
}

export const SearchItem = styled(TouchableOpacity)(
  (props: SearchItemProps) => ({
    paddingVertical: Sizes.spacing.small + 4,
    opacity: props.disabled ? 0.5 : 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
);

export const SearchItemContent = styled.View({
  flex: 1,
});

export const CityName = styled.Text({
  fontSize: Sizes.textSizes.bigger,
  fontWeight: '500',
  color: Colors.text.primary,
});

export const SearchDate = styled.Text({
  fontSize: Sizes.textSizes.medium,
  color: Colors.text.secondary,
  marginTop: Sizes.spacing.tiny,
});

export const LoadingIndicator = styled.View({
  marginLeft: Sizes.spacing.small + 2,
  width: Sizes.icon.tiny + 4,
  height: Sizes.icon.tiny + 4,
  justifyContent: 'center',
  alignItems: 'center',
});

export const Separator = styled.View({
  height: 1,
  backgroundColor: Colors.border.light,
});

export const ClearButton = styled.TouchableOpacity(
  (props: {disabled?: boolean}) => ({
    marginTop: Sizes.spacing.medium,
    padding: Sizes.spacing.small + 2,
    backgroundColor: Colors.background.secondary,
    borderRadius: Sizes.borderRadius.small + 1,
    alignItems: 'center',
    opacity: props.disabled ? 0.5 : 1,
  }),
);

export const ClearButtonText = styled.Text({
  color: Colors.error,
  fontWeight: '500',
  fontSize: Sizes.textSizes.normal,
});

export const EmptyContainer = styled.View({
  padding: Sizes.spacing.large + 6,
  alignItems: 'center',
});

export const EmptyText = styled.Text({
  fontSize: Sizes.textSizes.bigger,
  color: Colors.text.secondary,
});

// Loading overlay for full modal
export const LoadingOverlay = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: Sizes.borderRadius.large,
});

export const LoadingText = styled.Text({
  color: Colors.text.light,
  fontSize: Sizes.textSizes.bigger,
  marginTop: Sizes.spacing.small + 2,
});
