import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  View, 
  FlatList, 
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, loadCachedUsers, setSearchQuery, resetUsers } from '../redux/usersSlice';

// Components
import ScreenHeader from '../components/ScreenHeader';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import LoadMoreButton from '../components/LoadMoreButton';
import ScreenFooter from '../components/ScreenFooter';

const ITEMS_PER_PAGE = 5;

const UserListScreen = () => {
  const dispatch = useDispatch();
  const { users, status, page, hasMore, searchQuery, error } = useSelector((state) => state.users);
  const [refreshing, setRefreshing] = useState(false);

  // Load cached data first, then fetch fresh data from API
  useEffect(() => {
    dispatch(loadCachedUsers());
    dispatch(fetchUsers({ page: 1, limit: ITEMS_PER_PAGE }));
  }, [dispatch]);

  // Pull-to-refresh with proper error handling via unwrap()
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(resetUsers());
    try {
      await dispatch(fetchUsers({ page: 1, limit: ITEMS_PER_PAGE })).unwrap();
    } catch {
      // Error is already handled by the rejected case in the slice
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Load more — only if not already loading and more pages exist
  const handleLoadMore = useCallback(() => {
    if (status !== 'loading' && hasMore) {
      dispatch(fetchUsers({ page: page + 1, limit: ITEMS_PER_PAGE }));
    }
  }, [dispatch, status, hasMore, page]);

  // Search handler passed to SearchBar (already debounced inside SearchBar)
  const handleSearch = useCallback((text) => {
    dispatch(setSearchQuery(text));
  }, [dispatch]);

  // Memoized filtered list — only re-computes when users or searchQuery change
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Extracted renderItem with useCallback to avoid creating a new function on each render
  const renderItem = useCallback(({ item }) => <UserCard user={item} />, []);

  // Key extractor — stable reference
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Memoized footer to prevent re-creating the component reference each render
  const listFooter = useMemo(() => (
    <LoadMoreButton 
      loading={status === 'loading'}
      hasMore={hasMore}
      show={filteredUsers.length > 0 && searchQuery === ''}
      onPress={handleLoadMore}
    />
  ), [status, hasMore, filteredUsers.length, searchQuery, handleLoadMore]);

  // Memoized empty state
  const listEmpty = useMemo(() => {
    if (status === 'loading') return null;
    return (
      <View className="p-10 items-center">
        <Text className="text-base font-[900] text-gray-400 italic">
          {status === 'failed' ? `ERROR: ${error || 'FETCH FAILED'}` : 'NO USERS FOUND'}
        </Text>
        {status === 'failed' && (
          <TouchableOpacity 
            className="mt-4 bg-neo-primary px-4 py-2 border-neo-thin border-neo-black"
            onPress={onRefresh}
          >
            <Text className="text-white font-bold">RETRY</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [status, error, onRefresh]);

  return (
    <SafeAreaView className="flex-1 bg-neo-surface">
      <StatusBar barStyle="dark-content" />
      
      <ScreenHeader title="User Stream" />

      <SearchBar 
        value={searchQuery} 
        onChangeText={handleSearch} 
      />

      <FlatList
        className="flex-1"
        style={{ flex: 1 }}
        data={filteredUsers}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={listFooter}
        ListEmptyComponent={listEmpty}
        // FlatList performance optimizations
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />

      <ScreenFooter />
    </SafeAreaView>
  );
};

export default UserListScreen;
