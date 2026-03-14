import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text } from 'react-native';
import LibraryScreen from '../screens/LibraryScreen';
import PlayerScreen from '../screens/PlayerScreen';
import { useAppSelector } from '../store';

export type RootTabParamList = {
  Library: undefined;
  Player: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <View style={styles.iconContainer}>
    <Text style={[styles.iconText, focused && styles.iconFocused]}>
      {label === 'Library' ? '🎵' : '▶️'}
    </Text>
  </View>
);

export default function AppNavigator() {
  const currentTrack = useAppSelector((state) => state.player.currentTrack);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#1DB954',
          tabBarInactiveTintColor: '#888',
        }}>
        <Tab.Screen
          name="Library"
          component={LibraryScreen}
          options={{
            tabBarLabel: 'Library',
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Library" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Player"
          component={PlayerScreen}
          // Disable the Player tab if no track is loaded yet
          options={{
            tabBarLabel: 'Player',
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Player" focused={focused} />
            ),
            tabBarButton: currentTrack ? undefined : () => null,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#121212',
    borderTopColor: '#282828',
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
});