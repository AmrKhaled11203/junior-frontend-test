import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  StatusBar,
  Text,
  TouchableOpacity
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

const UserListScreen = () => {
  const dispatch = useDispatch();
  const { users, status, page, hasMore, searchQuery, error } = useSelector((state) => state.users);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(loadCachedUsers());
    dispatch(fetchUsers({ page: 1, limit: 6 }));
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(resetUsers());
    dispatch(fetchUsers({ page: 1, limit: 6 })).finally(() => setRefreshing(false));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (status !== 'loading' && hasMore) {
      dispatch(fetchUsers({ page: page + 1, limit: 6 }));
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-neo-surface">
      <StatusBar barStyle="dark-content" />
      
      <ScreenHeader title="User Stream" />

      <SearchBar 
        value={searchQuery} 
        onChangeText={(text) => dispatch(setSearchQuery(text))} 
      />

      <FlatList
        className="flex-1"
        style={{ flex: 1 }}
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserCard user={item} />}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={() => (
          <LoadMoreButton 
            loading={status === 'loading'}
            hasMore={hasMore}
            show={filteredUsers.length > 0 && searchQuery === ''}
            onPress={handleLoadMore}
          />
        )}
        ListEmptyComponent={() => (
          status !== 'loading' && (
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
          )
        )}
      />

      <ScreenFooter />
    </SafeAreaView>
  );
};

export default UserListScreen;
