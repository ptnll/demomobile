import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useContext, useState } from 'react';
import { Alert, FlatList, Image, Modal, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaintenanceContext } from '../contexts/MaintenanceContext';

// Dữ liệu giả lập khớp y hệt với ảnh mẫu
// const initialRequests = [
//   { id: '1', date: '19/04/2026', device: 'Máy tính Asus ExpertCenter (Lab 3)', reporter: 'Phạm Ngọc Lan', status: 'Chờ duyệt', statusBg: '#FDE68A', statusColor: '#D97706',imageSource: require('../assets/pc.png') },
//   { id: '2', date: '19/04/2026', device: 'Micro Shure SMS8 (Hội trường)', reporter: 'Phạm Ngọc Lan', status: 'Đã duyệt', statusBg: '#E5E7EB', statusColor: '#4B5563', imageSource: require('../assets/micro.png') },
//   { id: '3', date: '19/04/2026', device: 'Máy tính Lenovo ThinkCentre (Lab 2)', reporter: 'Phạm Ngọc Lan', status: 'Hoàn thành', statusBg: '#bcf8d9', statusColor: '#07be88', imageSource: require('../assets/pc3.png') },
//   { id: '4', date: '17/04/2026', device: 'Máy tính MSI Desktop Pro (Lab 4)', reporter: 'Phạm Ngọc Lan', status: 'Chờ duyệt', statusBg: '#FDE68A', statusColor: '#D97706', imageSource: require('../assets/pc2.png') },
//   { id: '5', date: '13/04/2026', device: 'Máy chiếu Epson EB-2250U (Phòng 101)', reporter: 'Quản trị viên', status: 'Từ chối', statusBg: '#FECACA', statusColor: '#B91C1C', imageSource: require('../assets/maychieu.png') },
// ];

export default function BaoTriTongScreen({ navigation }) {
  const { requests } = useContext(MaintenanceContext);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedImage, setSelectedImage] = useState(null);
  const maintenanceRequests = requests;
  // STATE MỞ/ĐÓNG MENU TRƯỢT
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hiệu ứng kéo xuống để load lại trang
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  // HÀM XỬ LÝ ĐĂNG XUẤT CHO MENU TRƯỢT
  const handleLogout = () => {
    setIsMenuOpen(false); // Đóng menu trước
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', onPress: () => navigation.navigate('Login'), style: 'destructive' },
    ]);
  };
  const getStatusStyle = (status) => {
  switch (status) {
    case 'Chờ duyệt':
      return {
        bg: '#FDE68A',
        text: '#D97706',
      };

    case 'Đã duyệt':
      return {
        bg: '#E5E7EB',
        text: '#4B5563',
      };

    case 'Hoàn thành':
      return {
        bg: '#bcf8d9',
        text: '#07be88',
      };

    case 'Từ chối':
      return {
        bg: '#FECACA',
        text: '#B91C1C',
      };

    default:
      return {
        bg: '#ddd',
        text: '#333',
      };
  }
};
  // Giao diện cho từng thẻ yêu cầu bảo trì
  const renderCard = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <View style={styles.card}>
        {/* Ngày & Trạng thái */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>
            {item.date}</Text>
          <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.badgeText, { color: statusStyle.text }]}>{item.status}</Text>
          </View>
        </View>
        {item.repairDate ? (
          <Text style={styles.cardSub}>
            Ngày sửa: {item.repairDate}
          </Text>
        ) : null}

        {item.repairCost ? (
          <Text style={styles.cardSub}>
            Chi phí: {item.repairCost} VNĐ
          </Text>
        ) : null}
        {/* Thông tin thiết bị */}
        <Text style={styles.cardTitle} numberOfLines={2}>{item.device}</Text>
        <Text style={styles.cardSub}>Người báo: <Text style={styles.cardSubBold}>{item.createdBy}</Text></Text>

        {/* 2 Nút hành động */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionBtn} onPress={() => navigation.navigate('XuLyBaoTri', { request: item, role: 'admin', })}>
            <MaterialCommunityIcons name="cog" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.actionBtnText}>Xử lý</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => {
              setSelectedImage(item.imageSource); 
              setModalVisible(true);
            }}>
            <MaterialCommunityIcons name="camera" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.actionBtnText}>Xem ảnh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E2A47" />
      
      {/* KHU VỰC HEADER TỐI MÀU */}
      <SafeAreaView style={{ backgroundColor: '#b1a4f7' }}>
        <View style={styles.header}>
          {/* NÚT MỞ MENU TRƯỢT */}
          <TouchableOpacity style={{ padding: 5 }} onPress={() => setIsMenuOpen(true)}>
            <MaterialCommunityIcons name="menu" size={28} color="#000000" />
          </TouchableOpacity>
        </View>
        <View style={styles.adminSection}>
          <View style={styles.adminInfo}>
            <Image source={require('../assets/avatar-placeholder.png')} style={styles.avatar} />
            <View>
              <Text style={styles.adminName}>Phạm Thị Ngọc Lan</Text>
              <Text style={styles.adminRole}>(Admin)</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* NỘI DUNG CHÍNH */}
      <View style={{ flex: 1, backgroundColor: '#ffffff', borderTopRightRadius:50, borderTopLeftRadius: 50  }}>
        <View style={styles.pageTitleRow}>
          <Text style={styles.pageTitle}>Danh sách phiếu bảo trì</Text>
        </View>

        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E2A47']} />}
          renderItem={renderCard}
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Không có yêu cầu bảo trì nào</Text>
            </View>
          }
        />
      </View>

      {/* KHUNG POPUP HIỂN THỊ ẢNH */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlayImage}>
          {/* Nút Đóng */}
          <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
            <MaterialCommunityIcons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>
          
          {/* Ảnh được phóng to */}
          {selectedImage && (
            <Image source={selectedImage} style={styles.fullImage} resizeMode="contain" />
          )}
        </View>
      </Modal>

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

    </View>
  );
}

// ================= CSS STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#b1a4f7' },

  // Header Styles
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#b1a4f7' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center', paddingRight: 20 },
  headerTitle: { color: '#000000', fontSize: 15, fontWeight: 'bold' },
  headerRight: { alignItems: 'center' },
  headerUser: { color: '#fff', fontSize: 13, fontWeight: '600' },
  headerRole: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },

  // Page Title
  pageTitleRow: { backgroundColor: '#ffffff', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, borderRadius: 20 },
  pageTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginLeft: 50, marginBottom: 10, marginTop: 10 },

  // List Styles
  listContent: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10 },
  
  // Card Styles
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardDate: { fontSize: 13, color: '#666', fontWeight: '500' },
  
  badge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 6, lineHeight: 22 },
  cardSub: { fontSize: 13, color: '#555', marginBottom: 15 },
  cardSubBold: { fontWeight: 'bold', color: '#333' },
  
  // Button Styles
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#b1a4f7', alignItems: 'center', justifyContent: 'center', borderRadius: 8, paddingVertical: 10, marginHorizontal: 5 },
  actionBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  emptyBox: { paddingVertical: 60, alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 15 },
  adminSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  adminInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  adminName: { color: '#000000', fontSize: 18, fontWeight: 'bold' },
  adminRole: { color: '#2d2e30', fontSize: 14, marginTop: 2 },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#4A5568', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 },
  logoutText: { color: '#A0AEC0', fontSize: 12 },
  
  // Modal Image Styles (Đổi tên một chút để không trùng với Modal Menu)
  modalOverlayImage: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  closeModalBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  fullImage: { width: '90%', height: '70%', borderRadius: 10 },

  // SIDE MENU TRƯỢT STYLES
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
  menuCloseArea: { flex: 1 },
  sideMenu: { width: 280, backgroundColor: '#fff', height: '100%', shadowColor: '#000', shadowOffset: { width: 5, height: 0 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 15 },
  sideMenuHeader: { backgroundColor: '#c887db', padding: 25, paddingTop: 50, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#968bfc' },
  sideMenuAvatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#fff', marginBottom: 10 },
  sideMenuName: { color: '#000000', fontSize: 18, fontWeight: 'bold' },
  sideMenuRole: { color: '#383838', fontSize: 13, marginTop: 4 },
  sideMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
  sideMenuText: { fontSize: 15, color: '#333', marginLeft: 15, flex: 1, fontWeight: '500' },
  badgeNotif: { backgroundColor: '#E53E3E', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  badgeNotifText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  sideMenuDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10, marginHorizontal: 20 },
  sideMenuFooter: { flexDirection: 'row', alignItems: 'center', padding: 20, borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: '#FEF2F2' },
});