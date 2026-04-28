import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, loadCachedUsers, setSearchQuery, resetUsers } from '../redux/usersSlice';
import { Search, User as UserIcon, Mail, Phone, ChevronRight } from 'lucide-react-native';

const NEO_PRIMARY = '#134a6d';
const NEO_SURFACE = '#fbfbf9';
const NEO_BLACK = '#000000';

const UserListScreen = () => {
  const dispatch = useDispatch();
  const { users, status, page, hasMore, searchQuery } = useSelector((state) => state.users);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(loadCachedUsers());
    dispatch(fetchUsers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(resetUsers());
    dispatch(fetchUsers({ page: 1, limit: 10 })).finally(() => setRefreshing(false));
  }, [dispatch]);

  const loadMore = () => {
    if (status !== 'loading' && hasMore) {
      dispatch(fetchUsers({ page: page + 1, limit: 10 }));
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={[styles.avatarBox, { backgroundColor: NEO_PRIMARY }]}>
          <UserIcon color="white" size={24} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={styles.infoRow}>
            <Mail size={12} color="#666" />
            <Text style={styles.userInfo}>{item.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Phone size={12} color="#666" />
            <Text style={styles.userInfo}>{item.phone}</Text>
          </View>
        </View>
        <ChevronRight color={NEO_BLACK} size={20} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Stream</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>FEKRA HUB</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search color={NEO_BLACK} size={20} style={styles.searchIcon} />
          <TextInput
            placeholder="SEARCH USERS..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => dispatch(setSearchQuery(text))}
          />
        </View>
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={() => (
          status === 'loading' ? (
            <ActivityIndicator size="large" color={NEO_PRIMARY} style={{ margin: 20 }} />
          ) : !hasMore && filteredUsers.length > 0 ? (
            <Text style={styles.footerText}>END OF STREAM</Text>
          ) : null
        )}
        ListEmptyComponent={() => (
          status !== 'loading' && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>NO USERS FOUND</Text>
            </View>
          )
        )}
      />

      {/* Footer Branding */}
      <View style={styles.footer}>
        <View style={styles.footerBadge}>
          <Text style={styles.footerBadgeText}>CREATED BY AMR KHALED</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_SURFACE,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 4,
    borderBottomColor: NEO_BLACK,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: NEO_BLACK,
  },
  badge: {
    backgroundColor: NEO_PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: NEO_BLACK,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  searchContainer: {
    padding: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: NEO_BLACK,
    paddingHorizontal: 15,
    height: 54,
    shadowColor: NEO_BLACK,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: NEO_BLACK,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: NEO_BLACK,
    marginBottom: 16,
    padding: 16,
    shadowColor: NEO_BLACK,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarBox: {
    width: 50,
    height: 50,
    borderWidth: 3,
    borderColor: NEO_BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: NEO_BLACK,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  userInfo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '900',
    color: '#999',
    marginVertical: 20,
    letterSpacing: 2,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#999',
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    borderTopWidth: 4,
    borderTopColor: NEO_BLACK,
    alignItems: 'center',
  },
  footerBadge: {
    backgroundColor: NEO_PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 3,
    borderColor: NEO_BLACK,
    shadowColor: NEO_BLACK,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  footerBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '900',
    fontStyle: 'italic',
  }
});

export default UserListScreen;
