import "./global.css";
import { Provider } from 'react-redux';
import store from './src/redux/store';
import UserListScreen from './src/screens/UserListScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <UserListScreen />
      </SafeAreaProvider>
    </Provider>
  );
}
