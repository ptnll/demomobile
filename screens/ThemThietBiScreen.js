import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getDevices, saveDevices } from '../storage/deviceStorage';
// Component tái sử dụng cho các ô nhập liệu
  const InputField = ({ label, icon, placeholder, value, onChangeText, keyboardType = 'default' }) => (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputBox}>
        <MaterialCommunityIcons name={icon} size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
export default function ThemThietBiScreen({ navigation }) {
  // State lưu trữ dữ liệu thiết bị mới
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: '', // Mặc định
    serial: '',
    buyDate: '',
    cycle: '',
    room: ''
  });

  // State mở/đóng dropdown loại thiết bị
  const [isTypeOpen, setTypeOpen] = useState(false);
  const typeOptions = ['Máy chiếu', 'Màn lớn', 'Máy tính', 'Điện lạnh', 'Thiết bị VP', 'Âm thanh', 'Mạng'];

  const handleLuu = async () => {
    if (!newDevice.name.trim() || !newDevice.serial.trim() || !newDevice.room.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ Tên thiết bị, Số Serial và Phòng!');
      return;
    }

    const deviceToAdd = {
      id: Date.now().toString(),
      name: newDevice.name,
      room: newDevice.room,
      type: newDevice.type || 'Khác',
      serial: newDevice.serial,
      buyDate: newDevice.buyDate,
      cycle: newDevice.cycle,
      status: 'Đang sử dụng',
      statusColor: '#E8F5E9',
      statusTextColor: '#2E7D32'
    };

    try {
      const oldDevices = await getDevices();
      const currentDevices = oldDevices || [];

      // Check serial trùng
      const isExist = currentDevices.some(
        d => d.serial.toLowerCase() === newDevice.serial.toLowerCase()
      );

      if (isExist) {
        Alert.alert('Lỗi', 'Serial thiết bị đã tồn tại!');
        return;
      }

      const updatedDevices = [deviceToAdd, ...currentDevices];

      await saveDevices(updatedDevices);

      Alert.alert('Thành công', 'Đã thêm thiết bị mới!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu thiết bị!');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E2A47" />
      
      {/* HEADER TỐI MÀU */}
      <SafeAreaView style={{ backgroundColor: '#80CBC4' }}>
        <View style={styles.header}>
          <View style={styles.pageTitleRow}>
            <MaterialCommunityIcons name="monitor-multiple" size={28} color="#111" style={{ marginLeft: 20 }} />
            <Text style={styles.pageTitle}>Thêm Thiết Bị Mới</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity><MaterialCommunityIcons name="menu" size={28} color="#000000" style={{ marginBottom: 20 }} /></TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View style={styles.formCard}>
            
            {/* Hàng 1: Tên & Loại */}
            <View style={styles.row}>
              <View style={[styles.inputGroupHalf, { marginRight: 10 }]}>
                <InputField label="Tên thiết bị" icon="projector" placeholder="VD: Máy ch" value={newDevice.name} onChangeText={(t) => setNewDevice({...newDevice, name: t})} />
              </View>
              
              <View style={[styles.inputGroupHalf, { zIndex: 10 }]}>
                <Text style={styles.inputLabel}>Loại thiết bị</Text>
                <TouchableOpacity style={styles.inputBox} onPress={() => setTypeOpen(!isTypeOpen)} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="projector" size={20} color="#888" style={{ marginRight: 8 }} />
                  <Text style={styles.input}>{newDevice.type}</Text>
                </TouchableOpacity>
                
                {isTypeOpen && (
                  <View style={styles.dropdownMenu}>
                    {typeOptions.map((opt) => (
                      <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setNewDevice({...newDevice, type: opt}); setTypeOpen(false); }}>
                        <Text style={styles.dropdownText}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Hàng 2: Serial & Ngày mua */}
            <View style={styles.row}>
               <View style={[styles.inputGroupHalf, { marginRight: 10 }]}>
                 <InputField label="Số sê-ri" icon="barcode" placeholder="VD: SN-123" value={newDevice.serial} onChangeText={(t) => setNewDevice({...newDevice, serial: t})} />
               </View>
               <View style={styles.inputGroupHalf}>
                 <InputField label="Ngày mua" icon="calendar" placeholder="VD: 15/05/20" value={newDevice.buyDate} onChangeText={(t) => setNewDevice({...newDevice, buyDate: t})} />
               </View>
            </View>

            {/* Hàng 3: Chu kỳ */}
            <View style={{ marginTop: 10 }}>
              <InputField label="Chu kỳ bảo trì (Tháng)" icon="wrench" placeholder="12" value={newDevice.cycle} onChangeText={(t) => setNewDevice({...newDevice, cycle: t})} keyboardType="numeric" />
            </View>

            {/* Hàng 4: Vị trí */}
            <View style={{ marginTop: 5 }}>
              <InputField label="Vị trí / Phòng" icon="map-marker" placeholder="VD: Phòng 101" value={newDevice.room} onChangeText={(t) => setNewDevice({...newDevice, room: t})} />
            </View>

            {/* Nút Lưu và Hủy */}
            <TouchableOpacity style={styles.btnSave} onPress={handleLuu}>
              <MaterialCommunityIcons name="lock" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.btnSaveText}>Lưu thiết bị</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="undo-variant" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.btnCancelText}>Quay lại</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>

        <View style={styles.footer}>
                <Text style={styles.footerText}>Thi cuoi ky by Ngoc Anh - Lan - Hien </Text>
                <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                  <MaterialCommunityIcons name="account-group-outline" size={16} color="#666" style={{ marginRight: 8, marginBottom: 15 }} />
                  <MaterialCommunityIcons name="link-variant" size={16} color="#666" />
                </View>
              </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E2A47' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, marginBottom: -10 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  breadcrumb: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, backgroundColor: '#fff' },
  breadcrumbText: { color: '#2B6CB0', fontSize: 14, fontWeight: '500' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10 },
  pageTitleRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  pageTitle: { fontSize: 20, fontWeight: 'bold', color: '#111', marginLeft: 30 },
  
  formCard: { backgroundColor: '#fff', borderRadius: 15, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 4, marginTop: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  inputGroupHalf: { flex: 1 },
  
  inputWrap: { marginBottom: 15 },
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, height: 45, backgroundColor: '#fff' },
  input: { flex: 1, fontSize: 14, color: '#333' },

  dropdownMenu: { position: 'absolute', top: 75, left: 0, right: 0, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, elevation: 5, zIndex: 99 },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownText: { fontSize: 14, color: '#333' },

  btnSave: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#80CBC4', paddingVertical: 14, borderRadius: 8, marginTop: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  btnSaveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnCancel: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#86919b', paddingVertical: 14, borderRadius: 8, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  btnCancelText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, backgroundColor: '#F4F5F7', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  footerText: { fontSize: 12, color: '#666', marginBottom: 15 }
});