import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, Text, View } from 'react-native';

// Import các màn hình từ thư mục screens
import BaoTriTongScreen from './screens/BaoTriTongScreen';
import ChinhSuaTaiKhoanScreen from './screens/ChinhSuaTaiKhoanScreen';
import ChinhSuaThietBiScreen from './screens/ChinhSuaThietBiScreen';
import ChiTietThietBiScreen from './screens/ChiTietThietBiScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import TaiKhoanScreen from './screens/TaiKhoanScreen';
import TaoTaiKhoanScreen from './screens/TaoTaiKhoanScreen';
import ThemThietBiScreen from './screens/ThemThietBiScreen';
import ThietBiScreen from './screens/ThietBiScreen';
import XuLyBaoTriScreen from './screens/XuLyBaoTriScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Dummy components cho các tab chưa làm
const DummyScreen = () => <View style={{flex: 1, backgroundColor: '#fff'}}><Text style={{padding: 50}}>Đang phát triển...</Text></View>;

// Thiết lập thanh Bottom Tab
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2E7D32', // Màu xanh khi được chọn
        tabBarInactiveTintColor: '#7C7C7C',
        tabBarIcon: ({ focused, color, size }) => {
          let iconPath;
          // Bạn thay các file ảnh icon tương ứng vào thư mục assets nhé
          if (route.name === 'Trang chủ') {
            iconPath = require('./assets/tab-home.png'); 
          } else if (route.name === 'Thiết bị') {
            iconPath = require('./assets/icon-pc1.png');
          } else if (route.name === 'Bảo trì') {
            iconPath = require('./assets/tab-maintenance.png');
          } else if (route.name === 'Tài khoản') {
            iconPath = require('./assets/tab-account.png');
          }
          return <Image source={iconPath} style={{ width: 24, height: 24, tintColor: color }} />;
        },
      })}
    >
      {/* THỨ TỰ CÁC TAB NHƯ BẠN YÊU CẦU */}
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Thiết bị" component={ThietBiScreen} />
      <Tab.Screen name="Bảo trì" component={BaoTriTongScreen} />
      <Tab.Screen name="Tài khoản" component={TaiKhoanScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ChiTietThietBi" component={ChiTietThietBiScreen} />
        <Stack.Screen name="ChinhSuaThietBi" component={ChinhSuaThietBiScreen}/>
        <Stack.Screen name="XuLyBaoTri" component={XuLyBaoTriScreen}/>
        <Stack.Screen name="ThemThietBi" component={ThemThietBiScreen}/>
        <Stack.Screen name="ChinhSuaTaiKhoan" component={ChinhSuaTaiKhoanScreen}/>
        <Stack.Screen name="TaoTaiKhoan" component={TaoTaiKhoanScreen}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}