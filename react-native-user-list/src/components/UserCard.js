import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User as UserIcon, Mail, ChevronRight } from 'lucide-react-native';
import { formatAddress } from '../utils/formatAddress';

/**
 * UserCard — Reusable card displaying user info.
 * Wrapped in React.memo to prevent unnecessary re-renders in FlatList.
 * Displays: name, username, company, email, website, and formatted address.
 */
const UserCard = ({ user }) => {
  return (
    <TouchableOpacity 
      className="bg-white border-neo-thick border-neo-black mb-4 p-4 shadow-neo-lg" 
      activeOpacity={0.8}
    >
      <View className="flex-row items-center gap-4">
        <View className="w-[50px] h-[50px] bg-neo-primary border-neo-thin border-neo-black items-center justify-center">
          <UserIcon color="white" size={24} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-baseline gap-2 mb-0.5">
            <Text className="text-xl font-[900] text-neo-black">{user.name}</Text>
            <Text className="text-[12px] font-bold text-neo-primary italic">@{user.username}</Text>
          </View>
          
          <Text className="text-[13px] font-extrabold text-neo-black uppercase tracking-wider mb-2 opacity-70">
            {user.company.name}
          </Text>

          <View className="gap-1 mb-3">
            <View className="flex-row items-center gap-2">
              <Mail size={12} color="#134a6d" />
              <Text className="text-[12px] font-semibold text-gray-700">{user.email}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-[12px] items-center">
                <Text className="text-[10px] font-bold">🌐</Text>
              </View>
              <Text className="text-[12px] font-semibold text-gray-700">{user.website}</Text>
            </View>
          </View>

          {/* Address: combined street, city, zipcode per spec */}
          <View className="self-start bg-neo-black px-2 py-0.5 border border-neo-black">
            <Text className="text-white text-[10px] font-[900] uppercase tracking-widest">
              {formatAddress(user.address)}
            </Text>
          </View>
        </View>
        <ChevronRight color="black" size={20} />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(UserCard);
