import 'react-native-get-random-values';
import React, {useRef, useEffect} from 'react';
import createQueryClient, {persister} from './httpclient/createQueryClient';
import {
  NavigationContainer,
  type NavigationContainerRef,
} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootNavigator from './navigation/root-navigator';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import BootSplash from 'react-native-bootsplash';
import {Provider} from 'react-redux';
import {store} from './store';
import {initializeLocation} from './utils/geolocation';
import ErrorBoundary from './components/error-boundary/error-boundary';

const queryClient = createQueryClient();

function App(): React.JSX.Element {
  // Use React.useRef with the correct type
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const routeNameRef = useRef<string | undefined>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Set a timeout to ensure the boot splash is hidden even if permissions take too long
        const timeoutPromise = new Promise<void>(resolve => {
          setTimeout(() => {
            console.log('Location initialization timeout reached');
            resolve();
          }, 3000); // 3 seconds timeout
        });

        // Race between location initialization and timeout
        await Promise.race([initializeLocation(), timeoutPromise]);

        // Hide the boot splash after initialization is complete or timeout
        await BootSplash.hide({fade: true});
        console.log('BootSplash has been hidden successfully');
      } catch (error) {
        console.error('Failed during initialization:', error);
        // Hide the boot splash even if there's an error
        await BootSplash.hide({fade: true});
      }
    };

    init();
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{persister}}
          onSuccess={() => {
            console.log('Successfully restored React Query cache');
          }}>
          <SafeAreaProvider>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                routeNameRef.current =
                  navigationRef.current?.getCurrentRoute()?.name;
              }}>
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistQueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
