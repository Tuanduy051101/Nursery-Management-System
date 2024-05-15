import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../../screens/dashboard/DashboardScreen';
import ClassroomScreen from '../../screens/classroom/ClassroomScreen';
import ProfileScreen from '../../screens/profile/ProfileScreen';
import SupportScreen from '../../screens/support/SupportScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const tabOptions = {
  tabBarLabelStyle: { fontSize: 12 },
  tabBarActiveTintColor: 'blue',
  tabBarInactiveTintColor: 'black',
  headerShown: false,
  tabBarStyle: { 
    backgroundColor: '#F8F8F8',
    height: 60, 
  },
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={tabOptions}
    >
      <Tab.Screen
        name='Dashboard'
        options={{
          tabBarLabel: 'Thống kê',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name='bar-chart' size={size} color={color} />
          ),
          ...tabOptions,
        }}
        component={DashboardScreen}
      />
      <Tab.Screen
        name='Classroom'
        options={{
          tabBarLabel: 'Lớp học',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name='graduation-cap' size={size} color={color} />
          ),
          ...tabOptions,
        }}
        component={ClassroomScreen}
      />
      <Tab.Screen
        name='Support'
        options={{
          tabBarLabel: 'Trợ giúp',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name='question-circle' size={size} color={color} />
          ),
          ...tabOptions,
        }}
        component={SupportScreen}
      />
      <Tab.Screen
        name='Profile'
        options={{
          tabBarLabel: 'Hồ sơ',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name='user' size={size} color={color} />
          ),
          ...tabOptions,
        }}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}
