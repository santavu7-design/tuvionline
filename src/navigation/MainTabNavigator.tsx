import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';

import TuViChartScreen from '../screens/TuViChartScreen';
import DailyFortuneScreen from '../screens/DailyFortuneScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="TuViChart"
        component={TuViChartScreen}
        options={{
          title: 'Lá số của tôi',
          tabBarLabel: 'Lá số',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🔮</Text>
          ),
        }}
      />
      <Tab.Screen
        name="DailyFortune"
        component={DailyFortuneScreen}
        options={{
          title: 'Vận mệnh hôm nay',
          tabBarLabel: 'Hôm nay',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>📅</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          title: 'Dịch vụ bói toán',
          tabBarLabel: 'Dịch vụ',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🔮</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Hồ sơ',
          tabBarLabel: 'Hồ sơ',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Temporary Text component for icons
const Text: React.FC<{ style: any }> = ({ style }) => (
  <span style={style}>🔮</span>
);

export default MainTabNavigator;
