import { MaterialCommunityIcons } from '@expo/vector-icons'; // Dùng thư viện icon xịn
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChiTietThietBiScreen({ route, navigation }) {
  // Lấy dữ liệu thiết bị được truyền sang từ trang danh sách
  // Nếu không có dữ liệu (lỗi), sẽ gán tạm một object rỗng để không bị crash app
  const device = route.params?.device || {
    name: 'Máy chiếu Epson EB-2250U',
    type: 'Máy chiếu',
    room: 'Phòng 101',
    serial: 'EP2230-123456',
    status: 'Sẵn dùng',
    statusColor: '#D1FAE5',
    statusTextColor: '#065F46'
  };

  // Component nhỏ để hiển thị từng dòng thông tin (để code gọn hơn)
  const InfoItem = ({ label, value }) => (
    <View style={styles.infoBlock}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#E3EDF7' }}>
      <StatusBar barStyle="light-content" backgroundColor="#37d1c2" />
    <SafeAreaView style={{ backgroundColor: '#80CBC4' }}>

      {/* HEADER TỐI MÀU (Giống ảnh) */}
      <View style={styles.topHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={require('../assets/logo.png')} 
            style={{ width: 60, height: 60, resizeMode: 'contain', marginRight: 10 }} 
          />
          <Text style={styles.headerTitle}>Quản lý thiết bị</Text>
        </View>

      </View>
    </SafeAreaView>
      {/* NỘI DUNG CHÍNH */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          
          {/* Tên thiết bị + Icon */}
          <View style={styles.titleRow}>
            <MaterialCommunityIcons name="projector" size={28} color="#1E2A47" style={{ marginRight: 8, marginTop: 2 }} />
            <Text style={styles.deviceTitle}>{device.name}</Text>
          </View>

          {/* Lưới 2 cột chứa thông tin */}
          <View style={styles.grid}>
            {/* Cột Trái */}
            <View style={styles.col}>
              <InfoItem label="Tên thiết bị:" value={device.name} />
              <InfoItem label="Loại:" value={device.type} />
              <InfoItem label="Vị trí/Phòng:" value={device.room} />
              <InfoItem label="Số Serial:" value={device.serial} />
            </View>

            {/* Cột Phải */}
            <View style={styles.col}>
              <InfoItem label="Chu kỳ bảo trì:" value="6 tháng" />
              <InfoItem label="Ngày mua:" value="12/02/2025" />
              <InfoItem label="Chu kỳ tiếp theo:" value="12/08/2025" />
              
              {/* Box Trạng thái */}
              <View style={styles.infoBlock}>
                <Text style={styles.label}>Trạng thái hiện tại:</Text>
                <View style={[styles.statusBadge, { backgroundColor: device.statusColor || '#D1FAE5' }]}>
                  <Text style={[styles.statusText, { color: device.statusTextColor || '#065F46' }]}>
                    {device.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Cụm Nút Bấm */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
                style={styles.btnEdit} onPress={() => navigation.navigate('ChinhSuaThietBi', { device: device })}
            >
            <Text style={styles.btnEditText}>Chỉnh sửa</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={styles.btnBack} onPress={() => navigation.navigate('Thiết bị', { updatedDevice: device })}
            >
            <Text style={styles.btnBackText}>Quay lại</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* FOOTER BẢN QUYỀN */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Thi cuoi ky by Ngoc Anh - Lan - Hien </Text>
        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
          <MaterialCommunityIcons name="account-group-outline" size={16} color="#666" style={{ marginRight: 8, marginBottom: 15 }} />
          <MaterialCommunityIcons name="link-variant" size={16} color="#666" />
        </View>
      </View>
    </View>
  );
}

// ================= CSS STYLES =================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E3EDF7' },
  
  topHeader: { backgroundColor: '#80CBC4', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 15 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  
  breadcrumb: { flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#F4F5F7' },
  breadcrumbText: { color: '#666', fontSize: 14 },
  breadcrumbActive: { color: '#111', fontSize: 14, fontWeight: 'bold' },

  scrollContent: { padding: 15, paddingBottom: 30 },
  
  card: { backgroundColor: '#F8F9FA', borderRadius: 15, padding: 20, shadowColor: '#BCAAA4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 3, shadowRadius: 10, elevation: 6, borderWidth: 1, borderColor: '#EFEBE9', marginTop: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  deviceTitle: { flex: 1, fontSize: 22, fontWeight: '800', color: '#1E2A47', lineHeight: 28 },

  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  col: { flex: 1, paddingRight: 10 },
  
  infoBlock: { marginBottom: 15 },
  label: { fontSize: 13, color: '#555', marginBottom: 4 },
  value: { fontSize: 14, fontWeight: 'bold', color: '#222', lineHeight: 20 },

  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15, marginTop: 2 },
  statusText: { fontSize: 13, fontWeight: 'bold' },

  buttonGroup: { marginTop: 10 },
  btnEdit: { backgroundColor: '#80CBC4', paddingVertical: 14, borderRadius: 25, alignItems: 'center', marginBottom: 15, shadowColor: '#3949AB', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.4, shadowRadius: 5, elevation: 4 },
  btnEditText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnBack: { backgroundColor: '#424242', paddingVertical: 14, borderRadius: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4 },
  btnBackText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, backgroundColor: '#F4F5F7', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  footerText: { fontSize: 12, color: '#666', marginBottom: 15 }
});