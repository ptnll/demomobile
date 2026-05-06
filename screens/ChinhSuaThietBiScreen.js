import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker'; // <-- Import thư viện lịch
import { useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChinhSuaThietBiScreen({ route, navigation }) {
  // Đảm bảo thiết bị luôn có id để sau này Danh sách biết đường mà cập nhật
  const initialDevice = route.params?.device || {
    id: '1',
    name: 'Máy chiếu Epson EB-2250U',
    type: 'Máy chiếu',
    room: 'Phòng 101',
    serial: 'EP2250-123456',
    status: 'Đang sử dụng',
    cycle: '6',
    buyDate: '12/02/2025'
  };

  const [device, setDevice] = useState(initialDevice);
  
  // State quản lý Dropdown và Lịch
  const [isTypeOpen, setTypeOpen] = useState(false);
  const [isStatusOpen, setStatusOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // <-- State bật/tắt Lịch

  const typeOptions = ['Máy tính', 'Máy chiếu', 'TV', 'Thiết bị mạng', 'Micro', 'Điều hòa', 'Khác'];
  const statusOptions = ['Đang sử dụng', 'Đang sửa chữa', 'Báo lỗi'];
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Đang sử dụng': return { bg: '#baf5c7', text: '#04a153' };
      case 'Đang sửa chữa': return { bg: '#fcf3a9', text: '#ffad14' };
      case 'Báo lỗi': return { bg: '#f7c8c8', text: '#B91C1C' };
      default: return { bg: '#FDE68A', text: '#D97706', icon: 'check-circle' };
    }
  };
  const currentStatusStyle = getStatusStyle(device.status);
  // Hàm bắt sự kiện khi chọn ngày trên lịch
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // iOS giữ lịch, Android tự đóng
    if (selectedDate) {
      // Format ngày thành DD/MM/YYYY
      const formattedDate = selectedDate.toLocaleDateString('vi-VN');
      setDevice({...device, buyDate: formattedDate});
    }
  };

  const handleLuu = () => {
    if (!device.name.trim() || !device.serial.trim()) {
      Alert.alert('Lỗi', 'Vui lòng không để trống tên thiết bị và số Serial!');
      return;
    }

    Alert.alert('Thành công', 'Đã cập nhật thông tin thiết bị!', [
      { 
        text: 'OK', 
        // Gửi thẳng gói dữ liệu 'device' vừa sửa về lại trang Chi Tiết
        onPress: () => navigation.navigate('ChiTietThietBi', { device: device }) 
      },
    ]);
  };

  const handleHuy = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn quay lại mà không lưu thay đổi?', [
      { text: 'Tiếp tục', style: 'cancel' },
      { text: 'Quay lại', onPress: () => navigation.goBack(), style: 'destructive' },
    ]);
  };

  const InputField = ({ label, value, onChangeText }) => (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputBox}>
        <TextInput style={styles.input} value={value} onChangeText={onChangeText} />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#E3EDF7' }}>
      <StatusBar barStyle="light-content" backgroundColor="#E3EDF7" />
      <SafeAreaView style={{ backgroundColor: '#E3EDF7' }}>
        <View style={styles.topHeader}>
          <View style={{ width: 28 }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="projector" size={40} color="#80CBC4" style={{ marginLeft: 20, marginBottom: 50 }} />
            <Text style={styles.pageTitle}>Cập nhật thiết bị {"\n"} {initialDevice.name}</Text>
          </View>
      </SafeAreaView>

      <View style={{ flex: 1, backgroundColor: '#F4F5F7' }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.formCard}>
            <InputField label="Tên thiết bị *" value={device.name} onChangeText={(t) => setDevice({...device, name: t})} />
            
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Loại thiết bị</Text>
              <TouchableOpacity style={styles.inputBox} onPress={() => setTypeOpen(!isTypeOpen)}>
                <Text style={styles.input}>{device.type}</Text>
                <MaterialCommunityIcons name={isTypeOpen ? "chevron-up" : "chevron-down"} size={20} color="#999" />
              </TouchableOpacity>
              {isTypeOpen && (
                <View style={styles.dropdownMenu}>
                  {typeOptions.map((opt) => (
                    <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setDevice({...device, type: opt}); setTypeOpen(false); }}>
                      <Text style={[styles.dropdownText, device.type === opt && { color: '#213159', fontWeight: 'bold' }]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.row}>
              <View style={[styles.inputWrap, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Vị trí / Phòng</Text>
                <View style={styles.inputBox}><TextInput style={styles.input} value={device.room} onChangeText={(t) => setDevice({...device, room: t})} /></View>
              </View>
              <View style={[styles.inputWrap, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Số Serial *</Text>
                <View style={styles.inputBox}><TextInput style={styles.input} value={device.serial} onChangeText={(t) => setDevice({...device, serial: t})} /></View>
              </View>
            </View>

            {/* ================= DROPDOWN TRẠNG THÁI HIỆN TẠI ================= */}
            <View style={[styles.inputWrap, { zIndex: 10 }]}>
              <Text style={styles.inputLabel}>Trạng thái hiện tại</Text>
              <TouchableOpacity 
                style={[styles.statusDropdown, { backgroundColor: currentStatusStyle.bg }]} 
                onPress={() => setStatusOpen(!isStatusOpen)}
                activeOpacity={0.9}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.statusDot, { backgroundColor: currentStatusStyle.text }]} />
                  <Text style={[styles.statusText, { color: currentStatusStyle.text }]}>{device.status}</Text>
                </View>
                <MaterialCommunityIcons name={isStatusOpen ? "chevron-up" : "chevron-down"} size={20} color={currentStatusStyle.text} />
              </TouchableOpacity>

              {isStatusOpen && (
                <View style={styles.dropdownMenuStatus}>
                  {statusOptions.map((opt) => (
                    <TouchableOpacity 
                      key={opt} 
                      style={styles.dropdownItem} 
                      onPress={() => { setDevice({...device, status: opt}); setStatusOpen(false); }}
                    >
                      <Text style={[
                        styles.dropdownText, 
                        device.status === opt && { color: currentStatusStyle.text, fontWeight: 'bold' }
                      ]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.row}>
              <View style={[styles.inputWrap, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Chu kỳ (tháng)</Text>
                <View style={styles.inputBox}><TextInput style={styles.input} value={device.cycle} onChangeText={(t) => setDevice({...device, cycle: t})} keyboardType="numeric" /></View>
              </View>
              
              {/* === KHU VỰC NGÀY MUA SẼ BẬT LỊCH KHI BẤM === */}
              <View style={[styles.inputWrap, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Ngày mua</Text>
                <TouchableOpacity style={styles.inputBox} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.input}>{device.buyDate}</Text>
                  <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>

            {/* BỘ HIỂN THỊ LỊCH */}
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

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

const styles = StyleSheet.create({
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#E3EDF7' },
  headerTitle: { color: '#242222', fontSize: 18, fontWeight: 'bold' },
  pageTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E2A47', marginBottom: 25, lineHeight: 28, textAlign: 'center' },
  formCard: { backgroundColor: '#FDFDFD', borderRadius: 15, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, borderWidth: 1, borderColor: '#EAEAEA', marginTop: 20 },
  inputWrap: { marginBottom: 15 },
  inputLabel: { fontSize: 13, color: '#444', marginBottom: 6, fontWeight: '500' },
  inputBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: 12, height: 45, backgroundColor: '#FFF' },
  input: { flex: 1, fontSize: 14, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  dropdownMenu: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginTop: 4, elevation: 5 },
  dropdownMenuStatus: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginTop: 4, elevation: 5, position: 'absolute', top: 70, left: 0, right: 0, zIndex: 99 },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownText: { fontSize: 14, color: '#333' },
  statusDropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1E5631', borderRadius: 8, paddingHorizontal: 15, height: 45 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  statusText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  btnSave: { backgroundColor: '#80CBC4', paddingVertical: 14, borderRadius: 25, alignItems: 'center', marginBottom: 15, marginTop: 10 },
  btnSaveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnCancel: { backgroundColor: '#FFF', paddingVertical: 14, borderRadius: 25, alignItems: 'center', borderWidth: 1, borderColor: '#213159' },
  btnCancelText: { color: '#213159', fontSize: 16, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
});