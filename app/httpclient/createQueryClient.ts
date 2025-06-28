import NetInfo from '@react-native-community/netinfo';
import {onlineManager, QueryClient} from '@tanstack/react-query';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
import {MMKV} from 'react-native-mmkv';

// Create storage instance
const storage = new MMKV();

// Create a wrapper that implements the required methods
const mmkvStorageAdapter = {
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};

export const persister = createAsyncStoragePersister({
  storage: mmkvStorageAdapter,
  throttleTime: 3000, // 3 seconds
});

// //////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(state.isInternetReachable !== false);
  });
});

// //////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////

export default function createQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        staleTime: 1000 * 60 * 5, // 5 minutes (300000ms)
        retry: 2,
        refetchOnWindowFocus: false, // Reduce unnecessary refetches
      },
    },
  });

  return queryClient;
}
