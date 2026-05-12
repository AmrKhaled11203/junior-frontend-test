import { Platform } from 'react-native';
import { fetch } from 'expo/fetch';

// Using dummyjson.com — more reliable across all networks and devices
const API_URL = 'https://dummyjson.com/users';

// Cap total users to match the jsonplaceholder spec (10 users).
// dummyjson has 30 users, but the spec only requires 10.
const MAX_USERS = 10;

/**
 * Normalize dummyjson user format to match our app's expected shape.
 * Maps dummyjson fields → JSONPlaceholder-compatible structure.
 */
export const normalizeUser = (user) => ({
  id: user.id,
  name: `${user.firstName} ${user.lastName}`,
  username: user.username,
  email: user.email,
  phone: user.phone,
  website: user.domain || '',
  company: {
    name: user.company?.name || '',
    catchPhrase: user.company?.title || '',
    bs: user.company?.department || '',
  },
  address: {
    street: user.address?.address || '',
    suite: user.address?.stateCode || '',
    city: user.address?.city || '',
    zipcode: user.address?.postalCode || '',
    geo: {
      lat: String(user.address?.coordinates?.lat || 0),
      lng: String(user.address?.coordinates?.lng || 0),
    },
  },
});

/**
 * Fetch with automatic retry logic using expo/fetch.
 * Retries up to `retries` times with a 1.5s delay between attempts.
 */
export const fetchWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      if (__DEV__) console.log(`[API] Attempt ${i + 1}/${retries} on ${Platform.OS}`);

      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (__DEV__) console.log(`[API] Success on attempt ${i + 1}`);
      return data;
    } catch (err) {
      if (__DEV__) console.error(`[API] Attempt ${i + 1} failed: ${err.message}`);
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1500));
    }
  }
};

/**
 * Fetch a page of users from the API.
 * @param {number} page - 1-indexed page number
 * @param {number} limit - Number of users per page
 * @returns {{ users: Array, hasMore: boolean, page: number }}
 */
export const fetchUsersFromApi = async (page, limit) => {
  const skip = (page - 1) * limit;

  // Don't fetch beyond our cap
  if (skip >= MAX_USERS) {
    return { users: [], page, hasMore: false };
  }

  // Adjust limit if we'd exceed the cap (e.g. skip=5, limit=6 → only fetch 5)
  const adjustedLimit = Math.min(limit, MAX_USERS - skip);
  const url = `${API_URL}?limit=${adjustedLimit}&skip=${skip}&select=firstName,lastName,username,email,phone,domain,company,address`;

  const data = await fetchWithRetry(url);

  // dummyjson returns { users: [...], total, skip, limit }
  const rawUsers = Array.isArray(data.users) ? data.users : [];
  const users = rawUsers.map(normalizeUser);
  const hasMore = skip + users.length < MAX_USERS;

  return { users, page, hasMore };
};
