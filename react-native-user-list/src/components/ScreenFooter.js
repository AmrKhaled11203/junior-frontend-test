import React from 'react';
import { View, Text } from 'react-native';

const ScreenFooter = () => {
  return (
    <View className="p-5 border-t-neo-thick border-neo-black items-center bg-neo-surface">
      <View className="bg-neo-primary px-5 py-2 border-neo-thin border-neo-black shadow-neo-sm">
        <Text className="text-white text-[12px] font-[900] italic">CREATED BY AMR KHALED</Text>
      </View>
    </View>
  );
};

export default ScreenFooter;
