import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Keyboard, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const initialDevices = [
  { id: '1', name: 'Máy chiếu Epson EB-2250U', room: 'Phòng 101', type: 'Màn lớn', serial: 'EP2250-001', status: 'Đang sử dụng', statusColor: '#E8F5E9', statusTextColor: '#2E7D32' },
  { id: '2', name: 'TV Samsung 55 Inch', room: 'Phòng 102', type: 'Màn lớn', serial: 'SS55-002', status: 'Đang sử dụng', statusColor: '#E8F5E9', statusTextColor: '#2E7D32' },
  { id: '3', name: 'Laptop Dell Latitude', room: 'Phòng IT', type: 'Máy tính', serial: 'DELL-003', status: 'Báo lỗi', statusColor: '#FFEBEE', statusTextColor: '#C62828' },
  { id: '4', name: 'Điều hòa Daikin 9000BTU', room: 'Phòng 201', type: 'Điện lạnh', serial: 'DK-004', status: 'Đang sử dụng', statusColor: '#E8F5E9', statusTextColor: '#2E7D32' },
  { id: '5', name: 'Máy in HP LaserJet', room: 'Phòng Giáo viên', type: 'Thiết bị VP', serial: 'HP-005', status: 'Đang sửa chữa', statusColor: '#FFF8E1', statusTextColor: '#F9A825' },
  { id: '6', name: 'Bảng tương tác thông minh', room: 'Phòng Lab', type: 'Màn lớn', serial: 'BT-006', status: 'Đang sử dụng', statusColor: '#E8F5E9', statusTextColor: '#2E7D32' },
  { id: '7', name: 'Micro không dây Shure', room: 'Hội trường', type: 'Âm thanh', serial: 'SH-007', status: 'Đang sử dụng', statusColor: '#E8F5E9', statusTextColor: '#2E7D32' },
  { id: '8', name: 'Loa hội trường JBL', room: 'Hội trường', type: 'Âm thanh', serial: 'JBL-008', status: 'Báo lỗi', statusColor: '#FFEBEE', statusTextColor: '#C62828' },
  { id: '9', name: 'PC Đồng bộ Lenovo', room: 'Phòng Máy 1', type: 'Máy tính', serial: 'LN-009', status: 'Đang sử dụng', statusColor: '#E8F5E9', statusTextColor: '#2E7D32' },
  { id: '10', name: 'Router Wifi Cisco', room: 'Phòng IT', type: 'Mạng', serial: 'CS-010', status: 'Đang sử dụng', statusColor: '#E8F5E9', statusTextColor: '#2E7D32' },
  { id: '11', name: 'Máy chiếu Sony A1', room: 'Phòng 103', type: 'Máy chiếu', serial: 'SN-PRJ-001', status: 'Đang sửa chữa', statusColor: '#FFF8E1', statusTextColor: '#F9A825' },
  { id: '12', name: 'Bàn phím cơ Fuhlen', room: 'Phòng Máy 1', type: 'Máy tính', serial: 'KB-FL-012', status: 'Đang sử dụng', statusColor: '#E8F5E9', statusTextColor: '#2E7D32' },
  { id: '13', name: 'Chuột Logitech G102', room: 'Phòng Máy 2', type: 'Máy tính', serial: 'MS-LG-013', status: 'Báo lỗi', statusColor: '#FFEBEE', statusTextColor: '#C62828' },
  { id: '14', name: 'Máy chiếu Panasonic PT-LB303', room: 'Phòng 202', type: 'Máy chiếu', serial: 'PN-PT-014', status: 'Đang sử dụng', statusColor: '#E8F5E9', statusTextColor: '#2E7D32' },
  { id: '15', name: 'Màn hình Dell UltraSharp 24"', room: 'Phòng IT', type: 'Màn lớn', serial: 'DL-US-015', status: 'Đang sửa chữa', statusColor: '#FFF8E1', statusTextColor: '#F9A825' },
  { id: '16', name: 'Máy chấm công Ronald Jack', room: 'Hành lang T1', type: 'Thiết bị VP', serial: 'RJ-016', status: 'Đang sử dụng', statusColor: '#E8F5E9', statusTextColor: '#2E7D32' },
  { id: '17', name: 'Switch mạng TP-Link 24 port', room: 'Phòng Server', type: 'Mạng', serial: 'SW-TP-017', status: 'Đang sử dụng', statusColor: '#E8F5E9', statusTextColor: '#2E7D32' },
  { id: '18', name: 'Điều hòa Panasonic 12000BTU', room: 'Phòng 103', type: 'Điện lạnh', serial: 'PN-AC-018', status: 'Báo lỗi', statusColor: '#FFEBEE', statusTextColor: '#C62828' },
  { id: '19', name: 'Amply Jarguar Suhyoung', room: 'Hội trường', type: 'Âm thanh', serial: 'AM-JG-019', status: 'Đang sử dụng', statusColor: '#E8F5E9', statusTextColor: '#2E7D32' },
  { id: '20', name: 'Máy photocopy Ricoh', room: 'Phòng Giáo viên', type: 'Thiết bị VP', serial: 'RC-PC-020', status: 'Đang sửa chữa', statusColor: '#FFF8E1', statusTextColor: '#F9A825' }
];

export default function ThietBiScreen({ navigation, route }) { 

  const [allDevices, setAllDevices] = useState(initialDevices); 
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceList, setDeviceList] = useState(initialDevices); 
  const [visibleCount, setVisibleCount] = useState(4); 
  
  // STATE MỚI CHO MENU TRƯỢT
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalCount = allDevices.length;
  const activeCount = allDevices.filter(dev => dev.status === 'Đang sử dụng').length;
  const errorCount = allDevices.filter(dev => dev.status === 'Báo lỗi').length;

  const handleSearch = () => {
    Keyboard.dismiss();
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setDeviceList(allDevices);
    } else {
      const filtered = allDevices.filter(dev => 
        dev.name.toLowerCase().includes(query) ||
        dev.room.toLowerCase().includes(query) ||
        dev.serial.toLowerCase().includes(query)
      );
      setDeviceList(filtered);
    }
    setVisibleCount(4); 
  };

  const handleReset = () => {
    Keyboard.dismiss();
    setSearchQuery('');
    setDeviceList(allDevices);
    setVisibleCount(4); 
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4); 
  };

  // HÀM XỬ LÝ ĐĂNG XUẤT CHO MENU
  const handleLogout = () => {
    setIsMenuOpen(false); // Tắt menu trước
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', onPress: () => navigation.navigate('Login'), style: 'destructive' },
    ]);
  };

  useEffect(() => {
    if (route.params?.updatedDevice) {
      const updated = route.params.updatedDevice;
      const newList = allDevices.map(d => d.id === updated.id ? updated : d);
      setAllDevices(newList); 
      setDeviceList(newList); 
    }
    if (route.params?.newlyAddedDevice) {
      const newDev = route.params.newlyAddedDevice;
      const isExist = allDevices.some(d => d.id === newDev.id);
      if (!isExist) {
        const newList = [newDev, ...allDevices];
        setAllDevices(newList);
        setDeviceList(newList);
      }
    }
  }, [route.params?.updatedDevice, route.params?.newlyAddedDevice]);

  const handleThanhLy = (deviceToDelete) => {
    Alert.alert(
      "Xác nhận thanh lý",
      `Bạn có chắc chắn muốn thanh lý ${deviceToDelete.name}?`,
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đồng ý", 
          onPress: () => {
            const newList = allDevices.filter(d => d.id !== deviceToDelete.id);
            setAllDevices(newList);
            setDeviceList(newList);
            Alert.alert("Thành công", "Đã đưa vào danh mục thanh lý các thiết bị.");
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderDeviceItem = ({ item }) => (
    <View style={styles.itemWrapper}>
      <View style={styles.deviceCard}>
        <View style={styles.cardTop}>
          <View style={styles.deviceIconBox}>
            <Image source={require('../assets/icon-pc1.png')} style={styles.deviceIcon} />
          </View>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{item.name}</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🏠 Phòng: </Text>
              <Text style={styles.infoValue}>{item.room}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
               <Text style={styles.infoLabel}>🚦 Trạng thái: </Text>
               <View style={[styles.statusBadge, { backgroundColor: item.statusColor }]}>
                 <Text style={[styles.statusText, { color: item.statusTextColor }]}>{item.status}</Text>
               </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🏷️ Loại: </Text>
              <View style={styles.typeBadge}><Text style={styles.typeText}>{item.type}</Text></View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🔢 Serial: </Text>
              <Text style={styles.infoValue}>{item.serial}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardBottom}>
          <TouchableOpacity 
            style={styles.actionBtn} onPress={() => navigation.navigate('ChiTietThietBi', { device: item })} 
          >
            <Text style={styles.actionText}>📄 Chi tiết</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity 
            style={styles.actionBtn} onPress={() => navigation.navigate('ChinhSuaThietBi', { device: item })} 
          >
            <Text style={styles.actionText}>✏️ Sửa</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleThanhLy(item)}>
            <Text style={styles.actionText}>🗑️ Thanh lý</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList 
        data={deviceList.slice(0, visibleCount)} 
        keyExtractor={(item) => item.id}
        renderItem={renderDeviceItem}

        ListHeaderComponent={
          <View>
            <View style={styles.topSection}>
              <View style={styles.header}>
                {/* GẮN LỆNH MỞ MENU VÀO NÚT NÀY */}
                <TouchableOpacity style={{ padding: 5 }} onPress={() => setIsMenuOpen(true)}>
                  <MaterialCommunityIcons name="menu" size={28} color="#000000" />
                </TouchableOpacity>
              </View>

              <View style={styles.profileRow}>
                <Image source={require('../assets/avatar-placeholder.png')} style={styles.avatar} />
                <View>
                  <Text style={styles.profileName}>Phạm Thị Ngọc Lan</Text>
                  <Text style={styles.profileRole}>(Admin)</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Tổng thiết bị:</Text>
                  <View style={styles.statValueRow}>
                    <Text style={styles.statIcon}>🖥️</Text>
                    <Text style={styles.statValue}>{totalCount}</Text>
                  </View>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Sử dụng:</Text>
                  <View style={styles.statValueRow}>
                    <Text style={styles.statIcon}>👥</Text>
                    <Text style={styles.statValue}>{activeCount}</Text>
                  </View>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Báo lỗi:</Text>
                  <View style={styles.statValueRow}>
                    <Text style={styles.statIcon}>🚩</Text>
                    <Text style={styles.statValue}>{errorCount}</Text> 
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.whiteHeaderSection}>
              <Text style={styles.pageTitle}>Danh sách thiết bị</Text>
              <View style={styles.searchContainer}>
                <View style={styles.searchInputBox}>
                  <Text style={{ marginRight: 10, fontSize: 16 }}>🔍</Text>
                  <TextInput 
                    style={{ flex: 1, fontSize: 14 }}
                    placeholder="Tìm theo tên, phòng, serial..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                  />
                </View>
                <View style={styles.filterBtnRow}>
                  <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}><Text style={styles.searchBtnText}>Tìm kiếm</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.resetBtn} onPress={handleReset}><Text style={styles.resetBtnText}>Reset</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        }

        ListFooterComponent={
          <View style={{ backgroundColor: '#FAFAFA', paddingBottom: 100, alignItems: 'center', paddingTop: 10 }}>
            {visibleCount < deviceList.length && (
              <TouchableOpacity style={styles.loadMoreBtn} onPress={handleLoadMore}>
                <Text style={styles.loadMoreText}>Hiển thị thêm ▼</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        
        ListEmptyComponent={
          <View style={{ backgroundColor: '#FAFAFA', padding: 30, alignItems: 'center' }}>
            <Text style={{ color: '#888', fontSize: 16 }}>Không tìm thấy thiết bị nào phù hợp.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fabAdd} onPress={() => navigation.navigate('ThemThietBi')}>
        <Text style={styles.fabText}>+ Thêm thiết bị</Text>
      </TouchableOpacity>

      {/* ================= OVERLAY MENU TRƯỢT TỪ TRÁI SANG ================= */}
      <Modal visible={isMenuOpen} transparent={true} animationType="fade">
        <View style={styles.menuOverlay}>
          
          <View style={styles.sideMenu}>
            <View style={styles.sideMenuHeader}>
              <Image source={require('../assets/avatar-placeholder.png')} style={styles.sideMenuAvatar} />
              <Text style={styles.sideMenuName}>Phạm Thị Ngọc Lan</Text>
              <Text style={styles.sideMenuRole}>Quản trị viên hệ thống</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.sideMenuItem} onPress={() => { setIsMenuOpen(false); navigation.navigate('Trang chủ'); }}>
                <MaterialCommunityIcons name="view-dashboard-outline" size={24} color="#555" />
                <Text style={styles.sideMenuText}>Tổng quan thống kê</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideMenuItem}>
                <MaterialCommunityIcons name="bell-outline" size={24} color="#555" />
                <Text style={styles.sideMenuText}>Thông báo</Text>
                <View style={styles.badgeNotif}><Text style={styles.badgeNotifText}>3</Text></View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideMenuItem}>
                <MaterialCommunityIcons name="history" size={24} color="#555" />
                <Text style={styles.sideMenuText}>Nhật ký hoạt động</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideMenuItem}>
                <MaterialCommunityIcons name="cog-outline" size={24} color="#555" />
                <Text style={styles.sideMenuText}>Cài đặt hệ thống</Text>
              </TouchableOpacity>
              <View style={styles.sideMenuDivider} />
              <TouchableOpacity style={styles.sideMenuItem}>
                <MaterialCommunityIcons name="help-circle-outline" size={24} color="#555" />
                <Text style={styles.sideMenuText}>Trợ giúp & Hỗ trợ</Text>
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity style={styles.sideMenuFooter} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={24} color="#D9534F" />
              <Text style={[styles.sideMenuText, {color: '#D9534F', fontWeight: 'bold'}]}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.menuCloseArea} onPress={() => setIsMenuOpen(false)} activeOpacity={1} />
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ================= CSS STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3EDF7' }, 
  
  topSection: { padding: 20, backgroundColor: '#E3EDF7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#fff', marginRight: 15 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  profileRole: { fontSize: 14, color: '#666' },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.6)', padding: 10, borderRadius: 12, marginHorizontal: 4, alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#555', marginBottom: 5 },
  statValueRow: { flexDirection: 'row', alignItems: 'center' },
  statIcon: { fontSize: 16, marginRight: 5 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#111' },

  whiteHeaderSection: { 
    backgroundColor: '#FAFAFA', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    paddingHorizontal: 20, 
    paddingTop: 25,
    shadowColor: '#000', shadowOffset: {width: 0, height: -3}, shadowOpacity: 0.05, shadowRadius: 5, elevation: 5
  },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 20 },
  
  searchContainer: { marginBottom: 10 },
  searchInputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 25, paddingHorizontal: 15, height: 45, marginBottom: 15 },
  filterBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
  searchBtn: { backgroundColor: '#80CBC4', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginRight: 10 },
  searchBtnText: { color: '#fff', fontWeight: 'bold' },
  resetBtn: { backgroundColor: '#E0E0E0', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  resetBtnText: { color: '#555', fontWeight: 'bold' },

  itemWrapper: { backgroundColor: '#FAFAFA', paddingHorizontal: 20 },

  deviceCard: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 20, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  cardTop: { flexDirection: 'row', marginBottom: 15 },
  deviceIconBox: { width: 60, height: 60, backgroundColor: '#E0F2F1', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  deviceIcon: { width: 35, height: 35, resizeMode: 'contain', tintColor: '#00796B' },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoLabel: { fontSize: 13, color: '#888' },
  infoValue: { fontSize: 13, color: '#333', fontWeight: '500' },
  
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  typeBadge: { backgroundColor: '#F3E5F5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  typeText: { fontSize: 12, color: '#8E24AA', fontWeight: 'bold' },

  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 10 },
  actionBtn: { flex: 1, alignItems: 'center' },
  actionText: { fontSize: 13, color: '#555', fontWeight: '600' },
  divider: { width: 1, backgroundColor: '#F0F0F0', height: '100%' },

  fabAdd: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#80CBC4', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  fabText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  loadMoreBtn: {
    backgroundColor: '#E0F2F1',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 20,
  },
  loadMoreText: {
    color: '#00796B',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // SIDE MENU TRƯỢT STYLES
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
  menuCloseArea: { flex: 1 },
  sideMenu: { width: 280, backgroundColor: '#fff', height: '100%', shadowColor: '#000', shadowOffset: { width: 5, height: 0 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 15 },
  sideMenuHeader: { backgroundColor: '#c887db', padding: 25, paddingTop: 50, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#968bfc' },
  sideMenuAvatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#fff', marginBottom: 10 },
  sideMenuName: { color: '#000000', fontSize: 18, fontWeight: 'bold' },
  sideMenuRole: { color: '#393a3a', fontSize: 13, marginTop: 4 },
  sideMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
  sideMenuText: { fontSize: 15, color: '#333', marginLeft: 15, flex: 1, fontWeight: '500' },
  badgeNotif: { backgroundColor: '#E53E3E', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  badgeNotifText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  sideMenuDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10, marginHorizontal: 20 },
  sideMenuFooter: { flexDirection: 'row', alignItems: 'center', padding: 20, borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: '#FEF2F2' },
});