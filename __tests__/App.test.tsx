/**
 * @format
 */

import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import App from '../app/App';

// Mock the initializeLocation function to avoid async issues
jest.mock('../app/utils/geolocation', () => ({
  initializeLocation: jest.fn().mockResolvedValue(undefined),
  requestLocationPermission: jest.fn().mockResolvedValue(true),
  getCurrentPosition: jest.fn().mockResolvedValue(undefined),
  getLocationNameFromCoordinates: jest.fn().mockResolvedValue('Test City'),
}));

// Mock the query client and persister
jest.mock('../app/httpclient/createQueryClient', () => {
  const mockQueryClient = {
    mount: jest.fn(),
    unmount: jest.fn(),
    clear: jest.fn(),
    getQueryData: jest.fn(),
    setQueryData: jest.fn(),
    invalidateQueries: jest.fn(),
    removeQueries: jest.fn(),
    cancelQueries: jest.fn(),
    isFetching: jest.fn().mockReturnValue(0),
    isMutating: jest.fn().mockReturnValue(0),
    getDefaultOptions: jest.fn().mockReturnValue({}),
    setDefaultOptions: jest.fn(),
    getQueryCache: jest.fn().mockReturnValue({
      find: jest.fn(),
      findAll: jest.fn(),
      subscribe: jest.fn().mockReturnValue(() => {}),
      clear: jest.fn(),
    }),
    getMutationCache: jest.fn().mockReturnValue({
      find: jest.fn(),
      findAll: jest.fn(),
      subscribe: jest.fn().mockReturnValue(() => {}),
      clear: jest.fn(),
    }),
  };

  return {
    __esModule: true,
    default: jest.fn(() => mockQueryClient),
    persister: {
      persistClient: jest.fn().mockResolvedValue(undefined),
      restoreClient: jest.fn().mockResolvedValue(undefined),
      removeClient: jest.fn().mockResolvedValue(undefined),
    },
  };
});

// Mock @tanstack/react-query-persist-client
jest.mock('@tanstack/react-query-persist-client', () => ({
  PersistQueryClientProvider: ({children}: {children: React.ReactNode}) =>
    children,
}));

// Mock the error boundary
jest.mock(
  '../app/components/error-boundary/error-boundary',
  () => 'ErrorBoundary',
);

// Mock the root navigator
jest.mock('../app/navigation/root-navigator', () => 'RootNavigator');

// Simple test to verify App renders without crashing
test('renders correctly', async () => {
  const {toJSON} = render(<App />);

  // Wait for any async operations to complete
  await waitFor(() => {
    expect(toJSON()).toBeTruthy();
  });
});
