import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getUsers, saveUsers } from '../storage/usersStorage';

export default function TaoTaiKhoanScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Admin');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isRoleOpen, setRoleOpen] = useState(false);

  const roleOptions = ['Admin', 'Technician', 'User'];

  const handleCreate = async () => {

    if (!username.trim() || !password.trim() || !fullName.trim()) {
      Alert.alert(
        'Lỗi',
        'Vui lòng nhập đầy đủ thông tin!'
      );
      return;
    }

    try {

      // LẤY USER CŨ
      const oldUsers = await getUsers();

      // CHECK TRÙNG USERNAME
      const isExist = oldUsers.some(
        item =>
          item.username.toLowerCase().trim() ===
          username.toLowerCase().trim()
      );

      if (isExist) {
        Alert.alert(
          'Lỗi',
          'Tên đăng nhập đã tồn tại!'
        );
        return;
      }

      // USER CHO LOGIN
      const loginUser = {
        username: username,
        password: password,

        fullName: fullName,

        role:
          role === 'Admin'
            ? 'admin'
            : role === 'Technician'
            ? 'tech'
            : 'user',
      };

      // SAVE USER LOGIN
      const updatedUsers = [...oldUsers, loginUser];

      await saveUsers(updatedUsers);

      // USER HIỂN THỊ UI
      const newAccount = {
        id: Date.now().toString(),
        username: username,
        fullName: fullName,
        role: role,
        roleIcon:
          role === 'Admin'
            ? 'flag'
            : role === 'Technician'
            ? 'hammer-wrench'
            : 'account',

        roleBg:
          role === 'Admin'
            ? '#2B407D'
            : role === 'Technician'
            ? '#D97706'
            : '#10B981',

        dept: 'Mới tạo',
        status: 'Hoạt động',
        isOnline: false,
      };

      Alert.alert(
        'Thành công',
        'Đã tạo tài khoản mới!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Lỗi',
        'Không thể tạo tài khoản!'
      );

    }

  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6F8" />
      
      {/* HEADER SÁNG MÀU */}
      <View style={styles.header}>
        <TouchableOpacity style={{ padding: 5 }} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <MaterialCommunityIcons name="monitor-dashboard" size={22} color="#333" style={{ marginRight: 6 }} />
          <Text style={styles.headerTitle}>Tạo tài khoản mới</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* CARD FORM TẠO TÀI KHOẢN */}
        <View style={styles.card}>
          <Text style={styles.cardSubtitle}>
            *Nhập thông tin chi tiết dưới đây để tạo một tài khoản người dùng mới.
          </Text>

          {/* Tên đăng nhập */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên đăng nhập</Text>
            <View style={styles.inputContainer}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#666" />
              </View>
              <TextInput style={styles.input} value={username} onChangeText={setUsername} />
            </View>
          </View>

          {/* Mật khẩu */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.inputContainer}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons name="lock-outline" size={20} color="#666" />
              </View>
              <TextInput 
                style={styles.input} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={!showPassword} 
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Họ tên */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ tên</Text>
            <View style={styles.inputContainer}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons name="account" size={20} color="#666" />
              </View>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
            </View>
          </View>

          {/* Vai trò */}
          <View style={[styles.inputGroup, { zIndex: 10 }]}>
            <Text style={styles.label}>Vai trò</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setRoleOpen(!isRoleOpen)} activeOpacity={0.8}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons name="badge-account-outline" size={20} color="#666" />
              </View>
              <Text style={[styles.input, { marginTop: 1 }]}>{role}</Text>
              <MaterialCommunityIcons name={isRoleOpen ? "chevron-up" : "chevron-down"} size={20} color="#666" style={{ paddingRight: 10 }} />
            </TouchableOpacity>

            {isRoleOpen && (
              <View style={styles.dropdownMenu}>
                {roleOptions.map((opt) => (
                  <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setRole(opt); setRoleOpen(false); }}>
                    <Text style={[styles.dropdownText, role === opt && { fontWeight: 'bold', color: '#1F774A' }]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Nút Tạo & Hủy */}
          <TouchableOpacity style={styles.btnCreate} onPress={handleCreate}>
            <Text style={styles.btnCreateText}>Tạo tài khoản </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()}>
            <Text style={styles.btnCancelText}>Hủy</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef9ff' },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#eef9ff', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', marginTop: 20 },
  headerCenter: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginRight: 60 },
  headerRight: { alignItems: 'center' },
  avatarHeader: { width: 30, height: 30, borderRadius: 15, marginBottom: 2 },
  userNameHeader: { fontSize: 10, color: '#555', fontWeight: '500' },

  scrollContent: { paddingHorizontal: 15, paddingTop: 20, paddingBottom: 40 },

  // Card
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3,marginTop: 30 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#111', marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  cardSubtitle: { fontSize: 13, color: '#666', fontStyle: 'italic', marginBottom: 20, lineHeight: 18 },

  // Input Box (Thiết kế khối icon xám bên trái)
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 14, color: '#333', marginBottom: 6 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff', height: 45, marginBottom: 5 },
  iconWrapper: { width: 45, height: '100%', backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#D1D5DB' },
  input: { flex: 1, fontSize: 15, color: '#111', paddingHorizontal: 12 },
  eyeIcon: { paddingHorizontal: 10, height: '100%', justifyContent: 'center' },

  // Dropdown
  dropdownMenu: { position: 'absolute', top: 75, left: 0, right: 0, backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, elevation: 5, zIndex: 99 },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropdownText: { fontSize: 15, color: '#333' },

  // Buttons
  btnCreate: { backgroundColor: '#3B82F6', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnCreateText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnCancel: { alignItems: 'center', marginTop: 15 },
  btnCancelText: { color: '#666', fontSize: 14, textDecorationLine: 'underline' }
});