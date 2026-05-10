import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Dữ liệu mẫu có 7 tài khoản
const initialAccounts = [
  { id: '1', username: 'admin', fullName: 'Quản trị viên', role: 'Admin', roleIcon: 'flag', roleBg: '#2B407D', dept: '', status: 'Hoạt động', isOnline: true },
  { id: '2', username: 'techlan', fullName: 'Ngọc Lan', role: 'Technician', roleIcon: 'hammer-wrench', roleBg: '#D97706', dept: 'IT & Âm thanh', status: 'Hoạt động', isOnline: true },
  { id: '3', username: 'user123', fullName: 'Ngọc Lan', role: 'Admin', roleIcon: 'flag', roleBg: '#2B407D', dept: 'None', status: 'Tạm khóa', isOnline: true },
  { id: '4', username: 'hoang_it', fullName: 'Lê Minh Hoàng', role: 'Technician', roleIcon: 'hammer-wrench', roleBg: '#D97706', dept: 'Phòng Máy Lab', status: 'Hoạt động', isOnline: false },
  { id: '5', username: 'gv_tuan', fullName: 'Trần Anh Tuấn', role: 'User', roleIcon: 'account', roleBg: '#10B981', dept: 'Khoa CNTT', status: 'Hoạt động', isOnline: true },
  { id: '6', username: 'xuanquynh', fullName: 'Nguyễn Xuân Quỳnh', role: 'User', roleIcon: 'account', roleBg: '#10B981', dept: 'Phòng Đào Tạo', status: 'Tạm khóa', isOnline: false },
  { id: '7', username: 'manh_admin', fullName: 'Vũ Đức Mạnh', role: 'Admin', roleIcon: 'flag', roleBg: '#2B407D', dept: 'Ban Quản Trị', status: 'Hoạt động', isOnline: true },
];

export default function TaiKhoanScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [accounts, setAccounts] = useState(initialAccounts);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [filterMode, setFilterMode] = useState('All'); 
  
  // KHAI BÁO BIẾN MENU Ở TRONG HÀM NÀY MỚI ĐÚNG:
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (route.params?.updatedAccount) {
      const updatedAcc = route.params.updatedAccount;
      const newList = accounts.map(acc => acc.id === updatedAcc.id ? updatedAcc : acc);
      setAccounts(newList);
    }
    if (route.params?.newlyAddedAccount) {
      const newAcc = route.params.newlyAddedAccount;
      if (!accounts.some(acc => acc.id === newAcc.id)) {
        setAccounts([newAcc, ...accounts]);
      }
    }
  }, [route.params?.updatedAccount, route.params?.newlyAddedAccount]);

  const toggleMenu = (id) => {
    if (activeMenuId === id) setActiveMenuId(null);
    else setActiveMenuId(id);
  };

  const closeMenu = () => {
    if (activeMenuId) setActiveMenuId(null);
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', onPress: () => navigation.navigate('Login'), style: 'destructive' },
    ]);
  };

  const handleDelete = (id, username) => {
    closeMenu();
    Alert.alert('Xác nhận xóa', `Bạn có chắc chắn muốn xóa tài khoản "${username}" không?`, [
      { text: 'Hủy', style: 'cancel' },
      { 
        text: 'Xóa', 
        style: 'destructive', 
        onPress: () => setAccounts(accounts.filter(acc => acc.id !== id))
      }
    ]);
  };

  const handleToggleLock = (id) => {
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === id) {
        const newStatus = acc.status === 'Hoạt động' ? 'Tạm khóa' : 'Hoạt động';
        return { ...acc, status: newStatus };
      }
      return acc;
    });
    setAccounts(updatedAccounts);
    closeMenu();
  };

  const handleFilter = () => {
    if (filterMode === 'All') setFilterMode('Hoạt động');
    else if (filterMode === 'Hoạt động') setFilterMode('Tạm khóa');
    else setFilterMode('All');
  };

  const displayedAccounts = accounts.filter(acc => {
    const matchSearch = acc.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        acc.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterMode === 'All' || acc.status === filterMode;
    return matchSearch && matchFilter;
  });

  const renderItem = ({ item }) => (
    <View style={[
      styles.card, 
      activeMenuId === item.id ? { zIndex: 1000, elevation: 1000 } : { zIndex: 1, elevation: 3 }
    ]}>
      <View style={styles.avatarContainer}>
        <Image source={require('../assets/avatar-placeholder.png')} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.username}>{item.username}</Text>
        <View style={styles.roleRow}>
          <Text style={styles.fullName}>{item.fullName}</Text>
          <View style={[styles.roleBadge, { backgroundColor: item.roleBg }]}>
            <MaterialCommunityIcons name={item.roleIcon} size={12} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.roleText}>{item.role}</Text>
          </View>
        </View>
        {item.dept ? <Text style={styles.deptText}>{item.dept}</Text> : null}
        <View style={[styles.statusBadge, item.status === 'Tạm khóa' && { backgroundColor: '#E2E8F0' }]}>
          <Text style={[styles.statusText, item.status === 'Tạm khóa' && { color: '#64748B' }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.moreBtn} onPress={() => toggleMenu(item.id)}>
        <MaterialCommunityIcons name="dots-vertical" size={24} color="#666" />
      </TouchableOpacity>

      {activeMenuId === item.id && (
        <View style={styles.popupMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); navigation.navigate('ChinhSuaTaiKhoan', { account: item }); }}>
            <MaterialCommunityIcons name="pencil-outline" size={18} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleToggleLock(item.id)}>
            <MaterialCommunityIcons name={item.status === 'Hoạt động' ? "lock-outline" : "lock-open-outline"} size={18} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>{item.status === 'Hoạt động' ? 'Tạm khóa' : 'Mở khóa'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleDelete(item.id, item.username)}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color="#D9534F" style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: '#D9534F' }]}>Xóa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => closeMenu()}>
            <MaterialCommunityIcons name="eye-outline" size={18} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
            <MaterialCommunityIcons name="menu" size={28} color="#1a1919" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.avatarHeaderBox}>
            <Image source={require('../assets/avatar-placeholder.png')} style={styles.avatarHeader} />
            <View style={styles.onlineDotHeader} />
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <MaterialCommunityIcons name="power" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.pageTitle}>Danh sách tài khoản</Text>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm username, họ tên..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={closeMenu}
          />
        </View>

        <View style={styles.toolbarRow}>
          <TouchableOpacity 
            style={[styles.filterBtn, filterMode !== 'All' && { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' }]} 
            onPress={handleFilter}
          >
            <MaterialCommunityIcons name={filterMode === 'All' ? "filter-outline" : "filter"} size={22} color={filterMode === 'All' ? "#666" : "#1D4ED8"} />
            {filterMode !== 'All' && <Text style={{marginLeft: 5, fontSize: 12, color: '#1D4ED8', fontWeight: 'bold'}}>{filterMode}</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.btnAdd} onPress={() => navigation.navigate('TaoTaiKhoan')}>
            <Text style={styles.btnAddText}>+ Tạo tài khoản mới</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={displayedAccounts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={closeMenu} 
          ListEmptyComponent={
            <Text style={{textAlign: 'center', marginTop: 20, color: '#888'}}>Không tìm thấy tài khoản nào phù hợp.</Text>
          }
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerSummary}>Hiển thị {displayedAccounts.length > 0 ? 1 : 0}-{displayedAccounts.length} trên tổng {accounts.length} tài khoản</Text>
      </View>

      {/* ================= OVERLAY MENU TRƯỢT TỪ TRÁI SANG (ĐÃ SỬA CẤU TRÚC) ================= */}
      <Modal visible={isMenuOpen} transparent={true} animationType="fade">
        <View style={styles.menuOverlay}>
          
          {/* KHUNG MENU CHÍNH NẰM BÊN TRÁI */}
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

            <TouchableOpacity style={styles.sideMenuFooter} onPress={() => { setIsMenuOpen(false); handleLogout(); }}>
              <MaterialCommunityIcons name="logout" size={24} color="#D9534F" />
              <Text style={[styles.sideMenuText, {color: '#D9534F', fontWeight: 'bold'}]}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>

          {/* VÙNG TỐI ĐỂ ĐÓNG NẰM BÊN PHẢI */}
          <TouchableOpacity style={styles.menuCloseArea} onPress={() => setIsMenuOpen(false)} activeOpacity={1} />

        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ================= STYLES GIỮ NGUYÊN =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef9ff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#eef9ff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoBox: { marginHorizontal: 10 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  avatarHeaderBox: { marginRight: 15 },
  avatarHeader: { width: 32, height: 32, borderRadius: 16 },
  onlineDotHeader: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: '#4CAF50', borderWidth: 1.5, borderColor: '#fff' },
  logoutBtn: { backgroundColor: '#991B1B', padding: 6, borderRadius: 6 },
  content: { flex: 1, paddingHorizontal: 15, paddingTop: 15 },
  pageTitle: { fontSize: 21, fontWeight: 'bold', color: '#111', marginBottom: 35, marginLeft: 60, marginTop: 10 },
  searchBox: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20, backgroundColor: '#fff', paddingHorizontal: 15, height: 45, justifyContent: 'center', marginBottom: 15 },
  searchInput: { fontSize: 15, color: '#333' },
  toolbarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, backgroundColor: '#fff', marginRight: 10 },
  btnAdd: { backgroundColor: '#3B82F6', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 15, marginRight: 'auto' },
  btnAddText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  btnOptions: { flexDirection: 'row', alignItems: 'center' },
  btnOptionsText: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  listContainer: { paddingBottom: 20 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3, position: 'relative' },
  avatarContainer: { marginRight: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#fff' },
  infoContainer: { flex: 1, justifyContent: 'center' },
  username: { fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  roleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' },
  fullName: { fontSize: 14, color: '#333', marginRight: 8 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  roleText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  deptText: { fontSize: 13, color: '#555', marginBottom: 6 },
  statusBadge: { alignSelf: 'flex-start', backgroundColor: '#DBEAFE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#1D4ED8', fontSize: 12, fontWeight: 'bold' },
  moreBtn: { padding: 5, alignSelf: 'center' },
  popupMenu: { position: 'absolute', top: 50, right: 30, backgroundColor: '#fff', borderRadius: 8, paddingVertical: 5, width: 150, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 10, zIndex: 1000 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15 },
  menuIcon: { marginRight: 10 },
  menuText: { fontSize: 14, color: '#333' },
  footer: { paddingHorizontal: 15, paddingBottom: 15, paddingTop: 10, backgroundColor: '#F8F9FB' },
  footerSummary: { fontSize: 13, color: '#111', fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10 },
  
  // Side Menu Trượt
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
  menuCloseArea: { flex: 1 },
  sideMenu: { width: 280, backgroundColor: '#fff', height: '100%', shadowColor: '#000', shadowOffset: { width: 5, height: 0 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 15 },
  sideMenuHeader: { backgroundColor: '#c887db', padding: 25, paddingTop: 50, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#968bfc' },
  sideMenuAvatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#fff', marginBottom: 10 },
  sideMenuName: { color: '#000000', fontSize: 18, fontWeight: 'bold' },
  sideMenuRole: { color: '#4c4c4d', fontSize: 13, marginTop: 4 },
  sideMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
  sideMenuText: { fontSize: 15, color: '#333', marginLeft: 15, flex: 1, fontWeight: '500' },
  badgeNotif: { backgroundColor: '#E53E3E', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  badgeNotifText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  sideMenuDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10, marginHorizontal: 20 },
  sideMenuFooter: { flexDirection: 'row', alignItems: 'center', padding: 20, borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: '#FEF2F2' },
});