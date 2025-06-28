import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import RecentSearchesModal from '../../app/components/recent-searches-modal/recent-searches-modal';
import {useAppSelector, useAppDispatch} from '../../app/store/hooks';

// Mock dependencies
jest.mock('../../app/store/hooks');
jest.mock('../../app/store/locationSlice');

// Mock the useAppSelector hook
const mockedUseAppSelector = useAppSelector as jest.MockedFunction<
  typeof useAppSelector
>;

// Mock the useAppDispatch hook
const mockedUseAppDispatch = useAppDispatch as jest.MockedFunction<
  typeof useAppDispatch
>;

// Mock the styles to avoid styling-related issues in tests
jest.mock('../../app/components/recent-searches-modal/styles', () => ({
  ModalOverlay: 'View',
  ModalContent: 'View',
  ModalHeader: 'View',
  ModalTitle: 'Text',
  CloseButton: 'TouchableOpacity',
  CloseButtonText: 'Text',
  SearchItem: 'TouchableOpacity',
  SearchItemContent: 'View',
  CityName: 'Text',
  SearchDate: 'Text',
  LoadingIndicator: 'View',
  Separator: 'View',
  ClearButton: 'TouchableOpacity',
  ClearButtonText: 'Text',
  EmptyContainer: 'View',
  EmptyText: 'Text',
  LoadingOverlay: 'View',
  LoadingText: 'Text',
  searchListStyle: {},
}));

// Mock the SearchListItem component
jest.mock('../../app/components/recent-searches-modal/search-list-item', () => {
  return function MockSearchListItem({item, onSelect, index}: any) {
    const {TouchableOpacity, Text} = require('react-native');
    return (
      <TouchableOpacity
        onPress={() =>
          onSelect(item.cityName, item.latitude, item.longitude, index)
        }
        testID={`search-item-${item.cityName}`}>
        <Text>{item.cityName}</Text>
      </TouchableOpacity>
    );
  };
});

describe('RecentSearchesModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSelectLocation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the dispatch function
    const mockDispatch = jest.fn();
    mockedUseAppDispatch.mockReturnValue(mockDispatch);
  });

  it('should render empty state when there are no recent searches', () => {
    // Mock the useAppSelector hook to return empty recent searches
    mockedUseAppSelector.mockImplementation(_selector => {
      // This simulates what the real selector would do
      return [];
    });

    const {getByText} = render(
      <RecentSearchesModal
        visible={true}
        onClose={mockOnClose}
        onSelectLocation={mockOnSelectLocation}
      />,
    );

    // Check if empty state message is displayed
    expect(getByText('No recent searches')).toBeTruthy();

    // Check if close button is displayed
    expect(getByText('✕')).toBeTruthy();
  });

  it('should render recent searches when available', () => {
    // Mock recent searches data
    const mockRecentSearches = [
      {
        cityName: 'New York',
        latitude: 40.7128,
        longitude: -74.006,
        timestamp: 1650034800000,
      },
      {
        cityName: 'London',
        latitude: 51.5074,
        longitude: -0.1278,
        timestamp: 1650034700000,
      },
    ];

    // Mock the useAppSelector hook to return recent searches
    mockedUseAppSelector.mockImplementation(_selector => {
      // This simulates what the real selector would do
      return mockRecentSearches;
    });

    const {getByTestId, getByText} = render(
      <RecentSearchesModal
        visible={true}
        onClose={mockOnClose}
        onSelectLocation={mockOnSelectLocation}
      />,
    );

    // Check if recent searches are displayed using testID
    expect(getByTestId('search-item-New York')).toBeTruthy();
    expect(getByTestId('search-item-London')).toBeTruthy();

    // Check if clear button is displayed
    expect(getByText('Clear All Searches')).toBeTruthy();
  });

  it('should call onClose when close button is pressed', () => {
    // Mock the useAppSelector hook to return empty recent searches
    mockedUseAppSelector.mockImplementation(_selector => {
      // This simulates what the real selector would do
      return [];
    });

    const {getByText} = render(
      <RecentSearchesModal
        visible={true}
        onClose={mockOnClose}
        onSelectLocation={mockOnSelectLocation}
      />,
    );

    // Press the close button
    fireEvent.press(getByText('✕'));

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onSelectLocation when a search item is pressed', () => {
    // Mock recent searches data
    const mockRecentSearches = [
      {
        cityName: 'New York',
        latitude: 40.7128,
        longitude: -74.006,
        timestamp: 1650034800000,
      },
    ];

    // Mock the useAppSelector hook to return recent searches
    mockedUseAppSelector.mockImplementation(_selector => {
      // This simulates what the real selector would do
      return mockRecentSearches;
    });

    const {getByTestId} = render(
      <RecentSearchesModal
        visible={true}
        onClose={mockOnClose}
        onSelectLocation={mockOnSelectLocation}
      />,
    );

    // Press the search item using testID
    fireEvent.press(getByTestId('search-item-New York'));

    // Check if onSelectLocation was called with correct parameters
    expect(mockOnSelectLocation).toHaveBeenCalledWith(
      'New York',
      40.7128,
      -74.006,
    );
  });

  // Additional tests for dispatch functionality could be added here
});
