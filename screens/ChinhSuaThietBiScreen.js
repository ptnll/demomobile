import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChinhSuaThietBiScreen({ route, navigation }) {
  // Lấy dữ liệu truyền sang (nếu có)
  const initialDevice = route.params?.device || {
    name: 'Máy chiếu Epson EB-2250U',
    type: 'Máy chiếu',
    room: 'Phòng 101',
    serial: 'EP2250-123456',
    status: 'Sẵn dùng',
    cycle: '6',
    buyDate: '12/02/2025'
  };

  const [device, setDevice] = useState(initialDevice);
  
  // State quản lý đóng/mở Dropdown
  const [isTypeOpen, setTypeOpen] = useState(false);
  const [isStatusOpen, setStatusOpen] = useState(false);

  // Danh sách các tùy chọn
  const typeOptions = ['Máy tính', 'Máy chiếu', 'Màn lớn', 'Thiết bị mạng', 'Khác'];
  const statusOptions = ['Sẵn dùng', 'Đang bảo trì', 'Báo lỗi'];

  // ================= CÁC HÀM XỬ LÝ CHỨC NĂNG =================

  // Hàm xử lý khi bấm Lưu
  const handleLuu = () => {
    // 1. Validate: Không được để trống Tên và Serial
    if (!device.name.trim() || !device.serial.trim()) {
      Alert.alert('Lỗi', 'Vui lòng không để trống tên thiết bị và số Serial!');
      return;
    }

    // 2. Chỗ này thực tế sẽ gọi API hoặc update Database
    // Hiện tại mình cho hiện thông báo thành công và quay về
    Alert.alert('Thành công', 'Đã cập nhật thông tin thiết bị!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  // Hàm xử lý khi bấm Hủy bỏ
  const handleHuy = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn quay lại mà không lưu thay đổi?', [
      { text: 'Tiếp tục chỉnh sửa', style: 'cancel' },
      { text: 'Quay lại', onPress: () => navigation.goBack(), style: 'destructive' },
    ]);
  };

  // ================= GIAO DIỆN =================

  const InputField = ({ label, value, onChangeText, placeholder }) => (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#1E2A47' }}>
      <StatusBar barStyle="light-content" backgroundColor="#1E2A47" />
      
      <SafeAreaView style={{ backgroundColor: '#1E2A47' }}>
        {/* HEADER */}
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="projector" size={24} color="#FBC02D" style={{ marginRight: 8 }} />
            <Text style={styles.headerTitle}>Quản Lý Thiết Bị</Text>
          </View>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.adminInfo}>
          <Image source={require('../assets/avatar-placeholder.png')} style={styles.avatar} />
          <Text style={styles.adminName}>Phạm Thị Ngọc Lan {'>'}</Text>
        </View>
      </SafeAreaView>

      <View style={{ flex: 1, backgroundColor: '#F4F5F7' }}>
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>Trang chủ {'>'} Thiết bị {'>'} ... {'>'} </Text>
          <Text style={styles.breadcrumbActive}>Cập nhật</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.pageTitle}>Cập nhật thiết bị {initialDevice.name}</Text>

          <View style={styles.formCard}>
            
            <InputField label="Tên thiết bị *" value={device.name} onChangeText={(t) => setDevice({...device, name: t})} />
            
            {/* ================= DROPDOWN LOẠI THIẾT BỊ ================= */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Loại thiết bị</Text>
              <TouchableOpacity style={styles.inputBox} onPress={() => setTypeOpen(!isTypeOpen)} activeOpacity={0.8}>
                <Text style={styles.input}>{device.type}</Text>
                <MaterialCommunityIcons name={isTypeOpen ? "chevron-up" : "chevron-down"} size={20} color="#999" />
              </TouchableOpacity>
              
              {isTypeOpen && (
                <View style={styles.dropdownMenu}>
                  {typeOptions.map((opt) => (
                    <TouchableOpacity 
                      key={opt} 
                      style={styles.dropdownItem} 
                      onPress={() => { setDevice({...device, type: opt}); setTypeOpen(false); }}
                    >
                      <Text style={[styles.dropdownText, device.type === opt && { color: '#213159', fontWeight: 'bold' }]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* HAI CỘT VỊ TRÍ & SERIAL */}
            <View style={styles.row}>
              <View style={[styles.inputWrap, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Vị trí / Phòng</Text>
                <View style={styles.inputBox}>
                  <TextInput style={styles.input} value={device.room} onChangeText={(t) => setDevice({...device, room: t})} />
                </View>
              </View>
              <View style={[styles.inputWrap, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Số Serial *</Text>
                <View style={styles.inputBox}>
                  <TextInput style={styles.input} value={device.serial} onChangeText={(t) => setDevice({...device, serial: t})} />
                </View>
              </View>
            </View>

            {/* ================= DROPDOWN TRẠNG THÁI HIỆN TẠI ================= */}
            <View style={[styles.inputWrap, { zIndex: 10 }]}>
              <Text style={styles.inputLabel}>Trạng thái hiện tại</Text>
              <TouchableOpacity 
                style={styles.statusDropdown} 
                onPress={() => setStatusOpen(!isStatusOpen)}
                activeOpacity={0.9}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.statusDot, { backgroundColor: device.status === 'Báo lỗi' ? '#FFCDD2' : '#A5D6A7' }]} />
                  <Text style={styles.statusText}>{device.status}</Text>
                </View>
                <MaterialCommunityIcons name={isStatusOpen ? "chevron-up" : "chevron-down"} size={20} color="#fff" />
              </TouchableOpacity>

              {isStatusOpen && (
                <View style={styles.dropdownMenuStatus}>
                  {statusOptions.map((opt) => (
                    <TouchableOpacity 
                      key={opt} 
                      style={styles.dropdownItem} 
                      onPress={() => { setDevice({...device, status: opt}); setStatusOpen(false); }}
                    >
                      <Text style={[styles.dropdownText, device.status === opt && { color: '#1E5631', fontWeight: 'bold' }]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* HAI CỘT CHU KỲ & NGÀY MUA */}
            <View style={styles.row}>
              <View style={[styles.inputWrap, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Chu kỳ (tháng)</Text>
                <View style={styles.inputBox}>
                  <TextInput style={styles.input} value={device.cycle} onChangeText={(t) => setDevice({...device, cycle: t})} keyboardType="numeric" />
                </View>
              </View>
              <View style={[styles.inputWrap, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Ngày mua</Text>
                <View style={styles.inputBox}>
                  <TextInput style={styles.input} value={device.buyDate} onChangeText={(t) => setDevice({...device, buyDate: t})} />
                  <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#999" />
                </View>
              </View>
            </View>

            {/* NÚT BẤM CÓ GẮN HÀM XỬ LÝ */}
            <TouchableOpacity style={styles.btnSave} onPress={handleLuu}>
              <Text style={styles.btnSaveText}>Lưu thay đổi</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCancel} onPress={handleHuy}>
              <Text style={styles.btnCancelText}>Hủy bỏ</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// ================= CSS STYLES =================
const styles = StyleSheet.create({
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#1E2A47' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  adminInfo: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 15, paddingBottom: 15 },
  avatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  adminName: { color: '#B0BEC5', fontSize: 13 },
  breadcrumb: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 5 },
  breadcrumbText: { color: '#888', fontSize: 13 },
  breadcrumbActive: { color: '#111', fontSize: 13, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#1E2A47', marginBottom: 20, lineHeight: 28 },
  formCard: { backgroundColor: '#FDFDFD', borderRadius: 15, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, borderWidth: 1, borderColor: '#EAEAEA' },
  
  inputWrap: { marginBottom: 15 },
  inputLabel: { fontSize: 13, color: '#444', marginBottom: 6, fontWeight: '500' },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: 12, height: 45, backgroundColor: '#FFF' },
  input: { flex: 1, fontSize: 14, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },

  // Dropdown list
  dropdownMenu: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginTop: 4, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: {width: 0, height: 2} },
  dropdownMenuStatus: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginTop: 4, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: {width: 0, height: 2}, position: 'absolute', top: 70, left: 0, right: 0, zIndex: 99 },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownText: { fontSize: 14, color: '#333' },

  statusDropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1E5631', borderRadius: 8, paddingHorizontal: 15, height: 45, shadowColor: '#000', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  statusText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  btnSave: { backgroundColor: '#213159', paddingVertical: 14, borderRadius: 25, alignItems: 'center', marginBottom: 15, marginTop: 10 },
  btnSaveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnCancel: { backgroundColor: '#FFF', paddingVertical: 14, borderRadius: 25, alignItems: 'center', borderWidth: 1, borderColor: '#213159' },
  btnCancelText: { color: '#213159', fontSize: 16, fontWeight: 'bold' },
});