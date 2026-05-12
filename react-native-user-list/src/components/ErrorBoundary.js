import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * Error Boundary — catches render-time crashes and shows a recovery UI
 * instead of a white screen. Class component required (no hook equivalent).
 */
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (__DEV__) {
      console.error('[ErrorBoundary]', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center p-8 bg-neo-surface">
          <Text className="text-3xl font-[900] text-neo-black mb-2">OOPS!</Text>
          <Text className="text-base font-bold text-gray-500 mb-6 text-center">
            Something went wrong. Please try again.
          </Text>
          {__DEV__ && this.state.error && (
            <Text className="text-xs text-red-500 font-mono mb-6 text-center">
              {this.state.error.toString()}
            </Text>
          )}
          <TouchableOpacity
            className="bg-neo-primary px-6 py-3 border-neo-thick border-neo-black shadow-neo-md"
            onPress={this.handleReset}
            activeOpacity={0.8}
          >
            <Text className="text-white font-[900] tracking-widest">RETRY</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
