import React from 'react';
import { View, Text } from 'react-native';

const ScreenHeader = ({ title }) => {
  return (
    <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b-neo-thick border-neo-black">
      <Text className="text-3xl font-[900] italic uppercase text-neo-black">{title}</Text>
      <View className="bg-neo-primary px-3 py-1 border-neo-thin border-neo-black">
        <Text className="text-white text-[10px] font-[900] tracking-widest">FEKRA SOLUTION HUB</Text>
      </View>
    </View>
  );
};

export default ScreenHeader;
