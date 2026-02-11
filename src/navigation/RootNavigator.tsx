import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AskScreen } from '../screens/AskScreen';
import { DocumentsScreen } from '../screens/DocumentsScreen';
import { QuickLookupScreen } from '../screens/QuickLookupScreen';
import { MaintenanceLogScreen } from '../screens/MaintenanceLogScreen';
import { BikeProfileScreen } from '../screens/BikeProfileScreen';

const Tab = createBottomTabNavigator();

export const RootNavigator = () => (
  <NavigationContainer theme={DarkTheme}>
    <Tab.Navigator screenOptions={{ headerStyle: { backgroundColor: '#121212' }, headerTintColor: '#fff', tabBarStyle: { backgroundColor: '#111' } }}>
      <Tab.Screen name="Ask" component={AskScreen} options={{ title: 'Ask the Badass Smartass' }} />
      <Tab.Screen name="Documents" component={DocumentsScreen} />
      <Tab.Screen name="QuickLookup" component={QuickLookupScreen} options={{ title: 'Quick Lookup' }} />
      <Tab.Screen name="Log" component={MaintenanceLogScreen} options={{ title: 'Maintenance Log' }} />
      <Tab.Screen name="Bike" component={BikeProfileScreen} options={{ title: 'Bike Profile' }} />
    </Tab.Navigator>
  </NavigationContainer>
);
