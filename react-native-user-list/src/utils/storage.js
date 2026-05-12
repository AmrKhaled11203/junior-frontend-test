import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_CACHE_KEY = '@users_cache';

/**
 * Cache users array to AsyncStorage.
 * Silently catches write errors to avoid crashing the app.
 */
export const cacheUsers = async (users) => {
  try {
    await AsyncStorage.setItem(USERS_CACHE_KEY, JSON.stringify(users));
    if (__DEV__) console.log('[Cache] Users cached successfully');
  } catch (err) {
    if (__DEV__) console.warn('[Cache] Failed to write:', err.message);
  }
};

/**
 * Retrieve cached users from AsyncStorage.
 * Returns an empty array if no cache exists or on read failure.
 */
export const getCachedUsers = async () => {
  try {
    const cachedData = await AsyncStorage.getItem(USERS_CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : [];
  } catch {
    return [];
  }
};
