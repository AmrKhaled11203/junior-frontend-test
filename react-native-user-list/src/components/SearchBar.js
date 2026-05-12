import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';

/**
 * SearchBar with debounced input.
 * Keeps a local state for instant UI feedback, then dispatches to Redux
 * after 300ms of inactivity to avoid excessive re-renders during typing.
 */
const SearchBar = ({ value, onChangeText }) => {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef(null);

  // Sync local state if the external value changes (e.g. on reset)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((text) => {
    setLocalValue(text);

    // Clear any pending debounce timer
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Dispatch to Redux after 300ms of no typing
    debounceRef.current = setTimeout(() => {
      onChangeText(text);
    }, 300);
  }, [onChangeText]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <View className="p-5">
      <View className="flex-row items-center bg-white border-neo-thick border-neo-black px-4 h-[54px] shadow-neo-md">
        <Search color="black" size={20} className="mr-3" />
        <TextInput
          placeholder="SEARCH USERS..."
          placeholderTextColor="#999"
          className="flex-1 text-sm font-bold text-neo-black"
          value={localValue}
          onChangeText={handleChange}
        />
      </View>
    </View>
  );
};

export default React.memo(SearchBar);
