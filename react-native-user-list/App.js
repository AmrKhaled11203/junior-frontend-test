import "./global.css";
import { Provider } from 'react-redux';
import store from './src/redux/store';
import UserListScreen from './src/screens/UserListScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <UserListScreen />
        </ErrorBoundary>
      </SafeAreaProvider>
    </Provider>
  );
}
