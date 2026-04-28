import React from 'react';
import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';

const SearchBar = ({ value, onChangeText }) => {
  return (
    <View className="p-5">
      <View className="flex-row items-center bg-white border-neo-thick border-neo-black px-4 h-[54px] shadow-neo-md">
        <Search color="black" size={20} className="mr-3" />
        <TextInput
          placeholder="SEARCH USERS..."
          placeholderTextColor="#999"
          className="flex-1 text-sm font-bold text-neo-black"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

export default SearchBar;
