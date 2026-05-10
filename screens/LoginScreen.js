import { useState } from 'react';
import { Alert, Image, ImageBackground, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { getUsers } from '../storage/usersStorage';

export default function LoginScreen({ navigation }) {
  // 1. Các biến lưu trữ trạng thái
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [googleModalVisible, setGoogleModalVisible] = useState(false);

  // 2. Hàm xử lý Đăng nhập
  const handleLogin = async () => {
    const users = await getUsers();
    const foundUser = users.find(
      item => item.username === username
    );
    if (!foundUser) {
      Alert.alert(
        'Lỗi đăng nhập',
        'Username không hợp lệ!'
      );
      return;
    }
    if (foundUser.password !== password) {
      Alert.alert(
        'Lỗi đăng nhập',
        'Password không hợp lệ!'
      );
      return;
    }

    Alert.alert(
      'Thành công',
      `Đăng nhập với quyền ${foundUser.role}`,
      [
        {
          text: 'OK',
          onPress: () =>
            navigation.replace('MainTabs', {
              role: foundUser.role,
              username: foundUser.username,
            }),
        },
      ]
    );
  };

  // Hàm xử lý Face ID / Vân tay
  const handleFaceID = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Đăng nhập bằng Face ID / Vân tay',
        fallbackLabel: 'Dùng mật khẩu',
      });

      if (result.success) {
        setUsername('adminlan');

        Alert.alert(
          'Xác thực thành công',
          'Chào mừng quay lại!',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.replace('MainTabs', {
                  role: 'admin',
                  username: 'adminlan',
                }),
            },
          ]
        );
      }
    } else {
      Alert.alert(
        'Lỗi',
        'Thiết bị không hỗ trợ Face ID/Vân tay hoặc chưa cài đặt.'
      );
    }
  };

  const handleGoogleLogin = (email) => {
    setGoogleModalVisible(false);

    let role = 'user';

    if (email === 'adminlan@gmail.com') {
      role = 'admin';
    } else if (email === 'Techna10@gmail.com') {
      role = 'tech';
    }

    Alert.alert(
      'Thành công',
      `Đăng nhập bằng tài khoản Google: ${email}`,
      [
        {
          text: 'OK',
          onPress: () =>
            navigation.replace('MainTabs', {
              role: role,
              username: email,
            }),
        },
      ]
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>Hệ thống bảo trì{"\n"}trường học</Text>
        <TouchableOpacity><Text style={{ fontSize: 24, fontWeight: 'bold' }}>≡</Text></TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Image source={require('../assets/avatar-placeholder.png')} style={styles.avatar} />
        
        <ImageBackground source={require('../assets/bg-login.png')} style={styles.loginBox} imageStyle={{ resizeMode: 'cover',borderRadius: 20, opacity: 3 }}>
          <Text style={styles.loginTitle}>LOGIN</Text>

          {/* Ô USERNAME */}
          <View style={styles.inputContainer}>
            <Image source={require('../assets/icon-user.png')} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Username" 
              value={username}
              onChangeText={setUsername}
              textContentType="username" 
            />
          </View>

          {/* Ô PASSWORD */}
          <View style={styles.inputContainer}>
            <Image source={require('../assets/icon-lock.png')} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Password" 
              secureTextEntry={!showPassword} 
              value={password}
              onChangeText={setPassword}
              textContentType="password" 
            />
            {/* Nút bấm con mắt */}
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image 
                source={require('../assets/icon-eye.png')} 
                style={[styles.inputIcon, { opacity: showPassword ? 1 : 0.4 }]} 
              />
            </TouchableOpacity>
          </View>

          {/* HÀNG REMEMBER ME & FORGOT PASSWORD */}
          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && { backgroundColor: '#B388FF', borderColor: '#B388FF' }]}>
                {rememberMe && <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>✓</Text>}
              </View>
              <Text style={{ fontSize: 12 }}>Remember me</Text>
            </TouchableOpacity>
            
            <TouchableOpacity>
              <Text style={{ fontSize: 12, textDecorationLine: 'underline' }}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          {/* NÚT ĐĂNG NHẬP */}
          <View style={{ flexDirection: 'row', width: '100%', marginBottom: 15 }}>
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.faceIdBtn} onPress={handleFaceID}>
              <Image
                source={require('../assets/icon-fingerprint.png')}
                style={{
                  width: 90,
                  height: 90,
                  tintColor: '#B388FF',
                }}
              />
            </TouchableOpacity>
          </View>

          {/* NÚT GOOGLE CHỈ MỞ MODAL */}
          <TouchableOpacity style={styles.googleBtn} onPress={() => setGoogleModalVisible(true)}>
            <Image source={require('../assets/google-icon.png')} style={{ width: 40, height: 40 }} />
            <Text style={styles.googleBtnText}>Sign in with Google</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>

      {/* ================= MODAL CHỌN TÀI KHOẢN GOOGLE ================= */}
      <Modal animationType="slide" transparent={true} visible={googleModalVisible} onRequestClose={() => setGoogleModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setGoogleModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' }}>Chọn tài khoản Google</Text>

            <TouchableOpacity style={styles.accountItem} onPress={() => handleGoogleLogin('adminlan@gmail.com')}>
              <View style={[styles.smallAvatar, { backgroundColor: '#b564b8' }]}><Text style={styles.smallAvatarText}>A</Text></View>
              <View>
                <Text style={styles.accountName}>Admin_Ngọc Lan</Text>
                <Text style={styles.accountEmail}>adminlan@gmail.com</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.accountItem} onPress={() => handleGoogleLogin('Techna10@gmail.com')}>
              <View style={[styles.smallAvatar, { backgroundColor: '#5bb8dd' }]}><Text style={styles.smallAvatarText}>T</Text></View>
              <View>
                <Text style={styles.accountName}>Tech_Ngọc Anh</Text>
                <Text style={styles.accountEmail}>Techna10@gmail.com</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.accountItem} onPress={() => handleGoogleLogin('user@gmail.com')}>
              <View style={[styles.smallAvatar, { backgroundColor: '#209690' }]}><Text style={styles.smallAvatarText}>Đ</Text></View>
              <View>
                <Text style={styles.accountName}>Đinh Thế Hiển</Text>
                <Text style={styles.accountEmail}>user@gmail.com</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.accountItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.addAccountText}>Thêm tài khoản...</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#dff6f7be'
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between'
  },

  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain'
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: -50,
    flex: 1
  },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 40,
    zIndex: 1,
    marginBottom: -50,
    borderWidth: 2,
    borderColor: '#fff'
  },

  loginBox: {
    padding: 26,
    paddingTop: 60,
    paddingBottom: 40,
    borderRadius: 20,
    alignItems: 'center',
    //backgroundColor: '#fff'
  },

  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 15,
    letterSpacing: 2
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    height: 50,
    width: '100%'
  },

  inputIcon: {
    width: 22,
    height: 22,
    marginRight: 5,
    resizeMode: 'contain',
    tintColor: '#555'
  },

  input: {
    flex: 1,
    fontSize: 16
  },

  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30
  },

  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },

  loginBtn: {
    flex: 1,
    backgroundColor: '#c1a0fa',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 35
  },

  loginBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1
  },

  faceIdBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B388FF'
  },

  googleBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },

  googleBtnText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 50
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },

  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40
  },

  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },

  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },

  smallAvatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },

  accountName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000'
  },

  accountEmail: {
    fontSize: 14,
    color: '#666'
  },

  addAccountText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 10
  }
});