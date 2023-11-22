import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './SignIn';
import Main from './Main';
import Credit from './Credit';
import SignOut from './SignOut';
import MyComponent from './AddDataDialog';

export default function App() {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="sign-in">
        <Stack.Screen name="sign-in" component={SignIn} />
        <Stack.Screen name="main" component={Main} />
        <Stack.Screen name="credit" component={Credit} />
        <Stack.Screen name="sign-out" component={SignOut} />
        <Stack.Screen name="add-data-dialog" component={MyComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}