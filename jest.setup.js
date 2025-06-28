// Mock react-native modules that aren't available in the test environment
jest.mock('react-native-config', () => ({
  BASE_URL: 'https://api.example.com/',
  API_KEY: 'mock-api-key',
  GOOGLE_PLACES_KEY: 'mock-google-places-key',
}));

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => {
  const mockMMKV = {
    getString: jest.fn(),
    set: jest.fn(),
  };

  return {
    MMKV: jest.fn().mockImplementation(() => mockMMKV),
  };
});

// Mock @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn().mockResolvedValue({isConnected: true}),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock react-native-permissions
jest.mock('react-native-permissions', () => ({
  request: jest.fn(),
  check: jest.fn(),
  PERMISSIONS: {
    IOS: {
      LOCATION_WHEN_IN_USE: 'ios.permission.LOCATION_WHEN_IN_USE',
    },
    ANDROID: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    },
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    UNAVAILABLE: 'unavailable',
  },
}));

// Mock react-native Platform and PermissionsAndroid
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn(),
  },
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
  },
  // Mock common React Native components
  View: 'View',
  Text: 'Text',
  ScrollView: 'ScrollView',
  TouchableOpacity: 'TouchableOpacity',
  Image: 'Image',
  TextInput: 'TextInput',
  FlatList: ({data, renderItem, keyExtractor}) => {
    const React = require('react');
    if (!data || !renderItem) {
      return React.createElement('View', {testID: 'empty-flatlist'});
    }

    return React.createElement(
      'View',
      {testID: 'flatlist-container'},
      data.map((item, index) => {
        const key = keyExtractor ? keyExtractor(item, index) : index.toString();
        return React.createElement(
          'View',
          {key, testID: `flatlist-item-${index}`},
          renderItem({item, index}),
        );
      }),
    );
  },
  ActivityIndicator: 'ActivityIndicator',
  Alert: {
    alert: jest.fn(),
  },
  Dimensions: {
    get: jest.fn().mockReturnValue({width: 375, height: 667}),
  },
  StyleSheet: {
    create: jest.fn(styles => styles),
    flatten: jest.fn(styles => styles),
  },
  Modal: 'Modal',
  Animated: {
    View: 'Animated.View',
    Text: 'Animated.Text',
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
    spring: jest.fn(() => ({
      start: jest.fn(),
    })),
  },
}));

// Mock @react-native-community/geolocation
jest.mock('@react-native-community/geolocation', () => ({
  setRNConfiguration: jest.fn(),
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
}));

// Mock react-native-linear-gradient
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

// Mock react-native-google-places-autocomplete
jest.mock('react-native-google-places-autocomplete', () => ({
  GooglePlacesAutocomplete: 'GooglePlacesAutocomplete',
}));

// Mock react-native-bootsplash
jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn().mockResolvedValue(true),
  show: jest.fn().mockResolvedValue(true),
  getVisibilityStatus: jest.fn().mockResolvedValue('hidden'),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: 'SafeAreaProvider',
  SafeAreaView: 'SafeAreaView',
  useSafeAreaInsets: jest.fn().mockReturnValue({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }),
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: 'NavigationContainer',
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: jest.fn().mockReturnValue({
    params: {},
  }),
}));

// Mock @react-navigation/native-stack
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: jest.fn().mockReturnValue({
    Navigator: 'Navigator',
    Screen: 'Screen',
  }),
}));

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useQueryClient: jest.fn().mockReturnValue({
      setQueryData: jest.fn(),
      invalidateQueries: jest.fn(),
      getQueryData: jest.fn(),
    }),
  };
});

// Mock react-redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
  Provider: 'Provider',
}));

// Mock file imports
jest.mock('__mocks__/fileMock.js', () => 'test-file-stub', {virtual: true});

// Mock the store
jest.mock('./app/store', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(),
    subscribe: jest.fn(),
  },
}));

// Mock the store hooks
jest.mock('./app/store/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

// Global setup
global.console = {
  ...console,
  // Uncomment to ignore specific console methods during tests
  // error: jest.fn(),
  // warn: jest.fn(),
  // log: jest.fn(),
};
