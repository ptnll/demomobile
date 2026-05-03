import { useState } from 'react';
import { Image, Modal, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);


  const handleLogout = () => {
    setModalVisible(false); 

    navigation.replace('Login'); 
  };

  return (

    <View style={styles.mainBackground}>

      <View style={{ backgroundColor: '#fff' }}>
        <SafeAreaView>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../assets/logo.png')} style={styles.logo} />
              <Text style={styles.headerTitle}>Quản lý thiết bị </Text>
            </View>
 
            <TouchableOpacity style={styles.profileBox} onPress={() => setModalVisible(true)}>
              <View style={styles.profileAvatar}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>A</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      <Text style={styles.pageTitle}> Hệ Thống</Text>

      <View style={styles.gridContainer}>

        <TouchableOpacity 
                style={[styles.card, { backgroundColor: '#80CBC4' }]} onPress={() => navigation.navigate('Thiết bị')}
            >
            <Image source={require('../assets/icon-pc.png')} style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Tổng Thiết Bị</Text>
            <Text style={styles.cardNumber}>55</Text>
        </TouchableOpacity>

          <View style={[styles.card, { backgroundColor: '#f14a5e' }]} >
          <Image source={require('../assets/icon-wrench.png')} style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Máy Đang Hỏng</Text>
          <Text style={styles.cardNumber}>12</Text>
        </View>

        <TouchableOpacity 
        style={[styles.card, { backgroundColor: '#4b52b1' }]} onPress={() => navigation.navigate('Bảo trì')} >
          <Image source={require('../assets/icon-clock.png')} style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Phiếu Chờ Duyệt</Text>
          <Text style={styles.cardNumber}>5</Text>
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: '#93cf4e' }]}>
          <Image source={require('../assets/icon-money.png')} style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Tổng Chi Phí</Text>
          <Text style={styles.cardNumberCost}>120.000.000 ??</Text>
          <Text style={styles.cardNumberCost}>'0' VNĐ</Text>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>

            <View style={styles.modalHeader}>
              <TouchableOpacity><Text style={{ fontSize: 24, color: '#0056b3' }}>...</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>Hủy</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.currentUserSection}>
              <View style={[styles.largeAvatar, { backgroundColor: '#b564b8' }]}>
                <Text style={styles.largeAvatarText}>A</Text>
              </View>
              <Text style={styles.currentUserName}>Admin_Ngọc Lan</Text>
              <Text style={styles.currentUserEmail}>adminlan@gmail.com</Text>
            </View>

            <View style={styles.accountListCard}>

              <TouchableOpacity style={styles.accountItem}>
                <View style={[styles.smallAvatar, { backgroundColor: '#5bb8dd' }]}>
                  <Text style={styles.smallAvatarText}>T</Text>
                </View>
                <View>
                  <Text style={styles.accountName}>Tech_Ngọc Anh</Text>
                  <Text style={styles.accountEmail}>Techna10@gmail.com</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.accountItem}>
                <View style={[styles.smallAvatar, { backgroundColor: '#209690' }]}>
                  <Text style={styles.smallAvatarText}>Đ</Text>
                </View>
                <View>
                  <Text style={styles.accountName}>Đinh Thế Hiển</Text>
                  <Text style={styles.accountEmail}>user@gmail.com</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addAccountBtn}>
                <Text style={styles.addAccountText}>Thêm tài khoản...</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>

          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#c9f0ea' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#ffffff' },
  logo: { width: 60, height: 60, resizeMode: 'contain', marginRight: 10, marginBottom: -5, marginTop: -20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  profileBox: { alignItems: 'center' },
  profileAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#b564b8', justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 25, color: '#333' },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  card: { width: '47%', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  cardIcon: { width: 40, height: 40, resizeMode: 'contain', marginBottom: 15, tintColor: '#fff' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
  cardNumber: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  cardNumberCost: { fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#F2F2F6', borderRadius: 15, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  closeText: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },
  
  currentUserSection: { alignItems: 'center', marginBottom: 20 },
  largeAvatar: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  largeAvatarText: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  currentUserName: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 2 },
  currentUserEmail: { fontSize: 14, color: '#666' },

  accountListCard: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 10, marginBottom: 15 },
  accountItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  smallAvatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  smallAvatarText: { color: 'white', fontSize: 16, fontWeight: '600' },
  accountName: { fontSize: 16, fontWeight: '500', color: '#000' },
  accountEmail: { fontSize: 13, color: '#666' },
  addAccountBtn: { paddingVertical: 15, paddingHorizontal: 15 },
  addAccountText: { fontSize: 16, color: '#007AFF', fontWeight: '500' },

  logoutCard: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  logoutText: { fontSize: 16, color: '#007AFF', fontWeight: '500' }
});