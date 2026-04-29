import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ConversationsScreen from '../../features/chat/screens/ConversationsScreen';
import ChatScreen from '../../features/chat/screens/ChatScreen';
import { COLORS } from '../theme/colors';

const Stack = createStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.primaryDark,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerBackTitle: 'Atrás',
      }}
    >
      <Stack.Screen 
        name="ConversationsList" 
        component={ConversationsScreen}
        options={{ 
          title: 'Mensajes',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={({ route }: any) => ({ 
          title: route.params?.name || 'Chat',
          headerTitleAlign: 'center',
        })}
      />
    </Stack.Navigator>
  );
}