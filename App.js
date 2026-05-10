import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Image, Text, View } from 'react-native';

import { MaintenanceProvider } from './contexts/MaintenanceContext';

// Import các màn hình từ thư mục screens
import BaoTriTechScreen from './screens/BaoTriTechScreen';
import BaoTriTongScreen from './screens/BaoTriTongScreen';
import ChinhSuaTaiKhoanScreen from './screens/ChinhSuaTaiKhoanScreen';
import ChinhSuaThietBiScreen from './screens/ChinhSuaThietBiScreen';
import ChiTietThietBiScreen from './screens/ChiTietThietBiScreen';
import HomeScreen from './screens/HomeScreen';
import IntroScreen from './screens/IntroScreen';
import LoginScreen from './screens/LoginScreen';
import TaiKhoanScreen from './screens/TaiKhoanScreen';
import TaoPhieuBaoHongScreen from './screens/TaoPhieuBaoHongScreen';
import TaoTaiKhoanScreen from './screens/TaoTaiKhoanScreen';
import ThemThietBiScreen from './screens/ThemThietBiScreen';
import ThietBiScreen from './screens/ThietBiScreen';
import XuLyBaoTriScreen from './screens/XuLyBaoTriScreen';
import PhieuCuaToiScreen from './screens/PhieuCuaToiScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Thiết lập thanh Bottom Tab
function MainTabs({ route }) {
  const role = route.params?.role ?? null;
  const username = route.params?.username || '';
  
  // FIX: Tránh lỗi trắng màn hình / crash khi chưa có params role
  if (!role) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#7C7C7C',
        tabBarIcon: ({ color }) => {
          // FIX: Thêm icon mặc định để tránh crash nếu route.name không khớp
          let iconPath = require('./assets/tab-home.png');

          if (route.name === 'Trang chủ') {
            iconPath = require('./assets/tab-home.png');
          } else if (route.name === 'Thiết bị') {
            iconPath = require('./assets/icon-pc1.png');
          } else if (
            route.name === 'Bảo trì' ||
            route.name === 'Báo hỏng' ||
            route.name === 'Phiếu sửa'
          ) {
            iconPath = require('./assets/tab-maintenance.png');
          } else if (route.name === 'Tài khoản') {
            iconPath = require('./assets/tab-account.png');
          }

          return (
            <Image
              source={iconPath}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
            />
          );
        },
      })}
    >
      {/* ================= ADMIN ================= */}
      {role === 'admin' && (
        <>
          <Tab.Screen name="Trang chủ" component={HomeScreen} />
          <Tab.Screen name="Thiết bị" component={ThietBiScreen} />
          <Tab.Screen name="Bảo trì" component={BaoTriTongScreen} />
          <Tab.Screen name="Tài khoản" component={TaiKhoanScreen} />
        </>
      )}

      {/* ================= USER ================= */}
      {role === 'user' && (
        <>
          <Tab.Screen
            name="Báo hỏng"
            component={TaoPhieuBaoHongScreen}
            initialParams={{ username }}
          />
          <Tab.Screen
            name="Phiếu của tôi"
            component={PhieuCuaToiScreen}
            initialParams={{ username }}
          />
        </>
      )}

      {/* ================= TECH ================= */}
      {role === 'tech' && (
        <>
          <Tab.Screen
            name="Phiếu sửa"
            component={BaoTriTechScreen}
            initialParams={{ username }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <MaintenanceProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="ChiTietThietBi" component={ChiTietThietBiScreen} />
          <Stack.Screen name="ChinhSuaThietBi" component={ChinhSuaThietBiScreen} />
          <Stack.Screen name="XuLyBaoTri" component={XuLyBaoTriScreen} />
          <Stack.Screen name="ThemThietBi" component={ThemThietBiScreen} />
          <Stack.Screen name="ChinhSuaTaiKhoan" component={ChinhSuaTaiKhoanScreen} />
          <Stack.Screen name="TaoTaiKhoan" component={TaoTaiKhoanScreen} />
          <Stack.Screen name="PhieuCuaToi" component={PhieuCuaToiScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MaintenanceProvider>
  );
}