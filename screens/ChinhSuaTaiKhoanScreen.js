import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChinhSuaTaiKhoanScreen({ route, navigation }) {
  // Lấy dữ liệu tài khoản truyền sang (nếu có), không có thì dùng mặc định
  const accountData = route.params?.account || {
    fullName: 'Quản trị viên',
    role: 'Admin',
  };

  const [fullName, setFullName] = useState(accountData.fullName);
  const [role, setRole] = useState(accountData.role);
  const [password, setPassword] = useState('');
  
  // Trạng thái cho Dropdown và Mật khẩu
  const [isRoleOpen, setRoleOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roleOptions = ['Admin', 'Technician', 'User'];

  const handleSave = () => {
    if (!fullName.trim()) {
      Alert.alert('Lỗi', 'Họ tên không được để trống!');
      return;
    }

    // 1. Tạo object chứa thông tin đã cập nhật
    const updatedAccount = {
      ...accountData, // Giữ lại ID, username, ảnh...
      fullName: fullName,
      role: role,
      // Cập nhật lại màu sắc/icon theo vai trò mới (nếu bạn có đổi vai trò)
      roleIcon: role === 'Admin' ? 'flag' : (role === 'Technician' ? 'hammer-wrench' : 'account'),
      roleBg: role === 'Admin' ? '#2B407D' : (role === 'Technician' ? '#D97706' : '#10B981'),
    };
    
    Alert.alert('Thành công', 'Đã lưu thay đổi tài khoản!', [
      { 
        text: 'OK', 
        // 2. Lệnh điều hướng gửi dữ liệu về Tab "Tài khoản"
        onPress: () => navigation.navigate('MainTabs', { 
          screen: 'Tài khoản', 
          params: { updatedAccount: updatedAccount } 
        }) 
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E2A47" />
      
      {/* HEADER TỐI MÀU GIAO DIỆN CHUNG */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="menu" size={28} color="#1d1d1d" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerRight}>
          <Image source={require('../assets/avatar-placeholder.png')} style={styles.avatarHeader} />
        </View>
      </View>

      {/* NỘI DUNG CHÍNH */}
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* CARD CHỈNH SỬA TÀI KHOẢN */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Chỉnh Sửa Tài Khoản</Text>
          </View>

          <View style={styles.cardBody}>
            {/* Field: Họ tên */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Họ tên</Text>
              <View style={styles.inputBox}>
                <MaterialCommunityIcons name="account-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Nhập họ tên"
                />
              </View>
            </View>

            {/* Field: Vai trò (Dropdown) */}
            <View style={[styles.inputGroup, { zIndex: 10 }]}>
              <Text style={styles.label}>Vai trò</Text>
              <TouchableOpacity style={styles.inputBox} onPress={() => setRoleOpen(!isRoleOpen)} activeOpacity={0.8}>
                <MaterialCommunityIcons name="account-check-outline" size={20} color="#666" style={styles.inputIcon} />
                <Text style={[styles.input, { flex: 1, marginTop: 1 }]}>{role}</Text>
                <MaterialCommunityIcons name={isRoleOpen ? "chevron-up" : "chevron-down"} size={20} color="#666" />
              </TouchableOpacity>

              {isRoleOpen && (
                <View style={styles.dropdownMenu}>
                  {roleOptions.map((opt) => (
                    <TouchableOpacity 
                      key={opt} 
                      style={styles.dropdownItem} 
                      onPress={() => { setRole(opt); setRoleOpen(false); }}
                    >
                      <Text style={[styles.dropdownText, role === opt && { fontWeight: 'bold', color: '#1F774A' }]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Field: Mật khẩu mới */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu mới (Để trống nếu không đổi)</Text>
              <View style={styles.inputBox}>
                <MaterialCommunityIcons name="lock-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Nhập mật khẩu mới..."
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialCommunityIcons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Nút Lưu */}
            <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
              <Text style={styles.btnSaveText}>Lưu Thay Đổi</Text>
            </TouchableOpacity>

          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef9ff' }, 
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#cfe0f3', paddingHorizontal: 15, paddingVertical: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#E2E8F0', fontSize: 16, fontWeight: '600' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  avatarHeader: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  userInfo: { justifyContent: 'center' },
  userNameHeader: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  userRoleHeader: { color: '#A0AEC0', fontSize: 11 },

  scrollContent: { paddingBottom: 40 },

  // Card
  card: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: 40, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, overflow: 'hidden', marginTop: 60 },
  cardHeader: { backgroundColor: '#2B6CB0', paddingVertical: 20, alignItems: 'center' },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  cardBody: { padding: 20 },

  // Inputs
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#333', marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, height: 48, backgroundColor: '#fff' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#111' },

  // Dropdown
  dropdownMenu: { position: 'absolute', top: 80, left: 0, right: 0, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5, zIndex: 99 },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropdownText: { fontSize: 15, color: '#333' },

  // Button
  btnSave: { backgroundColor: '#2B6CB0', paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  btnSaveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Footer
  footer: { alignItems: 'center', marginTop: 40 },
  logoCEM: { fontSize: 20, fontWeight: '900', marginBottom: 5, letterSpacing: 1 },
  footerText: { fontSize: 13, color: '#6B7280' }
});