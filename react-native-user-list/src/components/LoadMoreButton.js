import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

const LoadMoreButton = ({ loading, hasMore, show, onPress }) => {
  if (!show) return null;

  return (
    <View className="py-8 items-center">
      {loading ? (
        <ActivityIndicator size="large" color="#134a6d" />
      ) : hasMore ? (
        <TouchableOpacity 
          className="bg-neo-accent border-neo-thick border-neo-black px-8 py-4 shadow-neo-md" 
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text className="text-sm font-[900] text-neo-black tracking-widest">LOAD MORE USERS</Text>
        </TouchableOpacity>
      ) : (
        <Text className="text-center text-[12px] font-[900] text-gray-400 tracking-[2px]">END OF STREAM</Text>
      )}
    </View>
  );
};

export default LoadMoreButton;
