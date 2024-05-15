import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './components/navigation/TabNavigator';
import AuthLoadingScreen from './components/navigation/AuthLoadingScreen';
import LoginScreen from './screens/login/LoginScreen';
import { AuthProvider } from './screens/login/AuthContext';
import DetailProfileScreen from './screens/profile/DetailProfileScreen';
import ClassroomDetailScreen from './screens/classroom/ClassDetail';
import TeacherInfoScreen from './screens/classroom/Teacher';
import AttendanceScreen from './screens/classroom/Attendance';
import DevelopmentScreen from './screens/classroom/CDI';
import TuitionScreen from './screens/classroom/Tuition';
import MealTicketcreen from './screens/classroom/MealTicket';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='AuthLoading' component={AuthLoadingScreen} options={{ headerShown: false }} />
          <Stack.Screen name='TabNavigator' component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name='DetailProfile' component={DetailProfileScreen} options={{ headerTitle: 'Thông tin phụ huynh' }} />
          <Stack.Screen name='ClassroomDetail' component={ClassroomDetailScreen} options={{ headerTitle: 'Thông tin lớp học' }} />
          <Stack.Screen name='TeacherInfo' component={TeacherInfoScreen} options={{ headerTitle: 'Thông tin giáo viên' }} />
          <Stack.Screen name='Attendance' component={AttendanceScreen} options={{ headerTitle: 'Thông tin điểm danh' }} />
          <Stack.Screen name='Development' component={DevelopmentScreen} options={{ headerTitle: 'Thông tin chỉ số phát triển' }} />
          <Stack.Screen name='Tuition' component={TuitionScreen} options={{ headerTitle: 'Thông tin học phí' }} />
          <Stack.Screen name='MealTicket' component={MealTicketcreen} options={{ headerTitle: 'Thông tin phiếu ăn' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
